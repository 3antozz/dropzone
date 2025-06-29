import { auth } from "../../auth";
import { generateSecret, generateQRCode } from "@/lib/2fa";
import Image from "next/image";
import TwoFaForm from "@/components/forms/2fa-form";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
export default async function TwoFA() {
    const session = await auth();
    const { secret, otpauth } = generateSecret(session?.user?.email);
    const qrCode = await generateQRCode(otpauth);
    return (
        <section>
            <Image src={qrCode} alt="Scan QR Code for 2FA setup" width={200} height={200} />
            <p>Scan the QR code with your authenticator app or manually type the following code: <strong>{secret}</strong></p>
            <SessionProvider>
            <TwoFaForm userId={session?.user.id} secret={secret} />
            </SessionProvider>
            <Link href={'/dashboard'}>Skip</Link>
        </section>
    );
}
