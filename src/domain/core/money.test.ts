import { describe, expect, it } from "vitest";

import { addIdr, formatIdr, idr, multiplyIdr, nonNegativeIdr } from "./money";

describe("integer IDR money", () => {
  it("keeps payroll arithmetic in integer rupiah", () => {
    const baseSalary = nonNegativeIdr(6_000_000);
    const s2 = multiplyIdr(nonNegativeIdr(50_000), 7);
    const s3 = multiplyIdr(nonNegativeIdr(75_000), 6);

    expect(addIdr(baseSalary, s2, s3)).toBe(6_800_000);
  });

  it("rejects fractions and unsafe integers", () => {
    expect(() => idr(1.5)).toThrow(/safe integer/);
    expect(() => idr(Number.MAX_SAFE_INTEGER + 1)).toThrow(/safe integer/);
  });

  it("formats IDR without fractional currency", () => {
    expect(formatIdr(nonNegativeIdr(75_000))).toMatch(/75\.000/);
  });
});
