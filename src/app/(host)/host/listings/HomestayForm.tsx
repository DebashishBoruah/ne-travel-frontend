'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import { NE_STATES } from '@/types'
import { apiFetch } from '@/lib/api'
import { TextField, Select, Button, ImageAttacher } from '@/components/admin/ui'
import type { SelectOption } from '@/components/admin/ui'

const STATE_OPTIONS: SelectOption[] = NE_STATES.map((s) => ({ value: s, label: s }))

const AMENITIES = [
  'WiFi', 'Hot Water', 'Kitchen', 'Parking', 'Garden',
  'Mountain View', 'River View', 'Lake View', 'Fireplace', 'Balcony',
  'Home-cooked Meals', 'Laundry', 'TV', 'AC', 'Heater',
]

const LANGUAGES = [
  'English', 'Hindi', 'Assamese', 'Khasi', 'Garo',
  'Mizo', 'Manipuri', 'Nagamese', 'Bengali', 'Nepali',
  'Monpa', 'Bodo',
]

interface HomestayFormProps {
  initialData?: Record<string, unknown>
  onSuccess: () => void
  onCancel: () => void
}

export default function HomestayForm({ initialData, onSuccess, onCancel }: HomestayFormProps) {
  const isEdit = !!initialData
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [heroFiles, setHeroFiles] = useState<File[]>([])
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [amenities, setAmenities] = useState<string[]>((initialData?.amenities as string[]) || [])
  const [languages, setLanguages] = useState<string[]>((initialData?.languages as string[]) || [])

  const toggleChip = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    fd.set('amenities', JSON.stringify(amenities))
    fd.set('languages', JSON.stringify(languages))

    if (heroFiles[0]) fd.set('hero_image', heroFiles[0])
    galleryFiles.forEach((f) => fd.append('gallery', f))

    try {
      const url = isEdit
        ? `/api/host/listings/${initialData?.id}`
        : '/api/host/listings'
      const res = await apiFetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        body: fd,
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }
      onSuccess()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: '1.25rem' }}>
          <Info size={16} /> {error}
        </div>
      )}

      {/* ── Property Details ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Property Details</div>
        <div className="admin-form-section-body">
          <TextField
            label="Property Name"
            name="name"
            required
            defaultValue={initialData?.name as string}
            placeholder="e.g. Riverside Khasi Cottage"
          />
          <TextField
            label="Description"
            name="description"
            required
            multiline
            rows={3}
            defaultValue={initialData?.description as string}
            placeholder="Describe your property, surroundings, and what guests can expect..."
          />
          <div className="admin-form-row admin-form-row--2">
            <Select
              label="State"
              name="state"
              required
              options={STATE_OPTIONS}
              placeholder="Select state"
              defaultValue={initialData?.state as string}
            />
            <TextField
              label="District / Town"
              name="district"
              required
              defaultValue={initialData?.district as string}
              placeholder="e.g. Shillong"
            />
          </div>
          <div className="admin-form-row admin-form-row--3">
            <TextField
              label="Rooms"
              name="rooms"
              required
              type="number"
              defaultValue={initialData?.rooms as string}
              placeholder="2"
            />
            <TextField
              label="Price/Night (₹)"
              name="price"
              required
              type="number"
              defaultValue={initialData?.price as string}
              placeholder="1500"
            />
            <TextField
              label="Max Guests"
              name="max_guests"
              required
              type="number"
              defaultValue={initialData?.max_guests as string}
              placeholder="4"
            />
          </div>
        </div>
      </div>

      {/* ── Amenities ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Amenities</div>
        <div className="admin-form-section-body">
          <div className="admin-chip-grid">
            {AMENITIES.map((a) => (
              <label
                key={a}
                className={`admin-chip-toggle${amenities.includes(a) ? ' selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={amenities.includes(a)}
                  onChange={() => toggleChip(amenities, setAmenities, a)}
                />
                {a}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ── Languages ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Languages Spoken</div>
        <div className="admin-form-section-body">
          <div className="admin-chip-grid">
            {LANGUAGES.map((l) => (
              <label
                key={l}
                className={`admin-chip-toggle${languages.includes(l) ? ' selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={languages.includes(l)}
                  onChange={() => toggleChip(languages, setLanguages, l)}
                />
                {l}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ── Media ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Photos</div>
        <div className="admin-form-section-body">
          <ImageAttacher
            label="Cover Photo"
            required={!isEdit}
            existingUrl={initialData?.hero_image as string}
            files={heroFiles}
            onChange={setHeroFiles}
          />
          <ImageAttacher
            label="Gallery"
            hint="up to 10 images"
            multiple
            existingUrl={null}
            files={galleryFiles}
            onChange={setGalleryFiles}
          />
        </div>
      </div>

      {/* ── Bank Details ── */}
      <div className="admin-form-section">
        <div className="admin-form-section-header">Payout Details</div>
        <div className="admin-form-section-body">
          <TextField
            label="Account Holder"
            name="account_holder"
            defaultValue={initialData?.account_holder as string}
            placeholder="As per bank records"
          />
          <div className="admin-form-row admin-form-row--2">
            <TextField
              label="Account Number"
              name="account_number"
              defaultValue={initialData?.account_number as string}
              placeholder="Account number"
            />
            <TextField
              label="IFSC Code"
              name="ifsc"
              defaultValue={initialData?.ifsc as string}
              placeholder="SBIN0001234"
            />
          </div>
          <TextField
            label="UPI ID"
            name="upi"
            hint="optional"
            defaultValue={initialData?.upi as string}
            placeholder="name@upi"
          />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="admin-form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Discard
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEdit ? 'Update Listing' : 'Submit for Review'}
        </Button>
      </div>
    </form>
  )
}
