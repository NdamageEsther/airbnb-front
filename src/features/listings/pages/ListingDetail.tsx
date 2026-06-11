import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useListing } from '../hooks/useListing';
import { Spinner } from '../../../shared/components/Spinner';

const amenities = [
  { icon: '🍳', label: 'Kitchen' },
  { icon: '📶', label: 'Wifi' },
  { icon: '🚗', label: 'Free parking on premises' },
  { icon: '📺', label: 'TV' },
  { icon: '🫧', label: 'Washer' },
  { icon: '❄️', label: 'Air conditioning' },
  { icon: '📷', label: 'Exterior security cameras' },
  { icon: '🔥', label: 'Heating' },
  { icon: '🏊', label: 'Pool' },
  { icon: '💪', label: 'Gym access' },
];

const reviews = [
  { id: 1, name: 'Winnie Jeruto', location: 'Nairobi, Kenya', date: 'April 2026', stayed: 'Stayed one night', rating: 5, avatar: 'https://i.pravatar.cc/48?img=1', comment: 'This is a true mancave. It had everything I needed for a getaway. Very clean, well equipped kitchen and powerful Entertainment System.' },
  { id: 2, name: 'Praise', location: 'Kampala, Uganda', date: 'April 2026', stayed: 'Stayed one night', rating: 5, avatar: 'https://i.pravatar.cc/48?img=2', comment: 'Amazing host, very kind, responsive and attentive. The place was clean and comfortable. I felt welcomed throughout my stay.' },
  { id: 3, name: 'James Omondi', location: 'Mombasa, Kenya', date: 'March 2026', stayed: '2 nights', rating: 5, avatar: 'https://i.pravatar.cc/48?img=3', comment: 'Absolutely fantastic stay! The apartment was spotless, modern, and had everything you need.' },
  { id: 4, name: 'Sarah Mwangi', location: 'Kigali, Rwanda', date: 'March 2026', stayed: 'Stayed one night', rating: 5, avatar: 'https://i.pravatar.cc/48?img=5', comment: 'Great location, great value. The place was exactly as described. Very clean and cozy.' },
];



interface BookingGuest {
  id: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  guest: { name: string; email: string };
}

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toggle, isSaved } = useFavorites();
  const { data: listing, isLoading, isError } = useListing(id);
  const [activeSection, setActiveSection] = useState('Photos');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookings, setBookings] = useState<BookingGuest[]>([]);

  const isHost = user?.role === 'host';

  // Fetch bookings for this listing if user is host
  useEffect(() => {
    if (!isHost || !id) return;
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/v1/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filtered = data.filter((b: any) => b.listingId === id);
          setBookings(filtered);
        }
      })
      .catch(console.error);
  }, [isHost, id]);

  if (isLoading) return <Spinner />;
  if (isError || !listing) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ marginBottom: '12px' }}>Listing not found</h2>
        <Link to="/" style={{ color: '#ff385c' }}>Go home</Link>
      </div>
    );
  }

  const saved = isSaved(listing.id);
  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1;
  const total = listing.price * nights;

  const extraImgs = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
  ];

  return (
    <div style={{ background: '#fff', fontFamily: 'Circular, -apple-system, sans-serif' }}>

      {/* Sticky nav */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40, background: '#fff',
        borderBottom: '1px solid #ebebeb',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 40px', height: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '14px', fontWeight: 600, color: '#222', padding: 0,
          }}>
            ← Home
          </button>
          <div style={{ width: '1px', height: '20px', background: '#ddd' }} />
          <div style={{ display: 'flex', gap: '32px' }}>
            {['Photos', 'Amenities', 'Reviews', 'Location', ...(isHost ? ['Guests'] : [])].map((s) => (
              <button key={s} onClick={() => setActiveSection(s)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '14px', fontWeight: activeSection === s ? 600 : 400,
                color: activeSection === s ? '#222' : '#717171',
                padding: '0 0 4px',
                borderBottom: activeSection === s ? '2px solid #222' : '2px solid transparent',
              }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ fontSize: '14px', color: '#717171' }}>
            <span style={{ textDecoration: 'line-through', marginRight: '6px' }}>${listing.price + 6}</span>
            <strong style={{ fontSize: '16px', color: '#222' }}>${listing.price}</strong> for {nights} night{nights > 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: '13px', color: '#222' }}>⭐ {listing.rating} · {reviews.length} reviews</span>
          {!isHost && (
            <button
              onClick={() => isAuthenticated ? navigate(`/listings/${listing.id}/book`) : navigate('/login')}
              style={{
                background: 'linear-gradient(to right, #e61e4d, #e31c5f, #d70466)',
                color: '#fff', border: 'none', borderRadius: '8px',
                padding: '12px 24px', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
              }}
            >Reserve</button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '32px 40px' }}>

        {/* Title row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#222', margin: 0, flex: 1 }}>
            {listing.title}
          </h1>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#222', textDecoration: 'underline' }}>
              ↑ Share
            </button>
            <button
              onClick={() => toggle(listing.id, listing.title)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#222', textDecoration: 'underline' }}
            >
              {saved ? '❤️' : '🤍'} Save
            </button>
          </div>
        </div>

        {/* Photo grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px', height: '400px' }}>
          <img src={listing.img} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '8px' }}>
            {extraImgs.map((img, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {i === 3 && (
                  <button style={{
                    position: 'absolute', bottom: '12px', right: '12px',
                    background: '#fff', border: '1px solid #222', borderRadius: '8px',
                    padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  }}>
                    ⊞ Show all photos
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main content + sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: isHost ? '1fr' : '1fr 380px', gap: '64px' }}>

          {/* Left column */}
          <div>
            <div style={{ paddingBottom: '24px', borderBottom: '1px solid #ebebeb', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#222', margin: '0 0 8px' }}>
                Entire rental unit in {listing.location}
              </h2>
              <p style={{ fontSize: '16px', color: '#717171', margin: 0 }}>
                2 guests · 1 bedroom · 1 bed · 1 bath
              </p>
            </div>

            {/* Guest favorite */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '20px 24px', border: '1px solid #ddd', borderRadius: '16px', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#222' }}>Guest favorite</div>
              </div>
              <div style={{ fontSize: '13px', color: '#222', flex: 1 }}>
                One of the most loved homes on Airbnb, according to guests
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#222' }}>{listing.rating}</div>
                <div style={{ color: '#ff385c' }}>{'★'.repeat(5)}</div>
                <div style={{ fontSize: '12px', color: '#717171' }}>{reviews.length} Reviews</div>
              </div>
            </div>

            {/* Description */}
            <div style={{ paddingBottom: '24px', borderBottom: '1px solid #ebebeb', marginBottom: '24px' }}>
              <p style={{ fontSize: '15px', color: '#222', lineHeight: 1.7, margin: 0 }}>
                Welcome to this beautiful {listing.title.toLowerCase()} located in {listing.location}.
                This stunning property offers an unparalleled experience with breathtaking views and world-class amenities.
                Perfect for couples or solo travelers looking for a luxurious escape.
              </p>
            </div>

            {/* Amenities */}
            <div style={{ paddingBottom: '24px', borderBottom: '1px solid #ebebeb', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#222', marginBottom: '24px' }}>
                What this place offers
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {amenities.map((a) => (
                  <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '22px' }}>{a.icon}</span>
                    <span style={{ fontSize: '15px', color: '#222' }}>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar - only for guests */}
            {!isHost && (
              <div style={{ paddingBottom: '24px', borderBottom: '1px solid #ebebeb', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#222', marginBottom: '8px' }}>
                  {nights} night{nights > 1 ? 's' : ''} in {listing.location.split(',')[0]}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#222', display: 'block', marginBottom: '6px' }}>CHECK-IN</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#222', display: 'block', marginBottom: '6px' }}>CHECKOUT</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Guests section - only for hosts */}
            {isHost && (
              <div style={{ paddingBottom: '24px', borderBottom: '1px solid #ebebeb', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#222', marginBottom: '24px' }}>
                  👥 Guest Bookings ({bookings.length})
                </h2>
                {bookings.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', background: '#f7f7f7', borderRadius: '12px' }}>
                    <p style={{ fontSize: '48px', marginBottom: '12px' }}>📭</p>
                    <p style={{ fontSize: '16px', color: '#717171' }}>No bookings yet for this listing</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {bookings.map((booking) => (
                      <div key={booking.id} style={{
                        border: '1px solid #ebebeb', borderRadius: '12px',
                        padding: '20px', display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            background: '#ff385c', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 700,
                          }}>
                            {booking.guest?.name?.charAt(0).toUpperCase() || 'G'}
                          </div>
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: 600, color: '#222' }}>
                              {booking.guest?.name || 'Guest'}
                            </div>
                            <div style={{ fontSize: '13px', color: '#717171' }}>
                              {booking.guest?.email}
                            </div>
                            <div style={{ fontSize: '13px', color: '#717171', marginTop: '4px' }}>
                              📅 {new Date(booking.checkIn).toLocaleDateString()} → {new Date(booking.checkOut).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: '#222' }}>
                            ${booking.totalPrice}
                          </div>
                          <span style={{
                            display: 'inline-block', marginTop: '4px',
                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                            background: booking.status === 'CONFIRMED' ? 'rgba(34,197,94,0.1)' :
                              booking.status === 'CANCELLED' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)',
                            color: booking.status === 'CONFIRMED' ? '#16a34a' :
                              booking.status === 'CANCELLED' ? '#dc2626' : '#ca8a04',
                          }}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#222', marginBottom: '24px' }}>
                ⭐ {listing.rating} · {reviews.length} reviews
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {reviews.map((r) => (
                  <div key={r.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <img src={r.avatar} alt={r.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#222' }}>{r.name}</div>
                        <div style={{ fontSize: '12px', color: '#717171' }}>{r.location}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#717171', marginBottom: '8px' }}>
                      {'★'.repeat(r.rating)} · {r.date} · {r.stayed}
                    </div>
                    <p style={{ fontSize: '14px', color: '#222', lineHeight: 1.6, margin: 0 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#222', marginBottom: '8px' }}>Where you'll be</h2>
              <p style={{ fontSize: '15px', color: '#717171', marginBottom: '16px' }}>{listing.location}</p>
              <div style={{ borderRadius: '16px', overflow: 'hidden', height: '300px' }}>
                <iframe
                  title="map" width="100%" height="300" style={{ border: 0 }} loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.location)}&output=embed`}
                />
              </div>
            </div>
          </div>

          {/* Right sidebar - only for guests */}
          {!isHost && (
            <div style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
              <div style={{ border: '1px solid #ddd', borderRadius: '16px', padding: '24px', boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                  <div>
                    <span style={{ textDecoration: 'line-through', color: '#717171', fontSize: '14px', marginRight: '6px' }}>${listing.price + 6}</span>
                    <span style={{ fontSize: '22px', fontWeight: 700, color: '#222' }}>${listing.price}</span>
                    <span style={{ fontSize: '14px', color: '#717171' }}> night</span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#222' }}>⭐ {listing.rating} · {reviews.length} reviews</span>
                </div>

                <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #ddd' }}>
                    <div style={{ padding: '12px', borderRight: '1px solid #ddd' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#222', marginBottom: '4px' }}>CHECK-IN</div>
                      <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                        style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%', cursor: 'pointer' }} />
                    </div>
                    <div style={{ padding: '12px' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#222', marginBottom: '4px' }}>CHECKOUT</div>
                      <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                        style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%', cursor: 'pointer' }} />
                    </div>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#222', marginBottom: '4px' }}>GUESTS</div>
                    <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}
                      style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%', cursor: 'pointer' }}>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => isAuthenticated ? navigate(`/listings/${listing.id}/book`) : navigate('/login')}
                  style={{
                    width: '100%', background: 'linear-gradient(to right, #e61e4d, #e31c5f, #d70466)',
                    color: '#fff', border: 'none', borderRadius: '8px',
                    padding: '14px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', marginBottom: '12px',
                  }}
                >Reserve</button>
                <p style={{ textAlign: 'center', fontSize: '13px', color: '#717171', margin: '0 0 16px' }}>You won't be charged yet</p>

                {checkIn && checkOut && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#222' }}>${listing.price} × {nights} night{nights > 1 ? 's' : ''}</span>
                      <span style={{ fontSize: '14px', color: '#222' }}>${listing.price * nights}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#222' }}>Cleaning fee</span>
                      <span style={{ fontSize: '14px', color: '#222' }}>$25</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ fontSize: '14px', color: '#222' }}>Airbnb service fee</span>
                      <span style={{ fontSize: '14px', color: '#222' }}>$18</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #ddd' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#222' }}>Total before taxes</span>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#222' }}>${total + 43}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}