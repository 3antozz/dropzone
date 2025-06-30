import MapsLoader from "@/components/map/google-maps-loader";
import { fetchDropoffs } from "@/lib/data";
import Wrapper from "@/components/dashboard/wrapper";
export default async function Dashboard() {
    const dropoffs = await fetchDropoffs();
    return (
        <>
        Dashboard
            <MapsLoader>
                <Wrapper dropoffs={dropoffs} />
            </MapsLoader>
        </>
    );
}
