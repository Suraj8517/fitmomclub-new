import { BODY_TYPES, BODY_IMAGES, LB_PER_KG, CM_PER_IN } from "../Data/popupForm/popupFormData";

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

export const toKg = (v, unit) => (unit === "lb" ? v / LB_PER_KG : v);
export const toCm = (v, unit) => (unit === "in" ? v * CM_PER_IN : v);

/* ───────────── BMI + 10-stage body classification ───────────── */

/** Single source of truth for BMI. Returns a number (2 decimals) or null if input is invalid. */
export function calculateBMI({ weight, weightUnit, height, heightUnit }) {
  const w = Number(weight);
  const h = Number(height);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null;
  const kg = toKg(w, weightUnit);
  const m = toCm(h, heightUnit) / 100;
  if (!(kg > 0) || !(m > 0)) return null;
  const bmi = kg / (m * m);
  return Number.isFinite(bmi) ? Math.round(bmi * 100) / 100 : null;
}

/** Returns the stage object (stage 1-10) for a BMI, or null. */
export function getBodyType(bmi) {
  if (!Number.isFinite(bmi) || bmi <= 0) return null;
  return BODY_TYPES.find((t) => bmi >= t.min && bmi < t.max) ?? null;
}

/** Returns the image URL for a gender and stage, or null if the file is missing. */
export function getBodyImage(gender, stage) {
  return BODY_IMAGES[gender]?.[stage] ?? null;
}