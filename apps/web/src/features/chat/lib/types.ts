import type { ToolTrace } from "@einari/api-contract";
import type { FeedbackStatus } from "@einari/db/src/feedbackStatus";

export type ChatRole = "user" | "assistant";

export type Msg = {
  id: string;
  role: ChatRole;
  text: string;
  data?: ToolTrace[];
  createdAt: Date;
};

export type ToolOutputListItem = {
  id: string;
  summary?: string;
  status?: FeedbackStatus;
  createdAt?: string;
};

export type ToolOutputList = {
  items: ToolOutputListItem[];
};
