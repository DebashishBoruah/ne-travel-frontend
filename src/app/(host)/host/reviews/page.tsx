import { Star } from 'lucide-react'

const reviews = [
  { id: '1', tourist: 'Rahul Sharma', rating: 5, text: 'Absolutely amazing experience! The living root bridge trek was unforgettable. The guide was very knowledgeable about local culture.', date: '22 Dec 2024', package: '7 Days in Meghalaya' },
  { id: '2', tourist: 'Priya Patel', rating: 4, text: 'Lovely homestay, great food, and the owner was very hospitable. Would have liked better WiFi though.', date: '18 Dec 2024', package: 'Khasi Cottage Stay' },
  { id: '3', tourist: 'John Smith', rating: 5, text: 'The Hornbill Festival experience was incredible. Well organized and the cultural immersion was authentic.', date: '10 Dec 2024', package: 'Nagaland Tribal Trail' },
  { id: '4', tourist: 'Ananya Das', rating: 4, text: 'Beautiful location, clean rooms, and helpful staff. The natural pool was a highlight!', date: '5 Dec 2024', package: 'Riverside Khasi Cottage' },
  { id: '5', tourist: 'Mike Chen', rating: 5, text: 'Best travel experience I have ever had. Northeast India is a hidden gem and this operator knows it inside out.', date: '28 Nov 2024', package: '7 Days in Meghalaya' },
]

export default function ReviewsPage() {
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <div>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '2rem' }}>Reviews Received</h1>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>{avgRating}</p>
          <div style={{ display: 'flex', gap: 2, justifyContent: 'center', margin: '0.25rem 0' }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= Math.round(Number(avgRating)) ? 'var(--color-saffron-400)' : 'none'} color="var(--color-saffron-400)" />)}
          </div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>{reviews.length} reviews</p>
        </div>
        <div style={{ flex: 1 }}>
          {[5,4,3,2,1].map(n => {
            const count = reviews.filter(r => r.rating === n).length
            const pct = (count / reviews.length) * 100
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                <span style={{ fontSize: 'var(--font-size-xs)', width: 20, textAlign: 'right' }}>{n}★</span>
                <div style={{ flex: 1, height: 8, background: 'var(--color-slate-100)', borderRadius: 4 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-saffron-400)', borderRadius: 4 }} />
                </div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)', width: 20 }}>{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.map(r => (
          <div key={r.id} className="card" style={{ padding: '1.25rem' }}>
            <div className="flex justify-between items-center mb-2">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-saffron-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-saffron-700)', fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
                  {r.tourist.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{r.tourist}</p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)' }}>{r.date} · {r.package}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= r.rating ? 'var(--color-saffron-400)' : 'none'} color="var(--color-saffron-400)" />)}
              </div>
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
