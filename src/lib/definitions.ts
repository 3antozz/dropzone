import type { Marker } from "@googlemaps/markerclusterer"
import { Dispatch, SetStateAction } from "react"
export type MapContextType = {
    markers: {[key: number]: Marker},
    setMarkers: Dispatch<SetStateAction<{[key: number]: Marker}>>,
    clickedMarker: number | null,
    setClickedMarker: Dispatch<SetStateAction<number | null>>,
    infoWindowShown?: boolean,
    setInfoWindowShown?: Dispatch<SetStateAction<boolean>>
}