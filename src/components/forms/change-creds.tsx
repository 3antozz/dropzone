'use client'
import { changeCredentials } from "@/lib/actions";
import { useActionState, useState } from "react";
import { State } from "@/lib/zod";
import { redirect } from "next/navigation";
export default function Form() {
    const initialState: State = { message: "" };
    const [state, formAction, isPending] = useActionState(changeCredentials, initialState);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [openForm, setFormOpen] = useState(false)
    if(state?.redirectTo) {
        redirect(state.redirectTo)
    }
    return (
        <>
        <button onClick={() => setFormOpen(prev => !prev)}>Change Credentials</button>
        {openForm && <form action={formAction}>
            <div>
                <label htmlFor="email"></label>
                <input type="text" name="email" placeholder="New Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {state.errors?.email && <p>{state.errors.email}</p>}
            </div>
            <div>
                <label htmlFor="password"></label>
                <input type="password" name="password" placeholder="New Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {state.errors?.password && <p>{state.errors.password}</p>}
            </div>
            <div>
                <label htmlFor="confirm_password"></label>
                <input type="password" name="confirm" placeholder="confirm password" id="confirm_password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                {state.errors?.confirm && <p>{state.errors.confirm}</p>}
            </div>
            <div>
                <label htmlFor="old-password"></label>
                <input type="password" name="oldPassword" placeholder="Current Password" id="old-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                {state.errors?.oldPassword && <p>{state.errors.oldPassword}</p>}
            </div>
            {state.message && <p>{state.message}</p>}
            <button disabled={isPending}>{isPending ? 'Loading' : 'Submit'}</button>
        </form>}
        </>
    )
}