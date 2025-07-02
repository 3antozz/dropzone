'use client'
import DropoffMap from "@/components/map/dropoff-map";
import { editDropoff } from "@/lib/actions";
import { State } from "@/lib/zod";
import { useActionState, useState } from "react";
import { Dropoff } from "../../../generated/prisma";

export default function Form({dropoff} : {dropoff: Dropoff}) {
    const initialState: State = { message: "", errors: {} };
    const [state, formAction, isPending] = useActionState(editDropoff, initialState);
    const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>({lat: dropoff?.latitude, lng: dropoff?.longitude})
    return (
        <form action={formAction}>
            <div>
                <label htmlFor="title"></label>
                <input type="text" name="title" id="title" placeholder="Title" defaultValue={dropoff.title} />
                {state.errors?.title && <p>{state.errors.title}</p>}
            </div>
            <div>
                <label htmlFor="description"></label>
                <input type="text" name="description" id="description" placeholder="Description" defaultValue={dropoff.description || ""} />
                {state.errors?.description && <p>{state.errors.description}</p>}
            </div>
            <input type="text" name="lat" hidden value={markerPosition?.lat} />
            <input type="text" name="lng" hidden value={markerPosition?.lng} />
            <input type="text" name="id" hidden value={dropoff.id} />
            <DropoffMap markerPosition={markerPosition} setMarkerPosition={setMarkerPosition} />
            {state.message && <p>{state.message}</p>}
            <button disabled={isPending}>{isPending ? 'Loading' : 'Edit Dropoff'}</button>
        </form>
    )
}