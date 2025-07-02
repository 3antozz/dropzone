'use client'
import { Dropoff } from "../../../generated/prisma";
import Link from "next/link";
// import { useMap } from "@vis.gl/react-google-maps";
import { MapContext } from "../map/context";
import { useContext, useCallback } from "react";
import DeleteForm from "../forms/delete-dropoff";
import clsx from "clsx";

export default function DropoffElement({dropoff} : {dropoff: Dropoff}) {
    // const map = useMap();
    const context = useContext(MapContext);
    const {clickedMarker, setClickedMarker} = context;
    const handleDropoffClick = useCallback(() => {
            setClickedMarker(null);
            setTimeout(() => setClickedMarker(dropoff.id), 0)
            // map?.panTo({lat: dropoff.latitude, lng: dropoff.longitude});
            // map?.setZoom(17)
        },
        [dropoff, setClickedMarker]
    );
    return (
        <li className={clsx("flex items-center gap-4", clickedMarker === dropoff.id && 'bg-[#1b1b1b]')}>
            <button onClick={handleDropoffClick} className="cursor-pointer">
                <h2>{dropoff.title}</h2>
                <p>{dropoff.createdAt.toDateString()}</p>
                <p>{dropoff.description}</p>    
            </button>
            <Link href={`/edit/${dropoff.id}`}>Edit</Link>
            <DeleteForm dropoff={dropoff} />
        </li>
    )
}