export const BUSINESS_TIME_ZONE = "Asia/Jakarta" as const;
export const JAKARTA_UTC_OFFSET = "+07:00" as const;

const BUSINESS_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const LOCAL_TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;

export type BusinessDate = string & { readonly __businessDate: unique symbol };

export function parseBusinessDate(value: string): BusinessDate {
  if (!BUSINESS_DATE_RE.test(value)) {
    throw new Error(`Invalid business date: ${value}`);
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid business date: ${value}`);
  }

  return value as BusinessDate;
}

export function formatBusinessDate(instant: Date): BusinessDate {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Unable to format Asia/Jakarta business date");
  }

  return parseBusinessDate(`${year}-${month}-${day}`);
}

export function addBusinessDays(date: BusinessDate, days: number): BusinessDate {
  if (!Number.isInteger(days)) {
    throw new Error("Business-day delta must be an integer");
  }

  const instant = new Date(`${date}T00:00:00Z`);
  instant.setUTCDate(instant.getUTCDate() + days);
  return parseBusinessDate(instant.toISOString().slice(0, 10));
}

export function jakartaLocalDateTimeToInstant(date: BusinessDate, time: string): Date {
  const match = LOCAL_TIME_RE.exec(time);
  if (!match) {
    throw new Error(`Invalid local time: ${time}`);
  }

  const normalized = `${match[1]}:${match[2]}:${match[3] ?? "00"}`;
  const instant = new Date(`${date}T${normalized}${JAKARTA_UTC_OFFSET}`);
  if (Number.isNaN(instant.getTime())) {
    throw new Error(`Invalid Asia/Jakarta local datetime: ${date} ${time}`);
  }

  return instant;
}

export function buildShiftInterval(input: {
  workDate: BusinessDate;
  startTime: string;
  endTime: string;
  crossesMidnight: boolean;
}): { startAt: Date; endAt: Date } {
  const startAt = jakartaLocalDateTimeToInstant(input.workDate, input.startTime);
  const endDate = input.crossesMidnight ? addBusinessDays(input.workDate, 1) : input.workDate;
  const endAt = jakartaLocalDateTimeToInstant(endDate, input.endTime);

  if (endAt <= startAt) {
    throw new Error("Shift interval must end after it starts");
  }

  return { startAt, endAt };
}
