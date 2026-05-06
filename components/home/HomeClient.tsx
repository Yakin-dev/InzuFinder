'use client'

import { House, Users, MapPin, ShieldCheck } from '@phosphor-icons/react'
import AnimatedCounter from '@/components/ui/AnimatedCounter'

interface HomeClientProps {
  stats: {
    houses: number
    users: number
  }
}

export default function HomeClient({ stats }: HomeClientProps) {
  return (
    <section className="bg-white border-b border-gray-100 shadow-sm">
      <div className="container-app py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              label: 'Active Listings',
              value: stats.houses,
              suffix: '',
              icon: <House size={22} weight="duotone" />,
              color: 'bg-[#0d4f2e]/10 text-[#0d4f2e]',
            },
            {
              label: 'Happy Tenants',
              value: stats.users,
              suffix: '+',
              icon: <Users size={22} weight="duotone" />,
              color: 'bg-blue-50 text-blue-600',
            },
            {
              label: 'Districts Covered',
              value: 3,
              suffix: '',
              icon: <MapPin size={22} weight="duotone" />,
              color: 'bg-amber-50 text-amber-600',
            },
            {
              label: 'Verified Landlords',
              value: 100,
              suffix: '%',
              icon: <ShieldCheck size={22} weight="duotone" />,
              color: 'bg-emerald-50 text-emerald-600',
            },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-2xl font-bold text-gray-900">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
