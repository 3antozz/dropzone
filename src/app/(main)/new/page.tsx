import MapsLoader from "@/components/map/google-maps-loader";
import Form from "@/components/forms/create-dropoff";

export default async function AddDropoff() {
    return (
        <main className="w-full max-w-2xl mx-auto! py-10 px-4">
            <h1 className="text-2xl font-bold text-amber-600 mb-6">Add a New Dropoff</h1>
            <MapsLoader>
                <Form />
            </MapsLoader>
        </main>
    );
}

