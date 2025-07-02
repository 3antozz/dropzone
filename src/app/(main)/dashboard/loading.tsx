import DropoffsSkeleton from "@/components/skeletons/dropoffs-skeleton";
import MapSkeleton from "@/components/skeletons/map-skeleton";

export default function Loading() {
    return (
        <div className="flex flex-col md:flex-row gap-8 justify-center items-start w-full max-w-7xl mx-auto py-8 px-2">
            <div className="flex-1">
                <MapSkeleton />
            </div>
            <section className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="mb-4 h-10 w-24 bg-amber-200 rounded animate-pulse" />
                <div className="mb-6 h-10 w-full bg-gray-100 rounded animate-pulse" />
                <DropoffsSkeleton count={3} />
            </section>
        </div>
    );
}
