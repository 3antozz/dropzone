import { Suspense } from "react";
import MapsLoader from "@/components/map/google-maps-loader";
import DashboardMap from "@/components/map/dashboard-map";
import { MapContextProvider } from "@/components/map/context-provider";
import DropoffLoader from "@/components/dashboard/dropoff-loader";
import { fetchDropoffs } from "@/lib/data";
import Search from "@/components/dashboard/search";
import DropoffsSkeleton from "@/components/skeletons/dropoffs-skeleton";
import MapSkeleton from "@/components/skeletons/map-skeleton";

export default async function Dashboard(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const dropoffs = await fetchDropoffs(query, currentPage);
    return (
        <MapContextProvider>
            <main className="flex flex-col md:flex-row gap-5 justify-center items-start w-full max-w-7xl mx-auto! py-8 px-2">
                <MapsLoader>
                    <>
                        <Suspense fallback={<MapSkeleton />}>
                            <DashboardMap dropoffs={dropoffs}/>
                        </Suspense>
                        <div className="w-full sm:w-fit">
                            <section className="w-full sm:w-sm bg-white rounded-xl shadow-lg p-6 border border-gray-200 mx-auto! min-h-[36rem] flex flex-col">
                                <Search />
                                <Suspense key={query + currentPage} fallback={<DropoffsSkeleton count={dropoffs?.length} />}>
                                    <DropoffLoader dropoffs={dropoffs} query={query}/>
                                </Suspense>
                            </section>
                        </div>
                    </>
                </MapsLoader>
            </main>
        </MapContextProvider>
    );
}
