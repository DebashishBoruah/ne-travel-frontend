'use client'

import { useState } from 'react'
import { Calculator, Info } from 'lucide-react'
import { TextField, Select, Button, ImageAttacher } from '@/components/admin/ui'
import type { SelectOption } from '@/components/admin/ui'

const HOMESTAY_OPTIONS: SelectOption[] = [
  { value: '1', label: 'Riverside Khasi Cottage — Meghalaya (₹1,500/night, max 4)' },
  { value: '2', label: 'Tea Garden Bungalow — Assam (₹2,000/night, max 6)' },
  { value: '3', label: 'Bamboo House — Nagaland (₹1,200/night, max 3)' },
]

const INCLUSIONS: { key: 'guide' | 'transport' | 'permits'; label: string }[] = [
  { key: 'guide', label: 'Local guide included' },
  { key: 'transport', label: 'Transport included' },
  { key: 'permits', label: 'Permits included' },
]

const primaryGreen = { background: '#059669', borderColor: '#059669' } as const

export interface PackageFormProps {
  onSuccess: () => void
  onCancel?: () => void
  /** `modal` omits page title and pairs with side panel */
  variant?: 'page' | 'modal'
}

type InclusionState = Record<'guide' | 'transport' | 'permits', boolean>

export default function PackageForm({ onSuccess, onCancel, variant = 'page' }: PackageFormProps) {
  const [totalPrice, setTotalPrice] = useState(25000)
  const [duration, setDuration] = useState(7)
  const homestayRate = 1500
  const platformFee = 200
  const homestayCost = homestayRate * duration
  const operatorMargin = totalPrice - homestayCost - platformFee
  const [submitted, setSubmitted] = useState(false)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [inclusions, setInclusions] = useState<InclusionState>({
    guide: false,
    transport: false,
    permits: false,
  })

  const toggleInclusion = (key: keyof InclusionState) => {
    setInclusions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const setPhotosCapped = (files: File[]) => {
    setGalleryFiles(files.slice(0, 10))
  }

  if (submitted) {
    return (
      <div className="admin-empty-state" style={{ padding: variant === 'modal' ? '2rem 0' : '3rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <h2 className="admin-empty-state-title">Package submitted!</h2>
        <p className="admin-empty-state-desc" style={{ marginBottom: '1.5rem' }}>
          Your package is under review. We&apos;ll notify you within 24 hours.
        </p>
        <Button type="button" variant="primary" onClick={onSuccess} style={primaryGreen}>
          Done
        </Button>
      </div>
    )
  }

  return (
    <div>
      {variant === 'page' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--admin-text-main)',
              letterSpacing: '-0.02em',
              marginBottom: '0.25rem',
            }}
          >
            Create Tour Package
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-subtle)' }}>
            Design a package for tourists visiting Northeast India.
          </p>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
        }}
      >
        <div className="admin-form-section">
          <div className="admin-form-section-header">Package details</div>
          <div className="admin-form-section-body">
            <TextField
              label="Package name"
              name="name"
              required
              placeholder="e.g. 7 Days in Meghalaya"
            />
            <TextField
              label="Description"
              name="description"
              required
              multiline
              rows={4}
              placeholder="Describe the experience, highlights, and what makes it special..."
            />
            <TextField
              label="Day-by-day itinerary"
              name="itinerary"
              multiline
              rows={6}
              placeholder={'Day 1: Arrival in Shillong...\nDay 2: Cherrapunji waterfalls...\nDay 3: Living Root Bridges...'}
            />
            <div className="admin-form-row admin-form-row--2">
              <TextField
                label="Duration (days)"
                type="number"
                min={1}
                max={30}
                required
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value) || 1)}
              />
              <TextField
                label="Max group size"
                name="max_group_size"
                type="number"
                min={1}
                max={50}
                required
                placeholder="12"
                defaultValue={12}
              />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <div className="admin-form-section-header">Linked homestay</div>
          <div className="admin-form-section-body">
            <Select
              label="Homestay"
              name="homestay_id"
              required
              options={HOMESTAY_OPTIONS}
              placeholder="Choose an approved homestay…"
              hint="Only approved homestays with sufficient capacity are shown"
            />
          </div>
        </div>

        <div className="admin-form-section">
          <div className="admin-form-section-header">Inclusions</div>
          <div className="admin-form-section-body">
            <div className="admin-chip-grid">
              {INCLUSIONS.map(({ key, label }) => (
                <label
                  key={key}
                  className={`admin-chip-toggle${inclusions[key] ? ' selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={inclusions[key]}
                    onChange={() => toggleInclusion(key)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <div className="admin-form-section-header">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calculator size={16} />
              Pricing &amp; margin
            </span>
          </div>
          <div className="admin-form-section-body">
            <TextField
              label="Total package price (₹ per person)"
              type="number"
              min={100}
              required
              value={totalPrice}
              onChange={(e) => setTotalPrice(Number(e.target.value) || 0)}
            />

            <div
              style={{
                background: 'var(--color-forest-50)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                fontSize: '0.8125rem',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Homestay cost ({duration} nights × ₹{homestayRate.toLocaleString('en-IN')})</span>
                <span style={{ fontWeight: 600 }}>₹{homestayCost.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Platform fee</span>
                <span style={{ fontWeight: 600 }}>₹{platformFee}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--color-border)',
                  fontWeight: 700,
                  color: operatorMargin > 0 ? 'var(--color-success)' : 'var(--color-error)',
                }}
              >
                <span>Your margin</span>
                <span>₹{operatorMargin.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {operatorMargin < 0 && (
              <div className="admin-alert admin-alert-error" style={{ marginTop: '0.75rem' }}>
                <Info size={16} />
                Your margin is negative. Increase the package price or reduce the duration.
              </div>
            )}
          </div>
        </div>

        <div className="admin-form-section">
          <div className="admin-form-section-header">Photos</div>
          <div className="admin-form-section-body">
            <ImageAttacher
              label="Package photos"
              hint="Up to 10 images · PNG, JPG, WebP"
              multiple
              files={galleryFiles}
              onChange={setPhotosCapped}
            />
          </div>
        </div>

        <div className="admin-form-actions">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" disabled={operatorMargin < 0} style={primaryGreen}>
            Submit package for review
          </Button>
        </div>
      </form>
    </div>
  )
}
