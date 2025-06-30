'use client'


export default function InfoWindowContent({ title, description, createdAt } : { title: string, description: string, createdAt: string}) {
    return (
        <div className="min-w-[10rem] space-y-2!">
            <h2 className="font-bold text-lg">{title}</h2>
            <p className="text-md text-base">{description}</p>
            <p className="text-[12px]">{createdAt}</p>
        </div>
    )
}