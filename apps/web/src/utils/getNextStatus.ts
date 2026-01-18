import type { FeedbackStatus } from "@einari/db";

const NEXT_STATUS: Record<FeedbackStatus, FeedbackStatus> = {
  open: "planned",
  planned: "done",
  done: "open",
};

export function getNextStatus(status: FeedbackStatus): FeedbackStatus {
  return NEXT_STATUS[status];
}