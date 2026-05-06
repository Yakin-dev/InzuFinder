'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { Eye, EyeSlash, EnvelopeSimple, Lock, User, Phone, House, SpinnerGap } from '@phosphor-icons/react'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'LANDLORD' ? 'LANDLORD' : 'TENANT'

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: defaultRole,
    phone: '',
  })

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.name || formData.name.length < 2) errs.name = 'Name must be at least 2 characters'
    if (!formData.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email address'
    if (!formData.password) errs.password = 'Password is required'
    else if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      const res = await fetch('/api/auth/register', {
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
          setErrors({ general: data.error || 'Registration failed' })
        }
        return
      }

      toast.success('Account created successfully!')

      if (data.user.role === 'LANDLORD') router.push('/dashboard')
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

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-500 mb-8">
            {formData.role === 'LANDLORD' ? 'Start listing your properties today' : 'Find your perfect home in Kigali'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {errors.general}
              </div>
            )}

            {/* Role selector */}
            <div>
              <label className="form-label">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'TENANT' })}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    formData.role === 'TENANT'
                      ? 'border-[#0d4f2e] bg-[#0d4f2e]/5 text-[#0d4f2e]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Find a Home
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'LANDLORD' })}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    formData.role === 'LANDLORD'
                      ? 'border-[#0d4f2e] bg-[#0d4f2e]/5 text-[#0d4f2e]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  List My Property
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="form-label">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  placeholder="Jean-Pierre Habimana"
                  className={`form-input pl-10 ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

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
              <label htmlFor="phone" className="form-label">Phone (Optional)</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  placeholder="+250 788 123 456"
                  className="form-input pl-10"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="At least 8 characters"
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

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <><SpinnerGap size={18} className="animate-spin" /> Creating account...</>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-[#0d4f2e] font-semibold hover:underline">
              Sign in
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
          <h2 className="text-3xl font-bold mb-4">Join InzuFinder</h2>
          <p className="text-green-200 text-lg leading-relaxed">
            {formData.role === 'LANDLORD'
              ? 'List your properties and connect with verified tenants across Kigali.'
              : 'Find verified, trusted rental homes across all Kigali districts.'
            }
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-green-300">
            <span>Free to Join</span>
            <span className="w-1 h-1 rounded-full bg-green-400" />
            <span>Quick Setup</span>
            <span className="w-1 h-1 rounded-full bg-green-400" />
            <span>Secure</span>
          </div>
        </div>
      </div>
    </div>
  )
}
