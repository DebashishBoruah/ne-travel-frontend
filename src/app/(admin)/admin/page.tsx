'use client'

import { useState, useEffect } from 'react'
import { 
  Copy, 
  Check, 
  Database, 
  Shield, 
  GitBranch, 
  Zap,
  Globe,
  ChevronDown,
  Code,
  Key,
  HardDrive,
  Terminal
} from 'lucide-react'

export default function AdminOverviewPage() {
  const [copied, setCopied] = useState(false)
  const apiUrl = 'https://sdmjihbhikeibnygstrb.supabase.co'

  const handleCopy = () => {
    navigator.clipboard.writeText(apiUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 960 }}>
      {/* Hero Section */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--admin-text-main)', 
            letterSpacing: '-0.025em',
            fontFamily: "'Inter', sans-serif"
          }}>
            NorthEastTravel
          </h1>
          <span className="admin-badge admin-badge-nano" style={{ fontSize: '10px', padding: '2px 8px' }}>
            NANO
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <code style={{ 
            fontSize: '0.8125rem', 
            color: 'var(--admin-text-subtle)', 
            fontFamily: 'monospace' 
          }}>
            {apiUrl}
          </code>
          <button 
            onClick={handleCopy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              height: 28,
              padding: '0 0.625rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--admin-border-standard)',
              background: '#fff',
              color: 'var(--admin-text-subtle)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {copied ? <Check size={12} style={{ color: '#3ecf8e' }} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: '0.375rem',
              border: '1px solid var(--admin-border-standard)',
              background: '#fff',
              color: 'var(--admin-text-subtle)',
              cursor: 'pointer',
            }}
          >
            <ChevronDown size={12} />
          </button>
        </div>
      </div>

      {/* Stats Grid - 2 columns layout like Supabase */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1rem',
        marginBottom: '2rem' 
      }}>
        {/* Last Migration */}
        <div style={{
          border: '1px dashed var(--admin-border-standard)',
          borderRadius: '0.5rem',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '0.5rem',
            border: '1px solid var(--admin-border-standard)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
          }}>
            <Database size={18} />
          </div>
          <div>
            <div style={{ 
              fontSize: '10px', 
              fontWeight: 700, 
              color: '#9ca3af', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: 2 
            }}>
              Last Migration
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', fontStyle: 'italic' }}>
              No migrations
            </div>
          </div>
        </div>

        {/* Recent Branch */}
        <div style={{
          border: '1px dashed var(--admin-border-standard)',
          borderRadius: '0.5rem',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '0.5rem',
            border: '1px solid var(--admin-border-standard)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
          }}>
            <GitBranch size={18} />
          </div>
          <div>
            <div style={{ 
              fontSize: '10px', 
              fontWeight: 700, 
              color: '#9ca3af', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 2 
            }}>
              Recent Branch
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', fontStyle: 'italic' }}>
              No branches
            </div>
          </div>
        </div>

        {/* Backup */}
        <div style={{
          border: '1px dashed var(--admin-border-standard)',
          borderRadius: '0.5rem',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '0.5rem',
            border: '1px solid var(--admin-border-standard)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
          }}>
            <HardDrive size={18} />
          </div>
          <div>
            <div style={{ 
              fontSize: '10px', 
              fontWeight: 700, 
              color: '#9ca3af', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 2 
            }}>
              Backup
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', fontStyle: 'italic' }}>
              No backups
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Visualization */}
      <div style={{
        border: '1px solid var(--admin-border-standard)',
        borderRadius: '0.5rem',
        background: '#fff',
        position: 'relative',
        overflow: 'hidden',
        height: 400,
      }}>
        {/* Dot pattern background */}
        <div 
          style={{ 
            position: 'absolute',
            inset: 0,
            opacity: 0.03,
            backgroundImage: 'radial-gradient(#111 0.5px, transparent 0.5px)', 
            backgroundSize: '24px 24px' 
          }} 
        />
        
        {/* Centered database card */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ position: 'relative' }}>
            {/* The database card */}
            <div style={{
              width: 300,
              background: '#fff',
              border: '1px solid var(--admin-border-standard)',
              borderRadius: '0.5rem',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              zIndex: 10,
              position: 'relative',
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '0.5rem',
                background: '#3ecf8e',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Database size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>Primary Database</span>
                  {/* Singapore flag */}
                  <div style={{
                    width: 20,
                    height: 13,
                    borderRadius: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #eee',
                  }}>
                    <div style={{ flex: 1, background: '#e41e26' }} />
                    <div style={{ flex: 1, background: '#fff' }} />
                  </div>
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--admin-text-subtle)' }}>Southeast Asia (Singapore)</div>
                <div style={{ fontSize: '0.625rem', color: '#9ca3af', fontFamily: 'monospace', marginTop: 4 }}>ap-southeast-1 · t4g.nano</div>
              </div>
            </div>
            
            {/* Pulse ring */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '130%',
              height: '200%',
              transform: 'translate(-50%, -50%)',
              border: '1px solid rgba(62, 207, 142, 0.08)',
              borderRadius: '9999px',
              zIndex: 0,
            }} />
          </div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '9px',
          color: '#9ca3af',
          fontFamily: 'monospace',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          Infrastructure Managed by NE Travel Platform
        </div>
      </div>

      {/* Footer Quick Links */}
      <div style={{
        marginTop: '2.5rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--admin-border-standard)',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '2rem',
      }}>
        <FooterLink icon={<Zap size={14} />} label="Framework" value="Next.js" />
        <FooterLink icon={<Terminal size={14} />} label="Direct" value="PostgreSQL" />
        <FooterLink icon={<Code size={14} />} label="ORM" value="Prisma" />
        <FooterLink icon={<Globe size={14} />} label="MCP" value="Mumbai, IN" />
        <FooterLink icon={<Key size={14} />} label="API Keys" value="Configured" />
      </div>
    </div>
  )
}

function FooterLink({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ 
        fontSize: '10px', 
        fontWeight: 700, 
        color: '#9ca3af', 
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.375rem', 
        fontSize: '0.75rem', 
        color: 'var(--admin-text-subtle)',
        fontStyle: 'italic',
      }}>
        {icon} {value}
      </div>
    </div>
  )
}
