import { describe, it, expect } from "vitest";
import { calculateBMI, getBodyType } from "./popupFormValidations";

const cases = [
  [15.99, 1], [16, 2], [18.49, 2], [18.5, 3], [19.99, 3], [20, 4], [21.49, 4], [21.5, 5],
  [22.99, 5], [23, 6], [24.99, 6], [25, 7], [27.49, 7], [27.5, 8], [29.99, 8],
  [30, 8], [34.99, 8], [35, 9], [60, 10],
];

describe("getBodyType", () => {
  it.each(cases)("BMI %s -> stage %i", (bmi, stage) => {
    expect(getBodyType(bmi).stage).toBe(stage);
  });
  it("rejects invalid", () => {
    expect(getBodyType(null)).toBeNull();
    expect(getBodyType(NaN)).toBeNull();
    expect(getBodyType(-1)).toBeNull();
  });
});

describe("calculateBMI", () => {
  it("metric", () =>
    expect(calculateBMI({ weight: 70, weightUnit: "kg", height: 175, heightUnit: "cm" })).toBeCloseTo(22.86, 2));
  it("imperial matches metric", () =>
    expect(calculateBMI({ weight: 154.32, weightUnit: "lb", height: 68.9, heightUnit: "in" })).toBeCloseTo(22.86, 1));
  it("mixed units", () =>
    expect(calculateBMI({ weight: 70, weightUnit: "kg", height: 68.9, heightUnit: "in" })).toBeCloseTo(22.86, 1));
  it("invalid or missing", () => {
    expect(calculateBMI({ weight: "", weightUnit: "kg", height: 175, heightUnit: "cm" })).toBeNull();
    expect(calculateBMI({ weight: 70, weightUnit: "kg", height: 0, heightUnit: "cm" })).toBeNull();
    expect(calculateBMI({ weight: "abc", weightUnit: "kg", height: 175, heightUnit: "cm" })).toBeNull();
  });
});