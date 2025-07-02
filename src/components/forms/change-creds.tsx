'use client'
import { changeCredentials } from "@/lib/actions";
import { useActionState, useState, useEffect } from "react";
import { FormState } from "@/lib/definitions";
import Popup from "../popup";
export default function Form() {
    const initialState: FormState = { message: "", ok: false };
    const [state, formAction, isPending] = useActionState(changeCredentials, initialState);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [openForm, setFormOpen] = useState(false);
    const [popup, setPopup] = useState(false);
    useEffect(() => {
        if(state.ok) {
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setCurrentPassword("")
            setFormOpen(false)
        }
    }, [state.ok])
    useEffect(() => {
        if (state.message) setPopup(true);
    }, [state]);
    return (
        <div>
            {popup &&
            <Popup open={popup} onClose={() => setPopup(false)} type={state.ok ? "success" : "error"}>
                <p>{state.message}</p>
            </Popup>
            }
            <button
                onClick={() => setFormOpen(prev => !prev)}
                className="px-4 py-2 rounded-md bg-amber-500 text-white font-semibold shadow hover:bg-amber-600 transition mb-4 cursor-pointer"
            >
                {openForm ? 'Cancel' : 'Change Credentials'}
            </button>
            {openForm && (
                <form action={formAction} className="space-y-4!">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">New Email <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            placeholder="New Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-amber-200 focus:ring-2 outline-none transition placeholder-gray-400 bg-gray-50"
                        />
                        {state.errors?.email && <p className="text-sm text-red-500 mt-1">{state.errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password <span className="text-red-500">*</span></label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-amber-200 focus:ring-2 outline-none transition placeholder-gray-400 bg-gray-50"
                        />
                        {state.errors?.password && <p className="text-sm text-red-500 mt-1">{state.errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                        <input
                            type="password"
                            name="confirm"
                            id="confirm_password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-amber-200 focus:ring-2 outline-none transition placeholder-gray-400 bg-gray-50"
                        />
                        {state.errors?.confirm && <p className="text-sm text-red-500 mt-1">{state.errors.confirm}</p>}
                    </div>
                    <div className="mt-10!">
                        <label htmlFor="old-password" className="block text-sm font-medium text-gray-700 mb-1">Current Password <span className="text-red-500">*</span></label>
                        <input
                            type="password"
                            name="oldPassword"
                            id="old-password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-amber-200 focus:ring-2 outline-none transition placeholder-gray-400 bg-gray-50"
                        />
                        {state.errors?.oldPassword && <p className="text-sm text-red-500 mt-1">{state.errors.oldPassword}</p>}
                    </div>
                    <button
                        disabled={isPending}
                        className="w-full px-4 py-2 rounded-md bg-amber-500 text-white font-semibold shadow hover:bg-amber-600 transition disabled:opacity-60 cursor-pointer"
                    >
                        {isPending ? 'Loading...' : 'Submit'}
                    </button>
                </form>
            )}
        </div>
    )
}