
import slugify from "./slugify";

const stripHtml = (html = "") => {
  if (typeof html !== "string") return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const buildSearchIndex = (
  ipos = [],
  preIpos = [],
  brokers = [],
  blogs = [],
  unlistedShares = []
) => {
  const ipoIndex = ipos.map((ipo) => ({
    id: `ipo-${ipo.id}`,
    type: "IPO",
    title: ipo.name,
    content: `
      ${ipo.fullName || ""}
      IPO
      Price ${ipo.price || ""}
      Lot size ${ipo.lot || ""}
      Depository ${ipo.depository || ""}
      Status ${ipo.status || ""}
      ${ipo.type || ""}
    `,
    preview: `IPO • Price ${ipo.price || "N/A"} • Lot size ${ipo.lot || "N/A"}`,
    url: `/ipo/${ipo.id}/${slugify(ipo.name)}`,
  }));

  const preIpoIndex = preIpos.map((pre) => ({
    id: `preipo-${pre.id}`,
    type: "Pre-IPO",
    title: pre.name,
    content: `
      Pre IPO
      Unlisted Shares
      Price ${pre.price || ""}
      Lot size ${pre.minLotSize || ""}
      Depository ${pre.depository || ""}
    `,
    preview: `Pre IPO • Unlisted Share • Price ${pre.price || "N/A"}`,
    url: `/pre-ipo/${pre.id}/${slugify(pre.name)}`,
    anchor: null,
  }));

  const brokerIndex = brokers.map((b) => ({
    id: `broker-${b.id}`,
    type: "Broker",
    title: b.name,
    content: `Rating: ${b.rating}, Brokerage: ${b.brokerage}, Equities: ${b.equities}`,
    preview: `Rating: ${b.rating || "N/A"} • Brokerage: ${b.brokerage || "N/A"}`,
    url: `/brokers`,
  }));

  const CORPORATE_ACTION_CATEGORIES = new Set([
    "corporate action",
    "buyback",
    "dividend",
    "dividends",
    "bonus",
    "bonus issue",
    "stock split",
    "stock splits",
    "rights",
    "rights issue",
    "merger",
    "demerger",
    "takeover / acquisition",
    "open offer",
    "delisting",
    "ofs",
    "qip",
    "preferential allotment",
    "warrants issue",
    "esop allotment",
    "fpo",
    "bond issue",
    "ncd issue",
    "distribution",
    "unit split",
    "agm",
    "egm",
    "board meeting",
    "postal ballot",
    "e-voting",
    "promoter stake increase",
    "promoter stake sale",
    "pledge release",
    "scheme of arrangement",
    "insolvency resolution",
    "cirp process",
    "subsidiary incorporation",
    "joint venture",
    "change of company name",
    "ipo listing",
    "change in director",
    "ceo appointment",
    "auditor appointment",
    "regulatory action",
    "trading suspension",
    "revocation of suspension",
  ]);

  const normalizeCategory = (value = "") =>
    String(value)
      .trim()
      .toLowerCase()
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ");

  const isCorporateAction = (blog) => {
    const category = normalizeCategory(blog.category);

    return (
      category.includes("corporate action") ||
      CORPORATE_ACTION_CATEGORIES.has(category)
    );
  };

  const blogIndex = blogs.map((b) => {
    const title = b.heading || b.title || "";
    const corporateAction = isCorporateAction(b);

    const cleanContent = stripHtml(b.content);
    const cleanSummary = stripHtml(b.summary);
    const cleanExcerpt = stripHtml(b.excerpt);

    const fullTextContent = [
      cleanContent,
      cleanSummary,
      cleanExcerpt,
      b.category,
      b.action_type,
      Array.isArray(b.tags) ? b.tags.join(" ") : b.tags,
    ]
      .filter(Boolean)
      .join(" ");

    const rawPreview = cleanSummary || cleanExcerpt || cleanContent;
    const preview =
      rawPreview.length > 120
        ? `${rawPreview.slice(0, 120)}...`
        : rawPreview;

    return {
      id: `blog-${b.id}`,
      type: corporateAction ? "Corporate Action" : "Insight Hub",
      title,
      content: fullTextContent,
      preview,
      url: corporateAction
        ? `/corporate-actions/${b.id}/${slugify(title)}`
        : `/insight-hub/${b.id}/${slugify(title)}`,
    };
  });

  const unlistedIndex = unlistedShares.map((u) => ({
    id: `unlisted-${u.id}`,
    type: "Unlisted Share",
    title: u.name,
    content: `Unlisted Share • Price ${u.price || ""}`,
    preview: `Unlisted Share • Price ${u.price || "N/A"}`,
    url: `/pre-ipo/${u.id}/${slugify(u.name)}`,
    anchor: null,
  }));

  return [
    ...ipoIndex,
    ...preIpoIndex,
    ...brokerIndex,
    ...blogIndex,
    ...unlistedIndex,
  ];
};
