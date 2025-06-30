'use client'
import {AdvancedMarker, Map, Pin, useMap, useMapsLibrary, InfoWindow } from '@vis.gl/react-google-maps';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import type {Marker} from '@googlemaps/markerclusterer';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Dropoff } from '../../../generated/prisma';
import InfoWindowContent from './infoWindow';

export default function DashboardMap({dropoffs} : {dropoffs: Dropoff[]}) {
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
                        console.log('ERRORRR')
                }
        );
        } else {
            // Browser doesn't support Geolocation
            console.log('ERRORRR')
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
            });
        }
    }, [map, placesLib])
    return (
        <>
        <Map
            className="w-[80%] h-140 mx-auto!"
            mapId={process.env.NEXT_PUBLIC_MAP_ID}
            defaultZoom={2}
            defaultCenter={ { lat: 27.43752386602214, lng: 10.79002834887643 } }
            disableDefaultUI={true}
            mapTypeControl={true}>

            <PoiMarkers pois={dropoffs} />
            <div ref={controlDivRef} className='hidden'>
                <button className="text-base! font-bold! text-center rounded-sm text-black m-[8px]! shadow-sm bg-white cursor-pointer px-5 py-2 hover:bg-gray-300 transition-colors duration-150" onClick={panToLocation}>Current Location</button>
            </div>
            <div className="hidden shadow-sm rounded-sm text-lg font-bold p-1.5 bg-white m-[8px]!" ref={autocompleteDivRef}>
            </div>
        </Map>
        </>
    )
}

const PoiMarkers = (props: {pois: Dropoff[]}) => {
    const map = useMap();
    const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
    const [clickedMarker, setClickedMarker] = useState<Marker | null>(null)
    const clusterer = useRef<MarkerClusterer | null>(null);
    const [infoWindowShown, setInfoWindowShown] = useState(false);
    const handleMarkerClick = useCallback(
        (key: string, index: number) => {
            setInfoWindowShown(isShown => !isShown);
            setClickedMarker(markers[key])
            map?.panTo({lat: props.pois[index].latitude, lng: props.pois[index].longitude});
            map?.setZoom(17)
        },
        [map, markers, props]
    );
    const handleClose = useCallback(() => setInfoWindowShown(false), []);
    const setMarkerRef = (marker: Marker | null, key: string) => {
        if (marker && markers[key]) return;
        if (!marker && !markers[key]) return;

        setMarkers(prev => {
            if (marker) {
                return {...prev, [key]: marker};
            } else {
                const newMarkers = {...prev};
                delete newMarkers[key];
                return newMarkers;
            }
        });
    };
    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({map});
        }
    }, [map]);
    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);
  return (
    <>
        {props.pois.map( (poi: Dropoff, index) => (
            <AdvancedMarker
            className='has-hover:hover:scale-120 transition-transform duration-300'
            key={poi.title}
            position={{lat: poi.latitude, lng: poi.longitude}}
            ref={marker => setMarkerRef(marker, poi.title)}
            onClick={() => handleMarkerClick(poi.title, index)}
            >
                <Pin scale={1.2} background={'red'} glyphColor={'#000'} borderColor={'#000'}>
                    <svg className='w-30' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Dropoff package</title><path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L10.11,5.22L16,8.61L17.96,7.5L12,4.15M6.04,7.5L12,10.85L13.96,9.75L8.08,6.35L6.04,7.5M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z" /></svg>
                </Pin>
            </AdvancedMarker>
        ))}
        {infoWindowShown && (
            <InfoWindow anchor={clickedMarker} onClose={handleClose} className="text-black">
                <InfoWindowContent title='title' description='descrption' createdAt={new Date().toDateString()} />
            </InfoWindow>
        )}
    </>
  );
};