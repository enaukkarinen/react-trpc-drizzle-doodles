## Map Overview
- **Frontend**: Deck.gl + MapLibre. Deck.gl `MVTLayer` renders districts on top of a MapLibre base map.
- **Interaction**: Hover shows a tooltip; click selects a district, highlights it, and shows a details panel with properties.
- **Styling**: Selected district uses a darker stroke and fill; updates are driven by a `selectedKey`.

## Vector Tiles
- **Endpoint**: Vector tiles are served at `/tiles/lad/{z}/{x}/{y}.pbf` (Mapbox Vector Tile format, MVT).
- **Representation**: Each tile contains UK Local Authority District (LAD) polygons and properties.
- **Geometry**: Polygons are transformed to Web Mercator (EPSG:3857), clipped to the tile envelope, and encoded with `extent=4096` and `buffer=256` for smooth edges.
- **Attributes**: Features include `reference`, `name`, `entity`, `dataset`, `quality`, and `entry/start/end` dates—used by the UI for tooltips, selection, and the details panel.
- **Zooms**: The layer renders up to zoom 12 for performance and clarity.

## Surfacing
- **Frontend consumption**: The `MVTLayer` points directly to the tiles endpoint and handles picking (`onHover`, `onClick`).
- **Selection & details**: Clicking a feature extracts its properties to populate the district details panel; hover shows the district name when available.
- **Base map**: MapLibre provides only the basemap style; district polygons come from the custom LAD tile layer.

## Storage & Caching
- **Source of truth**: LAD polygons and metadata live in Postgres/PostGIS.
- **Tile generation**: Tiles are generated on-demand from the database using SQL functions (e.g., `ST_TileEnvelope`, `ST_AsMVTGeom`, `ST_AsMVT`).
- **HTTP delivery**: Served as `application/x-protobuf` with cache headers; empty tiles return `204 No Content`.
- **In-memory cache**: The server keeps an LRU cache of tile buffers (size-capped, ~10 min TTL) to reduce database load and improve responsiveness.

## Notes
- The frontend does not store tiles; it requests them as the map moves/zooms.
- Feature properties are authoritative from the database; the basemap is visual context only.
