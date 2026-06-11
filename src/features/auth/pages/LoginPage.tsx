import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      // error already shown by toast in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '80px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
        Welcome back
      </h1>
      <p style={{ color: '#717171', marginBottom: '32px' }}>Log in to your account</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" required style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" required style={inputStyle}
          />
        </div>
        <button type="submit" disabled={loading} style={{
          ...submitStyle,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#717171' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#ff385c', fontWeight: 600 }}>Sign up</Link>
      </p>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #e0ddd8',
  borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
};
const submitStyle: React.CSSProperties = {
  width: '100%', background: '#ff385c', color: '#fff', border: 'none',
  borderRadius: '8px', padding: '12px', fontSize: '15px', fontWeight: 600,
};