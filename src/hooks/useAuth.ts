'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@/types'
import { normalizeAuthUser, pickUserFromMeResponse } from '@/features/auth/normalizeUser'

function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )ne_auth_token=([^;]*)/)
  if (!match?.[1]) return null
  try {
    return decodeURIComponent(match[1])
  } catch {
    return match[1]
  }
}

/**
 * Client-side hook that checks the custom-backend JWT (`ne_auth_token` cookie)
 * and fetches the current user profile from the API.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    const token = getTokenFromCookie()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      })

      if (!res.ok) {
        setUser(null)
        setLoading(false)
        return
      }

      const data = await res.json() as Record<string, unknown>
      if (data.success === false) {
        setUser(null)
        setLoading(false)
        return
      }
      const raw = pickUserFromMeResponse(data)
      if (!raw) {
        setUser(null)
        setLoading(false)
        return
      }
      setUser(normalizeAuthUser(raw, token))
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return { user, loading, isAuthenticated: !!user, refetch: fetchUser }
}
