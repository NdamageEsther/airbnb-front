import { useState } from 'react';
import { usePendingListings } from '../hooks/usePendingListings';
import { useApprove } from '../hooks/useApprove';
import { useReject } from '../hooks/useReject';
import { Spinner } from '../../../shared/components/Spinner';

export default function ModerationPage() {
  const { data: listings = [], isLoading } = usePendingListings();
  const { mutate: approve } = useApprove();
  const { mutate: reject } = useReject();
  const [reasons, setReasons] = useState<Record<number, string>>({});
  const [showReason, setShowReason] = useState<number | null>(null);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', marginBottom: '8px' }}>
        Moderation Queue
      </h1>
      <p style={{ color: '#717171', marginBottom: '24px' }}>
        {listings.length} listings pending review
      </p>

      {listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>✅</p>
          <h2>All clear — no listings pending review</h2>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {listings.map((l) => (
            <div key={l.id} style={{ background: '#fff', border: '1px solid #f0ede8', borderRadius: '12px', overflow: 'hidden', display: 'flex' }}>
              <img src={l.img} alt={l.title} style={{ width: '200px', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ padding: '20px', flex: 1 }}>
                <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>{l.title}</h3>
                <p style={{ fontSize: '13px', color: '#717171', marginBottom: '4px' }}>{l.location}</p>
                <p style={{ fontSize: '13px', marginBottom: '12px' }}>${l.price}/night · ⭐ {l.rating}</p>

                {showReason === l.id && (
                  <input
                    placeholder="Rejection reason..."
                    value={reasons[l.id] ?? ''}
                    onChange={(e) => setReasons((r) => ({ ...r, [l.id]: e.target.value }))}
                    style={{ width: '100%', padding: '8px', border: '1.5px solid #e0ddd8', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box', marginBottom: '12px' }}
                  />
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => approve(l.id)} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
                    ✓ Approve
                  </button>
                  <button onClick={() => {
                    if (showReason === l.id) {
                      reject({ id: l.id, reason: reasons[l.id] ?? '' });
                      setShowReason(null);
                    } else {
                      setShowReason(l.id);
                    }
                  }} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
                    ✕ {showReason === l.id ? 'Confirm Reject' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}