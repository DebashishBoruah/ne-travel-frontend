'use server'

import { cookies } from 'next/headers'
import type { UserRole, User } from '@/types'
import { normalizeAuthUser, pickUserFromMeResponse } from '@/features/auth/normalizeUser'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

const AUTH_MAX_AGE = 604800

/** Readable by client JS so `apiFetch` can attach Bearer; must stay non-httpOnly until API uses cookie credentials. */
const neAuthCookieOptions = {
  path: '/' as const,
  maxAge: AUTH_MAX_AGE,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  httpOnly: false,
}

const mockAuthCookieOptions = {
  path: '/' as const,
  maxAge: AUTH_MAX_AGE,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
}

async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get('ne_auth_token')?.value
}

/**
 * Call from client login pages after the API returns a JWT so the session survives hard refresh
 * (Set-Cookie on the action response, not only `document.cookie`).
 */
export async function persistAuthSessionFromClient(token: string) {
  const cookieStore = await cookies()
  cookieStore.set({ name: 'ne_auth_token', value: token, ...neAuthCookieOptions })
  cookieStore.set({ name: 'mock-auth', value: 'true', ...mockAuthCookieOptions })
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    
    const data = await res.json()
    if (!data.success) {
      return { error: data.error || 'Login failed' }
    }

    const cookieStore = await cookies()
    cookieStore.set({ name: 'ne_auth_token', value: data.token, ...neAuthCookieOptions })
    cookieStore.set({ name: 'mock-auth', value: 'true', ...mockAuthCookieOptions })

    return { success: true, user: data.user }
  } catch (err: any) {
    return { error: err.message || 'An error occurred' }
  }
}

export async function signUpWithEmail(email: string, password: string, name: string, role: UserRole) {
  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    })
    
    const data = await res.json()
    if (!data.success) {
      return { error: data.error || 'Signup failed' }
    }

    const cookieStore = await cookies()
    cookieStore.set({ name: 'ne_auth_token', value: data.token, ...neAuthCookieOptions })
    cookieStore.set({ name: 'mock-auth', value: 'true', ...mockAuthCookieOptions })

    return { success: true, user: data.user }
  } catch (err: any) {
    return { error: err.message || 'An error occurred' }
  }
}

export async function sendOTP(phone: string) {
  return { error: 'OTP login is currently disabled on the custom backend.' }
}

export async function verifyOTP(phone: string, token: string) {
  return { error: 'OTP login is currently disabled on the custom backend.' }
}

export async function setUserRole(userId: string, role: UserRole, name: string, email?: string) {
  return { error: 'setUserRole disabled on custom backend temporarily' }
}

export async function getCurrentUser(): Promise<User | null> {
  const token = await getAuthToken()
  if (!token) return null

  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    })
    
    if (!res.ok) return null
    const data = await res.json() as Record<string, unknown>
    if (data.success === false) return null
    const raw = pickUserFromMeResponse(data)
    if (!raw) return null
    return normalizeAuthUser(raw, token)
  } catch (err) {
    return null
  }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('ne_auth_token')
  cookieStore.delete('mock-auth')
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<User, 'name' | 'bio' | 'avatar_url' | 'bank_details'>>
) {
  const token = await getAuthToken()
  if (!token) return { error: 'Not authenticated' }
  
  try {
    const res = await fetch(`${API_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    })
    
    const data = await res.json()
    if (!data.success) return { error: data.error || 'Update failed' }
    return { success: true, user: data.user }
  } catch (err: any) {
    return { error: err.message || 'An error occurred' }
  }
}
