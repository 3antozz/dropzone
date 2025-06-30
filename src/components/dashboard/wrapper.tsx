"use client"
import { useState } from "react";
import type { Marker } from "@googlemaps/markerclusterer";
import { Dropoff } from "../../../generated/prisma"
import DashboardMap from "../map/dashboard-map"
import DropoffElement from "./dropoff";
import { MapContext } from "../map/context";
export default function Wrapper({dropoffs}: {dropoffs: Dropoff[]}) {
    const [markers, setMarkers] = useState<{[key: number]: Marker}>({});
    const [clickedMarker, setClickedMarker] = useState<number | null>(null)
    return (
        <div className="flex justify-center">
            <MapContext value={{markers, setMarkers, clickedMarker, setClickedMarker}}>
            <DashboardMap dropoffs={dropoffs} />
            <section className="w-96">
                <ul className="space-y-5!">
                    {dropoffs.map(dropoff => 
                    <DropoffElement key={dropoff.id} dropoff={dropoff} />
                    )}
                </ul>
            </section>
            </MapContext>
        </div>
    )
}