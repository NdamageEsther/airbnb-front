import Image from 'next/image';
import Link from 'next/link';
import { getListings } from '@/lib/listings';
import FavoriteButton from '@/components/FavoriteButton';

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <div>
      {/* Hero Search Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #ff385c 0%, #e31c5f 100%)',
        borderRadius: '24px', padding: '48px 32px',
        marginBottom: '40px', textAlign: 'center',
      }}>
        <h1 style={{ color: '#fff', fontSize: '40px', fontWeight: 700, marginBottom: '8px' }}>
          Find your next stay
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', marginBottom: '24px' }}>
          Discover amazing places to stay around the world
        </p>
        <div style={{
          background: '#fff', borderRadius: '40px', padding: '8px',
          display: 'flex', maxWidth: '700px', margin: '0 auto',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        }}>
          <input placeholder="🔍  Where are you going?" style={{
            flex: 1, border: 'none', outline: 'none', padding: '10px 20px',
            fontSize: '15px', borderRadius: '40px', background: 'transparent',
          }} />
          <button style={{
            background: '#ff385c', color: '#fff', border: 'none',
            borderRadius: '40px', padding: '12px 28px', fontWeight: 600,
            fontSize: '15px', cursor: 'pointer',
          }}>
            Search
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '32px', overflowX: 'auto', marginBottom: '32px', paddingBottom: '8px' }}>
        {[
          { icon: '🏖️', label: 'Beach' },
          { icon: '🏔️', label: 'Mountain' },
          { icon: '🏙️', label: 'City' },
          { icon: '🌾', label: 'Countryside' },
          { icon: '🏊', label: 'Pool' },
          { icon: '🌊', label: 'Lakefront' },
          { icon: '🛖', label: 'Cabins' },
          { icon: '🏝️', label: 'Islands' },
        ].map((cat) => (
          <div key={cat.label} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '6px', cursor: 'pointer', flexShrink: 0,
            padding: '8px 4px', borderBottom: '2px solid transparent',
            color: '#717171', fontSize: '12px', fontWeight: 500,
          }}>
            <span style={{ fontSize: '24px' }}>{cat.icon}</span>
            {cat.label}
          </div>
        ))}
      </div>

      {/* Listings Count */}
      <p style={{ fontSize: '14px', color: '#717171', marginBottom: '24px' }}>
        {listings.length} stays available
      </p>

      {/* Listings Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
      }}>
        {listings.map((listing) => (
          <div key={listing.id} style={{ position: 'relative' }}>
            {/* Favorite Button */}
            <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
              <FavoriteButton id={listing.id} />
            </div>

            <Link href={`/listings/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {/* Image */}
              <div style={{ position: 'relative', height: '280px', borderRadius: '16px', overflow: 'hidden', marginBottom: '12px' }}>
                <Image
                  src={listing.img}
                  alt={listing.title}
                  fill
                  style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                />
              </div>

              {/* Info */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#222', margin: 0 }}>
                    {listing.location}
                  </h3>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '14px', fontWeight: 500 }}>
                    ⭐ {listing.rating}
                  </span>
                </div>
                <p style={{ color: '#717171', fontSize: '14px', margin: '2px 0' }}>
                  {listing.title}
                </p>
                <p style={{ color: '#717171', fontSize: '14px', margin: '2px 0' }}>
                  Available from {listing.availableFrom}
                </p>
                <p style={{ marginTop: '8px', fontSize: '15px', color: '#222' }}>
                  <span style={{ fontWeight: 700 }}>${listing.price}</span>
                  <span style={{ fontWeight: 400, color: '#717171' }}> / night</span>
                </p>
                {listing.superhost && (
                  <span style={{
                    display: 'inline-block', marginTop: '6px',
                    background: '#f7f7f7', border: '1px solid #ddd',
                    padding: '2px 10px', borderRadius: '20px',