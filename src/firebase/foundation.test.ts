import { describe, expect, it } from "vitest";

import { assertIntegerIdr, assertNoEffectiveRangeOverlap, effectiveRangesOverlap } from "./invariants";
import { firestoreCollections } from "./model";

describe("Firebase domain foundation", () => {
  it("keeps canonical collection names unique", () => {
    const names = Object.values(firestoreCollections);
    expect(new Set(names).size).toBe(names.length);
  });

  it("detects overlapping effective-dated versions", () => {
    expect(
      effectiveRangesOverlap(
        { effectiveFrom: "2026-01-01", effectiveTo: "2026-09-01" },
        { effectiveFrom: "2026-08-01", effectiveTo: null },
      ),
    ).toBe(true);

    expect(() =>
      assertNoEffectiveRangeOverlap(
        { effectiveFrom: "2026-08-01", effectiveTo: null },
        [{ effectiveFrom: "2026-01-01", effectiveTo: "2026-09-01" }],
      ),
    ).toThrow(/overlaps/i);
  });

  it("keeps IDR as integer rupiah", () => {
    expect(() => assertIntegerIdr(75_000)).not.toThrow();
    expect(() => assertIntegerIdr(75_000.5)).toThrow(/integer/i);
  });
});
