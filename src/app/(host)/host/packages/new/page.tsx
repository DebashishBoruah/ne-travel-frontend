'use client'

import { useState } from 'react'
import { Upload, Calculator, Info, X } from 'lucide-react'
import { NE_STATES } from '@/lib/types'
import { ImageUploader } from '@/components/shared/ImageUploader'

export default function CreatePackagePage() {
  const [totalPrice, setTotalPrice] = useState(25000)
  const [duration, setDuration] = useState(7)
  const homestayRate = 1500
  const platformFee = 200
  const homestayCost = homestayRate * duration
  const [operatorMargin = totalPrice - homestayCost - platformFee] = [totalPrice - homestayCost - platformFee]
  const [submitted, setSubmitted] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.5rem' }}>Package Submitted!</h1>
        <p style={{ color: 'var(--color-text-light)' }}>Your package is under review. We&apos;ll notify you within 24 hours.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.5rem' }}>Create Tour Package</h1>
      <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem', fontSize: 'var(--font-size-sm)' }}>Design a package for tourists visiting Northeast India.</p>

      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>Package Details</h3>
          <div className="form-group">
            <label className="form-label">Package Name</label>
            <input type="text" className="form-input" placeholder="e.g. 7 Days in Meghalaya" required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input form-textarea" rows={4} placeholder="Describe the experience, highlights, and what makes it special..." required />
          </div>
          <div className="form-group">
            <label className="form-label">Day-by-Day Itinerary</label>
            <textarea className="form-input form-textarea" rows={6} placeholder="Day 1: Arrival in Shillong...&#10;Day 2: Cherrapunji waterfalls...&#10;Day 3: Living Root Bridges..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Duration (days)</label>
              <input type="number" className="form-input" min={1} max={30} value={duration} onChange={(e) => setDuration(Number(e.target.value))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Max Group Size</label>
              <input type="number" className="form-input" min={1} max={50} placeholder="12" required />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>Linked Homestay</h3>
          <div className="form-group">
            <label className="form-label">Select Homestay</label>
            <select className="form-input form-select">
              <option value="">Choose an approved homestay...</option>
              <option value="1">Riverside Khasi Cottage — Meghalaya (₹1,500/night, max 4 guests)</option>
              <option value="2">Tea Garden Bungalow — Assam (₹2,000/night, max 6 guests)</option>
              <option value="3">Bamboo House — Nagaland (₹1,200/night, max 3 guests)</option>
            </select>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>Only approved homestays with sufficient capacity are shown</p>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>Inclusions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { id: 'guide', label: 'Local Guide Included' },
              { id: 'transport', label: 'Transport Included' },
              { id: 'permits', label: 'Permits Included' },
            ].map(item => (
              <label key={item.id} className="form-checkbox">
                <input type="checkbox" /> {item.label}
              </label>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>
            <Calculator size={18} style={{ display: 'inline', verticalAlign: 'middle' }} /> Pricing & Margin
          </h3>
          <div className="form-group">
            <label className="form-label">Total Package Price (₹ per person)</label>
            <input type="number" className="form-input" min={100} value={totalPrice} onChange={(e) => setTotalPrice(Number(e.target.value))} required />
          </div>

          <div style={{ background: 'var(--color-forest-50)', borderRadius: 'var(--radius-lg)', padding: '1rem', fontSize: 'var(--font-size-sm)' }}>
            <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
              <span>Homestay Cost ({duration} nights × ₹{homestayRate.toLocaleString('en-IN')})</span>
              <span style={{ fontWeight: 600 }}>₹{homestayCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
              <span>Platform Fee</span>
              <span style={{ fontWeight: 600 }}>₹{platformFee}</span>
            </div>
            <div className="flex justify-between" style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)', fontWeight: 700, color: operatorMargin > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
              <span>Your Margin</span>
              <span>₹{operatorMargin.toLocaleString('en-IN')}</span>
            </div>
          </div>
          {operatorMargin < 0 && (
            <p style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)', marginTop: '0.5rem' }}>
              ⚠️ Your margin is negative. Increase the package price or reduce the duration.
            </p>
          )}
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>📷 Photos (Max 10)</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {photos.map((url, i) => (
              <div key={i} style={{ position: 'relative', height: 120, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <img src={url} alt={`Package photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  type="button" 
                  onClick={() => setPhotos(prev => prev.filter((_, index) => index !== i))}
                  style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {photos.length < 10 && (
            <ImageUploader 
              onUploadComplete={(url) => setPhotos(prev => [...prev, url])} 
              folder="packages"
            />
          )}
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-full" disabled={operatorMargin < 0}>Submit Package for Review</button>
      </form>
    </div>
  )
}
