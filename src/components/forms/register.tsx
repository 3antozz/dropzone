'use client'
import { createUser } from "@/lib/actions";
import { useActionState } from "react";
import { State } from "@/lib/zod";
export default function Form() {
    const initialState: State = { message: "", errors: {} };
    const [state, formAction, isPending] = useActionState(createUser, initialState);
    return (
        <form action={formAction}>
            <div>
                <label htmlFor="email"></label>
                <input type="email" name="email" placeholder="Email" />
                {state.errors?.email && <p>{state.errors.email}</p>}
            </div>
            <div>
                <label htmlFor="password"></label>
                <input type="password" name="password" placeholder="password" id="password" />
                {state.errors?.password && <p>{state.errors.password}</p>}
            </div>
            <div>
                <label htmlFor="confirm_password"></label>
                <input type="password" name="confirm" placeholder="confirm password" id="confirm_password" />
                {state.errors?.confirm && <p>{state.errors.confirm}</p>}
            </div>
            {state.message && <p>{state.message}</p>}
            <button disabled={isPending}>{isPending ? 'Loading' : 'Create Account'}</button>
        </form>
    )
}