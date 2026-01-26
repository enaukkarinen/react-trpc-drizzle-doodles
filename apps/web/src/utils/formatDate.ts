import { format, isValid } from "date-fns";

/**
 * Formats ISO-like date strings from planning datasets.
 * Returns undefined for empty / invalid values.
 */
export function formatDate(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;

  const date = new Date(value);
  if (!isValid(date)) return undefined;

  return format(date, "d MMM yyyy");
}
