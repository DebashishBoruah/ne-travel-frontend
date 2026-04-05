'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/api'
import { NE_STATES } from '@/types'
import { Info, Loader2 } from 'lucide-react'

interface PermitFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PermitForm({ initialData, onSuccess, onCancel }: PermitFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const docs = formData.get('documents_required')?.toString().split(',').map(d => d.trim()).filter(Boolean) || []

    const payload = {
      state: formData.get('state'),
      permit_type: formData.get('permit_type'),
      who_needs_it: formData.get('who_needs_it'),
      how_to_apply: formData.get('how_to_apply'),
      documents_required: docs,
      processing_time: formData.get('processing_time'),
    }

    try {
      const res = await apiFetch(initialData?.id ? `/api/content/permits/${initialData.id}` : '/api/content/permits', {
        method: initialData?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const json = await res.json()

      if (json.success) {
        if (onSuccess) onSuccess()
      } else {
        setError(json.error || 'Failed to create permit guide')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#dc2626', fontSize: '0.8125rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Info size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Core Info Group */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Permit Details</h3>
          </div>
          <div className="admin-card-body" style={{ padding: '1.5rem' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="admin-form-group">
                <label className="admin-label">State <span style={{ color: '#dc2626' }}>*</span></label>
                <select name="state" defaultValue={initialData?.state} required className="admin-input admin-select">
                  <option value="">Select State</option>
                  {NE_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Permit Type (e.g. ILP, RAP)</label>
                <input type="text" name="permit_type" defaultValue={initialData?.permit_type} className="admin-input" placeholder="e.g. Inner Line Permit" />
              </div>
              
              <div className="admin-form-group col-span-full">
                <label className="admin-label">Processing Time</label>
                <input type="text" name="processing_time" defaultValue={initialData?.processing_time} className="admin-input" placeholder="e.g. 2-3 working days" />
              </div>
            </div>
          </div>
        </div>

        {/* Process Group */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Guidelines & Requirements</h3>
          </div>
          <div className="admin-card-body" style={{ padding: '1.5rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Who Needs It?</label>
              <textarea name="who_needs_it" defaultValue={initialData?.who_needs_it} rows={3} className="admin-input" placeholder="e.g. All Indian citizens residing outside Arunachal Pradesh" />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">How to Apply</label>
              <textarea name="how_to_apply" defaultValue={initialData?.how_to_apply} rows={4} className="admin-input" placeholder="e.g. Apply online via eILP portal..." />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Documents Required <span style={{ fontSize: '10px', color: 'var(--admin-text-subtle)', marginLeft: '8px' }}>(Comma separated)</span></label>
              <textarea name="documents_required" defaultValue={initialData?.documents_required?.join(', ')} rows={3} className="admin-input" placeholder="e.g. Aadhaar Card, Passport Size Photo" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border-standard)' }}>
          <button type="button" onClick={onCancel} className="admin-btn admin-btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary" style={{ flex: 1 }}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : (initialData?.id ? 'Update Permit Guide' : 'Save Permit Guide')}
          </button>
        </div>
      </form>
    </div>
  )
}
