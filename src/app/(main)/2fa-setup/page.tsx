import { auth } from "../../../auth";
import { generateSecret, generateQRCode } from "@/lib/2fa";
import Image from "next/image";
import TwoFaForm from "@/components/forms/2fa-verify";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";

export default async function TwoFA() {
    const session = await auth();
    const { secret, otpauth } = generateSecret(session?.user?.email);
    const qrCode = await generateQRCode(otpauth);
    return (
        <main className="min-h-[60vh] flex items-center justify-center py-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <h1 className="text-2xl font-bold text-amber-600 mb-6 text-center">Set Up Two-Factor Authentication</h1>
                <div className="flex flex-col items-center gap-4 mb-6">
                    <Image src={qrCode} alt="Scan QR Code for 2FA setup" width={200} height={200} className="rounded-md border border-gray-200" />
                    <p className="text-center text-gray-700">
                        Scan the QR code with your authenticator app or manually type the following code:
                        <br />
                        <span className="inline-block mt-2 px-3 py-1 rounded bg-amber-50 text-amber-800 font-mono tracking-widest text-lg border border-amber-200">{secret}</span>
                    </p>
                </div>
                <SessionProvider>
                    <TwoFaForm userId={session?.user.id} secret={secret} />
                </SessionProvider>
                <Link
                    href={'/dashboard'}
                    className="block mt-6 text-center text-[15px] text-gray-500 hover:text-amber-600 transition"
                >
                    Skip
                </Link>
            </div>
        </main>
    );
}
