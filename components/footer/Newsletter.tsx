'use client'

import { useState } from 'react'
import { Send, Bell, CheckCircle } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const [message, setMessage] = useState('')

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter a valid email.')
      return
    }

    if (!validateEmail(email)) {
      setStatus('error')
      setMessage('Please enter a valid email.')
      return
    }

    console.log('Newsletter subscription:', email)
    setStatus('success')
    setMessage("You're subscribed for demo rental alerts.")
    setEmail('')
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-2">
        <Bell size={14} className="text-[#4ade80]" />
        <h4 className="text-sm font-semibold text-white">Get Kigali rental alerts</h4>
      </div>
      <p className="text-xs text-white/50 mb-3 leading-relaxed">
        Be the first to know when verified listings go live.
      </p>

      {status === 'success' ? (
        <div className="flex items-center gap-2 text-sm text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-lg px-4 py-3">
          <CheckCircle size={16} />
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#4ade80]/40 focus:bg-white/8 transition-all"
            aria-label="Email address"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm bg-[#16a34a] text-white hover:bg-[#0ea54e] transition-all duration-200 hover:-translate-y-[1px]"
            style={{ boxShadow: '0 0 24px rgba(34,197,94,0.35)' }}
            aria-label="Subscribe to newsletter"
          >
            <Send size={14} />
            Subscribe
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-xs text-red-400 mt-2">{message}</p>
      )}
    </div>
  )
}
