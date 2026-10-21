
import { BODY_TYPES,LB_PER_KG,CM_PER_IN } from "../Data/popupForm/popupFormData";

export const cleanText = (v, max = 60) =>
  String(v)
    .normalize("NFKC")
    .replace(/[’‘]/g, "'")
    .replace(/[^\p{L}\p{M} .'-]/gu, "") // drops digits, <>, =, @, quotes, emoji, control chars
    .replace(/^[^\p{L}]+/u, "") // must start with a letter
    .replace(/\s{2,}/g, " ")
    .slice(0, max);

export const cleanEmail = (v) =>
  String(v)
    .replace(/[^A-Za-z0-9._%+@-]/g, "")
    .replace(/^[^A-Za-z0-9]+/, "")
    .slice(0, 254);

export const cleanCode = (v) => {
  const s = String(v).replace(/[^0-9+]/g, "");
  return ("+" + s.replace(/\+/g, "")).slice(0, 5);
};

export const FORMULA_START = /^[=+\-@\t\r|%]/;
export const safeCell = (v, max = 200) => {
  const s = String(v ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "")
    .trim()
    .slice(0, max);
  return FORMULA_START.test(s) ? `'${s}` : s;
};

// UTM values: tiny allow-list
export const cleanUtm = (v) => String(v || "").replace(/[^\w\-.~+ %]/g, "").slice(0, 100);

// Landing URL: http(s) only, rebuilt from parsed parts (no query/hash), length-capped
export const cleanUrl = (href) => {
  try {
    const u = new URL(href);
    if (!/^https?:$/.test(u.protocol)) return "";
    return (u.origin + u.pathname).slice(0, 300);
  } catch {
    return "";
  }
};

export const getBodyType = (bmi) =>
  BODY_TYPES.find((b) => bmi < b.max) ?? BODY_TYPES[BODY_TYPES.length - 1];


export const toKg = (v, unit) => (unit === "lb" ? v / LB_PER_KG : v);
export const toCm = (v, unit) => (unit === "in" ? v * CM_PER_IN : v);