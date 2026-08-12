import { describe, expect, it } from "vitest";

import {
  addBusinessDays,
  buildShiftInterval,
  formatBusinessDate,
  parseBusinessDate,
} from "./business-date";

describe("Asia/Jakarta business date", () => {
  it("resolves UTC instants into the canonical Jakarta business date", () => {
    expect(formatBusinessDate(new Date("2026-08-12T18:30:00.000Z"))).toBe("2026-08-13");
  });

  it("keeps cross-midnight shift work_date anchored to the start date", () => {
    const workDate = parseBusinessDate("2026-08-13");
    const interval = buildShiftInterval({
      workDate,
      startTime: "23:00",
      endTime: "07:00",
      crossesMidnight: true,
    });

    expect(interval.startAt.toISOString()).toBe("2026-08-13T16:00:00.000Z");
    expect(interval.endAt.toISOString()).toBe("2026-08-14T00:00:00.000Z");
    expect(addBusinessDays(workDate, 1)).toBe("2026-08-14");
  });

  it("rejects impossible business dates", () => {
    expect(() => parseBusinessDate("2026-02-30")).toThrow(/Invalid business date/);
  });
});
