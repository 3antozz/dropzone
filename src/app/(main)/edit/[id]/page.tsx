import MapsLoader from "@/components/map/google-maps-loader";
import { fetchOneDropoff } from "@/lib/data";
import Form from "@/components/forms/edit-dropoff";
import { notFound } from "next/navigation";

export default async function EditDropoff({params} : {params: Promise<{[key: string]: string}>}) {
    const { id } = await params;
    const dropoff = await fetchOneDropoff(id);
    if(!dropoff) {
        return notFound();
    }
    return (
        <main className="w-full max-w-2xl mx-auto! py-10 px-4">
            <h1 className="text-2xl font-bold text-amber-600 mb-6">Edit Dropoff</h1>
            <MapsLoader>
                <Form dropoff={dropoff} />
            </MapsLoader>
        </main>
    );
}
