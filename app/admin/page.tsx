import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import {
  UsersThree, House, Clock, CalendarCheck, Flag, ShieldCheck, ArrowRight, CheckCircle, XCircle, ChartLine, Bell
} from '@phosphor-icons/react/dist/ssr'

async function getAdminData() {
  const [usersCount, propertiesCount, pendingPropertiesCount, bookingsCount, reportsCount] = await Promise.all([
    prisma.user.count(),
    prisma.house.count(),
    prisma.house.count({ where: { status: 'PENDING' } }),
    prisma.booking.count(),
    prisma.report.count({ where: { resolved: false } }),
  ])

  const landlordCount = await prisma.user.count({ where: { role: 'LANDLORD' } })
  const tenantCount = await prisma.user.count({ where: { role: 'TENANT' } })
  const approvedPropertiesCount = await prisma.house.count({ where: { status: 'APPROVED' } })
  const rejectedPropertiesCount = await prisma.house.count({ where: { status: 'REJECTED' } })
  
  const approvalRate = propertiesCount > 0 ? Math.round((approvedPropertiesCount / propertiesCount) * 100) : 0

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  const pendingListings = await prisma.house.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      images: { take: 1 },
      landlord: { select: { name: true } },
    },
  })

  return { 
    usersCount, 
    propertiesCount, 
    pendingPropertiesCount, 
    bookingsCount, 
    reportsCount, 
    landlordCount,
    tenantCount,
    approvedPropertiesCount,
    rejectedPropertiesCount,
    approvalRate,
    recentUsers, 
    pendingListings 
  }
}

export default async function AdminDashboardPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') return null

  const data = await getAdminData()

  const stats = [
    { label: 'Total Users', value: data.usersCount, icon: <UsersThree size={22} weight="duotone" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Properties', value: data.propertiesCount, icon: <House size={22} weight="duotone" />, color: 'bg-green-50 text-green-600' },
    { label: 'Pending Approval', value: data.pendingPropertiesCount, icon: <Clock size={22} weight="duotone" />, color: 'bg-orange-50 text-orange-600', highlight: data.pendingPropertiesCount > 0 },
    { label: 'Total Bookings', value: data.bookingsCount, icon: <CalendarCheck size={22} weight="duotone" />, color: 'bg-purple-50 text-purple-600' },
    { label: 'Active Reports', value: data.reportsCount, icon: <Flag size={22} weight="duotone" />, color: 'bg-red-50 text-red-600', highlight: data.reportsCount > 0 },
  ]

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Command Center</h1>
        <p className="text-gray-500 mt-1">Platform overview and critical actions.</p>
      </div>

      {/* Platform Health Section */}
      <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <ChartLine size={24} weight="fill" className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Platform Health</h2>
              <p className="text-sm text-gray-600">System performance and metrics</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{data.approvalRate}%</p>
              <p className="text-xs text-gray-600">Approval Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{data.approvedPropertiesCount}</p>
              <p className="text-xs text-gray-600">Live Listings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{data.pendingPropertiesCount}</p>
              <p className="text-xs text-gray-600">Pending Review</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{data.reportsCount}</p>
              <p className="text-xs text-gray-600">Active Reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/admin/listings" className="card p-4 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-orange-500" weight="duotone" />
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-green-600">Pending Listings</p>
              <p className="text-xs text-gray-500">{data.pendingPropertiesCount} to review</p>
            </div>
            <ArrowRight size={16} className="text-gray-400 group-hover:text-green-600 ml-auto" />
          </div>
        </Link>
        
        <Link href="/admin/reports" className="card p-4 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <Flag size={20} className="text-red-500" weight="duotone" />
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-green-600">Review Reports</p>
              <p className="text-xs text-gray-500">{data.reportsCount} active</p>
            </div>
            <ArrowRight size={16} className="text-gray-400 group-hover:text-green-600 ml-auto" />
          </div>
        </Link>
        
        <Link href="/admin/listings?status=APPROVED" className="card p-4 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-green-500" weight="duotone" />
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-green-600">Live Listings</p>
              <p className="text-xs text-gray-500">{data.approvedPropertiesCount} active</p>
            </div>
            <ArrowRight size={16} className="text-gray-400 group-hover:text-green-600 ml-auto" />
          </div>
        </Link>
        
        <Link href="/admin/users" className="card p-4 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <UsersThree size={20} className="text-blue-500" weight="duotone" />
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-green-600">All Users</p>
              <p className="text-xs text-gray-500">{data.usersCount} total</p>
            </div>
            <ArrowRight size={16} className="text-gray-400 group-hover:text-green-600 ml-auto" />
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`card p-5 ${stat.highlight ? 'ring-2 ring-orange-200' : ''}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Queue */}
        <div className="card">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-orange-500" weight="duotone" />
              <h2 className="font-bold text-gray-900">Verification Queue</h2>
            </div>
            <Link href="/admin/listings" className="text-sm font-medium text-[#16a34a] hover:text-[#0d4f2e]">View All</Link>
          </div>
          {data.pendingListings.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {data.pendingListings.map((house) => (
                <li key={house.id} className="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{house.title}</p>
                    <p className="text-sm text-gray-500">By {house.landlord.name} • {house.price.toLocaleString()} RWF</p>
                  </div>
                  <span className="badge-pending">Pending</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <CheckCircle size={32} className="mx-auto mb-2 text-green-500" weight="duotone" />
              <p>No listings waiting for review</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-blue-500" weight="duotone" />
              <h2 className="font-bold text-gray-900">Recent Activity</h2>
            </div>
            <Link href="/admin/users" className="text-sm font-medium text-[#16a34a] hover:text-[#0d4f2e]">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="admin-table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {data.recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-gray-500 text-xs">{user.email}</div>
                    </td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'LANDLORD' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="text-gray-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
