'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { MapPin, Image as ImageIcon, WarningCircle, CheckCircle, SpinnerGap } from '@phosphor-icons/react'

export default function EditListingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    district: '',
    type: 'HOUSE',
    bedrooms: '',
    bathrooms: '',
    size: '',
    floor: '',
    furnished: false,
  })

  useEffect(() => {
    fetchHouse()
  }, [params.id])

  const fetchHouse = async () => {
    try {
      const res = await fetch(`/api/houses/${params.id}`)
      if (!res.ok) throw new Error('Failed to load listing')
      const data = await res.json()
      
      const house = data.house
      setFormData({
        title: house.title,
        description: house.description,
        price: house.price.toString(),
        location: house.location,
        district: house.district,
        type: house.type,
        bedrooms: house.bedrooms.toString(),
        bathrooms: house.bathrooms.toString(),
        size: house.size ? house.size.toString() : '',
        floor: house.floor ? house.floor.toString() : '',
        furnished: house.furnished,
      })
    } catch (err: any) {
      toast.error(err.message)
      router.push('/dashboard/listings')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const houseData = {
        ...formData,
        price: parseInt(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        size: formData.size ? parseInt(formData.size) : null,
        floor: formData.floor ? parseInt(formData.floor) : null,
      }

      const res = await fetch(`/api/houses/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(houseData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update listing')
      }

      toast.success('Listing updated successfully!')
      router.push('/dashboard/listings')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <SpinnerGap size={32} className="animate-spin text-[#0d4f2e]" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Listing</h1>
        <p className="text-gray-500 mt-1">Update your property details. Note: making changes will return the listing to PENDING status.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-center gap-2">
              <WarningCircle size={20} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Basic Details</h3>
            
            <div>
              <label className="form-label">Property Title</label>
              <input
                required
                type="text"
                className="form-input"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea
                required
                rows={4}
                className="form-input resize-none"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Price (RWF / month)</label>
                <input
                  required
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Property Type</label>
                <select
                  required
                  className="form-input"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="HOUSE">House</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="STUDIO">Studio</option>
                  <option value="VILLA">Villa</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Location & Features</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">District</label>
                <select
                  required
                  className="form-input"
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                >
                  <option value="" disabled>Select District</option>
                  <option value="Gasabo">Gasabo</option>
                  <option value="Kicukiro">Kicukiro</option>
                  <option value="Nyarugenge">Nyarugenge</option>
                </select>
              </div>
              <div>
                <label className="form-label">Specific Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    required
                    type="text"
                    className="form-input pl-10"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="form-label">Bedrooms</label>
                <input
                  required
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.bedrooms}
                  onChange={e => setFormData({ ...formData, bedrooms: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Bathrooms</label>
                <input
                  required
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.bathrooms}
                  onChange={e => setFormData({ ...formData, bathrooms: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Size (m²)</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="Optional"
                  value={formData.size}
                  onChange={e => setFormData({ ...formData, size: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Floor</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="Optional"
                  value={formData.floor}
                  onChange={e => setFormData({ ...formData, floor: e.target.value })}
                />
              </div>
              <div className="col-span-2 md:col-span-4 flex items-center mt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-[#0d4f2e] focus:ring-[#16a34a]"
                    checked={formData.furnished}
                    onChange={e => setFormData({ ...formData, furnished: e.target.checked })}
                  />
                  <span className="text-gray-700 font-medium">Fully Furnished</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary min-w-[150px]">
              {saving ? (
                <><SpinnerGap size={18} className="animate-spin" /> Saving...</>
              ) : (
                <><CheckCircle size={18} weight="fill" /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
