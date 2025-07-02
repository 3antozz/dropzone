'use client'
import DropoffMap from "@/components/map/dropoff-map";
import { editDropoff } from "@/lib/actions";
import { FormState } from "@/lib/definitions";
import { useActionState, useState, useEffect } from "react";
import { Dropoff } from "../../../generated/prisma";
import Popup from "../popup";

export default function Form({dropoff} : {dropoff: Dropoff}) {
    const initialState: FormState = { message: "", errors: {}, ok: false };
    const [state, formAction, isPending] = useActionState(editDropoff, initialState);
    const [title, setTitle] = useState(dropoff.title);
    const [description, setDescription] = useState(dropoff.description || "");
    const [popup, setPopup] = useState(false);
    const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>({lat: dropoff?.latitude, lng: dropoff?.longitude})
    useEffect(() => {
        if (state.message) setPopup(true);
    }, [state]);
    return (
        <>
        {popup &&
        <Popup open={popup} onClose={() => setPopup(false)} type={state.ok ? "success" : "error"}>
            <p>{state.message}</p>
        </Popup>
        }
        <form action={formAction} className="space-y-6! bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-amber-200 focus:ring-2 outline-none transition placeholder-gray-400 bg-gray-50"
                />
                {state.errors?.title && <p className="text-xs text-red-500 mt-1">{state.errors.title}</p>}
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    name="description"
                    id="description"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-amber-200 focus:ring-2 outline-none transition placeholder-gray-400 bg-gray-50"
                />
                {state.errors?.description && <p className="text-xs text-red-500 mt-1">{state.errors.description}</p>}
            </div>
            <input type="hidden" name="lat" value={markerPosition?.lat ?? ''} />
            <input type="hidden" name="lng" value={markerPosition?.lng ?? ''} />
            <input type="hidden" name="id" value={dropoff.id} />
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pick a location</label>
                <DropoffMap markerPosition={markerPosition} setMarkerPosition={setMarkerPosition} />
            </div>
            <button
                disabled={isPending}
                className="w-full px-4 py-2 rounded-md bg-amber-500 text-white font-semibold shadow hover:bg-amber-600 transition disabled:opacity-60"
            >
                {isPending ? 'Loading...' : 'Edit Dropoff'}
            </button>
        </form>
        </>
    )
}