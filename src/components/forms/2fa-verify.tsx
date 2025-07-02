'use client'
import { FormEvent, useState, useRef, KeyboardEvent, InputEvent, ClipboardEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TwoFaForm({userId, secret, login = false} : {login?: boolean, userId: number, secret?: string}) {
    const [otp, setOTP] = useState(Array(6).fill(''));
    const [error, setError] = useState("");
    const router = useRouter();
    const { update } = useSession();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
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
        const token = otp.join('')
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
                    className="bg-amber-50 text-black rounded-md aspect-square w-20 text-5xl! text-center"
                />)}
            </div>
            <button>Submit</button>
            {error && <p>{error}</p>}
        </form>
    )
}