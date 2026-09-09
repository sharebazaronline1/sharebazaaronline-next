// lib/utils.js
export const generateShortId = (uid) => {
  if (!uid) return "SB-GUEST000";
  const short = uid.slice(-12);
  const hash = btoa(short).replace(/[=+/]/g, "").slice(0, 8).toUpperCase();
  return `SB-${hash}`;
};