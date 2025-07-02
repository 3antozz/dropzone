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
        <div>
            <label htmlFor="search"></label>
            <input type="text" 
                ref={inputRef}
                id="search" 
                placeholder="Search for a dropoff" 
                onChange={handleSearch} 
                defaultValue={searchParams.get('query')?.toString()}/>
        </div>
    )
}