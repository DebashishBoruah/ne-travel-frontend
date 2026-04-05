'use client'

import { useState } from 'react'
import { Sparkles, MapPin, Calendar, Wallet } from 'lucide-react'
import Link from 'next/link'

export default function ItineraryBuilderPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/itinerary`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        }
      )
      if (!response.ok) throw new Error('Failed to generate itinerary')
      const data = await response.json()
      setItinerary(data.itinerary)
    } catch (error) {
      console.error(error)
      alert('Failed to generate itinerary. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, var(--color-forest-800), var(--color-forest-950))' }}>
        <div className="container">
          <span className="badge badge-accent" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} /> AI-Powered
          </span>
          <h1 className="page-hero-title">AI Trip Planner</h1>
          <p className="page-hero-sub">
            Tell us about your dream Northeast India trip and our AI will create a personalized day-by-day itinerary.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '3rem' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: '-2rem auto 2rem' }}>
          <div className="t-info-card" style={{ padding: '1.5rem', boxShadow: 'var(--shadow-lg)' }}>
            <textarea
              className="form-input form-textarea"
              rows={4}
              placeholder="Example: I want to visit Northeast India for 7 days in December. I love nature, tribal culture, and festivals. My budget is ₹30,000."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />
            <button
              type="submit"
              className="btn btn-accent btn-lg"
              style={{ width: '100%' }}
              disabled={!prompt.trim() || loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 20, height: 20 }} /> Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Generate My Itinerary
                </>
              )}
            </button>
          </div>
        </form>

        {itinerary && (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div
              className="t-info-card"
              style={{
                padding: '2rem',
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, var(--color-forest-50), var(--color-saffron-50))',
              }}
            >
              <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.5rem' }}>{itinerary.title}</h2>
              <p style={{ color: 'var(--color-text-light)' }}>{itinerary.summary}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={16} /> {itinerary.days.length} days
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Wallet size={16} /> ~₹{itinerary.totalCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {itinerary.days.map((day: any) => (
              <div key={day.day} className="t-itin-day">
                <div className="t-itin-day-num">D{day.day}</div>
                <div className="t-itin-day-content">
                  <div className="t-itin-day-header">
                    <div className="t-itin-day-loc">
                      <MapPin size={14} /> {day.location}
                    </div>
                    <div className="t-itin-day-cost">~₹{day.cost.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="t-itin-day-desc">{day.activities}</div>
                </div>
              </div>
            ))}

            <div className="t-callout info" style={{ marginTop: '1.5rem' }}>
              <div className="t-callout-title">Travel Tips</div>
              <ul style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', paddingLeft: '1.25rem', margin: 0 }}>
                {itinerary.tips.map((tip: string, i: number) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>{tip}</li>
                ))}
              </ul>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link href="/packages" className="btn btn-primary btn-lg">
                Find Packages for This Trip
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
