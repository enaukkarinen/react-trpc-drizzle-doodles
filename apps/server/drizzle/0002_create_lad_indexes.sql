CREATE INDEX IF NOT EXISTS lad_geom_gix ON lad USING GIST (geom);
CREATE INDEX IF NOT EXISTS lad_reference_idx ON lad (reference);
