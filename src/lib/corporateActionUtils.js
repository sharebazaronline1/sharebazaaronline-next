// src/lib/corporateActionUtils.js

export const TABS = [
  {
    id: "buyback",
    label: "Buyback",
    href: "/corporate-actions",
    dbType: "buyback",
    aliases: ["buyback", "buy_back"],
  },
  {
    id: "dividends",
    label: "Dividends",
    href: "/corporate-actions/dividends",
    dbType: "dividend",
    aliases: ["dividend", "dividends"],
  },
  {
    id: "rights",
    label: "Rights Issue",
    href: "/corporate-actions/rights",
    dbType: "rights",
    aliases: ["rights", "rights_issue", "rights issue"],
  },
  {
    id: "bonus",
    label: "Bonus Issue",
    href: "/corporate-actions/bonus",
    dbType: "bonus",
    aliases: ["bonus", "bonus_issue", "bonus issue"],
  },
  {
    id: "splits",
    label: "Stock Split",
    href: "/corporate-actions/splits",
    dbType: "split",
    aliases: ["split", "stock_split", "stock split"],
  },
  {
    id: "others",
    label: "Other Actions",
    href: "/corporate-actions/others",
    dbType: "other",
    aliases: ["other", "others", "other_action"],
  },
];

export function getTabConfig(id) {
  return TABS.find((t) => t.id === id) || TABS[0];
}