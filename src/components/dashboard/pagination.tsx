"use client"
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";

export default function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };
    return (
        <div className="flex flex-wrap gap-2">
            {pages.map(page =>
                <Link
                    key={page}
                    href={createPageURL(page)}
                    className={clsx(
                        "px-3 py-1 rounded-md font-medium transition",
                        page === currentPage
                            ? "bg-amber-500 text-white shadow"
                            : "bg-gray-100 text-gray-700 hover:bg-amber-100"
                    )}
                >
                    {page}
                </Link>
            )}
        </div>
    );
}