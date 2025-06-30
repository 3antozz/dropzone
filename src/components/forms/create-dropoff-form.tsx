'use client'
import DropoffMap from "@/components/map/dropoff-map";
import { addDropoff } from "@/lib/actions";
import { State } from "@/lib/zod";
import { useActionState, useState } from "react";

export default function Form() {
    const initialState: State = { message: "", errors: {} };
    const [state, formAction, isPending] = useActionState(addDropoff, initialState);
    const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null)
    return (
        <form action={formAction}>
            <div>
                <label htmlFor="title"></label>
                <input type="text" name="title" id="title" placeholder="Title" />
                {state.errors?.title && <p>{state.errors.title}</p>}
            </div>
            <div>
                <label htmlFor="description"></label>
                <input type="text" name="description" id="description" placeholder="Description" />
                {state.errors?.description && <p>{state.errors.description}</p>}
            </div>
            <input type="text" name="lat" value={markerPosition?.lat} />
            <input type="text" name="lng" value={markerPosition?.lng} />
            <DropoffMap markerPosition={markerPosition} setMarkerPosition={setMarkerPosition} />
            {state.message && <p>{state.message}</p>}
            <button>{isPending ? 'Loading' : 'Add Dropoff'}</button>
        </form>
    )
}