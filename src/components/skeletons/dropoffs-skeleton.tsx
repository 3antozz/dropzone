export default function DropoffsSkeleton({ count = 2 }: { count?: number }) {
  return (
    <ul className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-gray-200 shadow-sm bg-gray-100 animate-pulse"
        >
          <div className="flex-1 w-full">
            <div className="h-5 w-1/3 bg-gray-300 rounded mb-2" />
            <div className="h-3 w-1/4 bg-gray-200 rounded mb-1" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-gray-300 rounded-md" />
            <div className="h-8 w-16 bg-gray-200 rounded-md" />
          </div>
        </li>
      ))}
    </ul>
  );
}