'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { MapPin, Image as ImageIcon, WarningCircle, CheckCircle, SpinnerGap, PlusCircle, X } from '@phosphor-icons/react'

export default function NewListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      if (images.length + filesArray.length > 8) {
        setError('Maximum 8 images allowed')
        return
      }
      setImages((prev) => [...prev, ...filesArray])
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let uploadedImages: { url: string; publicId: string }[] = []
      
      // Upload images first
      if (images.length > 0) {
        const imageFormData = new FormData()
        images.forEach(img => imageFormData.append('images', img))
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData
        })
        
        if (!uploadRes.ok) {
          throw new Error('Failed to upload images')
        }
        
        const uploadData = await uploadRes.json()
        uploadedImages = uploadData.images
      }

      // Submit house data
      const houseData = {
        ...formData,
        price: parseInt(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        size: formData.size ? parseInt(formData.size) : null,
        floor: formData.floor ? parseInt(formData.floor) : null,
        images: uploadedImages
      }

      const res = await fetch('/api/houses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(houseData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create listing')
      }

      toast.success('Listing created successfully!')
      router.push('/dashboard/listings')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add New Listing</h1>
        <p className="text-gray-500 mt-1">Fill in the details to list your property. All listings require admin approval.</p>
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
                placeholder="e.g. Beautiful 3 Bedroom House in Kibagabaga"
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
                placeholder="Describe the property, amenities, and nearby attractions..."
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
                  placeholder="e.g. 500000"
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
                    placeholder="e.g. Kibagabaga near hospital"
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

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Photos</h3>
            
            <div>
              <label className="form-label">Upload Images (Max 8)</label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-[#16a34a] hover:bg-green-50/50 transition-colors cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                <div className="space-y-2 text-center">
                  <ImageIcon size={48} weight="duotone" className="mx-auto text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <span className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#16a34a] hover:text-[#0d4f2e]">
                      <span>Click to upload files</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageChange} />
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            </div>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-video">
                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-700"
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary min-w-[150px]">
              {loading ? (
                <><SpinnerGap size={18} className="animate-spin" /> Submitting...</>
              ) : (
                <><PlusCircle size={18} weight="fill" /> Submit Listing</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
