import { useState } from 'react';

const USERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'guest', since: '2025-01-10', listings: 0, bookings: 5, banned: false },
  { id: 2, name: 'Bob Smith', email: 'host@example.com', role: 'host', since: '2025-03-22', listings: 3, bookings: 0, banned: false },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'guest', since: '2025-06-01', listings: 0, bookings: 2, banned: true },
  { id: 4, name: 'Admin User', email: 'admin@example.com', role: 'admin', since: '2024-12-01', listings: 0, bookings: 0, banned: false },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [banned, setBanned] = useState<number[]>(USERS.filter((u) => u.banned).map((u) => u.id));

  const filtered = USERS.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', marginBottom: '24px' }}>Users</h1>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          placeholder="Search by name or email..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e0ddd8', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ padding: '10px 14px', border: '1.5px solid #e0ddd8', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
          <option value="all">All Roles</option>
          <option value="guest">Guest</option>
          <option value="host">Host</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div style={{ background: '#fff', border: '1px solid #f0ede8', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f8f6f3', borderBottom: '1px solid #f0ede8' }}>
              {['Name', 'Email', 'Role', 'Since', 'Listings', 'Bookings', 'Status', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '13px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f0ede8' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{u.name}</td>
                <td style={{ padding: '12px 16px', color: '#717171' }}>{u.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                    background: u.role === 'admin' ? 'rgba(99,102,241,0.1)' : u.role === 'host' ? 'rgba(251,191,36,0.1)' : 'rgba(34,197,94,0.1)',
                    color: u.role === 'admin' ? '#4f46e5' : u.role === 'host' ? '#92400e' : '#16a34a',
                    textTransform: 'capitalize',
                  }}>{u.role}</span>
                </td>
                <td style={{ padding: '12px 16px', color: '#717171' }}>{u.since}</td>
                <td style={{ padding: '12px 16px' }}>{u.listings}</td>
                <td style={{ padding: '12px 16px' }}>{u.bookings}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                    background: banned.includes(u.id) ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                    color: banned.includes(u.id) ? '#dc2626' : '#16a34a',
                  }}>
                    {banned.includes(u.id) ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => {
                      if (banned.includes(u.id)) {
                        setBanned((b) => b.filter((id) => id !== u.id));
                      } else if (window.confirm(`Ban ${u.name}?`)) {
                        setBanned((b) => [...b, u.id]);
                      }
                    }} style={{
                      background: banned.includes(u.id) ? '#16a34a' : '#dc2626',
                      color: '#fff', border: 'none', borderRadius: '6px',
                      padding: '4px 10px', fontSize: '12px', cursor: 'pointer',
                    }}>
                      {banned.includes(u.id) ? 'Unban' : 'Ban'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}