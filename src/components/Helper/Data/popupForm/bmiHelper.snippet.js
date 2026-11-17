/* ──────────────────────────────────────────────────────────────
   MERGE INTO popupFormHelpers/popupFormValidations.js
   1. Add this import at the top of that file.
   2. Delete your old getBodyType and paste the three functions below.
   (toKg and toCm already live in that file, so they are not imported.)
   ────────────────────────────────────────────────────────────── */
import { BODY_TYPES, BODY_IMAGES } from "../Data/popupForm/popupFormData";

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