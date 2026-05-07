export function HouseCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-10 w-28 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
