'use client'
import { authenticate } from "@/lib/actions";
import { useActionState, useState } from "react";
import { State } from "@/lib/zod";
import { redirect } from "next/navigation";
export default function Form() {
    const initialState: State = { message: "" };
    const [state, formAction, isPending] = useActionState(authenticate, initialState);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    if(state?.redirectTo) {
        redirect(state.redirectTo)
    }
    return (
        <form action={formAction}>
            <div>
                <label htmlFor="email"></label>
                <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password"></label>
                <input type="password" name="password" placeholder="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {state.message && <p>{state.message}</p>}
            <button>{isPending ? 'Loading' : 'Login'}</button>
        </form>
    )
}