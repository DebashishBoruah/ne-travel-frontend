'use client'

import Link from 'next/link'
import { Home, Package, Calendar, Inbox, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react'

export default function HostDashboard() {
  const stats = [
    { label: 'Active Listings', value: '2', icon: <Home size={20} />, color: 'var(--color-primary)' },
    { label: 'Pending Bookings', value: '3', icon: <Clock size={20} />, color: 'var(--color-saffron-500)' },
    { label: 'Confirmed', value: '12', icon: <CheckCircle size={20} />, color: 'var(--color-success)' },
    { label: 'Total Earnings', value: '₹1,45,000', icon: <TrendingUp size={20} />, color: 'var(--color-primary)' },
  ]

  const recentBookings = [
    { id: '1', tourist: 'Rahul Sharma', dates: '15-21 Dec 2024', guests: 2, amount: '₹50,000', status: 'pending' },
    { id: '2', tourist: 'Priya Patel', dates: '20-23 Dec 2024', guests: 4, amount: '₹18,000', status: 'confirmed' },
    { id: '3', tourist: 'John Smith', dates: '25-30 Dec 2024', guests: 3, amount: '₹75,000', status: 'pending' },
  ]

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="dashboard-header">
        <div className="header-text">
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Monitor your properties and earnings in real-time.</p>
        </div>
        <div className="header-actions">
          <Link href="/host/calendar" className="premium-btn-outline">
            <Calendar size={18} />
            <span>Manage Calendar</span>
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{"--delay": `${i * 0.1}s`} as any}>
            <div className="stat-card-inner">
              <div className="stat-info">
                <span className="stat-label">{s.label}</span>
                <span className="stat-value">{s.value}</span>
              </div>
              <div className="stat-icon-box" style={{ backgroundColor: `${s.color}18`, color: s.color }}>
                {s.icon}
              </div>
            </div>
            <div className="stat-card-glow" style={{ backgroundColor: s.color }} />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">Quick Management</h2>
          <div className="section-line" />
        </div>
        <div className="actions-grid">
          <Link href="/host/listings/new" className="action-tile group">
            <div className="action-tile-bg" />
            <div className="action-icon-circle primary">
              <Home size={24} />
            </div>
            <div className="action-info">
              <span className="action-name">New Listing</span>
              <span className="action-description">Register a new homestay property</span>
            </div>
            <div className="action-arrow">→</div>
          </Link>
          
          <Link href="/host/packages/new" className="action-tile group">
            <div className="action-tile-bg" />
            <div className="action-icon-circle accent">
              <Package size={24} />
            </div>
            <div className="action-info">
              <span className="action-name">New Package</span>
              <span className="action-description">Bundle tours and experiences</span>
            </div>
            <div className="action-arrow">→</div>
          </Link>

          <Link href="/host/bookings" className="action-tile group">
            <div className="action-tile-bg" />
            <div className="action-icon-circle slate">
              <Inbox size={24} />
            </div>
            <div className="action-info">
              <span className="action-name">Active Bookings</span>
              <span className="action-description">Review and manage reservations</span>
            </div>
            <div className="action-arrow">→</div>
          </Link>
        </div>
      </section>

      {/* Recent Bookings */}
      <section className="section-container">
        <div className="section-header-flex">
          <h2 className="section-title">Recent Activity</h2>
          <Link href="/host/bookings" className="text-link">View Detailed Inbox</Link>
        </div>
        
        <div className="table-card">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Traveler</th>
                <th>Stay Duration</th>
                <th>Group Size</th>
                <th>Revenue</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b.id} className="table-row">
                  <td>
                    <div className="traveler-cell">
                      <div className="traveler-avatar">{b.tourist.charAt(0)}</div>
                      <div className="traveler-meta">
                        <span className="traveler-name">{b.tourist}</span>
                        <span className="traveler-id">ID: #BK-{b.id}829</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="date-tag">{b.dates}</span></td>
                  <td><span className="guest-badge">{b.guests} Guests</span></td>
                  <td><span className="price-tag">{b.amount}</span></td>
                  <td>
                    <span className={`status-pill ${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="text-right">
                    {b.status === 'pending' ? (
                      <div className="table-btn-group">
                        <button className="btn-table accept">Confirm</button>
                        <button className="btn-table decline">Reject</button>
                      </div>
                    ) : (
                      <button className="btn-table ghost">Manage</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dashboard-title {
          font-size: 2.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--color-text-dark);
          margin-bottom: 0.5rem;
        }

        .dashboard-subtitle {
          color: var(--color-text-light);
          font-size: 1.05rem;
          font-weight: 500;
        }

        .premium-btn-outline {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 14px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--color-text-dark);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: all 0.25s ease;
        }

        .premium-btn-outline:hover {
          background: var(--color-slate-50);
          border-color: var(--color-primary-light);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.75rem;
        }

        @media (max-width: 1280px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr; }
        }

        .stat-card {
          position: relative;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          padding: 1.75rem;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          animation-delay: var(--delay, 0s);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-6px);
          background: white;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          border-color: var(--color-primary-light);
        }

        .stat-card-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .stat-info { display: flex; flex-direction: column; gap: 0.5rem; }

        .stat-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-light);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-text-dark);
          font-family: var(--font-family-display);
        }

        .stat-icon-box {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
        }

        .stat-card-glow {
          position: absolute;
          right: -20px;
          top: -20px;
          width: 80px;
          height: 80px;
          filter: blur(40px);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-card:hover .stat-card-glow { opacity: 0.15; }

        .section-container { display: flex; flex-direction: column; gap: 2rem; }

        .section-header { display: flex; align-items: center; gap: 1.5rem; }

        .section-title {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .section-line {
          height: 1px;
          flex: 1;
          background: radial-gradient(circle at left, var(--color-border), transparent);
          opacity: 0.5;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .actions-grid { grid-template-columns: 1fr; }
        }

        .action-tile {
          position: relative;
          background: white;
          padding: 2rem;
          border-radius: 24px;
          display: flex;
          align-items: center;
          gap: 1.75rem;
          border: 1px solid var(--color-border);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .action-tile-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        .action-tile:hover {
          transform: scale(1.02);
          border-color: transparent;
          box-shadow: 0 15px 35px rgba(22, 163, 74, 0.15);
        }

        .action-tile:hover .action-tile-bg { opacity: 0.03; }

        .action-icon-circle {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .action-icon-circle.primary { background: #f0fdf4; color: #16a34a; }
        .action-icon-circle.accent { background: #fffbeb; color: #d97706; }
        .action-icon-circle.slate { background: #f1f5f9; color: #475569; }

        .action-tile:hover .action-icon-circle {
          transform: scale(1.1);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }

        .action-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
          z-index: 2;
        }

        .action-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-text-dark);
        }

        .action-description {
          font-size: 0.85rem;
          color: var(--color-text-light);
          font-weight: 500;
        }

        .action-arrow {
          font-size: 1.5rem;
          color: var(--color-border);
          transform: translateX(-10px);
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 2;
        }

        .action-tile:hover .action-arrow {
          opacity: 1;
          transform: translateX(0);
          color: var(--color-primary);
        }

        .table-card {
          background: white;
          border-radius: 28px;
          padding: 0.75rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
          border: 1px solid var(--color-border);
          overflow: hidden;
        }

        .premium-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .premium-table th {
          padding: 1.5rem;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-light);
          background: #fafafa;
          border-bottom: 1px solid var(--color-border);
        }

        .premium-table th:first-child { border-top-left-radius: 20px; }
        .premium-table th:last-child { border-top-right-radius: 20px; }

        .table-row { transition: all 0.2s ease; }
        .table-row:hover { background: #fbfcfd; }

        .premium-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f2f4f6;
          vertical-align: middle;
        }

        .traveler-cell { display: flex; align-items: center; gap: 1rem; }

        .traveler-avatar {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: var(--color-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1rem;
          box-shadow: 0 4px 10px rgba(22, 163, 74, 0.2);
        }

        .traveler-meta { display: flex; flex-direction: column; }
        .traveler-name { font-weight: 700; color: var(--color-text-dark); }
        .traveler-id { font-size: 0.7rem; color: var(--color-text-light); font-weight: 600; }

        .date-tag {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-dark);
          padding: 0.4rem 0.75rem;
          background: var(--color-slate-50);
          border-radius: 10px;
        }

        .guest-badge {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-light);
        }

        .price-tag {
          font-weight: 800;
          color: var(--color-primary);
          font-family: var(--font-family-display);
        }

        .status-pill {
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-pill.pending { background: #fffbeb; color: #b45309; }
        .status-pill.confirmed { background: #f0fdf4; color: #15803d; }

        .table-btn-group {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        .btn-table {
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .btn-table.accept { background: var(--color-forest-600); color: white; border: none; }
        .btn-table.accept:hover { background: var(--color-forest-700); transform: translateY(-1px); }
        
        .btn-table.decline { background: #fee2e2; color: #ef4444; border: none; }
        .btn-table.decline:hover { background: #fecaca; }

        .btn-table.ghost { 
          background: transparent; 
          border: 1px solid var(--color-border); 
          color: var(--color-text-light); 
        }
        .btn-table.ghost:hover { border-color: var(--color-primary-light); color: var(--color-primary); }

        .text-link {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-primary);
          transition: all 0.2s ease;
        }

        .text-link:hover { color: var(--color-primary-dark); text-decoration: underline; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .premium-table { display: block; overflow-x: auto; }
        }
      `}</style>
    </div>
  )
}
