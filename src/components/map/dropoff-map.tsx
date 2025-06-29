'use client'
import { Map, MapMouseEvent, useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import { useState, useEffect, useRef, useCallback} from 'react';
import Marker from './marker';


export default function DropoffMap() {
    const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null)
    const map = useMap();
    const placesLib = useMapsLibrary('places');
    const controlDivRef = useRef<HTMLDivElement>(null);
    const autocompleteDivRef = useRef<HTMLDivElement>(null);
    const panToLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    map?.panTo(pos);
                    map?.setZoom(13);
                    setMarkerPosition(pos)
                    },
                    () => {
                        console.log('ERRORRR')
                }
        );
        } else {
            // Browser doesn't support Geolocation
            console.log('ERRORRR')
        }
    }, [map])
    const placeMarkerAndPanTo = (event: MapMouseEvent) =>  {
        if(event.detail.latLng) {
            // map?.panTo(event.detail.latLng);
            setMarkerPosition(event.detail.latLng)
        }
    }
    useEffect(() => {
        if (map && controlDivRef.current) {
            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDivRef.current);
            controlDivRef.current.classList.add("block!"); 
        }
        panToLocation();
    }, [map, panToLocation])

    useEffect(() => {
        if(map && placesLib && autocompleteDivRef.current) {
            //@ts-expect-error library not updated yet
            const placeAutocomplete = new placesLib.PlaceAutocompleteElement();
            autocompleteDivRef.current.appendChild(placeAutocomplete);
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(autocompleteDivRef.current);
            autocompleteDivRef.current.classList.add("block!"); 
            //@ts-expect-error dunno what's the type of this prop (not documented)
            placeAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
                const place = placePrediction.toPlace();
                await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });

                if (place.viewport) {
                    map.fitBounds(place.viewport);
                } else {
                    map.setCenter(place.location);
                    map.setZoom(17);
                }
                setMarkerPosition(place.location)
            });
        }
    }, [map, placesLib])
    return (
        <Map
            className="w-[80%] h-140 mx-auto!"
            mapId={process.env.NEXT_PUBLIC_MAP_ID}
            defaultZoom={2}
            disableDefaultUI={true}
            mapTypeControl={true}
            defaultCenter={ { lat: 27.43752386602214, lng: 10.79002834887643 } }
            onClick={placeMarkerAndPanTo}>
            {markerPosition && 
            <Marker pos={markerPosition}/>
            }
            <div ref={controlDivRef} className='hidden'>
                <button className="text-base! font-bold! text-center rounded-sm text-black m-[8px]! shadow-sm bg-white cursor-pointer px-5 py-2 border-1 border-amber-800 hover:bg-gray-300 transition-colors duration-150" onClick={panToLocation}>Current Location</button>
            </div>
            <div className="hidden shadow-sm rounded-sm text-lg font-bold p-1.5 bg-white m-[8px]!" ref={autocompleteDivRef}>
            </div>
        </Map>
    )
}