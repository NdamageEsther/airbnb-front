import { useState } from 'react';
import { useAllBookings } from '../hooks/useAllBookings';
import { Spinner } from '../../../shared/components/Spinner';

export default function AllBookingsPage() {
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data: bookings = [], isLoading, isFetching } = useAllBookings(status, page);

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return b.listingTitle.toLowerCase().includes(q);
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px' }}>All Bookings</h1>
        {isFetching && <span style={{ fontSize: '12px', color: '#717171' }}>Refreshing...</span>}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          placeholder="Search by listing..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e0ddd8', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
        />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} style={{ padding: '10px 14px', border: '1.5px solid #e0ddd8', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
          {['all', 'pending', 'confirmed', 'cancelled'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {isLoading ? <Spinner /> : (
        <>
          <div style={{ background: '#fff', border: '1px solid #f0ede8', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f8f6f3', borderBottom: '1px solid #f0ede8' }}>
                  {['ID', 'Listing', 'Dates', 'Guests', 'Total', 'Status'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '13px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f0ede8' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#717171' }}>{b.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{b.listingTitle}</td>
                    <td style={{ padding: '12px 16px', color: '#717171', fontSize: '12px' }}>{b.checkIn} → {b.checkOut}</td>
                    <td style={{ padding: '12px 16px' }}>{b.guests}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>${b.total}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                        background: b.status === 'confirmed' ? 'rgba(34,197,94,0.1)' : b.status === 'pending' ? 'rgba(251,191,36,0.1)' : 'rgba(239,68,68,0.1)',
                        color: b.status === 'confirmed' ? '#16a34a' : b.status === 'pending' ? '#92400e' : '#dc2626',
                        textTransform: 'capitalize',
                      }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={pageBtn}>← Prev</button>
            <span style={{ padding: '6px 12px', fontSize: '14px' }}>Page {page}</span>
            <button onClick={() => setPage((p) => p + 1)} style={pageBtn}>Next →</button>
          </div>
        </>
      )}
    </div>
  );
}

const pageBtn: React.CSSProperties = { background: '#fff', border: '1.5px solid #e0ddd8', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' };