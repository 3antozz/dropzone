'use client'
import { FormEvent, useState, useRef, KeyboardEvent, InputEvent, ClipboardEvent } from "react";
import { useSession } from "next-auth/react";

export default function TwoFaForm({userId, secret, login = false} : {login?: boolean, userId?: number, secret?: string}) {
    const [otp, setOTP] = useState(Array(6).fill(''));
    const [error, setError] = useState("");
    const { update } = useSession();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [isPending, setPending] = useState(false)
    const handleChange = (e: InputEvent, index: number) => {
        e.preventDefault();
        let value = e.nativeEvent.data;
        if(value && value?.length > 1) {
            value = value?.slice(0, 1);
        }
        if(!value) return;
        const onlyDigits = /^\d+$/;
        if(!onlyDigits.test(value)) return;
        if(index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
        if(index === 5) {
            inputRefs.current[index]?.blur();
        }
        setOTP(prev => {
            const newOTP = [...prev];
            newOTP[index] = value;
            return newOTP;
        })
    }
    const handleKeyDown = (e: KeyboardEvent, index: number) => {
        if(e.key === 'Backspace') {
            setOTP(prev => {
                const newOTP = [...prev];
                newOTP[index] = '';
                return newOTP;
            })
            if(index > 0 && !otp[index]) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    }

    const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
        const onlyDigits = /^\d+$/;
        const value = e.clipboardData.getData("text/plain");
        if(!onlyDigits.test(value)) return;
        const sixFirstDigits = value.slice(0, 6);
        setOTP(prev => {
            const newOTP = [...prev];
            sixFirstDigits.split("").forEach((digit, index) => { newOTP[index] = digit })
            return newOTP
        })
        inputRefs.current.forEach(input => input?.blur())
    }
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        let res;
        setPending(true)
        const token = otp.join('')
        try{
            if(!login) {
                res = await fetch("/api/2fa/verify", {
                    method: "POST",
                    body: JSON.stringify({userId, token, secret }),
                    headers: { "Content-Type": "application/json" },
                });
            } else {
                res = await fetch("/api/2fa/verify", {
                    method: "POST",
                    body: JSON.stringify({ token }),
                    headers: { "Content-Type": "application/json" },
                });
            }
            const data = await res.json();
            if (!data.ok) {
                setError("Invalid token");
            } else {
                if(!login) {
                    await update({refreshSession: true});
                }
                setTimeout(() => window.location.replace("dashboard"), 300)
                // window.location.replace("dashboard")
            }
        } catch {
            setError('Something Went Wrong. Try again later!');
        } finally {
            setPending(false)
        }
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => 
                <input 
                    key={index} 
                    inputMode="numeric"
                    maxLength={1}
                    ref={(element) => {inputRefs.current[index] = element}}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onBeforeInput={(e) => handleChange(e, index)}
                    onPaste={handlePaste}
                    onChange={() => {}}
                    value={digit}
                    className="bg-amber-50 text-black rounded-md aspect-square w-1/6 sm:w-14 text-3xl! text-center border border-amber-200 focus:border-amber-500 focus:ring-amber-200 focus:ring-2 outline-none transition"
                />)}
            </div>
            <button
                type="submit"
                disabled={isPending}
                className="w-full text-lg! px-4 py-2 rounded-md bg-amber-500 text-white font-semibold shadow hover:bg-amber-600 transition cursor-pointer"
            >
                {isPending ? 'Loading' : 'Submit'}
            </button>
            {error && <p className="text-md bg-red-100 text-red-900 py-2 text-center">{error}</p>}
        </form>
    )
}