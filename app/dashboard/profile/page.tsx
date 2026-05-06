'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { UserCircle, Lock, SpinnerGap } from '@phosphor-icons/react'

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({ name: '', email: '', phone: '', bio: '' })
  const [passwords, setPasswords] = useState({ current: '', newPassword: '', confirm: '' })
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            bio: data.user.bio || '',
          })
        }
      })
      .catch(() => {})
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, phone: user.phone, bio: user.bio }),
      })
      if (!res.ok) throw new Error('Failed to update')
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (passwords.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setPasswordLoading(true)
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPassword }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to change password')
      }
      toast.success('Password changed successfully')
      setPasswords({ current: '', newPassword: '', confirm: '' })
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account information</p>
      </div>

      {/* Profile Info */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserCircle size={24} weight="duotone" className="text-[#0d4f2e]" />
          <h2 className="font-bold text-gray-900">Personal Information</h2>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input bg-gray-50 cursor-not-allowed"
              value={user.email}
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              placeholder="+250 788 123 456"
            />
          </div>

          <div>
            <label className="form-label">Bio</label>
            <textarea
              className="form-input resize-none"
              rows={3}
              value={user.bio}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              placeholder="Tell tenants about yourself..."
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><SpinnerGap size={16} className="animate-spin" /> Saving...</> : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock size={24} weight="duotone" className="text-[#0d4f2e]" />
          <h2 className="font-bold text-gray-900">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-input"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-input"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-input"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={passwordLoading} className="btn-primary">
            {passwordLoading ? <><SpinnerGap size={16} className="animate-spin" /> Changing...</> : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
