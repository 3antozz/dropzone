import MapsLoader from "@/components/map/google-maps-loader";
import { fetchOneDropoff } from "@/lib/data";
import Form from "@/components/forms/edit-dropoff";
export default async function EditDropoff({params} : {params: Promise<{[key: string]: string}>}) {
    const { id } = await params;
    console.log(id)
    const dropoff = await fetchOneDropoff(id);
    return (
        <section>
            <MapsLoader>
                <Form dropoff={dropoff} />
            </MapsLoader>
        </section>
    );
}
