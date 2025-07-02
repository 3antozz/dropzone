"use client"
import {  useState } from "react";
import { MapContext } from "./context";
import type { Marker } from "@googlemaps/markerclusterer";

export function MapContextProvider({ children }: { children: React.ReactNode }) {
    const [markers, setMarkers] = useState<{[key: number]: Marker}>({});
    const [clickedMarker, setClickedMarker] = useState<number | null>(null);

    return (
        <MapContext.Provider value={{ markers, setMarkers, clickedMarker, setClickedMarker }}>
            {children}
        </MapContext.Provider>
    );
}