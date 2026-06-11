import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Role } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('guest');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password, role, username);
      navigate(role === 'host' ? '/host/dashboard' : '/');
    } catch {
      // error already shown by toast in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '80px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
        Create account
      </h1>
      <p style={{ color: '#717171', marginBottom: '32px' }}>Join Airbnb today</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="John Doe" required style={inputStyle} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
            placeholder="johndoe" required style={inputStyle} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" required style={inputStyle} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
  placeholder="••••••••" required minLength={8} style={inputStyle} />
<p style={{ fontSize: '12px', color: '#717171', marginTop: '4px' }}>
  Minimum 8 characters
</p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>I want to</label>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)} style={inputStyle}>
            <option value="guest">Travel as a Guest</option>
            <option value="host">Host my property</option>
          </select>
        </div>

        <button type="submit" disabled={loading} style={{
          ...submitStyle,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#717171' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#ff385c', fontWeight: 600 }}>Log in</Link>
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