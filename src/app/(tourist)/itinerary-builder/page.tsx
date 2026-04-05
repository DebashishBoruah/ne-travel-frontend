'use client'

import { useState } from 'react'
import { Sparkles, Send, MapPin, Calendar, Wallet } from 'lucide-react'
import Link from 'next/link'

export default function ItineraryBuilderPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Demo response (in production, calls /api/itinerary which uses Claude API)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate itinerary');

      const data = await response.json();
      setItinerary(data.itinerary);
    } catch (error) {
      console.error(error);
      alert('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container section">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span className="badge badge-accent" style={{ marginBottom: '1rem' }}>
          <Sparkles size={14} /> AI-Powered
        </span>
        <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: '0.75rem' }}>AI Trip Planner</h1>
        <p style={{ color: 'var(--color-text-light)', maxWidth: 600, margin: '0 auto' }}>
          Tell us about your dream Northeast India trip and our AI will create a personalized day-by-day itinerary for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: '0 auto 2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <textarea
            className="form-input form-textarea"
            rows={4}
            placeholder="Example: I want to visit Northeast India for 7 days in December. I love nature, tribal culture, and festivals. My budget is ₹30,000."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ marginBottom: '1rem' }}
          />
          <button type="submit" className="btn btn-accent btn-lg w-full" disabled={!prompt.trim() || loading}>
            {loading ? <><div className="spinner" style={{ width: 20, height: 20 }} /> Generating...</> : <><Sparkles size={18} /> Generate My Itinerary</>}
          </button>
        </div>
      </form>

      {itinerary && (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--color-forest-50), var(--color-saffron-50))' }}>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.5rem' }}>{itinerary.title}</h2>
            <p style={{ color: 'var(--color-text-light)' }}>{itinerary.summary}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
              <span><Calendar size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> {itinerary.days.length} days</span>
              <span><Wallet size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> ~₹{itinerary.totalCost.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {itinerary.days.map((day: any) => (
            <div key={day.day} className="card" style={{ marginBottom: '0.75rem' }}>
              <div className="card-body" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                  D{day.day}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex justify-between items-center">
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700 }}>
                      <MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {day.location}
                    </h3>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>~₹{day.cost.toLocaleString('en-IN')}</span>
                  </div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginTop: '0.25rem', lineHeight: 1.6 }}>{day.activities}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="card" style={{ padding: '1.5rem', marginTop: '1rem', background: 'var(--color-saffron-50)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: '0.75rem' }}>💡 Travel Tips</h3>
            <ul style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', paddingLeft: '1.25rem' }}>
              {itinerary.tips.map((tip: string, i: number) => <li key={i} style={{ marginBottom: '0.25rem' }}>{tip}</li>)}
            </ul>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/packages" className="btn btn-primary btn-lg">Find Packages for This Trip</Link>
          </div>
        </div>
      )}
    </div>
  )
}
