'use client'
import DropoffMap from "@/components/map/dropoff-map";
import { addDropoff } from "@/lib/actions";
import { FormState } from "@/lib/definitions";
import { useActionState, useState, useEffect } from "react";
import { Suspense } from "react";
import MapSkeleton from "../skeletons/map-skeleton";
import Popup from "../popup";

export default function Form() {
    const initialState: FormState = { message: "", errors: {}, ok: false };
    const [state, formAction, isPending] = useActionState(addDropoff, initialState);
    const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null)
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [popup, setPopup] = useState(false);
    useEffect(() => {
        if(state.ok) {
            setTitle("");
            setDescription("")
        }
    }, [state.ok])
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    id="title"
                    placeholder="Title"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-amber-200 focus:ring-2 outline-none transition placeholder-gray-400 bg-gray-50"
                />
                {state.errors?.title && <p className="text-sm text-red-500 mt-1">{state.errors.title}</p>}
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    name="description"
                    id="description"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-17 px-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-amber-200 focus:ring-2 outline-none transition placeholder-gray-400 bg-gray-50"
                />
                {state.errors?.description && <p className="text-sm text-red-500 mt-1">{state.errors.description}</p>}
            </div>
            <input type="hidden" name="lat" value={markerPosition?.lat ?? ''} />
            <input type="hidden" name="lng" value={markerPosition?.lng ?? ''} />
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pick a location</label>
                <Suspense fallback={<MapSkeleton />} />
                    <DropoffMap panToCurrentLocation={true} markerPosition={markerPosition} 
                    setMarkerPosition={setMarkerPosition} />
                <Suspense/>
            </div>
            <button
                disabled={isPending}
                className="w-full px-4 py-2 rounded-md bg-amber-500 text-white font-semibold shadow hover:bg-amber-600 transition disabled:opacity-60 cursor-pointer"
            >
                {isPending ? 'Loading...' : 'Add Dropoff'}
            </button>
        </form>
        </>
    )
}