import { auth } from "../../auth";
import TwoFaForm from "@/components/forms/2fa-verify";
import { SessionProvider } from "next-auth/react";
import { signOut } from "../../auth";
export default async function TwoFA() {
    const session = await auth();
    return (
        <section>
            <SessionProvider>
            <TwoFaForm login={true} userId={session?.user.id} secret={session?.user.secret} />
            </SessionProvider>
            <form action={async () => {
                    "use server"
                    await signOut()
                    }}
                    >
                <button type="submit">Sign Out</button>
            </form>
        </section>
    );
}
