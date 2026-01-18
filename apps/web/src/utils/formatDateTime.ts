import { format } from "date-fns";

export function formatDateTime(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;

  return format(date, "d MMM yyyy HH:mm");
}
