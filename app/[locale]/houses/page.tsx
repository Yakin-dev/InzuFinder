import { Suspense } from 'react'
import HousesContent from './HousesContent'
import { HouseCardSkeleton } from '@/components/HouseCardSkeleton'

export const dynamic = 'force-dynamic'

export default function HousesPage() {
  return (
    <Suspense fallback={<HouseCardSkeleton count={6} />}>
      <HousesContent />
    </Suspense>
  )
}
