// Calendar days in the device's local time, as 'YYYY-MM-DD'. Streaks and due
// dates follow the learner's day, not UTC.

export type Day = string;

export function toDay(date: Date): Day {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function today(): Day {
  return toDay(new Date());
}

function parse(day: Day): Date {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(day: Day, n: number): Day {
  const date = parse(day);
  date.setDate(date.getDate() + n);
  return toDay(date);
}

/** Whole calendar days from `a` to `b` (positive when b is later). */
export function daysBetween(a: Day, b: Day): number {
  // Noon avoids daylight-saving shifts turning 24h into 23h or 25h.
  const ms = parse(b).setHours(12) - parse(a).setHours(12);
  return Math.round(ms / 86_400_000);
}
