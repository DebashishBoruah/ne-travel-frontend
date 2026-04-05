'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Clock, User, Calendar, Users, Inbox } from 'lucide-react'

const bookings = [
  { id: '1', tourist: 'Rahul Sharma', phone: '+91 98765 43210', dates: '15-21 Dec 2024', guests: 2, amount: 50000, message: 'Looking forward to exploring Meghalaya! Any tips?', status: 'pending' as const },
  { id: '2', tourist: 'Priya Patel', phone: '+91 87654 32100', dates: '20-23 Dec 2024', guests: 4, amount: 18000, message: 'We are a family with two kids. Is the trail kid-friendly?', status: 'confirmed' as const },
  { id: '3', tourist: 'John Smith', phone: '+91 76543 21000', dates: '25-30 Dec 2024', guests: 3, amount: 75000, message: 'We would love to experience local cuisine and culture.', status: 'pending' as const },
  { id: '4', tourist: 'Ananya Das', phone: '+91 65432 10000', dates: '1-5 Jan 2025', guests: 2, amount: 30000, message: '', status: 'declined' as const },
  { id: '5', tourist: 'Mike Chen', phone: '+91 54321 09876', dates: '10-15 Jan 2025', guests: 6, amount: 90000, message: 'Group of friends, all adventure lovers!', status: 'confirmed' as const },
]

export default function BookingsPage() {
  const [filter, setFilter] = useState<string>('all')
  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div className="bookings-container animate-fade-in">
      <header className="page-header">
        <div className="header-text">
          <h1 className="page-title">Booking Inbox</h1>
          <p className="page-subtitle">Unified management for all travel requests and confirmations.</p>
        </div>
      </header>

      <nav className="filter-wrapper">
        <div className="filter-label">Filter by Status:</div>
        <div className="filter-nav">
          {['all', 'pending', 'confirmed', 'declined'].map(s => (
            <button 
              key={s} 
              onClick={() => setFilter(s)} 
              className={`filter-chip ${filter === s ? 'active' : ''}`}
            >
              <span className="chip-text">{s}</span>
              {s === 'pending' && <span className="chip-count">{bookings.filter(b => b.status === 'pending').length}</span>}
            </button>
          ))}
        </div>
      </nav>

      <div className="bookings-grid">
        {filtered.map((b, i) => (
          <div key={b.id} className="booking-premium-card" style={{"--delay": `${i * 0.05}s`} as any}>
            <div className="card-top">
              <div className="user-profile">
                <div className="avatar-box">{b.tourist.charAt(0)}</div>
                <div className="user-info">
                  <h3 className="user-full-name">{b.tourist}</h3>
                  <span className="user-contact">{b.phone}</span>
                </div>
              </div>
              <div className={`status-tag ${b.status}`}>
                <div className="status-dot" />
                {b.status}
              </div>
            </div>

            <div className="booking-info-strip">
              <div className="info-cell">
                <Calendar size={14} className="info-icon" />
                <div className="info-text">
                  <span className="info-label">Check-in / Out</span>
                  <span className="info-value">{b.dates}</span>
                </div>
              </div>
              <div className="info-cell">
                <Users size={14} className="info-icon" />
                <div className="info-text">
                  <span className="info-label">Occupancy</span>
                  <span className="info-value">{b.guests} Guests</span>
                </div>
              </div>
              <div className="info-cell price-total">
                <div className="info-text">
                  <span className="info-label">Total Revenue</span>
                  <span className="info-value primary">₹{b.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {b.message && (
              <div className="message-wrapper">
                <div className="message-quote">“</div>
                <p className="message-body">{b.message}</p>
              </div>
            )}

            <div className="card-footer">
              <div className="footer-meta">
                <Clock size={12} />
                <span>Expires in 12 hours</span>
              </div>
              {b.status === 'pending' && (
                <div className="action-group">
                  <button className="btn-action confirm"><CheckCircle size={16} /> Confirm</button>
                  <button className="btn-action reject"><XCircle size={16} /> Decline</button>
                </div>
              )}
              {b.status !== 'pending' && (
                <button className="btn-action secondary">View Full Details</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-illustration">
            <Inbox size={64} strokeWidth={1} />
          </div>
          <h3>Inbox is Empty</h3>
          <p>No {filter !== 'all' ? filter : ''} bookings matching your filter.</p>
        </div>
      )}

      <style jsx>{`
        .bookings-container {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .page-header { margin-bottom: 0.5rem; }
        .page-title { 
          font-size: 2.25rem; 
          font-weight: 800; 
          letter-spacing: -0.02em; 
          margin-bottom: 0.5rem;
        }
        .page-subtitle { 
          color: var(--color-text-light); 
          font-size: 1.05rem;
          font-weight: 500;
        }

        .filter-wrapper {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .filter-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-light);
        }

        .filter-nav {
          display: flex;
          gap: 0.75rem;
          background: #f1f5f9;
          padding: 0.35rem;
          border-radius: 16px;
          border: 1px solid var(--color-border);
        }

        .filter-chip {
          padding: 0.6rem 1.5rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-light);
          text-transform: capitalize;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .filter-chip:hover { color: var(--color-text-dark); }

        .filter-chip.active {
          background: white;
          color: var(--color-primary);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0,0,0,0.04);
        }

        .chip-count {
          background: var(--color-accent);
          color: white;
          font-size: 0.65rem;
          padding: 0.15rem 0.45rem;
          border-radius: 6px;
          font-weight: 800;
        }

        .bookings-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .booking-premium-card {
          background: white;
          padding: 2.25rem;
          border-radius: 32px;
          border: 1px solid var(--color-border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          animation: fadeInUp 0.6s ease forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
        }

        .booking-premium-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
          border-color: var(--color-primary-light);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .user-profile { display: flex; align-items: center; gap: 1.25rem; }

        .avatar-box {
          width: 56px;
          height: 56px;
          background: var(--color-forest-100);
          color: var(--color-primary);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.25rem;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5);
        }

        .user-full-name {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-text-dark);
          margin: 0;
          letter-spacing: -0.01em;
        }

        .user-contact {
          font-size: 0.85rem;
          color: var(--color-text-light);
          font-weight: 500;
        }

        .status-tag {
          padding: 0.5rem 1.25rem;
          border-radius: 14px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .status-dot { width: 6px; height: 6px; border-radius: 50%; }

        .status-tag.pending { background: #fffbeb; color: #b45309; }
        .status-tag.pending .status-dot { background: #b45309; box-shadow: 0 0 8px #d97706; }

        .status-tag.confirmed { background: #f0fdf4; color: #15803d; }
        .status-tag.confirmed .status-dot { background: #15803d; box-shadow: 0 0 8px #16a34a; }

        .status-tag.declined { background: #fef2f2; color: #991b1b; }
        .status-tag.declined .status-dot { background: #991b1b; }

        .booking-info-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          padding: 1.75rem 0;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 1.75rem;
        }

        .info-cell { display: flex; align-items: flex-start; gap: 0.85rem; }
        .info-icon { color: var(--color-text-light); margin-top: 0.25rem; opacity: 0.5; }

        .info-text { display: flex; flex-direction: column; gap: 0.15rem; }
        .info-label {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--color-text-light);
          letter-spacing: 0.1em;
        }

        .info-value { font-weight: 700; color: var(--color-text-dark); font-size: 1rem; }
        .info-value.primary {
          color: var(--color-primary);
          font-size: 1.35rem;
          font-weight: 800;
          font-family: var(--font-family-display);
        }

        .message-wrapper {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          position: relative;
        }

        .message-quote {
          position: absolute;
          left: 1.5rem; top: 0.5rem;
          font-size: 3rem;
          color: var(--color-border);
          font-family: serif;
          opacity: 0.3;
        }

        .message-body {
          font-family: var(--font-family-display);
          font-style: italic;
          font-size: 0.95rem;
          color: var(--color-text-light);
          line-height: 1.6;
          padding-left: 1rem;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-light);
          opacity: 0.7;
        }

        .action-group { display: flex; gap: 1rem; }

        .btn-action {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1.5rem;
          border-radius: 14px;
          font-size: 0.9rem;
          font-weight: 700;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-action.confirm { background: var(--color-forest-600); color: white; border: none; }
        .btn-action.confirm:hover { background: var(--color-forest-700); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3); }

        .btn-action.reject { background: #fef2f2; color: #ef4444; border: 1px solid #fee2e2; }
        .btn-action.reject:hover { background: #fee2e2; }

        .btn-action.secondary { 
          background: transparent; 
          border: 1px solid var(--color-border); 
          color: var(--color-text-light); 
        }
        .btn-action.secondary:hover { border-color: var(--color-primary-light); color: var(--color-primary); }

        .empty-state {
          padding: 8rem 2rem;
          text-align: center;
          background: white;
          border-radius: 32px;
          border: 1px dashed var(--color-border);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .empty-illustration { color: var(--color-border); margin-bottom: 1rem; }
        .empty-state h3 { font-size: 1.5rem; font-weight: 800; color: var(--color-text-dark); }
        .empty-state p { color: var(--color-text-light); }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .booking-info-strip { grid-template-columns: 1fr; gap: 1rem; }
          .card-footer { flex-direction: column; gap: 1.5rem; align-items: stretch; }
          .action-group { flex-direction: column; }
          .btn-action { justify-content: center; }
        }
      `}</style>
    </div>
  )
}
