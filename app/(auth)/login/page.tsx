'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { Eye, EyeSlash, EnvelopeSimple, Lock, House, SpinnerGap } from '@phosphor-icons/react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')
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

      if (redirectTo) {
        router.push(redirectTo)
      } else if (data.user.role === 'ADMIN') {
        router.push('/admin')
      } else if (data.user.role === 'LANDLORD') {
        router.push('/dashboard/landlord')
      } else {
        router.push('/houses')
      }
      router.refresh()
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#fafaf9]">
      <div className="hidden lg:flex w-[40%] bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-8 w-32 h-32 rounded-full border border-white" />
          <div className="absolute bottom-8 right-10 w-44 h-44 rounded-full border border-white" />
        </div>
        <div className="relative z-10 flex flex-col justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold"><House size={24} weight="fill" />InzuFinder</Link>
          <h2 className="text-4xl font-bold tracking-tight max-w-md">Find your perfect home in Kigali</h2>
          <div className="space-y-2 text-green-100"><p>✓ Admin Verified</p><p>✓ No Fake Listings</p><p>✓ Free to Browse</p></div>
        </div>
      </div>
      <div className="w-full lg:w-[60%] flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600 mb-8">Sign in to continue finding your home</p>
          {process.env.NODE_ENV !== 'production' && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Demo admin login</p>
              <p className="mt-1 font-mono">admin@inzufinder.rw</p>
            </div>
          )}
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
                <input type="email" id="email" placeholder="you@example.com" className={`form-input pl-10 ${errors.email ? 'border-red-300 focus:ring-red-500' : ''}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} id="password" placeholder="Enter your password" className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-300 focus:ring-red-500' : ''}`} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
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
              <Link href="#" className="text-sm text-[#0d4f2e] font-medium hover:underline">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <><SpinnerGap size={18} className="animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-gray-400">or</span></div>
          </div>
          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account? <Link href="/register" className="text-[#0d4f2e] font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
