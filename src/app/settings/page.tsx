import { auth } from "../../auth";
import Link from "next/link";
import TwoFaFormDisable from "@/components/2fa-disable";
import { SessionProvider } from "next-auth/react";
export default async function Settings() {
    const session = await auth();
    const { twoFA } = session?.user;
    return (
        <section>
            { twoFA ?
            <SessionProvider>
            <TwoFaFormDisable/>
            </SessionProvider> :
            <Link href="/2fa-setup">Enable 2FA</Link>
            }
        </section>
    );
}
