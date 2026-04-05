'use client'

import { useState, Suspense } from 'react'
import { Mail, Lock, ArrowRight, Shield, User as UserIcon, AlertCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import { persistAuthSessionFromClient } from '@/features/auth/actions'
import type { UserRole } from '@/types'

function AdminLoginContent() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const role: UserRole = 'admin'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const payload = mode === 'login'
        ? { email, password }
        : { email, password, name, role }

      const res = await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Authentication failed')
        setLoading(false)
        return
      }

      document.cookie = `ne_auth_token=${encodeURIComponent(data.token)}; path=/; max-age=604800; samesite=lax`
      await persistAuthSessionFromClient(data.token)
      window.location.href = redirect
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="admin-auth-page">
      {/* Left brand panel — visible on wider screens */}
      <div className="admin-auth-brand-panel">
        <div className="admin-auth-brand-logo">
          <div className="admin-auth-brand-logo-icon">
            <Shield size={16} strokeWidth={2.5} />
          </div>
          <span className="admin-auth-brand-logo-text">NorthEastTravel</span>
        </div>
        <h2 className="admin-auth-brand-heading">
          Manage destinations, festivals &amp; travel experiences across Northeast India.
        </h2>
        <p className="admin-auth-brand-sub">
          The admin portal gives you full control over content, bookings, users, and platform settings.
        </p>
      </div>

      {/* Right form panel */}
      <div className="admin-auth-form-panel">
        <div className="admin-auth-form-card">
          <div className="admin-auth-form-header">
            <h1 className="admin-auth-form-title">
              {mode === 'login' ? 'Sign in to Admin' : 'Create Admin Account'}
            </h1>
            <p className="admin-auth-form-subtitle">
              {mode === 'login'
                ? 'Enter your credentials to continue'
                : 'Set up a new administrator account'}
            </p>
          </div>

          {error && (
            <div className="admin-auth-error">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="admin-auth-field">
                <label className="admin-auth-field-label">Full Name</label>
                <div className="admin-auth-input-wrap">
                  <span className="admin-auth-input-icon"><UserIcon size={16} /></span>
                  <input
                    className="admin-auth-input"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="admin-auth-field">
              <label className="admin-auth-field-label">Email</label>
              <div className="admin-auth-input-wrap">
                <span className="admin-auth-input-icon"><Mail size={16} /></span>
                <input
                  className="admin-auth-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="admin-auth-field">
              <label className="admin-auth-field-label">Password</label>
              <div className="admin-auth-input-wrap">
                <span className="admin-auth-input-icon"><Lock size={16} /></span>
                <input
                  className="admin-auth-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>
            </div>

            <button className="admin-auth-submit" type="submit" disabled={loading}>
              {loading
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={15} />
                  </>
                )}
            </button>
          </form>

          <div className="admin-auth-toggle">
            {mode === 'login' ? "Don\u2019t have an account? " : 'Already have an account? '}
            <button
              type="button"
              className="admin-auth-toggle-btn"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="admin-auth-page">
        <div className="admin-auth-form-panel">
          <div style={{ color: 'var(--admin-text-subtle)', fontSize: '0.8125rem' }}>Loading...</div>
        </div>
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  )
}
