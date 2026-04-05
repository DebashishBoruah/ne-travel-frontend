'use client'

import { FileText, MapPin, Calendar, CheckSquare, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AdminContentPage() {
  const contentTypes = [
    {
      title: 'Destinations',
      description: 'Manage destinations across NE India',
      icon: <MapPin size={18} />,
      iconColor: '#3ecf8e',
      iconBg: '#ecfdf5',
      link: '/admin/content/destinations',
      addLink: '/admin/content/destinations/new',
    },
    {
      title: 'Festivals',
      description: 'Manage cultural festivals and events',
      icon: <Calendar size={18} />,
      iconColor: '#f59e0b',
      iconBg: '#fffbeb',
      link: '/admin/content/festivals',
      addLink: '/admin/content/festivals/new',
    },
    {
      title: 'Articles',
      description: 'Blog posts and long-form cultural content',
      icon: <FileText size={18} />,
      iconColor: '#3b82f6',
      iconBg: '#eff6ff',
      link: '/admin/content/articles',
      addLink: '/admin/content/articles/new',
    },
    {
      title: 'Permit Guides',
      description: 'ILP and RAP process documentation',
      icon: <CheckSquare size={18} />,
      iconColor: '#8b5cf6',
      iconBg: '#f5f3ff',
      link: '/admin/content/permits',
      addLink: '/admin/content/permits/new',
    },
  ]

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-text-main)', letterSpacing: '-0.025em' }}>Content Management</h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', marginTop: 2 }}>
          Super Admin dashboard to manage platform content natively.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
        {contentTypes.map(ct => (
          <Link 
            key={ct.title} 
            href={ct.link}
            className="admin-card-modern"
            style={{ 
              padding: '1.25rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
          >
            <div style={{ 
              width: 36, height: 36, borderRadius: '0.375rem', 
              background: ct.iconBg, color: ct.iconColor, 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {ct.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--admin-text-main)', marginBottom: 2 }}>{ct.title}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-subtle)', lineHeight: 1.4 }}>{ct.description}</p>
            </div>
            <ArrowRight size={14} style={{ color: '#d1d5db', flexShrink: 0 }} />
          </Link>
        ))}
      </div>
    </div>
  )
}
