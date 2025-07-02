import DropoffElement from "./dropoff";
import type { Dropoff } from "../../../generated/prisma";
import Pagination from "./pagination";
import { fetchPagesCount } from "@/lib/data";
import Link from "next/link";

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
            <ul className="space-y-2.5!">
                {dropoffs.map((dropoff: Dropoff) =>
                    <DropoffElement key={dropoff.id} dropoff={dropoff} />
                )}
            </ul>
            {totalPages > 1 && (
                <div className="mt-auto">
                    <Link
                        href="/new"
                        className="w-full block mx-auto! mt-4 text-center mb-4 px-4 py-1.5 rounded-md bg-amber-500 text-white font-semibold shadow hover:bg-amber-600 transition"
                    >
                        New Dropoff
                    </Link>
                    <div className="flex justify-center">
                        <Pagination totalPages={totalPages}/>
                    </div>
                </div>
            )}
        </>
    );
}