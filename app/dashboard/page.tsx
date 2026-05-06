import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import Link from 'next/link'
import { House, CheckCircle, Clock, Bell } from '@phosphor-icons/react/dist/ssr'

async function getDashboardData(userId: string) {
  const [houses, bookings] = await Promise.all([
    prisma.house.findMany({
      where: { landlordId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        _count: { select: { bookings: true } },
      },
    }),
    prisma.booking.findMany({
      where: { house: { landlordId: userId } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        house: { select: { title: true } },
        tenant: { select: { name: true, email: true } },
      },
    }),
  ])

  const totalHouses = await prisma.house.count({ where: { landlordId: userId } })
  const pendingHouses = await prisma.house.count({ where: { landlordId: userId, status: 'PENDING' } })
  const approvedHouses = await prisma.house.count({ where: { landlordId: userId, status: 'APPROVED' } })
  const pendingBookings = await prisma.booking.count({ where: { house: { landlordId: userId }, status: 'PENDING' } })

  return { houses, bookings, totalHouses, pendingHouses, approvedHouses, pendingBookings }
}

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session) return null

  const data = await getDashboardData(session.id)

  const stats = [
    { label: 'Total Listings', value: data.totalHouses, icon: <House size={20} weight="duotone" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Listings', value: data.approvedHouses, icon: <CheckCircle size={20} weight="duotone" />, color: 'bg-green-50 text-green-600' },
    { label: 'Pending Review', value: data.pendingHouses, icon: <Clock size={20} weight="duotone" />, color: 'bg-orange-50 text-orange-600' },
    { label: 'New Bookings', value: data.pendingBookings, icon: <Bell size={20} weight="duotone" />, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session.name}</h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your properties today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Listings */}
        <div className="card">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Listings</h2>
            <Link href="/dashboard/listings" className="text-sm font-medium text-[#16a34a] hover:text-[#0d4f2e]">View All</Link>
          </div>
          <div className="p-0">
            {data.houses.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {data.houses.map((house) => (
                  <li key={house.id} className="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{house.title}</p>
                      <p className="text-sm text-gray-500">{house.price.toLocaleString()} RWF / month</p>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        house.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        house.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {house.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">You haven&apos;t added any properties yet.</p>
                <Link href="/dashboard/new-listing" className="btn-primary inline-flex">Add Your First Listing</Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Booking Requests</h2>
            <Link href="/dashboard/bookings" className="text-sm font-medium text-[#16a34a] hover:text-[#0d4f2e]">View All</Link>
          </div>
          <div className="p-0">
            {data.bookings.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {data.bookings.map((booking) => (
                  <li key={booking.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-900">{booking.house.title}</p>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                        booking.status === 'DECLINED' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Requested by <span className="font-medium text-gray-900">{booking.tenant.name}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Move-in: {booking.moveInDate ? new Date(booking.moveInDate).toLocaleDateString() : 'Not specified'}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No booking requests yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
