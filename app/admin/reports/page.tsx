'use client'

import * as React from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { ReportModal } from '@/components/ReportModal'
import { Flag, Clock, CheckCircle, XCircle, Eye } from '@phosphor-icons/react'

type Report = {
  id: string
  reason: string
  details?: string | null
  createdAt: string
  status: string
  resolved: boolean
  reporter?: { name: string; email: string } | null
  house?: { id: string; title: string; location: string; status: string } | null
}

export default function AdminReportsPage() {
  const [reports, setReports] = React.useState<Report[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function run() {
      setLoading(true)
      try {
        const res = await fetch('/api/admin/reports')
        const data = await res.json()
        setReports(data.reports || [])
      } catch {
        toast.error('Failed to load reports')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const updateStatus = async (id: string, status: 'PENDING' | 'REVIEWED' | 'DISMISSED') => {
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: data.report.status, resolved: data.report.resolved } : r)))
      toast.success('Report updated')
    } catch {
      toast.error('Failed to update report')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Flag size={22} weight="duotone" />
          Reports
        </h1>
        <p className="text-gray-500 mt-1">Review reported listings and take action.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-6">
              <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mt-3 animate-pulse" />
              <div className="h-10 bg-gray-100 rounded-xl mt-4 animate-pulse" />
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Flag size={26} weight="duotone" className="text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No reports yet</h3>
          <p className="text-gray-500">All good. Keep verifying listings.</p>
        </div>
      ) : (
        <div className="card p-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Listing</th>
                  <th>Reporter</th>
                  <th>Reason</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-4 min-w-[260px]">
                      <div>
                        <div className="font-semibold text-gray-900">{r.house?.title || 'Unknown listing'}</div>
                        <div className="text-xs text-gray-500">{r.house?.location}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{r.reporter?.name || '—'}</div>
                      <div className="text-xs text-gray-500">{r.reporter?.email || ''}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-700">{r.reason}</div>
                      {r.details ? <div className="text-xs text-gray-500 mt-1 line-clamp-2">{r.details}</div> : null}
                    </td>
                    <td className="px-4 py-4 text-gray-600 text-sm">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          r.status === 'REVIEWED'
                            ? 'bg-green-100 text-green-700'
                            : r.status === 'DISMISSED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {r.status || (r.resolved ? 'REVIEWED' : 'PENDING')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button variant="secondary" onClick={() => updateStatus(r.id, 'REVIEWED')} className="!py-2 !px-3 text-sm flex items-center gap-2">
                          <CheckCircle size={16} />
                          Review
                        </Button>
                        <Button variant="danger" onClick={() => updateStatus(r.id, 'DISMISSED')} className="!py-2 !px-3 text-sm flex items-center gap-2">
                          <XCircle size={16} />
                          Dismiss
                        </Button>
                        <a href={`/houses/${r.house?.id}`} target="_blank" rel="noreferrer" className="btn-ghost !py-2 !px-3 text-sm border border-gray-200 rounded-xl">
                          <Eye size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

