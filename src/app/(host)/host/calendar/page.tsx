'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_HEADERS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function CalendarPage() {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [blocked, setBlocked] = useState<Set<string>>(new Set(['2024-12-20','2024-12-21','2024-12-22','2024-12-25','2024-12-26']))
  const [booked] = useState<Set<string>>(new Set(['2024-12-15','2024-12-16','2024-12-17','2024-12-18']))

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prev = () => { if (month === 0) { setMonth(11); setYear(year - 1) } else setMonth(month - 1) }
  const next = () => { if (month === 11) { setMonth(0); setYear(year + 1) } else setMonth(month + 1) }

  const toggle = (d: string) => {
    if (booked.has(d)) return
    setBlocked((p) => { const n = new Set(p); n.has(d) ? n.delete(d) : n.add(d); return n })
  }

  return (
    <div style={{ maxWidth: 640 }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-text-main)', letterSpacing: '-0.025em' }}>
          Availability Calendar
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', marginTop: 2 }}>
          Click a date to block or unblock it. Booked dates are locked.
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem', fontSize: '0.75rem', color: 'var(--admin-text-subtle)' }}>
        <LegendDot color="#ecfdf5" border label="Available" />
        <LegendDot color="#fee2e2" label="Booked" />
        <LegendDot color="#e5e7eb" label="Blocked" />
        <LegendDot color="#eef2ff" border borderColor="#6366f1" label="Today" />
      </div>

      {/* Calendar card */}
      <div style={{
        background: '#fff',
        border: '1px solid var(--admin-border-standard)',
        borderRadius: '0.5rem',
        overflow: 'hidden',
      }}>
        {/* Month nav */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1.25rem',
          borderBottom: '1px solid var(--admin-border-subtle)',
        }}>
          <button className="admin-topnav-icon-btn" onClick={prev} aria-label="Previous month">
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>
            {MONTH_NAMES[month]} {year}
          </span>
          <button className="admin-topnav-icon-btn" onClick={next} aria-label="Next month">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Grid */}
        <div style={{ padding: '0.75rem 1rem 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center' }}>
            {/* Day headers */}
            {DAY_HEADERS.map((d) => (
              <div key={d} style={{
                padding: '0.375rem 0',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--admin-text-placeholder)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}>
                {d}
              </div>
            ))}

            {/* Empty cells */}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isBooked = booked.has(dateStr)
              const isBlocked = blocked.has(dateStr)
              const isToday = dateStr === todayStr

              let bg = '#f0fdf4'
              let color = 'var(--admin-text-main)'
              let border = '1px solid transparent'
              if (isBooked)       { bg = '#fee2e2'; color = '#991b1b' }
              else if (isBlocked) { bg = '#e5e7eb'; color = '#6b7280' }
              if (isToday)        { border = '2px solid #6366f1' }

              return (
                <button
                  key={day}
                  onClick={() => toggle(dateStr)}
                  disabled={isBooked}
                  style={{
                    position: 'relative',
                    padding: '0.5rem 0',
                    borderRadius: 'var(--admin-radius)',
                    background: bg,
                    color,
                    fontWeight: isToday ? 700 : 500,
                    fontSize: '0.8125rem',
                    border,
                    cursor: isBooked ? 'not-allowed' : 'pointer',
                    transition: 'background 0.12s, transform 0.1s',
                    opacity: isBooked ? 0.8 : 1,
                  }}
                  onMouseEnter={(e) => { if (!isBooked) e.currentTarget.style.transform = 'scale(1.08)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                >
                  {day}
                  {isBooked && (
                    <Lock size={8} style={{ position: 'absolute', top: 3, right: 3, opacity: 0.45 }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Hint */}
      <p style={{
        fontSize: '0.6875rem',
        color: 'var(--admin-text-placeholder)',
        textAlign: 'center',
        marginTop: '0.75rem',
      }}>
        Changes are saved automatically.
      </p>
    </div>
  )
}

function LegendDot({ color, label, border, borderColor }: { color: string; label: string; border?: boolean; borderColor?: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
      <span style={{
        width: 14, height: 14,
        borderRadius: 3,
        background: color,
        border: border ? `1.5px solid ${borderColor || 'var(--admin-border-standard)'}` : 'none',
        flexShrink: 0,
      }} />
      {label}
    </span>
  )
}
