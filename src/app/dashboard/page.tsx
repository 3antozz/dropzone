import { Suspense } from "react";
import MapsLoader from "@/components/map/google-maps-loader";
import DashboardMap from "@/components/map/dashboard-map";
import { MapContextProvider } from "@/components/map/context-provider";
import DropoffLoader from "@/components/dashboard/dropoff-loader";
import { fetchDropoffs } from "@/lib/data";
import Search from "@/components/dashboard/search";

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
            <div className="flex justify-center">
                <MapsLoader>
                    <>
                    <DashboardMap dropoffs={dropoffs}/>
                    <section className="w-96">
                        <Search />
                        <Suspense key={query + currentPage} fallback={<h1>LOADING</h1>}>
                            <DropoffLoader dropoffs={dropoffs} query={query}/>
                        </Suspense>
                    </section>
                    </>
                </MapsLoader>
            </div>
        </MapContextProvider>
    );
}
