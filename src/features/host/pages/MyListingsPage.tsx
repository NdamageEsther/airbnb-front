import { Link } from 'react-router-dom';
import { useMyListings } from '../hooks/useMyListings';
import { useDeleteListing } from '../hooks/useDeleteListing';
import { Spinner } from '../../../shared/components/Spinner';

export default function MyListingsPage() {
  const { data: listings = [], isLoading, isError } = useMyListings();
  const { mutate: deleteListing } = useDeleteListing();

  const handleDelete = (id: any) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      deleteListing(id);
    }
  };

  if (isLoading) return <Spinner />;

  if (isError) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <p style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</p>
      <h2 style={{ marginBottom: '12px' }}>Failed to load listings</h2>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px' }}>My Listings</h1>
        <Link to="/host/listings/new" style={btnStyle}>+ Add New Listing</Link>
      </div>

      {listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</p>
          <h2 style={{ marginBottom: '12px' }}>No listings yet</h2>
          <Link to="/host/listings/new" style={btnStyle}>Create your first listing</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: '20px' }}>
          {listings.map((l) => (
            <div key={l.id} style={{
              background: '#fff', border: '1px solid #f0ede8',
              borderRadius: '12px', overflow: 'hidden',
            }}>
              <img src={l.img} alt={l.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{l.title}</h3>
                  <span style={{
                    background: 'rgba(34,197,94,0.1)', color: '#16a34a',
                    padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                  }}>
                    published
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#717171', marginBottom: '12px' }}>${l.price}/night</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/host/listings/${l.id}/edit`} style={smallBtnStyle}>Edit</Link>
                  <Link to={`/listings/${l.id}`} style={{ ...smallBtnStyle, background: '#fff', color: '#222', border: '1px solid #e0ddd8' }}>View</Link>
                  <button
                    onClick={() => handleDelete(l.id)}
                    style={{ ...smallBtnStyle, background: '#fff', color: '#ff385c', border: '1px solid #ff385c', cursor: 'pointer' }}
                  >
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

const btnStyle: React.CSSProperties = {
  background: '#ff385c', color: '#fff', textDecoration: 'none',
  padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
};
const smallBtnStyle: React.CSSProperties = {
  background: '#ff385c', color: '#fff', textDecoration: 'none',
  padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, border: 'none',
};