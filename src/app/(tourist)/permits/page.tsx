'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, FileText, Clock, CheckCircle } from 'lucide-react'
import { apiFetch } from '@/lib/api'

export default function PermitsPage() {
  const [permitGuides, setPermitGuides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPermits() {
      try {
        const res = await apiFetch('/api/content/permits')
        if (res.ok) {
          const data = await res.json()
          setPermitGuides(data)
        }
      } catch (e) {
        console.error('Failed to fetch permits:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchPermits()
  }, [])

  return (
    <div className="container section">
      <div className="section-header" style={{ textAlign: 'center' }}>
        <h1 className="section-title">🛡️ Permit Guide</h1>
        <p className="section-subtitle">Everything you need to know about permits for Northeast India</p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto 2rem', padding: '1.5rem', background: 'var(--color-saffron-50)', borderRadius: 'var(--radius-xl)', borderLeft: '4px solid var(--color-saffron-500)' }}>
        <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: '0.5rem' }}>⚠️ Important Note</h3>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>
          Four states require Inner Line Permits (ILP) for Indian citizens: Arunachal Pradesh, Nagaland, Manipur, and Mizoram.
          Foreigners need Restricted Area Permits (RAP) for most of Northeast India. Apply well in advance.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
        {loading ? (
          <div>Loading permit guides...</div>
        ) : permitGuides.map((p, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem' }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="badge badge-primary">{p.state}</span>
                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginTop: '0.5rem' }}>{p.permit_type}</h3>
              </div>
              <Shield size={24} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: 'var(--font-size-sm)' }}>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Who needs it?</p>
                <p style={{ color: 'var(--color-text-light)' }}>{p.who_needs_it}</p>
              </div>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>How to apply</p>
                <p style={{ color: 'var(--color-text-light)' }}>{p.how_to_apply}</p>
              </div>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Documents required</p>
                <ul style={{ color: 'var(--color-text-light)', paddingLeft: '1rem' }}>
                  {(p.documents_required || []).map((d: string, j: number) => <li key={j}>{d}</li>)}
                </ul>
              </div>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Processing time</p>
                <p style={{ color: 'var(--color-text-light)' }}>{p.processing_time}</p>
                <p style={{ fontWeight: 600, marginTop: '0.5rem', marginBottom: '0.25rem' }}>Foreign nationals</p>
                <p style={{ color: 'var(--color-text-light)' }}>Restricted Area Permit (RAP) required — apply via MHA or state tourism board.</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Permit Status Tracker */}
      <div style={{ maxWidth: 600, margin: '3rem auto 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '1rem' }}>📋 Track Your Permit Status</h2>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Application Reference Number</label>
            <input type="text" className="form-input" placeholder="Enter your permit application ref..." />
          </div>
          <button className="btn btn-primary w-full">Check Status</button>
        </div>
      </div>
    </div>
  )
}
