'use client'
import { deleteDropoff } from "@/lib/actions";
import { useActionState, useEffect, Dispatch, SetStateAction } from "react";
import { Dropoff } from "../../../generated/prisma";
import { DeleteDropoffFormState } from "@/lib/definitions";
import { useRouter } from "next/navigation";

export default function DeleteForm({dropoff, showPopup} : {dropoff: Dropoff, showPopup: Dispatch<SetStateAction<{ message: string, ok: boolean } | null>>}) {
    const router = useRouter();
    const initialState: DeleteDropoffFormState = { message: "", ok: false };
    const [state, formAction, isPending] = useActionState(deleteDropoff, initialState);
    useEffect(() => {
        if (state.message) showPopup({message: state.message, ok: state.ok});
    }, [showPopup, state]);
    useEffect(() => {
        if (state.ok) {
            setTimeout(() => router.refresh(), 2500)
        }
    }, [router, state]);
    return (
        <>
        <form action={formAction} className="w-full hover:bg-amber-50 hover:text-amber-900 transition">
            <input type="text" hidden name="id" defaultValue={dropoff.id} />
            <button
                disabled={isPending}
                className="w-full px-4 py-2 text-sm text-gray-700 text-left cursor-pointer"
            >
                {isPending
                    ? 'Loading'
                    : 'Delete'}
            </button>
        </form>
        </>
    )
}