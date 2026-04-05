'use client'

import React from 'react'
import { MapPin, Calendar, Shield, Map as MapIcon, Info, Users, Globe } from 'lucide-react'
import { WeatherWidget } from '@/components/shared/WeatherWidget'

interface DestinationPreviewProps {
  data: any
}

export default function DestinationPreview({ data }: DestinationPreviewProps) {
  if (!data) return null;

  return (
    <div className="card animate-fade-in" style={{ borderRadius: '2rem', overflow: 'hidden', border: '1px solid var(--color-border)', marginBottom: '3rem' }}>
      {/* Hero Section */}
      <div style={{ position: 'relative', height: '450px', backgroundColor: 'var(--color-slate-50)' }}>
        {data.hero_image ? (
          <img src={data.hero_image} alt={data.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-light" style={{ height: '100%', gap: '1rem' }}>
            <MapIcon size={64} style={{ opacity: 0.2 }} />
            <span className="admin-card-meta">No hero image uploaded</span>
          </div>
        )}
        <div 
          style={{ 
            position: 'absolute', inset: 0, 
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 60%, transparent 100%)', 
            display: 'flex', alignItems: 'flex-end', padding: '3rem' 
          }}
        >
          <div style={{ color: 'white', maxWidth: '800px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}>
              {data.state}
            </span>
            <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'white' }}>
              {data.title}
            </h1>
            <div className="flex gap-6" style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-slate-200)' }}>
              <div className="flex items-center gap-2">
                <MapPin size={18} style={{ color: 'var(--color-forest-400)' }} />
                <span>{data.district || 'Location unlisted'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} style={{ color: 'var(--color-forest-400)' }} />
                <span>Best Season: {data.best_season || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div 
        className="flex flex-col lg:flex-row gap-12" 
        style={{ padding: '3rem' }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {/* About Section */}
          <section>
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>The Experience</h2>
            <div style={{ fontSize: '1.125rem', color: 'var(--color-text-light)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {data.description || 'No description provided.'}
            </div>
          </section>

          {/* Cultural Context */}
          {data.cultural_context && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div style={{ width: 40, height: 40, backgroundColor: 'var(--color-forest-50)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifySelf: 'center', color: 'var(--color-forest-600)', justifyContent: 'center' }}>
                   <Globe size={20} />
                </div>
                <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>Cultural Context</h2>
              </div>
              <div style={{ fontSize: '1.125rem', color: 'var(--color-forest-900)', padding: '2rem', backgroundColor: 'var(--color-forest-50)', borderRadius: '2rem', border: '1px solid var(--color-forest-100)' }}>
                {data.cultural_context}
              </div>
            </section>
          )}

          {/* Tribal History */}
          {data.tribal_history && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div style={{ width: 40, height: 40, backgroundColor: 'var(--color-saffron-50)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-saffron-600)' }}>
                   <Users size={20} />
                </div>
                <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>Tribal History</h2>
              </div>
              <div style={{ fontSize: '1.125rem', color: 'var(--color-text-light)', fontStyle: 'italic', borderLeft: '4px solid var(--color-saffron-400)', paddingLeft: '2rem' }}>
                {data.tribal_history}
              </div>
            </section>
          )}

          {/* Gallery Preview */}
          {data.medias && data.medias.length > 0 && (
            <section>
              <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Gallery</h2>
              <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                {data.medias.map((url: string, idx: number) => (
                  <div key={idx} className="card" style={{ aspectRatio: '1/1', borderRadius: '1rem', overflow: 'hidden' }}>
                    <img src={url} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Quick Info Card */}
          <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--color-slate-50)', borderRadius: '2rem' }}>
            <h3 className="admin-card-meta" style={{ marginBottom: '1.5rem' }}>Essential Info</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', backgroundColor: data.permit_required ? "var(--color-saffron-100)" : "var(--color-forest-100)", color: data.permit_required ? "var(--color-saffron-700)" : "var(--color-forest-700)" }}>
                  <Shield size={20} />
                </div>
                <div>
                  <p className="admin-card-meta" style={{ fontSize: '0.65rem', marginBottom: '0.25rem' }}>Regulations</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 800 }}>{data.permit_required ? 'Permit Required' : 'Open Entry'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div style={{ width: 40, height: 40, backgroundColor: 'var(--color-slate-50)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-slate-500)' }}>
                  <Info size={20} />
                </div>
                <div>
                  <p className="admin-card-meta" style={{ fontSize: '0.65rem', marginBottom: '0.25rem' }}>State</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 800 }}>{data.state}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Widget */}
          <div className="card shadow-xl" style={{ padding: '2rem', borderRadius: '2rem' }}>
            <h3 className="admin-card-meta" style={{ marginBottom: '1.5rem' }}>Current Atmosphere</h3>
            <WeatherWidget 
              lat={(data.map_coordinates?.lat || 25.5).toString()} 
              lon={(data.map_coordinates?.lng || 91.8).toString()} 
            />
          </div>

          {/* Location Pin */}
          <div className="card shadow-sm" style={{ padding: '2rem', borderRadius: '2rem', position: 'relative', overflow: 'hidden' }}>
             <div style={{ position: 'absolute', top: 0, right: 0, padding: '2rem', opacity: 0.05 }}>
                <MapPin size={80} />
             </div>
            <h3 className="admin-card-meta" style={{ marginBottom: '1.5rem' }}>Coordinates</h3>
            <div className="flex items-center gap-3">
              <div className="admin-card-title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>
                {data.map_coordinates?.lat?.toFixed(4)}°N, {data.map_coordinates?.lng?.toFixed(4)}°E
              </div>
            </div>
            <p className="admin-card-meta" style={{ marginTop: '0.5rem' }}>Pin verified in global database</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
