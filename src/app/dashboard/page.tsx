import { signOut, auth } from "../../auth";
export default async function Dashboard() {
    const session = await auth();
    return (
        <section>
            Dashboard
            <p>{session?.user.email}</p>
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
