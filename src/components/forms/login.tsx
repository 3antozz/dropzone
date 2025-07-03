'use client'
import { authenticate } from "@/lib/actions";
import { useActionState, useState } from "react";
import { LoginFormState } from "@/lib/definitions";
import { useRouter } from "next/navigation";

export default function Form() {
    const router = useRouter()
    const initialState: LoginFormState = { message: "" };
    const [state, formAction, isPending] = useActionState(authenticate, initialState);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    if(state?.redirectTo) {
        router.replace(state.redirectTo)
    }
    return (
        <form action={formAction} className="space-y-6!">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-amber-200 focus:ring-2 outline-none transition placeholder-gray-400 bg-gray-50"
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-amber-200 focus:ring-2 outline-none transition placeholder-gray-400 bg-gray-50"
                />
            </div>
            {state.message && <p className="text-md bg-red-100 text-red-900 py-2 text-center">{state.message}</p>}
            <button
                disabled={isPending}
                type="submit"
                className="w-full px-4 py-2 rounded-md bg-amber-500 text-white font-semibold shadow hover:bg-amber-600 transition disabled:opacity-60 cursor-pointer"
            >
                {isPending ? 'Loading...' : 'Login'}
            </button>
        </form>
    )
}