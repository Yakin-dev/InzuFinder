'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Eye, EyeSlash, EnvelopeSimple, Lock, House, SpinnerGap } from '@phosphor-icons/react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email address'
    if (!formData.password) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.issues) {
          setErrors(Object.fromEntries(
            Object.entries(data.issues).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
          ) as Record<string, string>)
        } else {
          setErrors({ general: data.error || 'Login failed' })
        }
        return
      }

      toast.success(`Welcome back, ${data.user.name}!`)

      if (data.user.role === 'ADMIN') router.push('/admin')
      else if (data.user.role === 'LANDLORD') router.push('/dashboard')
      else router.push('/houses')
      router.refresh()
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] rounded-xl flex items-center justify-center">
              <House size={20} weight="fill" className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Inzu<span className="text-[#0d4f2e]">Finder</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <div className="relative">
                <EnvelopeSimple size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className={`form-input pl-10 ${errors.email ? 'border-red-300 focus:ring-red-500' : ''}`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-300 focus:ring-red-500' : ''}`}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0d4f2e] focus:ring-[#16a34a]" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <span className="text-sm text-[#0d4f2e] font-medium cursor-pointer hover:underline">Forgot Password?</span>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <><SpinnerGap size={18} className="animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#0d4f2e] font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Branding Panel */}
      <div className="hidden lg:flex flex-col items-center justify-center w-[45%] bg-gradient-to-br from-[#0d4f2e] to-[#0a3d23] text-white p-16 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full border-2 border-white/5" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full border border-white/5" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <House size={32} weight="fill" className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">InzuFinder</h2>
          <p className="text-green-200 text-lg leading-relaxed">
            Kigali&apos;s most trusted rental platform. Every listing is admin-verified for your safety.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-green-300">
            <span>Admin-Verified</span>
            <span className="w-1 h-1 rounded-full bg-green-400" />
            <span>No Fake Listings</span>
            <span className="w-1 h-1 rounded-full bg-green-400" />
            <span>Rwanda-First</span>
          </div>
        </div>
      </div>
    </div>
  )
}
