import { DollarSign, TrendingUp, Clock, CheckCircle, Building2 } from 'lucide-react'

const payouts = [
  { id: '1', booking: 'Rahul Sharma — 7 Days Meghalaya', amount: 14300, date: '22 Dec 2024', status: 'paid' },
  { id: '2', booking: 'Priya Patel — Khasi Cottage (3 nights)', amount: 4500, date: '24 Dec 2024', status: 'pending' },
  { id: '3', booking: 'Mike Chen — 5 Day Nagaland', amount: 35000, date: '17 Jan 2025', status: 'processing' },
  { id: '4', booking: 'John Smith — 5 Days Meghalaya', amount: 22000, date: '1 Jan 2025', status: 'pending' },
]

export default function EarningsPage() {
  const totalEarned = 145000
  const pendingAmount = 61500
  const paidAmount = 83500

  return (
    <div>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '2rem' }}>Earnings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Earnings', value: `₹${totalEarned.toLocaleString('en-IN')}`, icon: <TrendingUp size={20} />, color: 'var(--color-primary)' },
          { label: 'Paid Out', value: `₹${paidAmount.toLocaleString('en-IN')}`, icon: <CheckCircle size={20} />, color: 'var(--color-success)' },
          { label: 'Pending', value: `₹${pendingAmount.toLocaleString('en-IN')}`, icon: <Clock size={20} />, color: 'var(--color-saffron-500)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)', fontWeight: 500 }}>{s.label}</p>
                <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginTop: '0.25rem' }}>{s.value}</p>
              </div>
              <div style={{ color: s.color, opacity: 0.7 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>Payout History</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>Booking</th><th>Amount</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {payouts.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.booking}</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>₹{p.amount.toLocaleString('en-IN')}</td>
                  <td style={{ color: 'var(--color-text-light)', fontSize: 'var(--font-size-sm)' }}>{p.date}</td>
                  <td>
                    <span className={`badge ${p.status === 'paid' ? 'badge-success' : p.status === 'processing' ? 'badge-accent' : 'badge-warning'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>
          <Building2 size={18} style={{ display: 'inline', verticalAlign: 'middle' }} /> Bank Details
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Account Holder</label>
            <input type="text" className="form-input" defaultValue="Naga Homestay LLP" />
          </div>
          <div className="form-group">
            <label className="form-label">Account Number</label>
            <input type="text" className="form-input" defaultValue="****5678" />
          </div>
          <div className="form-group">
            <label className="form-label">IFSC Code</label>
            <input type="text" className="form-input" defaultValue="SBIN0001234" />
          </div>
          <div className="form-group">
            <label className="form-label">UPI ID</label>
            <input type="text" className="form-input" defaultValue="nagahomestay@upi" />
          </div>
        </div>
        <button className="btn btn-primary mt-4">Update Bank Details</button>
      </div>
    </div>
  )
}
