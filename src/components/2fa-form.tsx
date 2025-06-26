'use client'
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TwoFaForm({userId, secret, login = false} : {login?: boolean, userId: number, secret?: string}) {
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const router = useRouter()
    const { update } = useSession()
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        let res;
        if(!login) {
            res = await fetch("/api/2fa/verify", {
                method: "POST",
                body: JSON.stringify({userId, token, secret }),
                headers: { "Content-Type": "application/json" },
            });
        } else {
            res = await fetch("/api/2fa/verify", {
                method: "POST",
                body: JSON.stringify({ userId, token }),
                headers: { "Content-Type": "application/json" },
            });
        }
        const data = await res.json();
        if (!data.ok) {
            setError("Invalid token");
        } else {
            await update({refreshSession: true});
            router.push("/dashboard");
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input className="tracking-[0.5em] text-black text-center bg-white border border-gray-300 rounded-md p-2 w-full text-lg" type="tel" maxLength={6} value={token} onChange={(e) => setToken(e.target.value)} />
            <button>Submit</button>
            {error && <p>{error}</p>}
        </form>
    )
}