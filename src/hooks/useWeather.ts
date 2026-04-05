'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { APP_CONFIG } from '@/constants/config'

interface WeatherData {
  location: string
  temp: number
  description: string
  humidity: number
  icon: string
}

/**
 * Fetches current weather for a given coordinate.
 * Defaults to Guwahati, Assam when no coordinates are provided.
 */
export function useWeather(
  lat: number = APP_CONFIG.DEFAULT_MAP_CENTER.lat,
  lon: number = APP_CONFIG.DEFAULT_MAP_CENTER.lng
) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    apiFetch(`/api/weather?lat=${lat}&lon=${lon}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return
        if (json.success) {
          setWeather(json.data)
        } else {
          setError(json.error ?? 'Failed to load weather')
        }
      })
      .catch(() => {
        if (!cancelled) setError('Unable to fetch weather data')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [lat, lon])

  return { weather, loading, error }
}
