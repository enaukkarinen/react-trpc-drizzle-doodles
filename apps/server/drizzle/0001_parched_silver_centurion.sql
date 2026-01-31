CREATE TABLE "lad" (
	"reference" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"entity" text,
	"dataset" text,
	"quality" text,
	"entry_date" date,
	"start_date" date,
	"end_date" date,
	"geom" geometry(MultiPolygon, 4326) NOT NULL
);
