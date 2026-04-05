'use client'

import { useState } from 'react'
import { MapPin, X, CheckCircle } from 'lucide-react'
import { NE_STATES } from '@/types'
import { TextField, Select, Button, ImageAttacher } from '@/components/admin/ui'
import type { SelectOption } from '@/components/admin/ui'
import { ImageUploader } from '@/components/shared/ImageUploader'

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

export default function CreateListingPage() {
  const [photos, setPhotos] = useState<string[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const toggleChip = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setSubmitted(true); setLoading(false) }, 600)
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 480, margin: '4rem auto', textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: '#ecfdf5', color: '#10b981',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem',
        }}>
          <CheckCircle size={28} />
        </div>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--admin-text-main)', marginBottom: '0.5rem' }}>
          Listing Submitted
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-subtle)', lineHeight: 1.6 }}>
          Your homestay is under review. We&apos;ll notify you within 24 hours once it&apos;s approved.
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.5rem', fontWeight: 700,
          color: 'var(--admin-text-main)', letterSpacing: '-0.02em',
          marginBottom: '0.25rem',
        }}>
          Create Homestay Listing
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-subtle)' }}>
          Fill in the details about your property. Fields marked * are required.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Basic Information ── */}
        <div className="admin-form-section">
          <div className="admin-form-section-header">Basic Information</div>
          <div className="admin-form-section-body">
            <TextField
              label="Property Name"
              name="name"
              required
              placeholder="e.g. Riverside Khasi Cottage"
            />
            <TextField
              label="Description"
              name="description"
              required
              multiline
              rows={4}
              placeholder="Describe your property, surroundings, and what guests can expect..."
            />
            <div className="admin-form-row admin-form-row--2">
              <Select
                label="State"
                name="state"
                required
                options={STATE_OPTIONS}
                placeholder="Select state"
              />
              <TextField
                label="Number of Rooms"
                name="rooms"
                required
                type="number"
                placeholder="2"
              />
            </div>
            <div className="admin-form-row admin-form-row--2">
              <TextField
                label="Price per Night (₹)"
                name="price"
                required
                type="number"
                placeholder="1500"
              />
              <TextField
                label="Max Guests"
                name="max_guests"
                required
                type="number"
                placeholder="4"
              />
            </div>
          </div>
        </div>

        {/* ── Location ── */}
        <div className="admin-form-section">
          <div className="admin-form-section-header">Location</div>
          <div className="admin-form-section-body">
            <TextField
              label="Full Address"
              name="address"
              required
              placeholder="Village / Town, District, State"
            />
            <div className="admin-map-placeholder">
              <MapPin size={24} />
              <span>Map integration — click to set location</span>
              <span style={{ fontSize: '0.6875rem' }}>OpenStreetMap loads here</span>
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

        {/* ── Photos ── */}
        <div className="admin-form-section">
          <div className="admin-form-section-header">Photos (Max 10)</div>
          <div className="admin-form-section-body">
            {photos.length > 0 && (
              <div className="admin-photo-grid">
                {photos.map((url, i) => (
                  <div key={i} className="admin-photo-thumb">
                    <img src={url} alt={`Photo ${i + 1}`} />
                    <button
                      type="button"
                      className="admin-photo-thumb-remove"
                      onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {photos.length < 10 && (
              <ImageUploader
                onUploadComplete={(url) => setPhotos((prev) => [...prev, url])}
                folder="homestays"
              />
            )}
          </div>
        </div>

        {/* ── Bank Details ── */}
        <div className="admin-form-section">
          <div className="admin-form-section-header">Bank / UPI Details</div>
          <div className="admin-form-section-body">
            <TextField
              label="Account Holder Name"
              name="account_holder"
              placeholder="As per bank records"
            />
            <div className="admin-form-row admin-form-row--2">
              <TextField
                label="Account Number"
                name="account_number"
                placeholder="Account number"
              />
              <TextField
                label="IFSC Code"
                name="ifsc"
                placeholder="SBIN0001234"
              />
            </div>
            <TextField
              label="UPI ID"
              name="upi"
              placeholder="name@upi"
              hint="optional"
            />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="admin-form-actions">
          <Button type="button" variant="secondary">
            Save as Draft
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Submit for Review
          </Button>
        </div>
      </form>
    </div>
  )
}
