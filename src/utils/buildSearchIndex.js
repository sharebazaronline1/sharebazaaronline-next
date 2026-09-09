// src/utils/buildSearchIndex.js
import slugify from "./slugify";

// Utility to strip HTML tags and normalize spaces
const stripHtml = (html = "") => {
  if (typeof html !== "string") return "";
  return html
    .replace(/<[^>]*>/g, " ") // Replace tags with a space
    .replace(/\s+/g, " ")    // Normalize multiple spaces
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
    title: pre.name,
    content: `
      Pre IPO
      Unlisted Shares
      Price ${pre.price || ""}
      Lot size ${pre.minLotSize || ""}
      Depository ${pre.depository || ""}
    `,
    preview: `Pre IPO • Unlisted Share • Price ${pre.price || "N/A"}`,
    url: `/pre-ipo-stocks`,
    anchor: `preipo-${pre.id}`,
  }));

  const brokerIndex = brokers.map((b) => ({
    id: `broker-${b.id}`,
    title: b.name,
    content: `Rating: ${b.rating}, Brokerage: ${b.brokerage}, Equities: ${b.equities}`,
    preview: `Rating: ${b.rating || "N/A"} • Brokerage: ${b.brokerage || "N/A"}`,
    url: `/brokers`,
  }));

  const blogIndex = blogs.map((b) => {
    const title = b.heading || b.title || "";
    
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
    const preview = rawPreview.length > 120 
      ? `${rawPreview.slice(0, 120)}...` 
      : rawPreview;

    return {
      id: `blog-${b.id}`,
      title,
      content: fullTextContent,
      preview,
      url: `/insight-hub/${b.id}/${slugify(title)}`,
    };
  });

  const unlistedIndex = unlistedShares.map((u) => ({
    id: `unlisted-${u.id}`,
    title: u.name,
    content: `Unlisted Share • Price ${u.price || ""}`,
    preview: `Unlisted Share • Price ${u.price || "N/A"}`,
    url: `/pre-ipo-stocks`,
    anchor: `preipo-${u.id}`,
  }));

  return [
    ...ipoIndex,
    ...preIpoIndex,
    ...brokerIndex,
    ...blogIndex,
    ...unlistedIndex,
  ];
};