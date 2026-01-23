import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeckGL from "@deck.gl/react";
import Map from "react-map-gl/maplibre";

import type { Hover, SelectedDistrict } from "../types";
import { createLadLayer } from "../lib/ladLayer";
import { HoverTooltip } from "../components/HoverTooltip";
import { DistrictDetailsPanel } from "../components/DistrictDetailsPanel";

const INITIAL_VIEW_STATE = {
  longitude: -0.1276,
  latitude: 51.5072,
  zoom: 6,
  pitch: 0,
  bearing: 0,
};

export default function MapPage() {
  const navigate = useNavigate();

  const [hover, setHover] = useState<Hover>(null);
  const [selected, setSelected] = useState<SelectedDistrict>(null);

  const selectedKey = selected?.key ?? null;

  const layers = useMemo(() => {
    return [createLadLayer({ selectedKey, setHover, setSelected })];
  }, [selectedKey]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-2">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-200">Map</div>
        <div className="text-xs text-slate-400">Click a district</div>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[1fr_340px]">
        <div className="relative h-[520px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
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

          <HoverTooltip hover={hover} />
        </div>

        <DistrictDetailsPanel
          selected={selected}
          onClear={() => setSelected(null)}
          onAskChat={() => {
            const district = selected?.name ?? "";
            const ref = selected?.reference ?? "";
            const qs = new URLSearchParams();
            if (district) qs.set("district", district);
            if (ref) qs.set("ref", ref);
            navigate(`/chat?${qs.toString()}`);
          }}
          onCopyReference={() => {
            if (selected?.reference) navigator.clipboard.writeText(selected.reference);
          }}
        />
      </div>
    </section>
  );
}
