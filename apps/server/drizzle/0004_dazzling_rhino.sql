CREATE TABLE "kb_chunk" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"chunk_index" integer NOT NULL,
	"content" text NOT NULL,
	"content_hash" text NOT NULL,
	"embedding" vector(1536),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kb_document" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"source" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "kb_chunk_document_id_idx" ON "kb_chunk" USING btree ("document_id");--> statement-breakpoint
CREATE UNIQUE INDEX "kb_chunk_content_hash_uq" ON "kb_chunk" USING btree ("content_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "kb_document_source_uq" ON "kb_document" USING btree ("source");