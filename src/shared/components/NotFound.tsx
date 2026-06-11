import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h1 style={{ fontSize: '72px', fontWeight: 700, color: '#ff385c' }}>404</h1>
      <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Page not found</h2>
      <p style={{ color: '#717171', marginBottom: '24px' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" style={{ color: '#ff385c', fontWeight: 600 }}>
        Go home
      </Link>
    </div>
  );
}