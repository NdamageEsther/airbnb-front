import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/hooks/useAuth';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: '240px', background: '#0f172a', color: '#fff',
        display: 'flex', flexDirection: 'column', padding: '24px 0',
        position: 'fixed', top: 0, left: 0, height: '100vh',
      }}>
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid #1e293b' }}>
          <span style={{ fontSize: '20px', color: '#ff385c', fontWeight: 700 }}>
            ✦ Admin Panel
          </span>
        </div>

        <nav style={{ padding: '16px 0', flex: 1 }}>
          {[
            { to: '/admin/dashboard', label: '📊 Dashboard' },
            { to: '/admin/moderation', label: '🔍 Moderation' },
            { to: '/admin/users', label: '👥 Users' },
            { to: '/admin/bookings', label: '📅 All Bookings' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'block', padding: '10px 24px',
              color: isActive ? '#ff385c' : '#94a3b8',
              textDecoration: 'none', fontSize: '14px', fontWeight: 500,
              background: isActive ? 'rgba(255,56,92,0.1)' : 'transparent',
            })}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Back to Home button */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #1e293b' }}>
          <Link
            to="/"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              color: '#fff', fontSize: '14px', fontWeight: 600,
              textDecoration: 'none', background: '#ff385c',
              borderRadius: '8px', padding: '10px 16px',
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </aside>

      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 32px', borderBottom: '1px solid #f0ede8', background: '#fff',
        }}>
          <span style={{ fontSize: '14px', color: '#717171' }}>
            Admin: <strong>{user?.name}</strong>
          </span>
          <button onClick={() => { logout(); navigate('/'); }} style={{
            background: '#ff385c', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer',
          }}>
            Log out
          </button>
        </header>

        <main style={{ flex: 1, padding: '32px', background: '#f8fafc' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}