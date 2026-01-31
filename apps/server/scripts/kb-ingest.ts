import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import OpenAI from "openai";

import { db } from "@einari/db-client";
import { kbDocument, kbChunk } from "@einari/db"; // adjust if your exports differ

function sha256(s: string) {
  return createHash("sha256").update(s).digest("hex");
}

function chunkText(input: string, maxChars = 1200, overlap = 200) {
  const chunks: string[] = [];
  let i = 0;
  while (i < input.length) {
    const end = Math.min(i + maxChars, input.length);
    chunks.push(input.slice(i, end).trim());
    if (end === input.length) break;
    i = Math.max(0, end - overlap);
  }
  return chunks.filter(Boolean);
}

async function findMarkdownFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) out.push(...(await findMarkdownFiles(full)));
    else if (it.isFile() && it.name.endsWith(".md")) out.push(full);
  }
  return out;
}

async function main() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const kbDir = path.resolve(process.cwd(), "kb");
  const files = await findMarkdownFiles(kbDir);

  if (files.length === 0) {
    console.log("No markdown files found in ./kb");
    return;
  }

  for (const file of files) {
    const rel = path.relative(process.cwd(), file).replaceAll("\\", "/");
    const title = path.basename(file);
    const content = await fs.readFile(file, "utf8");

    const chunks = chunkText(content);
    const hashes = chunks.map((c) => sha256(`${rel}:${c}`));

    // Precompute embeddings outside the transaction to keep it short
    const batchSize = 32;
    const chunkRecords: Array<{
      chunkIndex: number;
      content: string;
      contentHash: string;
      embedding: number[];
    }> = [];
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batchChunks = chunks.slice(i, i + batchSize);
      const embRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: batchChunks,
      });
      for (let j = 0; j < batchChunks.length; j++) {
        const chunkIndex = i + j;
        const contentHash = hashes[chunkIndex];
        const embedding = embRes.data[j].embedding as number[];
        chunkRecords.push({
          chunkIndex,
          content: batchChunks[j],
          contentHash,
          embedding,
        });
      }
    }

    // Upsert document and all chunks in a single transaction per file
    await db.transaction(async (tx) => {
      const [doc] = await tx
        .insert(kbDocument)
        .values({ title, source: rel })
        .onConflictDoUpdate({
          target: kbDocument.source,
          set: { title },
        })
        .returning({ id: kbDocument.id });

      for (const r of chunkRecords) {
        await tx
          .insert(kbChunk)
          .values({
            documentId: doc.id,
            chunkIndex: r.chunkIndex,
            content: r.content,
            contentHash: r.contentHash,
            embedding: r.embedding,
          })
          .onConflictDoUpdate({
            target: kbChunk.contentHash,
            set: {
              documentId: doc.id,
              chunkIndex: r.chunkIndex,
              content: r.content,
              embedding: r.embedding,
            },
          });
      }
    });

    console.log(`Ingested ${rel} (${chunks.length} chunks)`);
  }

  console.log("KB ingest complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
