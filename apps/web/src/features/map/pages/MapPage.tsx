import { useMemo, useState } from "react";
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { MVTLayer } from "@deck.gl/geo-layers";
import type { PickingInfo } from "@deck.gl/core";

type Hover = { x: number; y: number; name?: string } | null;

const INITIAL_VIEW_STATE = {
  longitude: -0.1276,
  latitude: 51.5072,
  zoom: 6,
  pitch: 0,
  bearing: 0,
};

export default function MapPage() {
  const [hover, setHover] = useState<Hover>(null);

  const layers = useMemo(() => {
    return [
      new MVTLayer({
        id: "lad-mvt",
        data: "/tiles/lad/{z}/{x}/{y}.pbf",
        minZoom: 0,
        maxZoom: 12,
        pickable: true,
        filled: true,
        stroked: true,
        getFillColor: [20, 80, 200, 50],
        getLineColor: [15, 23, 42, 140],
        lineWidthUnits: "pixels",
        getLineWidth: 1,
        autoHighlight: true,
        highlightColor: [255, 255, 255, 80],
        onHover: (info: PickingInfo) => {
          const obj: any = info.object;
          if (!info.picked || !obj) return setHover(null);
          setHover({
            x: info.x ?? 0,
            y: info.y ?? 0,
            name: obj.properties?.name ?? obj.properties?.NAME,
          });
        },
      }),
    ];
  }, []);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-2">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-200">Map</div>
        <div className="text-xs text-slate-400">Vector tiles</div>
      </div>

      <div className="relative h-[520px] overflow-hidden rounded-b-xl">
        <DeckGL
          width="100%"
          height="100%"
          useDevicePixels={1}
          initialViewState={INITIAL_VIEW_STATE}
          controller
          layers={layers}
          onError={(err) => console.error("DeckGL error:", err)}
        >
          <Map reuseMaps mapStyle="https://demotiles.maplibre.org/style.json" attributionControl={false} />
        </DeckGL>

        {hover ? (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs text-slate-800 shadow-sm"
            style={{ left: hover.x + 12, top: hover.y + 12 }}
          >
            <div className="font-medium">{hover.name ?? "Area"}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
