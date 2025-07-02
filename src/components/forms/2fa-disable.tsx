'use client'
import { disable2FA } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function TwoFaFormDisable() {
    const { update } = useSession();
    const router = useRouter();
    const [error, setError] = useState("")
    const handleForm = async(e: FormEvent) => {
        e.preventDefault();
        try {
            const req = await disable2FA();
            await update({refreshSession: true});
            if(req.error) {
                setError(req.error)
            }
            if(req?.ok) {
                router.push('/settings');
                setError("")
            }
        } catch {
            setError("Unexpected error, please try again later.");
        }
    }
    return (
        <form onSubmit={handleForm} className="space-y-2!">
            <button
                className="px-4 py-2 rounded-md bg-red-100 text-red-700 font-medium hover:bg-red-200 transition cursor-pointer"
            >
                Disable 2FA
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
    )
}