'use client'

import { useState, useEffect } from 'react'
import { UserCircle, Ban, Search, Loader2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    try {
      const res = await apiFetch('/api/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      setUsers(data)
    } catch (err: any) {
      console.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    try {
      const res = await apiFetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })
      if (!res.ok) throw new Error('Failed to update role')
      fetchUsers()
    } catch (err: any) {
      alert(err.message)
    }
  }

  let filtered = users
  if (search) filtered = filtered.filter(u => (u.name?.toLowerCase().includes(search.toLowerCase())) || (u.email?.toLowerCase().includes(search.toLowerCase())) || (u.phone?.includes(search)))
  if (roleFilter !== 'all') filtered = filtered.filter(u => u.role === roleFilter)

  const roles = [
    { value: 'tourist', label: 'Tourist' },
    { value: 'homestay_owner', label: 'Homestay Owner' },
    { value: 'host', label: 'Host' },
    { value: 'content_manager', label: 'Content Manager' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'admin', label: 'Admin' },
  ]

  const getRoleBadgeStyle = (role: string) => {
    const styles: Record<string, { bg: string; color: string; border: string }> = {
      admin: { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
      moderator: { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
      host: { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
      homestay_owner: { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
      content_manager: { bg: '#eef2ff', color: '#4338ca', border: '#c7d2fe' },
      tourist: { bg: '#f3f4f6', color: '#6b7280', border: '#e5e7eb' },
    }
    return styles[role] || styles.tourist
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <Loader2 className="animate-spin" size={24} style={{ color: 'var(--admin-primary)' }} />
    </div>
  )

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-text-main)', letterSpacing: '-0.025em' }}>Users</h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', marginTop: 2 }}>{users.length} registered users on the platform</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-placeholder)' }} />
          <input type="text" className="admin-input" placeholder="Search by name, email, or phone..." style={{ paddingLeft: '2rem' }} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="admin-input admin-select" style={{ width: 180 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          {roles.map(r => <option key={r.value} value={r.value}>{r.label}s</option>)}
        </select>
      </div>

      <div className="admin-card-modern">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--admin-border-standard)', background: '#fafafa' }}>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Joined</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const badgeStyle = getRoleBadgeStyle(u.role)
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--admin-border-subtle)' }}>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', flexShrink: 0 }}>
                          <UserCircle size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--admin-text-main)', fontSize: '0.8125rem' }}>{u.name || 'Anonymous User'}</div>
                          <div style={{ fontSize: '10px', color: '#9ca3af', fontFamily: 'monospace' }}>...{u.id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem', color: 'var(--admin-text-subtle)', fontSize: '0.8125rem' }}>{u.email || u.phone || '-'}</td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: badgeStyle.bg,
                        color: badgeStyle.color,
                        border: `1px solid ${badgeStyle.border}`,
                      }}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem', color: 'var(--admin-text-subtle)', fontSize: '0.75rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <select 
                          defaultValue={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="admin-input admin-select"
                          style={{ width: 140 }}
                        >
                          {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                        <button className="admin-btn admin-btn-secondary" style={{ color: '#dc2626', padding: '0 0.5rem' }}>
                          <Ban size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-subtle)', fontSize: '0.8125rem', fontStyle: 'italic' }}>
              <Search size={24} style={{ color: '#d1d5db', margin: '0 auto 0.75rem' }} />
              No matching users found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
