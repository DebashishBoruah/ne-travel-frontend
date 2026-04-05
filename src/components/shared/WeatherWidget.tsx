'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Cloud, Sun, CloudRain } from 'lucide-react'

interface WeatherData {
  location: string
  temp: number
  description: string
  humidity: number
  icon: string
}

export function WeatherWidget({ lat = '25.5', lon = '91.8' }: { lat?: string, lon?: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await apiFetch(`/api/weather?lat=${lat}&lon=${lon}`)
        if (res.ok) {
          const data = await res.json()
          setWeather(data)
        }
      } catch (e) {
        console.error('Failed to load weather:', e)
      } finally {
        setLoading(false)
      }
    }
    loadWeather()
  }, [lat, lon])

  if (loading) return <div className="weather-placeholder animate-pulse">Loading weather...</div>
  if (!weather) return <div className="weather-placeholder">Weather unavailable</div>

  return (
    <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--color-sky-50), var(--color-sky-100))', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>
        {weather.icon.includes('d') ? <Sun size={48} /> : weather.icon.includes('r') ? <CloudRain size={48} /> : <Cloud size={48} />}
      </div>
      <div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text)' }}>{weather.temp}°C</div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', textTransform: 'capitalize' }}>{weather.description}</div>
      </div>
      <div style={{ marginLeft: 'auto', textAlign: 'right', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>
        <p>Humidity: {weather.humidity}%</p>
        <p style={{ fontWeight: 600 }}>{weather.location}</p>
      </div>
    </div>
  )
}
