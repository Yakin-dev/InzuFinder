'use client'

import { House, Users, MapPin, ShieldCheck } from '@phosphor-icons/react'
import { useCountUp } from '@/hooks/useCountUp'

interface HomeClientProps {
  stats: {
    houses: number
    users: number
  }
}

export default function HomeClient({ stats }: HomeClientProps) {
  void stats
  const listings = useCountUp(150)
  const tenants = useCountUp(500)
  const districts = useCountUp(3)
  const verified = useCountUp(100)
  const cards = [
    { label: 'Active Listings', suffix: '+', icon: <House size={28} weight="duotone" className="text-[#0d4f2e]" />, hook: listings },
    { label: 'Happy Tenants', suffix: '+', icon: <Users size={28} weight="duotone" className="text-[#0d4f2e]" />, hook: tenants },
    { label: 'Districts Covered', suffix: '', icon: <MapPin size={28} weight="duotone" className="text-[#0d4f2e]" />, hook: districts },
    { label: 'Verified', suffix: '%', icon: <ShieldCheck size={28} weight="duotone" className="text-[#0d4f2e]" />, hook: verified },
  ]

  return (
    <section className="bg-[#fafaf9] border-b border-gray-100">
      <div className="container-app py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((stat) => (
            <div key={stat.label} ref={stat.hook.ref} className="rounded-2xl p-5 text-center bg-gradient-to-br from-[#f0fdf4] to-white shadow-sm border border-green-100">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold tracking-tight text-gray-900">{stat.hook.value}{stat.suffix}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
