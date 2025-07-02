'use client'
import { ReactNode } from "react";
import { createPortal } from "react-dom";

export default function Popup({
    open,
    onClose,
    type = "info",
    children,
}: {
    open: boolean;
    onClose: () => void;
    type?: "info" | "success" | "error";
    children: ReactNode;
}) {
    let color = "bg-amber-100 text-amber-900 border-amber-300";
    if (type === "success") color = "bg-green-100 text-green-900 border-green-300";
    if (type === "error") color = "bg-red-100 text-red-900 border-red-300";

    return createPortal(
        <div
            className={`
                fixed top-6 left-1/2 -translate-x-1/2 z-50
                transition-all duration-300
                ${open
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-8 pointer-events-none"
                }
            `}
        >
            <div className={`relative max-w-sm w-full p-4 rounded-xl border shadow-lg ${color} flex items-center`}>
                <div className="flex-1">{children}</div>
                <button
                    onClick={onClose}
                    className="ml-4 text-2xl! text-gray-400 hover:text-gray-700 transition cursor-pointer"
                    aria-label="Close"
                >
                    &times;
                </button>
            </div>
        </div>, document.body
    );
}