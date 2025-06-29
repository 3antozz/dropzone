'use client'
import {AdvancedMarker, Pin} from '@vis.gl/react-google-maps';
import type {Marker} from '@googlemaps/markerclusterer';


export default function Marker({ pos } : {pos: google.maps.LatLngLiteral}) {
    return (
        <AdvancedMarker position={pos} >
            <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
    )
}