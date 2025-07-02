"use client"
import { ChangeEvent, useRef, useEffect } from "react"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from "use-debounce";

export default function Search() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const inputRef = useRef<HTMLInputElement>(null)
    const handleSearch = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        const term = e.target.value;
        params.set('page', '1');
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300)
    useEffect(() => {
        if(inputRef.current) {
            inputRef.current.focus()
        }
    }, [])
    return (
        <div className="mb-4 relative">
            <svg className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 fill-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>magnify</title><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" /></svg>
            <label htmlFor="search" className="sr-only">Search for a dropoff</label>
            <input
                type="text"
                ref={inputRef}
                id="search"
                placeholder="Search for a dropoff"
                onChange={handleSearch}
                defaultValue={searchParams.get('query')?.toString()}
                className="w-full px-4 pl-9 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-amber-200 focus:ring-2 outline-none transition placeholder-gray-400 bg-gray-50"
            />
        </div>
    )
}