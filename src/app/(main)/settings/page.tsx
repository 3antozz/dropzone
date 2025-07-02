import { auth } from "../../../auth";
import Link from "next/link";
import TwoFaFormDisable from "@/components/forms/2fa-disable";
import Form from "@/components/forms/change-creds";
import { SessionProvider } from "next-auth/react";

export default async function Settings() {
    const session = await auth();
    const { twoFA } = session?.user;
    return (
        <main className="w-full max-w-xl mx-auto! py-10 px-4 space-y-8!">
            <h1 className="text-2xl font-bold text-amber-600 mb-4">Settings</h1>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 space-y-6">
                <p><strong>Current Email</strong>: {session?.user.email}</p>
                { twoFA ?
                    <SessionProvider>
                        <TwoFaFormDisable/>
                    </SessionProvider>
                    :
                    <Link
                        href="/2fa-setup"
                        className="inline-block px-4 py-2 rounded-md bg-amber-500 text-white font-semibold shadow hover:bg-amber-600 transition cursor-pointer"
                    >
                        Enable 2FA
                    </Link>
                }
                <Form />
            </div>
        </main>
    );
}
