import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { Spinner } from '../../../shared/components/Spinner';

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  guest: { name: string; email: string };
  listing: { title: string; location: string; photos?: { url: string }[] };
}

const statusColors: Record<string, { bg: string; color: string }> = {
  CONFIRMED: { bg: '#d1fae5', color: '#065f46' },
  PENDING:   { bg: '#fef3c7', color: '#92400e' },
  CANCELLED: { bg: '#fee2e2', color: '#991b1b' },
};

export default function HostBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'CONFIRMED' | 'PENDING' | 'CANCELLED'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user?.id) return;

    fetch(`http://localhost:3000/api/v1/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter only bookings for this host's listings
          setBookings(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch bookings:', err);
        setLoading(false);
      });
  }, [user?.id]);

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:3000/api/v1/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      setBookings((prev) =>
        prev.map((b) => b.id === id ? { ...b, status } : b)
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesFilter = filter === 'all' || b.status === filter;
    const matchesSearch =
      b.guest?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.listing?.title?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = bookings
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  if (loading) return <Spinner />;

  return (
    <div style={{ fontFamily: 'Circular, -apple-system, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#222', margin: 0 }}>Bookings Received</h1>
        <p style={{ color: '#717171', marginTop: '8px', fontSize: '14px' }}>Manage all bookings for your listings</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Bookings', value: bookings.length, icon: '📅' },
          { label: 'Confirmed', value: bookings.filter(b => b.status === 'CONFIRMED').length, icon: '✅' },
          { label: 'Pending', value: bookings.filter(b => b.status === 'PENDING').length, icon: '⏳' },
          { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: '💰' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#222' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: '#717171', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search guest or listing..."
          style={{ flex: 1, minWidth: '200px', padding: '10px 16px', border: '1px solid #ddd', borderRadius: '24px', fontSize: '14px', outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'CONFIRMED', 'PENDING', 'CANCELLED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '10px 18px', borderRadius: '24px', border: '1px solid #ddd',
                background: filter === s ? '#222' : '#fff',
                color: filter === s ? '#fff' : '#222',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📭</p>
            <h3 style={{ fontSize: '18px', color: '#222' }}>No bookings yet</h3>
            <p style={{ color: '#717171', fontSize: '14px' }}>When guests book your listings, they will appear here.</p>
          </div>
        ) : (
          filtered.map((booking) => (
            <div key={booking.id} style={{
              background: '#fff', borderRadius: '16px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              display: 'flex', overflow: 'hidden',
            }}>
              {/* Listing image */}
              <img
                src={booking.listing?.photos?.[0]?.url ?? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80'}
                alt={booking.listing?.title}
                style={{ width: '140px', height: '120px', objectFit: 'cover', flexShrink: 0 }}
              />

              {/* Booking details */}
              <div style={{ flex: 1, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#717171', fontWeight: 600 }}>#{booking.id.slice(0, 8)}</span>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      background: statusColors[booking.status]?.bg ?? '#f0f0f0',
                      color: statusColors[booking.status]?.color ?? '#222',
                    }}>
                      {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#222', margin: '0 0 4px' }}>
                    {booking.listing?.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#717171', margin: '0 0 8px' }}>
                    📍 {booking.listing?.location}
                  </p>
                  <p style={{ fontSize: '13px', color: '#222', margin: 0 }}>
                    👤 <strong>{booking.guest?.name}</strong> · {booking.guest?.email}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '13px', color: '#717171', margin: '0 0 4px' }}>
                    📅 {new Date(booking.checkIn).toLocaleDateString()} → {new Date(booking.checkOut).toLocaleDateString()}
                  </p>
                  <p style={{ fontSize: '22px', fontWeight: 700, color: '#222', margin: '0 0 12px' }}>
                    ${booking.totalPrice?.toLocaleString()}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {booking.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                          style={{ padding: '8px 16px', background: '#ff385c', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(booking.id, 'CANCELLED')}
                          style={{ padding: '8px 16px', background: '#fff', color: '#222', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                          Decline
                        </button>
                      </>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateStatus(booking.id, 'CANCELLED')}
                        style={{ padding: '8px 16px', background: '#fff', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}