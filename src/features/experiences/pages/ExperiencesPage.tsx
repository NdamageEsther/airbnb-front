import { useState } from 'react';
import { useExperiences } from '../hooks/useExperiences';
import { useAuth } from '../../auth/hooks/useAuth';
import { Spinner } from '../../../shared/components/Spinner';
import { Link } from 'react-router-dom';

const CATEGORY_ICONS: Record<string, string> = {
  SPORTS: '⚽', COOKING: '🍳', MUSIC: '🎵', ART: '🎨',
  NATURE: '🌿', CULTURE: '🏛️', FOOD: '🍜', ADVENTURE: '🧗',
};

export default function ExperiencesPage() {
  const { data: experiences = [], isLoading } = useExperiences();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  const categories = ['ALL', 'SPORTS', 'COOKING', 'MUSIC', 'ART', 'NATURE', 'CULTURE', 'FOOD', 'ADVENTURE'];

  const filtered = experiences.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q);
    const matchCategory = category === 'ALL' || e.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '40px', fontWeight: 700, marginBottom: '8px' }}>
            Experiences
          </h1>
          <p style={{ color: '#717171', fontSize: '16px' }}>
            Unique activities hosted by locals
          </p>
        </div>
        {isAuthenticated && (
          <Link to="/experiences/new" style={{
            background: '#ff385c', color: '#fff', textDecoration: 'none',
            padding: '12px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
          }}>
            + Create Experience
          </Link>
        )}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or location..."
          style={{
            width: '100%', padding: '12px 20px', border: '1.5px solid #e0ddd8',
            borderRadius: '50px', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} style={{
            padding: '8px 16px', borderRadius: '20px', border: '1.5px solid #e0ddd8',
            background: category === c ? '#222' : '#fff',
            color: category === c ? '#fff' : '#444',
            fontSize: '13px', fontWeight: 500, cursor: 'pointer',
          }}>
            {CATEGORY_ICONS[c] ?? ''} {c.charAt(0) + c.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading ? <Spinner /> : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
          <h2 style={{ marginBottom: '12px' }}>No experiences found</h2>
          <p style={{ color: '#717171' }}>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filtered.map((exp) => (
            <div key={exp.id} style={{
              background: '#fff', borderRadius: '16px', overflow: 'hidden',
              border: '1px solid #f0ede8', transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ position: 'relative', height: '200px', background: '#f0ede8' }}>
                {exp.img ? (
                  <img src={exp.img} alt={exp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
                    {CATEGORY_ICONS[exp.category] ?? '🎯'}
                  </div>
                )}
                <span style={{
                  position: 'absolute', top: '12px', left: '12px',
                  background: 'rgba(255,255,255,0.92)', padding: '4px 10px',
                  borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                }}>
                  {CATEGORY_ICONS[exp.category]} {exp.category.charAt(0) + exp.category.slice(1).toLowerCase()}
                </span>
              </div>

              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px', color: '#222' }}>
                  {exp.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#717171', marginBottom: '8px' }}>
                  📍 {exp.location}
                </p>
                <p style={{ fontSize: '13px', color: '#717171', marginBottom: '8px' }}>
                  ⏱ {exp.duration}h · 👥 Max {exp.maxGuests} guests
                </p>
                <p style={{ fontSize: '13px', color: '#717171', marginBottom: '12px' }}>
                  Hosted by <strong>{exp.host.name}</strong>
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#222' }}>
                    ${exp.price} <span style={{ fontSize: '13px', fontWeight: 400, color: '#717171' }}>/ person</span>
                  </span>
                  <Link to={`/experiences/${exp.id}`} style={{
                    background: '#ff385c', color: '#fff', textDecoration: 'none',
                    padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  }}>
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}