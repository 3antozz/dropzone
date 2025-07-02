'use client'
import {AdvancedMarker, Map, Pin, useMap, useMapsLibrary, InfoWindow } from '@vis.gl/react-google-maps';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import type {Marker} from '@googlemaps/markerclusterer';
import { useContext, useRef, useEffect, useCallback, useMemo } from 'react';
import { Dropoff } from '../../../generated/prisma';
import InfoWindowContent from './infoWindow';
import { MapContext } from './context';
function DashboardMap({dropoffs} : {dropoffs: Dropoff[]}) {
    const { setClickedMarker } = useContext(MapContext)
    const map = useMap();
    const placesLib = useMapsLibrary('places');
    const controlDivRef = useRef<HTMLDivElement>(null);
    const autocompleteDivRef = useRef<HTMLDivElement>(null);
    const panToLocation = useCallback((e?: React.MouseEvent<HTMLButtonElement> | null, zoom = 13) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    map?.setCenter(pos);
                    map?.setZoom(zoom);
                    },
                    () => {
                        console.log('Error: The Geolocation service failed.')
                }
        );
        } else {
            console.log("Error: Your browser doesn't support geolocation.")
        }
    }, [map])
    useEffect(() => {
        if (map && controlDivRef.current) {
            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDivRef.current);
            controlDivRef.current.classList.add("block!"); 
        }
        panToLocation(null, 9);
    }, [map, panToLocation])

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
            });
        }
    }, [map, placesLib])
    return (
        <>
        <Map
            className="w-full max-w-3xl h-[36rem] rounded-xl shadow-lg border p-2 border-gray-200"
            mapId={process.env.NEXT_PUBLIC_MAP_ID}
            defaultZoom={2}
            defaultCenter={ { lat: 27.43752386602214, lng: 10.79002834887643 } }
            disableDefaultUI={true}
            mapTypeControl={true}
            onClick={() => setClickedMarker(null)}
            >

            <PoiMarkers pois={dropoffs} />
            <div ref={controlDivRef} className='hidden'>
                <button type='button' className="w-10! p-1 text-[13px]! lg:text-base! font-semibold! text-center rounded-full text-amber-900 m-2 shadow bg-white cursor-pointer border border-amber-800 hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400" onClick={panToLocation}><svg className='w-full' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Current Location</title><path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z" /></svg></button>
            </div>
            <div className="hidden shadow rounded-md text-lg font-semibold lg:p-1 bg-white m-2" ref={autocompleteDivRef}>
            </div>
        </Map>
        </>
    )
}

function PoiMarkers(props: {pois: Dropoff[]}) {
    const context = useContext(MapContext);
    const {markers, setMarkers, clickedMarker, setClickedMarker} = context;
    const map = useMap();
    const selectedDropoff = useMemo(() => props.pois.find(drop => drop.id == clickedMarker), [clickedMarker, props.pois])
    const clusterer = useRef<MarkerClusterer | null>(null);
    const handleMarkerClick = useCallback(
        (key: number, index?: number) => {
            console.log(index)
            setClickedMarker(null);
            setTimeout(() => setClickedMarker(key), 0)
            // map?.panTo({lat: props.pois[index].latitude, lng: props.pois[index].longitude});
            // map?.setZoom(17)
        },
        [setClickedMarker]
    );
    const handleClose = useCallback(() => setClickedMarker(null), [setClickedMarker]);
    const setMarkerRef = useCallback((marker: Marker | null, key: number) => {
        if(!marker || markers[key]) return;
        setMarkers(markers => {
            if ((marker && markers[key]) || (!marker && !markers[key]))
                return markers;
            if (marker) {
                return {...markers, [key]: marker};
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const {[key]: _, ...newMarkers} = markers;

                return newMarkers;
            }
        });
    }, [markers, setMarkers]);
    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({
                map,
                algorithmOptions: {
                    maxZoom: 12
                }
            });
        }
    }, [map, props]);
    useEffect(() => {
        if(markers) {
            clusterer.current?.clearMarkers();
            clusterer.current?.addMarkers(Object.values(markers));
        }
    }, [markers, props.pois]);

    useEffect(() => {
        // Remove markers that are no longer in the current pois
        const currentIds = new Set(props.pois.map(p => p.id));
        const markersToRemove = Object.keys(markers)
            .map(Number)
            .filter(id => !currentIds.has(id));
        if (markersToRemove.length > 0) {
            setMarkers(existing => {
                const updated = { ...existing };
                markersToRemove.forEach(id => {
                    // Remove marker from clusterer if present
                    if (updated[id]) {
                        clusterer.current?.removeMarker(updated[id]);
                    }
                    delete updated[id];
                });
                return updated;
            });
        }
    }, [props.pois, markers, setMarkers]);
  return (
    <>
        {props.pois.map( (poi: Dropoff, index) => (
            <AdvancedMarker
            className='has-hover:hover:scale-120 transition-transform duration-300'
            key={poi.id}
            position={{lat: poi.latitude, lng: poi.longitude}}
            ref={(marker: google.maps.marker.AdvancedMarkerElement) => setMarkerRef(marker, poi.id)}
            onClick={() => handleMarkerClick(poi.id, index)}
            >
                <Pin scale={clickedMarker === poi.id ? 1.5 : 1.2} background={clickedMarker === poi.id ? 'cyan' : 'red'} glyphColor={'#000'} borderColor={'#000'}>
                    <svg className='w-30' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Dropoff package</title><path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L10.11,5.22L16,8.61L17.96,7.5L12,4.15M6.04,7.5L12,10.85L13.96,9.75L8.08,6.35L6.04,7.5M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z" /></svg>
                </Pin>
            </AdvancedMarker>
        ))}
        {clickedMarker && markers[clickedMarker] && selectedDropoff && (
            <InfoWindow anchor={markers[clickedMarker]} onClose={handleClose} className="text-black">
                <InfoWindowContent title={selectedDropoff.title} description={selectedDropoff.description || ""} createdAt={new Date(selectedDropoff.createdAt).toDateString()} />
            </InfoWindow>
        )}
    </>
  );
};

export default DashboardMap;