-- Create HNSW index on kb_chunk.embedding for fast cosine similarity
-- Requires pgvector extension (created in 0003_vector_extension.sql)
CREATE INDEX IF NOT EXISTS kb_chunk_embedding_hnsw_idx
  ON kb_chunk
  USING hnsw (embedding vector_cosine_ops);
