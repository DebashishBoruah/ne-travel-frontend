'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function CalendarPage() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set(['2024-12-20','2024-12-21','2024-12-22','2024-12-25','2024-12-26']))
  const [bookedDates] = useState<Set<string>>(new Set(['2024-12-15','2024-12-16','2024-12-17','2024-12-18']))

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1) }
    else setCurrentMonth(currentMonth - 1)
  }

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1) }
    else setCurrentMonth(currentMonth + 1)
  }

  const toggleBlock = (dateStr: string) => {
    if (bookedDates.has(dateStr)) return
    setBlockedDates(prev => {
      const next = new Set(prev)
      if (next.has(dateStr)) next.delete(dateStr)
      else next.add(dateStr)
      return next
    })
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.5rem' }}>Manage Calendar</h1>
      <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--font-size-sm)', marginBottom: '2rem' }}>
        Block or open dates. Booked dates (red) cannot be changed.
      </p>

      <div className="flex gap-4 mb-6" style={{ fontSize: 'var(--font-size-sm)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--color-forest-100)', border: '1px solid var(--color-border)' }}></span> Available</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 16, height: 16, borderRadius: 4, background: '#fee2e2' }}></span> Booked (locked)</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--color-slate-300)' }}></span> Manually Blocked</span>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="btn btn-ghost btn-sm"><ChevronLeft size={18} /></button>
          <h3 style={{ fontSize: 'var(--font-size-lg)' }}>{monthNames[currentMonth]} {currentYear}</h3>
          <button onClick={nextMonth} className="btn btn-ghost btn-sm"><ChevronRight size={18} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center' }}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} style={{ padding: '0.5rem', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-light)' }}>{d}</div>
          ))}

          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isBooked = bookedDates.has(dateStr)
            const isBlocked = blockedDates.has(dateStr)

            let bg = 'var(--color-forest-50)'
            let color = 'var(--color-text)'
            if (isBooked) { bg = '#fee2e2'; color = '#991b1b' }
            else if (isBlocked) { bg = 'var(--color-slate-200)'; color = 'var(--color-slate-500)' }

            return (
              <button
                key={day}
                onClick={() => toggleBlock(dateStr)}
                disabled={isBooked}
                style={{
                  padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-md)',
                  background: bg, color, fontWeight: 500, fontSize: 'var(--font-size-sm)',
                  border: 'none', cursor: isBooked ? 'not-allowed' : 'pointer',
                  position: 'relative', transition: 'all 0.15s ease',
                }}
              >
                {day}
                {isBooked && <Lock size={10} style={{ position: 'absolute', top: 4, right: 4, opacity: 0.5 }} />}
              </button>
            )
          })}
        </div>
      </div>

      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)', marginTop: '1rem', textAlign: 'center' }}>
        Click any date to block/unblock it. Changes save instantly.
      </p>
    </div>
  )
}
