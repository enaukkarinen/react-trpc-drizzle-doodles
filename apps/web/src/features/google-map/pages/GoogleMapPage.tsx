import { useMemo, useEffect } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";

import { ScatterplotLayer } from "@deck.gl/layers";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import type { DeckProps } from "@deck.gl/core";

function DeckGLOverlay(props: DeckProps) {
  const map = useMap();
  const overlay = useMemo(() => new GoogleMapsOverlay({}), []);

  useEffect(() => {
    overlay.setMap(map);
    return () => overlay.setMap(null);
  }, [map, overlay]);

  useEffect(() => {
    overlay.setProps(props);
  }, [overlay, props]);

  return null;
}

export function GoogleMapPage() {
  const layers = useMemo(
    () => [
      new ScatterplotLayer({
        id: "deckgl-circle",
        data: [{ position: [0.45, 51.47] }],
        getPosition: (d) => d.position,
        getFillColor: [255, 0, 0, 100],
        getRadius: 1000,
      }),
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Google Maps</h1>
      </header>

      <APIProvider apiKey="">
        <Map defaultCenter={{ lat: 51.47, lng: 0.45 }} defaultZoom={11} style={{ width: "100%", height: "520px" }}>
          <DeckGLOverlay layers={layers} />
        </Map>
      </APIProvider>
    </div>
  );
}
