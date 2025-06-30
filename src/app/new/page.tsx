import MapsLoader from "@/components/map/google-maps-loader";
import Form from "@/components/forms/create-dropoff-form";
export default async function AddDropoff() {
    return (
        <section>
            <MapsLoader>
                <Form />
            </MapsLoader>
        </section>
    );
}

