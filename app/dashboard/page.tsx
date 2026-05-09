import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import Link from 'next/link'
import { House, CheckCircle, Clock, Bell, Plus, ArrowRight, Star, List, Calendar, User } from '@phosphor-icons/react/dist/ssr'

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

      {/* Landlord Success Panel */}
      <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Star size={24} weight="fill" className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Landlord Success Panel</h2>
              <p className="text-sm text-gray-600">Tips to maximize your rental success</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <User size={16} className="text-green-600" />
                Profile Completion
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Contact Info</span>
                  <CheckCircle size={14} className="text-green-500" weight="fill" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Verification</span>
                  <CheckCircle size={14} className="text-green-500" weight="fill" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <List size={16} className="text-green-600" />
                Approval Checklist
              </h3>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Clear photos from multiple angles</li>
                <li>• Correct and competitive pricing</li>
                <li>• Exact location with landmarks</li>
                <li>• Reachable phone/WhatsApp</li>
                <li>• Honest detailed description</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/dashboard/new-listing" className="card p-4 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <Plus size={20} className="text-green-600" weight="duotone" />
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-green-600">Add Listing</p>
              <p className="text-xs text-gray-500">Create new property</p>
            </div>
            <ArrowRight size={16} className="text-gray-400 group-hover:text-green-600 ml-auto" />
          </div>
        </Link>
        
        <Link href="/dashboard/listings" className="card p-4 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <House size={20} className="text-blue-600" weight="duotone" />
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-green-600">My Listings</p>
              <p className="text-xs text-gray-500">{data.totalHouses} properties</p>
            </div>
            <ArrowRight size={16} className="text-gray-400 group-hover:text-green-600 ml-auto" />
          </div>
        </Link>
        
        <Link href="/dashboard/bookings" className="card p-4 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-purple-600" weight="duotone" />
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-green-600">Booking Requests</p>
              <p className="text-xs text-gray-500">{data.pendingBookings} pending</p>
            </div>
            <ArrowRight size={16} className="text-gray-400 group-hover:text-green-600 ml-auto" />
          </div>
        </Link>
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
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <House size={28} weight="duotone" className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No listings yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Add your first property and our admin team will review it before it goes live.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/dashboard/new-listing" className="btn-primary inline-flex items-center gap-2">
                    <Plus size={16} />
                    Add New Listing
                  </Link>
                  <button className="btn-secondary inline-flex items-center gap-2">
                    <List size={16} />
                    Learn Approval Rules
                  </button>
                </div>
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
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar size={28} weight="duotone" className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No booking requests yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Requests will appear after tenants discover your approved listings.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/dashboard/listings" className="btn-primary inline-flex items-center gap-2">
                    <House size={16} />
                    View My Listings
                  </Link>
                  <Link href="/dashboard/new-listing" className="btn-secondary inline-flex items-center gap-2">
                    <Plus size={16} />
                    Add New Listing
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
