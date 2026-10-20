// src/lib/corporateActionUtils.js

export const TABS = [
  {
    id: "buyback",
    label: "Buyback",
    href: "/corporateactions",
    dbType: "buyback",
    aliases: ["buyback", "buy_back"],
  },
  {
    id: "dividends",
    label: "Dividends",
    href: "/corporateactions/dividends",
    dbType: "dividend",
    aliases: ["dividend", "dividends"],
  },
  {
    id: "rights",
    label: "Rights Issue",
    href: "/corporateactions/rights",
    dbType: "rights",
    aliases: ["rights", "rights_issue", "rights issue"],
  },
  {
    id: "bonus",
    label: "Bonus Issue",
    href: "/corporateactions/bonus",
    dbType: "bonus",
    aliases: ["bonus", "bonus_issue", "bonus issue"],
  },
  {
    id: "splits",
    label: "Stock Split",
    href: "/corporateactions/splits",
    dbType: "split",
    aliases: ["split", "stock_split", "stock split"],
  },
  {
    id: "others",
    label: "Other Actions",
    href: "/corporateactions/others",
    dbType: "other",
    aliases: ["other", "others", "other_action"],
  },
];

export function getTabConfig(id) {
  return TABS.find((t) => t.id === id) || TABS[0];
}