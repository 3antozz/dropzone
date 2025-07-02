import { auth } from "../../../auth";
import TwoFaForm from "@/components/forms/2fa-verify";
import { SessionProvider } from "next-auth/react";
import { signOut } from "../../../auth";

export default async function TwoFA() {
    const session = await auth();
    return (
        <main className="min-h-[60vh] flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <h1 className="text-2xl font-bold text-amber-600 mb-6 text-center">Two-Factor Authentication</h1>
                <p className="text-center text-gray-700 mb-6">
                    Enter the 6-digits Code found in your Authenticator App:
                </p>
                <SessionProvider>
                    <TwoFaForm login={true} userId={session?.user.id} secret={session?.user.secret} />
                </SessionProvider>
                <form
                    action={async () => {
                        "use server"
                        await signOut()
                    }}
                    className="mt-6 flex justify-center"
                >
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-amber-100 transition cursor-pointer"
                    >
                        Sign Out
                    </button>
                </form>
            </div>
        </main>
    );
}
