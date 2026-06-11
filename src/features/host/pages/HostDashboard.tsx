import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { useMyListings } from '../hooks/useMyListings';
import { useDeleteListing } from '../hooks/useDeleteListing';
import { Spinner } from '../../../shared/components/Spinner';

export default function HostDashboard() {
  const { user } = useAuth();
  const { data: listings = [], isLoading } = useMyListings();
  const { mutate: deleteListing } = useDeleteListing();

  const stats = [
    { label: 'Total Listings', value: listings.length, icon: '🏠' },
    { label: 'Bookings This Month', value: 12, icon: '📅' },
    { label: 'Earnings This Month', value: '$3,240', icon: '💰' },
    { label: 'Average Rating', value: '4.91', icon: '⭐' },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', marginBottom: '8px' }}>
        Welcome back, {user?.name}! 👋
      </h1>
      <p style={{ color: '#717171', marginBottom: '32px' }}>
        Here's what's happening with your properties.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #f0ede8', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: '#717171' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>My Listings</h2>
        <Link to="/host/listings/new" style={btnStyle}>+ Add New Listing</Link>
      </div>

      {isLoading ? <Spinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '16px' }}>
          {listings.map((l) => (
            <div key={l.id} style={{ background: '#fff', border: '1px solid #f0ede8', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={l.img} alt={l.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              <div style={{ padding: '14px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{l.title}</h3>
                <p style={{ fontSize: '13px', color: '#717171', marginBottom: '10px' }}>${l.price}/night</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <Link to={`/host/listings/${l.id}/edit`} style={smallBtn}>Edit</Link>
                  <Link to={`/listings/${l.id}`} style={{ ...smallBtn, background: '#fff', color: '#222', border: '1px solid #e0ddd8' }}>View</Link>
                  <button onClick={() => {
                    if (window.confirm('Delete this listing?')) deleteListing(l.id);
                  }} style={{ ...smallBtn, background: '#fff', color: '#ff385c', border: '1px solid #ff385c', cursor: 'pointer' }}>
                    Delete
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

const btnStyle: React.CSSProperties = { background: '#ff385c', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '14px' };
const smallBtn: React.CSSProperties = { background: '#ff385c', color: '#fff', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, border: 'none' };