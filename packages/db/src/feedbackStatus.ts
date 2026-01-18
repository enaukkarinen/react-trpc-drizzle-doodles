import { feedbackStatus } from "./schema";

export const FEEDBACK_STATUSES = feedbackStatus.enumValues;

export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];
