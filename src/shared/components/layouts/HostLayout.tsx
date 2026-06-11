import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/hooks/useAuth';

export function HostLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}
      <aside style={{
        width: '240px', background: '#1a1a1a', color: '#fff',
        display: 'flex', flexDirection: 'column', padding: '24px 0',
        position: 'fixed', top: 0, left: 0, height: '100vh',
      }}>
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid #333' }}>
          <span style={{ fontSize: '20px', color: '#ff385c', fontWeight: 700 }}>
            ✦ Host Panel
          </span>
        </div>

        <nav style={{ padding: '16px 0', flex: 1 }}>
          {[
            { to: '/host/dashboard', label: '📊 Dashboard' },
            { to: '/host/listings', label: '🏠 My Listings' },
            { to: '/host/listings/new', label: '➕ Add Listing' },
            { to: '/host/bookings', label: '📅 Bookings' },
            { to: '/profile', label: '👤 Profile' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'block', padding: '10px 24px',
              color: isActive ? '#ff385c' : '#ccc',
              textDecoration: 'none', fontSize: '14px', fontWeight: 500,
              background: isActive ? 'rgba(255,56,92,0.1)' : 'transparent',
            })}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Back to Home button */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #333' }}>
          <Link
            to="/"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              color: '#fff', fontSize: '14px', fontWeight: 600,
              textDecoration: 'none',
              background: '#ff385c', borderRadius: '8px',
              padding: '10px 16px',
              transition: 'background 0.2s',
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 32px', borderBottom: '1px solid #ebebeb', background: '#fff',
        }}>
          <span style={{ fontSize: '14px', color: '#717171' }}>
            Welcome, <strong>{user?.name || 'host'}</strong>
          </span>
          <button
            onClick={() => { logout(); navigate('/'); }}
            style={{
              background: 'none', border: '1px solid #ddd', borderRadius: '24px',
              padding: '8px 16px', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', color: '#222',
            }}
          >
            Log out
          </button>
        </header>

        <main style={{ flex: 1, padding: '32px', background: '#f7f7f7' }}>
          <Outlet />
        </main>
      </div>

    </div>
  );
}