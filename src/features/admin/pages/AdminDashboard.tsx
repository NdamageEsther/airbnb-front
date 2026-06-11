import { Link } from 'react-router-dom';
import { withAuth } from '../../../shared/hocs/withAuth';

const STATS = [
  { label: 'Total Users', value: '1,284', icon: '👥' },
  { label: 'Total Listings', value: '342', icon: '🏠' },
  { label: 'Total Bookings', value: '5,621', icon: '📅' },
  { label: 'Total Revenue', value: '$284,320', icon: '💰' },
  { label: 'Pending Review', value: '7', icon: '⏳' },
];

const ACTIVITY = [
  { id: 1, msg: 'New user registered: alice@example.com', time: '2 min ago' },
  { id: 2, msg: 'Listing submitted for review: Beachfront Villa', time: '15 min ago' },
  { id: 3, msg: 'Booking confirmed: Bob → Mountain Cabin', time: '1 hr ago' },
  { id: 4, msg: 'New user registered: carol@example.com', time: '2 hr ago' },
  { id: 5, msg: 'Listing approved: City Loft Paris', time: '3 hr ago' },
];

export default withAuth(function AdminDashboard() {
  return (
    <div>
      <div style={{
        background: 'rgba(251,191,36,0.15)', border: '1px solid #fbbf24',
        borderRadius: '10px', padding: '12px 16px', marginBottom: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          ⚠️ 7 listings are pending moderation review
        </span>
        <Link to="/admin/moderation" style={{ color: '#ff385c', fontWeight: 600, fontSize: '13px' }}>
          Review now →
        </Link>
      </div>

      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', marginBottom: '24px' }}>
        Platform Overview
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {STATS.map((s) => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #f0ede8', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#717171' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Recent Activity</h2>
      <div style={{ background: '#fff', border: '1px solid #f0ede8', borderRadius: '12px', overflow: 'hidden' }}>
        {ACTIVITY.map((a) => (
          <div key={a.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 20px', borderBottom: '1px solid #f0ede8', fontSize: '14px',
          }}>
            <span>{a.msg}</span>
            <span style={{ color: '#717171', fontSize: '12px', flexShrink: 0, marginLeft: '16px' }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
});