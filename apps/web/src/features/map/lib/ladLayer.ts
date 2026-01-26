import { MVTLayer } from "@deck.gl/geo-layers";
import type { PickingInfo } from "@deck.gl/core";
import type { Hover, SelectedDistrict } from "../types";
import { asRecord, getEntity, getFeatureKey, getName, getReference } from "./ladFeature";

export function createLadLayer(opts: {
  selectedKey: string | null;
  setHover: (h: Hover) => void;
  setSelected: (s: SelectedDistrict) => void;
}) {
  const { selectedKey, setHover, setSelected } = opts;

  return new MVTLayer({
    id: "lad-mvt",
    data: "/tiles/lad/{z}/{x}/{y}.pbf",
    minZoom: 0,
    maxZoom: 12,

    pickable: true,
    filled: true,
    stroked: true,

    autoHighlight: true,
    highlightColor: [255, 255, 255, 80],

    getFillColor: (f: any) => {
      const key = getFeatureKey(f);
      if (selectedKey && key === selectedKey) return [20, 80, 200, 110];
      return [20, 80, 200, 50];
    },
    getLineColor: (f: any) => {
      const key = getFeatureKey(f);
      if (selectedKey && key === selectedKey) return [15, 23, 42, 220];
      return [15, 23, 42, 140];
    },
    lineWidthUnits: "pixels",
    getLineWidth: (f: any) => {
      const key = getFeatureKey(f);
      return selectedKey && key === selectedKey ? 2 : 1;
    },

    updateTriggers: {
      getFillColor: [selectedKey],
      getLineColor: [selectedKey],
      getLineWidth: [selectedKey],
    },

    onHover: (info: PickingInfo) => {
      const obj: any = info.object;
      if (!info.picked || !obj) return setHover(null);

      const props = asRecord(obj.properties);
      setHover({
        x: info.x ?? 0,
        y: info.y ?? 0,
        name: getName(props),
      });
    },

    onClick: (info: PickingInfo) => {
      const obj: any = info.object;
      if (!info.picked || !obj) {
        setSelected(null);
        return;
      }

      const props = asRecord(obj.properties);

      setSelected({
        key: getFeatureKey(obj),
        name: getName(props),
        reference: getReference(props),
        entity: getEntity(props),
        properties: props,
      });
    },
  });
}
