import type { EffectiveRange } from "./model";

function rangeEnd(value: string | null) {
  return value ?? "9999-12-31";
}

export function effectiveRangesOverlap(left: EffectiveRange, right: EffectiveRange) {
  return (
    left.effectiveFrom < rangeEnd(right.effectiveTo) &&
    right.effectiveFrom < rangeEnd(left.effectiveTo)
  );
}

export function assertNoEffectiveRangeOverlap(
  candidate: EffectiveRange,
  existing: EffectiveRange[],
) {
  if (existing.some((range) => effectiveRangesOverlap(candidate, range))) {
    throw new Error("Effective-dated version overlaps an existing version.");
  }
}

export function assertPositiveRowVersion(rowVersion: number) {
  if (!Number.isInteger(rowVersion) || rowVersion < 1) {
    throw new Error("rowVersion must be a positive integer.");
  }
}

export function assertIntegerIdr(amount: number) {
  if (!Number.isSafeInteger(amount)) {
    throw new Error("IDR amount must be represented as a safe integer rupiah value.");
  }
}
