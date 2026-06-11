import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useListings } from '../hooks/useListings';
import { useFavorites } from '../hooks/useFavorites';
import { useStore } from '../../../store/StoreContext';
import { Spinner } from '../../../shared/components/Spinner';
import type { Listing } from '../types';

export function ListingsPage() {
  const { data: listings = [], isLoading, isError, refetch } = useListings();
  const { state } = useStore();
  const { toggle, isSaved } = useFavorites();

  const filtered = useMemo(() => {
    const q = state.filter.toLowerCase();
    return listings.filter((l) =>
      l.title.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q)
    );
  }, [listings, state.filter]);

  const popular = filtered.slice(0, 8);
  const featured = filtered.slice(0, 8);
  const available = filtered.filter((l) => l.available).slice(0, 8);

  if (isLoading) return <Spinner />;

  if (isError) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <p style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</p>
      <h2 style={{ marginBottom: '12px' }}>Failed to load listings</h2>
      <button onClick={() => refetch()} style={{
        background: '#ff385c', color: '#fff', border: 'none',
        borderRadius: '8px', padding: '10px 24px', cursor: 'pointer',
        fontSize: '14px', fontWeight: 600,
      }}>Retry</button>
    </div>
  );

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Circular, -apple-system, sans-serif' }}>

      <HorizontalSection title="Popular homes near you" listings={popular} toggle={toggle} isSaved={isSaved} />

      {featured.length > 0 && (
        <HorizontalSection title="Featured stays" listings={featured} toggle={toggle} isSaved={isSaved} />
      )}

      {available.length > 0 && (
        <HorizontalSection title="Available now" listings={available} toggle={toggle} isSaved={isSaved} />
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
          <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>No listings found</h2>
          <p style={{ color: '#717171' }}>Try adjusting your search.</p>
        </div>
      )}

      <BigFooter />
    </div>
  );
}

function HorizontalSection({
  title, listings, toggle, isSaved,
}: {
  title: string;
  listings: Listing[];
  toggle: (id: number, title: string) => void;
  isSaved: (id: number) => boolean;
}) {
  return (
    <div style={{ padding: '40px 24px 0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 16px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#222' }}>{title} →</h2>
      </div>
      <div style={{
        display: 'flex', gap: '16px',
        overflowX: 'auto', paddingBottom: '16px',
        paddingLeft: '16px', paddingRight: '16px',
        scrollbarWidth: 'none',
      }}>
        {listings.map((listing) => (
          <Link key={listing.id} to={`/listings/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
            <AirbnbCard listing={listing} toggle={toggle} isSaved={isSaved} />
          </Link>
        ))}
      </div>
    </div>
  );
}

function AirbnbCard({
  listing, toggle, isSaved,
}: {
  listing: Listing;
  toggle: (id: number, title: string) => void;
  isSaved: (id: number) => boolean;
}) {
  const saved = isSaved(listing.id);
  return (
    <div style={{ width: '220px', cursor: 'pointer' }}>
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '1 / 1', background: '#f0f0f0' }}>
        <img src={listing.img} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'white', borderRadius: '20px', padding: '5px 10px', fontSize: '12px', fontWeight: 600, color: '#222' }}>
          Guest favorite
        </div>
        <button
          onClick={(e) => { e.preventDefault(); toggle(listing.id, listing.title); }}
          style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
          <svg width="24" height="24" viewBox="0 0 32 32" fill={saved ? '#ff385c' : 'rgba(0,0,0,0.5)'} stroke={saved ? 'none' : 'white'} strokeWidth="2">
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
          <span style={{ fontWeight: 600, color: '#222' }}>${listing.price * 2}</span> for 2 nights
        </p>
      </div>
    </div>
  );
}

function BigFooter() {
  const sections = [
    { title: 'Support', links: ['Help Center', 'Get help with a safety issue', 'AirCover', 'Anti-discrimination', 'Disability support', 'Cancellation options'] },
    { title: 'Hosting', links: ['Airbnb your home', 'AirCover for Hosts', 'Hosting resources', 'Community forum', 'Hosting responsibly', 'Join a free hosting class'] },
    { title: 'Airbnb', links: ['Newsroom', 'New features', 'Careers', 'Investors', 'Gift cards', 'Airbnb.org emergency stays'] },
  ];
  return (
    <footer style={{ borderTop: '1px solid #ebebeb', background: '#f7f7f7', marginTop: '48px' }}>
      <div style={{ padding: '48px 40px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
        {sections.map((s) => (
          <div key={s.title}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#222', marginBottom: '16px' }}>{s.title}</h3>
            {s.links.map((link) => (
              <p key={link} style={{ fontSize: '13px', color: '#222', marginBottom: '12px', cursor: 'pointer' }}>{link}</p>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #ddd', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#222' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span>© 2026 Airbnb, Inc.</span>
          <span>·</span>
          <span style={{ cursor: 'pointer' }}>Privacy</span>
          <span>·</span>
          <span style={{ cursor: 'pointer' }}>Terms</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span>🌐 English (US)</span>
          <span>$ USD</span>
        </div>
      </div>
    </footer>
  );
}