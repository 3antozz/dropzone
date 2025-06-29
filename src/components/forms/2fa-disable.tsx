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
        <form onSubmit={handleForm}>
            <button>Disable 2FA</button>
            {error && <p>An error has occured, please try again later.</p>}
        </form>
    )
}