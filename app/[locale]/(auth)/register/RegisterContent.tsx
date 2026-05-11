'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { Eye, EyeSlash, EnvelopeSimple, Lock, User, Phone, House, SpinnerGap, CheckCircle } from '@phosphor-icons/react'

export default function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'LANDLORD' ? 'LANDLORD' : 'TENANT'
  const redirectTo = searchParams.get('redirect')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: defaultRole, phone: '' })

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.name || formData.name.length < 2) errs.name = 'Name must be at least 2 characters'
    if (!formData.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email address'
    if (!formData.phone) errs.phone = 'Phone is required'
    if (!formData.password || formData.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (!agreeTerms) errs.terms = 'You must agree to terms'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErrors({})
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      const data = await res.json()
      if (!res.ok) {
        setErrors({ general: data.error || 'Registration failed' })
        return
      }
      toast.success('Account created successfully!')
      if (redirectTo) {
        router.push(redirectTo)
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
          <div className="absolute top-12 left-8 h-28 w-28 rounded-full border border-white" />
          <div className="absolute bottom-12 right-10 h-40 w-40 rounded-full border border-white" />
        </div>
        <div className="relative z-10 flex flex-col justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold"><House size={24} weight="fill" />InzuFinder</Link>
          <h2 className="text-4xl font-bold tracking-tight max-w-md">Join 500+ Kigali renters finding homes on InzuFinder</h2>
          <div className="space-y-2 text-green-100">
            <p>✓ Admin Verified</p><p>✓ No Fake Listings</p><p>✓ Free to Browse</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[60%] flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600 mb-8">Start your verified rental journey in Kigali.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{errors.general}</div>}
            <Field icon={<User size={18} />} label="Full Name" id="name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} error={errors.name} />
            <Field icon={<EnvelopeSimple size={18} />} label="Email" id="email" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} error={errors.email} />
            <Field icon={<Phone size={18} />} label="Phone" id="phone" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} error={errors.phone} />
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} className="form-input pl-10 pr-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}</button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
            <div>
              <label className="form-label">I want to</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { role: 'TENANT', title: 'RENT' },
                  { role: 'LANDLORD', title: 'LIST my property' },
                ].map((opt) => (
                  <button key={opt.role} type="button" onClick={() => setFormData({ ...formData, role: opt.role })} className={`rounded-2xl border-2 p-4 text-left transition-all ${formData.role === opt.role ? 'border-[#16a34a] bg-[#f0fdf4]' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{opt.title}</span>
                      {formData.role === opt.role && <CheckCircle size={20} weight="fill" className="text-[#16a34a]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#16a34a] focus:ring-[#16a34a]" />
              I agree to InzuFinder&apos;s terms
            </label>
            {errors.terms && <p className="form-error">{errors.terms}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? <><SpinnerGap size={18} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">Already have an account? <Link href="/login" className="text-[#0d4f2e] font-semibold hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}

function Field({
  icon,
  label,
  id,
  value,
  onChange,
  error,
  type = 'text',
}: {
  icon: React.ReactNode
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  error?: string
  type?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="form-label">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input id={id} type={type} className="form-input pl-10" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}
