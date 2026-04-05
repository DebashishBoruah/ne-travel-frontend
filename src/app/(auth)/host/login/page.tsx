'use client'

import { useState } from 'react'
import { Mail, Lock, ArrowRight, Shield, User as UserIcon, Info } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { apiFetch } from '@/lib/api'
import type { UserRole } from '@/types'

function HostLoginContent() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<UserRole>('homestay_owner')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/host/dashboard'

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
        body: JSON.stringify(payload)
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Authentication failed')
        setLoading(false)
        return
      }

      document.cookie = `ne_auth_token=${data.token}; path=/; max-age=604800`
      handleRedirect()

    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleRedirect = () => {
    document.cookie = "mock-auth=true; path=/; max-age=3600"
    window.location.href = redirect
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', background: 'white', borderRadius: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--color-primary)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)' }}>
            <Shield size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            {mode === 'login' ? 'Host Portal' : 'Join as a Host'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            {mode === 'login' ? 'Sign in to manage your properties' : 'Create an account to start hosting'}
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.5rem', color: '#b91c1c', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="text" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }} placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="email" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }} placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="password" className="form-input" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>I am a...</label>
              <select className="form-input" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }} value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                <option value="homestay_owner">🏠 Host (Property Owner)</option>
                <option value="operator">🗺️ Operator (Tour Creator)</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg w-full" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', height: '3.25rem', fontSize: '1rem', borderRadius: '0.75rem' }} disabled={loading}>
            {loading ? (mode === 'login' ? 'Authenticating...' : 'Creating Account...') : (
              <>
                {mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={20} />
              </>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button 
              type="button" 
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              style={{ fontSize: '0.875rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function HostLoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div className="spinner" />
      </div>
    }>
      <HostLoginContent />
    </Suspense>
  )
}
