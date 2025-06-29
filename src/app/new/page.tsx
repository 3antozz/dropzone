import MapsLoader from "@/components/map/google-maps-loader";
import DropoffMap from "@/components/map/dropoff-map";
export default async function Dashboard() {
    return (
        <section>
            Add Dropoff
            <MapsLoader>
                <DropoffMap />
            </MapsLoader>
        </section>
    );
}

