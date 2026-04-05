'use client'

import { useEffect, useState } from 'react'
import { Shield, Clock } from 'lucide-react'
import { apiFetch } from '@/lib/api'

export default function PermitsPage() {
  const [permitGuides, setPermitGuides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPermits() {
      try {
        const res = await apiFetch('/api/content/permits')
        if (res.ok) setPermitGuides(await res.json())
      } catch (e) {
        console.error('Failed to fetch permits:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchPermits()
  }, [])

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero-title">Permit Guide</h1>
          <p className="page-hero-sub">
            Everything you need to know about permits for Northeast India
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '3rem' }}>
        <div className="t-callout warning">
          <div className="t-callout-title">Important Note</div>
          <div className="t-callout-text">
            Four states require Inner Line Permits (ILP) for Indian citizens: Arunachal Pradesh, Nagaland, Manipur, and Mizoram.
            Foreigners need Restricted Area Permits (RAP) for most of Northeast India. Apply well in advance.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="t-skeleton" style={{ height: 200, borderRadius: 'var(--radius-xl)' }} />
            ))
          ) : permitGuides.length === 0 ? (
            <div className="t-empty">
              <div className="t-empty-icon"><Shield size={40} /></div>
              <div className="t-empty-title">No permit guides yet</div>
              <div className="t-empty-desc">Permit information will be added soon.</div>
            </div>
          ) : (
            permitGuides.map((p, i) => (
              <div key={i} className="t-permit-card">
                <div className="t-permit-card-header">
                  <div>
                    <span className="badge badge-primary">{p.state}</span>
                    <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginTop: '0.5rem' }}>
                      {p.permit_type}
                    </h3>
                  </div>
                  <Shield size={24} style={{ color: 'var(--color-primary)', opacity: 0.4 }} />
                </div>

                <div className="t-permit-card-grid">
                  <div>
                    <div className="t-permit-label">Who needs it?</div>
                    <div className="t-permit-value">{p.who_needs_it}</div>
                  </div>
                  <div>
                    <div className="t-permit-label">How to apply</div>
                    <div className="t-permit-value">{p.how_to_apply}</div>
                  </div>
                  <div>
                    <div className="t-permit-label">Documents required</div>
                    <div className="t-permit-value">
                      <ul>
                        {(p.documents_required || []).map((d: string, j: number) => (
                          <li key={j}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <div className="t-permit-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} /> Processing time
                    </div>
                    <div className="t-permit-value">{p.processing_time}</div>
                    <div className="t-permit-label" style={{ marginTop: '0.75rem' }}>Foreign nationals</div>
                    <div className="t-permit-value">RAP required — apply via MHA or state tourism board.</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ maxWidth: 600, margin: '3rem auto 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '1rem' }}>Track Your Permit Status</h2>
          <div className="t-info-card" style={{ padding: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Application Reference Number</label>
              <input type="text" className="form-input" placeholder="Enter your permit application ref..." />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>Check Status</button>
          </div>
        </div>
      </div>
    </>
  )
}
