import { useMyBookings } from '../hooks/useMyBookings';
import { useCancelBooking } from '../hooks/useCancelBooking';
import { Spinner } from '../../../shared/components/Spinner';
import { useNavigate } from 'react-router-dom';

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  confirmed: { bg: '#d1fae5', color: '#065f46', label: 'Confirmed' },
  pending:   { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
  cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
};

export default function MyBookingsPage() {
  const { data: bookings = [], isLoading } = useMyBookings();
  const { mutate: cancel } = useCancelBooking();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
      <button onClick={() => navigate('/')} style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#222', fontSize: '14px', fontWeight: 600,
        marginBottom: '24px', padding: '0',
      }}>
        ← Back to Home
      </button>

      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', color: '#222' }}>
        My Bookings
      </h1>
      <p style={{ color: '#717171', marginBottom: '32px', fontSize: '14px' }}>
        {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
      </p>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>📭</p>
          <h2 style={{ fontSize: '22px', marginBottom: '12px' }}>No bookings yet</h2>
          <p style={{ color: '#717171', marginBottom: '24px' }}>Start exploring and book your first stay!</p>
          <button onClick={() => navigate('/')} style={{
            background: '#ff385c', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '12px 24px', fontSize: '15px',
            fontWeight: 600, cursor: 'pointer',
          }}>Browse listings</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map((booking) => {
            const statusStyle = statusColors[booking.status] ?? statusColors.pending;
            const checkIn = new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const checkOut = new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const nights = Math.max(1, Math.round((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86400000));

            return (
              <div key={booking.id} style={{
                display: 'flex', gap: '0', borderRadius: '16px',
                border: '1px solid #ebebeb', overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                {/* Image */}
                <div style={{ width: '160px', flexShrink: 0 }}>
                  {booking.listingImg ? (
                    <img src={booking.listingImg} alt={booking.listingTitle}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>🏠</div>
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#222', margin: '0 0 6px' }}>
                      {booking.listingTitle}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#717171', margin: '0 0 4px' }}>
                      📅 {checkIn} → {checkOut} · {nights} night{nights > 1 ? 's' : ''}
                    </p>
                    <p style={{ fontSize: '13px', color: '#717171', margin: '0 0 4px' }}>
                      👥 {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#222', margin: '8px 0 0' }}>
                      ${booking.total.toLocaleString()}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <span style={{
                      padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                      background: statusStyle.bg, color: statusStyle.color,
                    }}>
                      {statusStyle.label}
                    </span>
                    {booking.status === 'pending' || booking.status === 'confirmed' ? (
                      <button
                        onClick={() => {
                          if (window.confirm('Cancel this booking?')) cancel(booking.id);
                        }}
                        style={{
                          padding: '8px 16px', background: '#fff', color: '#dc2626',
                          border: '1px solid #dc2626', borderRadius: '8px',
                          fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}