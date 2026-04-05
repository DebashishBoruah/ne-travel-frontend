'use client'

import { useState } from 'react'
import { Upload, MapPin, Plus, X, Trash2 } from 'lucide-react'
import { NE_STATES } from '@/lib/types'
import { ImageUploader } from '@/components/shared/ImageUploader'

const amenitiesList = ['WiFi', 'Hot Water', 'Kitchen', 'Parking', 'Garden', 'Mountain View', 'River View', 'Lake View', 'Fireplace', 'Balcony', 'Home-cooked Meals', 'Laundry', 'TV', 'AC', 'Heater']
const languagesList = ['English', 'Hindi', 'Assamese', 'Khasi', 'Garo', 'Mizo', 'Manipuri', 'Nagamese', 'Bengali', 'Nepali', 'Monpa', 'Bodo']

export default function CreateListingPage() {
  const [photos, setPhotos] = useState<string[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.5rem' }}>Listing Submitted!</h1>
        <p style={{ color: 'var(--color-text-light)', maxWidth: 400, margin: '0 auto' }}>
          Your listing is under review. We&apos;ll notify you within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.5rem' }}>Create Homestay Listing</h1>
      <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem', fontSize: 'var(--font-size-sm)' }}>Fill in the details about your property. All fields are required.</p>

      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>Basic Information</h3>
          <div className="form-group">
            <label className="form-label">Property Name</label>
            <input type="text" className="form-input" placeholder="e.g. Riverside Khasi Cottage" required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input form-textarea" placeholder="Describe your property, surroundings, and what guests can expect..." rows={4} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">State</label>
              <select className="form-input form-select" required>
                <option value="">Select state</option>
                {NE_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Number of Rooms</label>
              <input type="number" className="form-input" min={1} max={20} placeholder="2" required />
            </div>
            <div className="form-group">
              <label className="form-label">Price per Night (₹)</label>
              <input type="number" className="form-input" min={100} placeholder="1500" required />
            </div>
            <div className="form-group">
              <label className="form-label">Max Guests</label>
              <input type="number" className="form-input" min={1} max={50} placeholder="4" required />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>📍 Location</h3>
          <div style={{ background: 'var(--color-slate-50)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
            <MapPin size={28} /><p>Click on the map to set your location</p><p style={{ fontSize: 'var(--font-size-xs)' }}>OpenStreetMap integration loads here</p>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>Amenities</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {amenitiesList.map(a => (
              <label key={a} className="form-checkbox" style={{ padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-full)', border: `1px solid ${amenities.includes(a) ? 'var(--color-primary)' : 'var(--color-border)'}`, background: amenities.includes(a) ? 'var(--color-forest-50)' : 'white', fontSize: 'var(--font-size-sm)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ display: 'none' }} checked={amenities.includes(a)} onChange={() => setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])} />
                {a}
              </label>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>Languages Spoken</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {languagesList.map(l => (
              <label key={l} className="form-checkbox" style={{ padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-full)', border: `1px solid ${languages.includes(l) ? 'var(--color-primary)' : 'var(--color-border)'}`, background: languages.includes(l) ? 'var(--color-forest-50)' : 'white', fontSize: 'var(--font-size-sm)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ display: 'none' }} checked={languages.includes(l)} onChange={() => setLanguages(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])} />
                {l}
              </label>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>📷 Photos (Max 10)</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {photos.map((url, i) => (
              <div key={i} style={{ position: 'relative', height: 120, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <img src={url} alt={`Listing photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              folder="homestays"
            />
          )}
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>💰 Bank / UPI Details</h3>
          <div className="form-group">
            <label className="form-label">Account Holder Name</label>
            <input type="text" className="form-input" placeholder="As per bank records" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input type="text" className="form-input" placeholder="Account number" />
            </div>
            <div className="form-group">
              <label className="form-label">IFSC Code</label>
              <input type="text" className="form-input" placeholder="SBIN0001234" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">UPI ID (optional)</label>
            <input type="text" className="form-input" placeholder="name@upi" />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-full">Submit Listing for Review</button>
      </form>
    </div>
  )
}
