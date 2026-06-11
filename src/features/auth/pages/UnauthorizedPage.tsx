import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function UnauthorizedPage() {
  const { user } = useAuth();

  const homeLink = user?.role === 'host'
    ? '/host/dashboard'
    : user?.role === 'admin'
    ? '/admin/dashboard'
    : '/';

  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h1 style={{ fontSize: '64px' }}>🚫</h1>
      <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
        Access Denied
      </h2>
      <p style={{ color: '#717171', marginBottom: '8px' }}>
        You don't have permission to view this page.
      </p>
      <p style={{ color: '#717171', marginBottom: '24px' }}>
        Your current role: <strong>{user?.role ?? 'guest'}</strong>
      </p>
      <Link to={homeLink} style={{ color: '#ff385c', fontWeight: 600 }}>
        Go to your home page
      </Link>
    </div>
  );
}