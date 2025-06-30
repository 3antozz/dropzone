import { createContext } from "react"
import type { MapContextType } from "@/lib/definitions"
export const MapContext = createContext<MapContextType>({
  markers: {},
  setMarkers: () => {
    throw new Error("setMarkers must be used within a MapProvider");
  },
  clickedMarker: null,
  setClickedMarker: () => {
    throw new Error("setClickedMarker must be used within a MapProvider");
  },
  infoWindowShown: false,
  setInfoWindowShown: () => {
    throw new Error("setInfoWindowShown must be used within a MapProvider");
  },
});