'use server'

import { cookies } from 'next/headers'
import type { UserRole, User } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get('ne_auth_token')?.value
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
    cookieStore.set({ name: 'ne_auth_token', value: data.token, path: '/', maxAge: 604800, secure: process.env.NODE_ENV === 'production' })

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
    cookieStore.set({ name: 'ne_auth_token', value: data.token, path: '/', maxAge: 604800, secure: process.env.NODE_ENV === 'production' })

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
    const data = await res.json()
    return data.success ? data.user : null
  } catch (err) {
    return null
  }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('ne_auth_token')
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
