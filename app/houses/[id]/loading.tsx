import { HouseCardSkeleton } from '@/components/HouseCardSkeleton'

export default function HouseDetailLoading() {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="container-app py-8">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-video bg-gray-200 rounded-2xl animate-pulse mb-6" />
            <HouseCardSkeleton count={3} />
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
