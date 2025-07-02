import DropoffElement from "./dropoff";
import type { Dropoff } from "../../../generated/prisma";
import Pagination from "./pagination";
import { fetchPagesCount } from "@/lib/data";

export default async function DropoffLoader({
  dropoffs,
  query
}: {
  dropoffs: Dropoff[],
  query: string
}) {
    const totalPages = await fetchPagesCount(query)
    return (
        <>
            <ul className="space-y-5!">
                {dropoffs.map((dropoff: Dropoff) => 
                    <DropoffElement key={dropoff.id} dropoff={dropoff} />
                )}
            </ul>
            {totalPages > 1 && <Pagination totalPages={totalPages}/>}
        </>
    );
}