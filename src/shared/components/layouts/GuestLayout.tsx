import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { useState, useEffect } from 'react';

export function GuestLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.startsWith('/experiences')
    ? 'Experiences'
    : location.pathname.startsWith('/services')
    ? 'Services'
    : 'Homes';

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState<'where' | 'when' | 'who' | null>(null);
  const [whereValue, setWhereValue] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestCounts, setGuestCounts] = useState({ adults: 0, children: 0, infants: 0, pets: 0 });
  const [locations, setLocations] = useState<string[]>([]);

  const totalGuests = guestCounts.adults + guestCounts.children;

  const handleSearch = () => setSearchOpen(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/listings?limit=100')
      .then(r => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const locs = [...new Set(data.map((l: any) => l.location).filter(Boolean))] as string[];
          setLocations(locs);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = () => setSearchOpen(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>

      {/* Top Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: '80px',
        borderBottom: '1px solid #ebebeb',
        background: '#fff', position: 'sticky', top: 0, zIndex: 50,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', minWidth: '100px' }}>
          <svg width="30" height="32" viewBox="0 0 30 32" fill="#ff385c">
            <path d="M15 0C9 0 0 10 0 18c0 5.5 3.5 9.5 8.5 11 1 .3 2 .5 3 .5 1.5 0 2.5-.5 3.5-1.5 1 1 2 1.5 3.5 1.5 1 0 2-.2 3-.5C26.5 27.5 30 23.5 30 18 30 10 21 0 15 0zm0 27c-.8 0-1.5-.7-1.5-1.5S14.2 24 15 24s1.5.7 1.5 1.5S15.8 27 15 27zm0-5c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/>
          </svg>
          <span style={{ color: '#ff385c', fontWeight: 700, fontSize: '22px', letterSpacing: '-0.5px' }}>airbnb</span>
        </Link>

        {/* Center Tabs */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {[
            { label: 'Homes', icon: '🏠' },
            { label: 'Experiences', icon: '🎈', isNew: true },
            { label: 'Services', icon: '🔔', isNew: true },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                if (tab.label === 'Experiences') navigate('/experiences');
                else if (tab.label === 'Services') navigate('/services');
                else navigate('/');
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '28px 16px', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: activeTab === tab.label ? '2px solid #222' : '2px solid transparent',
              }}
            >
              <span style={{ fontSize: '22px' }}>{tab.icon}</span>
              <span style={{ fontSize: '15px', fontWeight: activeTab === tab.label ? 600 : 400, color: '#222' }}>
                {tab.label}
              </span>
              {tab.isNew && (
                <span style={{ background: '#ff385c', color: 'white', fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '4px' }}>
                  NEW
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px', justifyContent: 'flex-end' }}>
          {!isAuthenticated ? (
            <>
              <Link to="/register" style={{ textDecoration: 'none', color: '#222', fontSize: '14px', fontWeight: 600, padding: '10px 14px', borderRadius: '24px', whiteSpace: 'nowrap' }}>
                Become a host
              </Link>
              <div style={{ position: 'relative' }}>
                <div
                  onClick={() => setMenuOpen((v) => !v)}
                  style={{ border: '1px solid #ddd', borderRadius: '24px', padding: '6px 6px 6px 14px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', cursor: 'pointer' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                  <div style={{ background: '#717171', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                    </svg>
                  </div>
                </div>
                {menuOpen && (
                  <div style={{ position: 'absolute', top: '52px', right: 0, background: '#fff', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', minWidth: '240px', zIndex: 100, overflow: 'hidden' }}>
                    <Link to="#" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 20px', fontSize: '14px', color: '#222', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>
                      Help Center
                    </Link>
                    <div
                      style={{ borderBottom: '1px solid #ebebeb', padding: '14px 20px', cursor: 'pointer' }}
                      onClick={() => { navigate('/register'); setMenuOpen(false); }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#222' }}>Become a host</div>
                      <div style={{ fontSize: '12px', color: '#717171' }}>It's easy to start hosting and earn extra income.</div>
                    </div>
                    {['Refer a Host', 'Find a co-host', 'Gift cards'].map((item) => (
                      <Link key={item} to="#" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 20px', fontSize: '14px', color: '#222', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>
                        {item}
                      </Link>
                    ))}
                    <Link to="/login" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 20px', fontSize: '14px', fontWeight: 600, color: '#222', textDecoration: 'none' }}>
                      Log in or sign up
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {user?.role === 'host' && <Link to="/host/dashboard" style={navLinkStyle}>Switch to hosting</Link>}
              {user?.role === 'admin' && <Link to="/admin/dashboard" style={navLinkStyle}>Admin panel</Link>}
              {user?.role === 'guest' && <Link to="/bookings" style={navLinkStyle}>My Bookings</Link>}
              <div style={{ position: 'relative' }}>
                <div
                  onClick={() => setMenuOpen((v) => !v)}
                  style={{ border: '1px solid #ddd', borderRadius: '24px', padding: '6px 6px 6px 14px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', cursor: 'pointer' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                  <div style={{ background: '#ff385c', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700 }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                {menuOpen && (
                  <div style={{ position: 'absolute', top: '52px', right: 0, background: '#fff', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', minWidth: '240px', zIndex: 100, overflow: 'hidden' }}>
                    {user?.role === 'guest' && (
                      <>
                        <Link to="/bookings" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 20px', fontSize: '14px', color: '#222', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>My Bookings</Link>
                        <Link to="/saved" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 20px', fontSize: '14px', color: '#222', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>Saved Listings</Link>
                      </>
                    )}
                    {user?.role === 'host' && (
                      <>
                        <Link to="/host/dashboard" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 20px', fontSize: '14px', fontWeight: 700, color: '#222', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>Host Dashboard</Link>
                        <Link to="/host/listings" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 20px', fontSize: '14px', color: '#222', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>My Listings</Link>
                        <Link to="/host/listings/new" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 20px', fontSize: '14px', color: '#222', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>+ Add New Listing</Link>
                        <Link to="/host/bookings" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 20px', fontSize: '14px', color: '#222', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>Bookings Received</Link>
                      </>
                    )}
                    {user?.role === 'admin' && (
                      <>
                        <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 20px', fontSize: '14px', fontWeight: 700, color: '#222', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>Admin Dashboard</Link>
                        <Link to="/admin/users" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 20px', fontSize: '14px', color: '#222', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>Manage Users</Link>
                        <Link to="/admin/bookings" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 20px', fontSize: '14px', color: '#222', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>All Bookings</Link>
                        <Link to="/admin/moderation" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 20px', fontSize: '14px', color: '#222', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>Moderation</Link>
                      </>
                    )}
                    <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 20px', fontSize: '14px', color: '#222', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>Profile</Link>
                    <div
                      onClick={() => { handleLogout(); setMenuOpen(false); }}
                      style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 600, color: '#222', cursor: 'pointer' }}
                    >
                      Log out
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Big Search Bar */}
      <div
        onClick={() => setSearchOpen(null)}
        style={{ background: '#fff', padding: '16px 24px', borderBottom: '1px solid #ebebeb', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 45 }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', width: '100%', maxWidth: '760px', position: 'relative' }}
        >
          {/* WHERE */}
          <div
            style={{ flex: 1, padding: '14px 24px', borderRight: '1px solid #ddd', cursor: 'pointer', position: 'relative', borderRadius: '40px 0 0 40px', background: searchOpen === 'where' ? '#f7f7f7' : 'transparent' }}
            onClick={() => setSearchOpen(searchOpen === 'where' ? null : 'where')}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#222' }}>Where</div>
            <input
              value={whereValue}
              onChange={(e) => { setWhereValue(e.target.value); setSearchOpen('where'); }}
              onClick={(e) => e.stopPropagation()}
              placeholder="Search destinations"
              style={{ border: 'none', outline: 'none', fontSize: '13px', color: '#222', width: '100%', background: 'transparent', cursor: 'text' }}
            />
            {searchOpen === 'where' && (
              <div style={{ position: 'absolute', top: '72px', left: 0, background: '#fff', border: '1px solid #ddd', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: '300px', zIndex: 200, overflow: 'hidden' }}>
                {locations.filter(l => l.toLowerCase().includes(whereValue.toLowerCase())).length === 0
                  ? <div style={{ padding: '20px', fontSize: '13px', color: '#717171' }}>No locations found</div>
                  : locations.filter(l => l.toLowerCase().includes(whereValue.toLowerCase())).map((loc) => (
                    <div
                      key={loc}
                      onClick={() => { setWhereValue(loc); setSearchOpen(null); }}
                      style={{ padding: '14px 20px', fontSize: '14px', color: '#222', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f7f7f7')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                    >
                      <span style={{ fontSize: '20px' }}>📍</span> {loc}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* WHEN */}
          <div
            style={{ flex: 1, padding: '14px 24px', borderRight: '1px solid #ddd', cursor: 'pointer', position: 'relative', background: searchOpen === 'when' ? '#f7f7f7' : 'transparent' }}
            onClick={() => setSearchOpen(searchOpen === 'when' ? null : 'when')}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#222' }}>When</div>
            <div style={{ fontSize: '13px', color: checkIn && checkOut ? '#222' : '#717171' }}>
              {checkIn && checkOut ? `${checkIn} → ${checkOut}` : 'Add dates'}
            </div>
            {searchOpen === 'when' && (
              <div
                onClick={e => e.stopPropagation()}
                style={{ position: 'absolute', top: '72px', left: '-20px', background: '#fff', border: '1px solid #ddd', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 200, padding: '24px', minWidth: '320px' }}
              >
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#222', marginBottom: '16px' }}>Select dates</div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#717171', display: 'block', marginBottom: '6px' }}>CHECK-IN</label>
                  <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#717171', display: 'block', marginBottom: '6px' }}>CHECKOUT</label>
                  <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <button onClick={() => setSearchOpen(null)} style={{ width: '100%', background: '#ff385c', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* WHO */}
          <div
            style={{ flex: 1, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', background: searchOpen === 'who' ? '#f7f7f7' : 'transparent', borderRadius: '0 40px 40px 0' }}
          >
            <div style={{ cursor: 'pointer' }} onClick={() => setSearchOpen(searchOpen === 'who' ? null : 'who')}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#222' }}>Who</div>
              <div style={{ fontSize: '13px', color: totalGuests > 0 ? '#222' : '#717171' }}>
                {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests'}
              </div>
            </div>
            <div
              onClick={handleSearch}
              style={{ background: '#ff385c', borderRadius: '50%', width: '40px', height: '40px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M10.5 2a8.5 8.5 0 105.962 14.477l4.28 4.28 1.415-1.414-4.28-4.28A8.5 8.5 0 0010.5 2zm0 2a6.5 6.5 0 110 13 6.5 6.5 0 010-13z"/>
              </svg>
            </div>
            {searchOpen === 'who' && (
              <div
                onClick={e => e.stopPropagation()}
                style={{ position: 'absolute', top: '72px', right: 0, background: '#fff', border: '1px solid #ddd', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 200, padding: '24px', minWidth: '320px' }}
              >
                {([
                  { label: 'Adults', sub: 'Ages 13 or above', key: 'adults' },
                  { label: 'Children', sub: 'Ages 2–12', key: 'children' },
                  { label: 'Infants', sub: 'Under 2', key: 'infants' },
                  { label: 'Pets', sub: 'Bringing a service animal?', key: 'pets' },
                ] as const).map(({ label, sub, key }) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#222' }}>{label}</div>
                      <div style={{ fontSize: '12px', color: '#717171' }}>{sub}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => setGuestCounts(g => ({ ...g, [key]: Math.max(0, g[key] - 1) }))}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >−</button>
                      <span style={{ fontSize: '14px', minWidth: '16px', textAlign: 'center' }}>{guestCounts[key]}</span>
                      <button
                        onClick={() => setGuestCounts(g => ({ ...g, [key]: g[key] + 1 }))}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >+</button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setSearchOpen(null)} style={{ width: '100%', background: '#ff385c', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

    </div>
  );
}

const navLinkStyle: React.CSSProperties = {
  textDecoration: 'none', color: '#222', fontSize: '14px',
  fontWeight: 600, padding: '10px 14px', borderRadius: '24px', whiteSpace: 'nowrap',
};