'use client'
import {APIProvider} from '@vis.gl/react-google-maps';
import { ReactElement } from 'react';

export default function MapsLoader({children} : {children : ReactElement}) {
    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} onLoad={() => console.log('Maps API has loaded.')}>
            {children}
        </APIProvider>
    )
}