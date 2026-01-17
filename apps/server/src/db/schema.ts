import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";

export const feedbackStatus = pgEnum("feedback_status", [
  "open",
  "planned",
  "done",
]);

export const feedback = pgTable("feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  status: feedbackStatus("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
