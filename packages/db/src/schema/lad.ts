import { pgTable, text, date, customType } from "drizzle-orm/pg-core";

const geometryMultiPolygon = customType({
  dataType() {
    return "geometry(MultiPolygon, 4326)";
  },
});

export const lad = pgTable("lad", {
  reference: text("reference").primaryKey(),
  name: text("name").notNull(),
  entity: text("entity"),
  dataset: text("dataset"),
  quality: text("quality"),
  entryDate: date("entry_date"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  geom: geometryMultiPolygon("geom").notNull(),
});
