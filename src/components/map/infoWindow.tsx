'use client'

export default function InfoWindowContent({ title, description, createdAt } : { title: string, description: string, createdAt: string}) {
    return (
        <div className="min-w-[12rem] max-w-xs bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 space-y-2">
            <h2 className="font-bold text-amber-700 text-xl! truncate">{title}</h2>
            <p className="text-gray-700 text-sm! break-words">{description.slice(0, 30)}...</p>
            <p className="text-[11px]! text-gray-700">{createdAt}</p>
        </div>
    )
}