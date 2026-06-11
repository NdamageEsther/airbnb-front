import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', marginBottom: '24px' }}>
        My Profile
      </h1>

      <div style={{
        background: '#fff', border: '1px solid #f0ede8',
        borderRadius: '16px', padding: '24px', marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: '#ff385c', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: 700,
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '18px' }}>{user?.name}</p>
            <span style={{
              background: '#f0ede8', padding: '2px 10px', borderRadius: '20px',
              fontSize: '12px', fontWeight: 600, textTransform: 'capitalize',
            }}>
              {user?.role}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        </div>
        <button style={btnStyle}>Save Changes</button>
      </div>

      <button onClick={handleLogout} style={{
        ...btnStyle, background: 'none', color: '#ff385c',
        border: '1.5px solid #ff385c',
      }}>
        Log out
      </button>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #e0ddd8',
  borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
  marginBottom: '4px',
};
const btnStyle: React.CSSProperties = {
  background: '#ff385c', color: '#fff', border: 'none', borderRadius: '8px',
  padding: '10px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
};