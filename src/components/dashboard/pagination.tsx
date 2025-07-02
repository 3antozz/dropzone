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
        <div>
            {pages.map(page =>
                <Link key={page} href={createPageURL(page)} className={clsx(page === currentPage && "text-red-600")}>{page}</Link>
            )}
        </div>
    );
}