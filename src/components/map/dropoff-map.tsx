'use client'
import { Map, MapMouseEvent, useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import { useEffect, useRef, useCallback, useState} from 'react';
import Marker from './marker';


function DropoffMap({markerPosition, setMarkerPosition, panToCurrentLocation = false} : {markerPosition: google.maps.LatLngLiteral | null, setMarkerPosition: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral | null>>, panToCurrentLocation?: boolean}) {
    const map = useMap();
    const placesLib = useMapsLibrary('places');
    const controlDivRef = useRef<HTMLDivElement>(null);
    const autocompleteDivRef = useRef<HTMLDivElement>(null);
    const [firstLoad, setFirstLoad] = useState(false);
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
                        console.log('Error: The Geolocation service failed.')
                }
        );
        } else {
            console.log("Error: Your browser doesn't support geolocation.")
        }
    }, [map, setMarkerPosition])
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
        if(panToCurrentLocation) {
            panToLocation();
        }
    }, [map, panToCurrentLocation, panToLocation])

    useEffect(() => {
        if(map && markerPosition && !firstLoad) {
            map?.panTo(markerPosition);
            map?.setZoom(15);
            setFirstLoad(true)
        }
    }, [firstLoad, map, markerPosition])

    useEffect(() => {
        if(map && placesLib && autocompleteDivRef.current) {
            //@ts-expect-error library not updated yet
            const placeAutocomplete = new placesLib.PlaceAutocompleteElement();
            autocompleteDivRef.current.appendChild(placeAutocomplete);
            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(autocompleteDivRef.current);
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
    }, [map, placesLib, setMarkerPosition])
    return (
        <Map
            className="w-full h-96 mx-auto rounded-xl shadow border border-gray-200"
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
                <button type='button' className="w-10! p-1 text-[13px]! lg:text-base! font-semibold! text-center rounded-full text-amber-900 m-2 shadow bg-white cursor-pointer border border-amber-800 hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400" onClick={panToLocation}><svg className='w-full' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Current Location</title><path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z" /></svg></button>
            </div>
            <div className="hidden shadow rounded-md text-lg font-semibold p-0.5 bg-white m-2" ref={autocompleteDivRef}>
            </div>
        </Map>
    )
}

export default DropoffMap;