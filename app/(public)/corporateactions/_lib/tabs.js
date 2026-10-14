// app/corporateactions/_lib/tabs.js
export const TABS = [
  { id: "buyback",   label: "Buyback",       dbType: "buyback",  href: "/corporateactions" },
  { id: "dividends", label: "Dividends",     dbType: "dividend", href: "/corporateactions/dividends" },
  { id: "rights",    label: "Rights Issue",  dbType: "rights",   href: "/corporateactions/rights-issue" },
  { id: "bonus",     label: "Bonus Issue",   dbType: "bonus",    href: "/corporateactions/bonus-issue" },
  { id: "splits",    label: "Stock Split",   dbType: "split",    href: "/corporateactions/stock-split" },
  { id: "others",    label: "Other Actions", dbType: "other",    href: "/corporateactions/other-actions" },
];

export const KNOWN_TYPES = ["buyback", "dividend", "rights", "bonus", "split"];

export function findTab(tabId) {
  return TABS.find((t) => t.id === tabId) || TABS[0];
}

/**
 * Returns rows matching the tab's dbType.
 * `other` catches anything not in KNOWN_TYPES so nothing is silently dropped.
 */
export function filterRowsForTab(records = [], dbType = "buyback") {
  return (records || []).filter((r) => {
    const t = (r.action_type || "other").toLowerCase().trim();
    if (dbType === "other") return !KNOWN_TYPES.includes(t);
    return t === dbType;
  });
}