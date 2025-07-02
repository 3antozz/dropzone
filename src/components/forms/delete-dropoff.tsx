'use client'
import { deleteDropoff } from "@/lib/actions";
import { useActionState } from "react";
import { Dropoff } from "../../../generated/prisma";
type DeleteDropoffState = { message: string; error?: string };

export default function DeleteForm({dropoff} : {dropoff: Dropoff}) {
    const initialState: DeleteDropoffState = { message: "" };
    const [state, formAction, isPending] = useActionState(deleteDropoff, initialState);
    return (
            <form action={formAction}>
                <input type="text" hidden name="id" defaultValue={dropoff.id} />
                <button disabled={isPending}>{isPending ? 'Loading' : state.error ? state.error : 'Delete'}</button>
            </form>
    )
}