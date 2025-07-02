import { auth } from "../../auth";
import Link from "next/link";
import TwoFaFormDisable from "@/components/forms/2fa-disable";
import Form from "@/components/forms/change-creds";
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
            <Form />
        </section>
    );
}
