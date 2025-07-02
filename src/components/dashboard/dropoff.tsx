'use client'
import { Dropoff } from "../../../generated/prisma";
import Link from "next/link";
import { MapContext } from "../map/context";
import { useContext, useCallback, useState, useRef, useEffect } from "react";
import DeleteForm from "../forms/delete-dropoff";
import clsx from "clsx";
import Popup from "../popup";

export default function DropoffElement({dropoff} : {dropoff: Dropoff}) {
    const context = useContext(MapContext);
    const [popup, setPopup] = useState<{ message: string, ok: boolean } | null>(null);
    const {clickedMarker, setClickedMarker} = context;
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const handleDropoffClick = useCallback(() => {
            setClickedMarker(null);
            setTimeout(() => setClickedMarker(dropoff.id), 0)
        },
        [dropoff, setClickedMarker]
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <>
            {popup?.message &&
            <Popup open={!!popup.message} onClose={() => setPopup({ message: "", ok: false })} type={popup.ok ? "success" : "error"}>
                <p>{popup.message}</p>
            </Popup>
            }
        <li
            className={clsx(
                "flex items-center gap-4 rounded-lg border border-gray-200 shadow-sm transition bg-white hover:bg-gray-50",
                clickedMarker === dropoff.id && 'bg-amber-200! border-amber-400!'
            )}
        >
            <button
                onClick={handleDropoffClick}
                className="flex-1 text-left cursor-pointer px-4 py-2"
            >
                <h2 className="text-lg font-semibold text-amber-900">{dropoff.title}</h2>
                <p className="text-xs text-gray-500">{dropoff.createdAt.toDateString()}</p>
                {clickedMarker === dropoff.id && 
                <p className="mt-1 text-gray-700">{dropoff.description}</p>
                }
            </button>
            <div className="relative px-2" ref={dropdownRef}>
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="p-2 cursor-pointer rounded-full hover:bg-gray-100 transition"
                    aria-label="Open actions"
                >
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <circle cx="12" cy="5" r="1.5"/>
                        <circle cx="12" cy="12" r="1.5"/>
                        <circle cx="12" cy="19" r="1.5"/>
                    </svg>
                </button>
                {open && (
                    <div className="absolute right-0 z-10 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-2 flex flex-col">
                        <Link
                            href={`/edit/${dropoff.id}`}
                            className="text-base! px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-900 transition text-left"
                            onClick={() => setOpen(false)}
                        >
                            Edit
                        </Link>
                        <div>
                            <DeleteForm showPopup={setPopup} dropoff={dropoff} />
                        </div>
                    </div>
                )}
            </div>
        </li>
        </>
    )
}