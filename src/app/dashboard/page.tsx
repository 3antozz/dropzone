import { signOut, auth } from "../../auth";
import MapsLoader from "@/components/map/google-maps-loader";
import DashboardMap from "@/components/map/dashboard-map";
import { fetchDropoffs } from "@/lib/data";
export default async function Dashboard() {
    const session = await auth();
    const dropoffs = await fetchDropoffs();
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
            <MapsLoader>
                <DashboardMap dropoffs={dropoffs} />
            </MapsLoader>
        </section>
    );
}
