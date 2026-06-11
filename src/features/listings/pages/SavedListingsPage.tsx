import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { useListings } from '../hooks/useListings';
import { Spinner } from '../../../shared/components/Spinner';

export default function SavedListingsPage() {
  const { data: listings = [], isLoading } = useListings();
 const { toggle, isSaved } = useFavorites();
  const savedListings = listings.filter((l) => isSaved(l.id));

  if (isLoading) return <Spinner />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', marginBottom: '8px' }}>
        Saved Places
      </h1>
      <p style={{ color: '#717171', marginBottom: '32px', fontSize: '14px' }}>
        {savedListings.length} {savedListings.length === 1 ? 'place' : 'places'} saved
      </p>

      {savedListings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>♡</p>
          <h2 style={{ marginBottom: '12px', fontSize: '22px' }}>No saved listings yet</h2>
          <p style={{ color: '#717171', marginBottom: '24px' }}>
            Click the heart on any listing to save it here.
          </p>
          <Link to="/" style={{ color: '#ff385c', fontWeight: 600, fontSize: '15px' }}>Browse listings</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {savedListings.map((listing) => (
            <Link key={listing.id} to={`/listings/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ position: 'relative', aspectRatio: '1/1', background: '#f0f0f0' }}>
                  <img src={listing.img} alt={listing.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={(e) => { e.preventDefault(); toggle(listing.id, listing.title); }}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="#ff385c" stroke="none">
                      <path d="M16 28c0 0-14-8.5-14-17a8 8 0 0116 0 8 8 0 0116 0c0 8.5-14 17-14 17z" />
                    </svg>
                  </button>
                </div>
                <div style={{ paddingTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#222', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {listing.title}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0, marginLeft: '8px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#222">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span style={{ fontSize: '13px', color: '#222' }}>{listing.rating?.toFixed(2)}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#717171', margin: '2px 0 0' }}>{listing.location}</p>
                  <p style={{ fontSize: '13px', color: '#717171', margin: '2px 0 0' }}>
                    <span style={{ fontWeight: 600, color: '#222' }}>${listing.price}</span> / night
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}