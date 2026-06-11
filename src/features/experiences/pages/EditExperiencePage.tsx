import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useUpdateExperience, useDeleteExperience } from '../hooks/useExperiences';
import type { Experience } from '../hooks/useExperiences';
import { Spinner } from '../../../shared/components/Spinner';

const CATEGORIES = ['SPORTS', 'COOKING', 'MUSIC', 'ART', 'NATURE', 'CULTURE', 'FOOD', 'ADVENTURE'];

const CATEGORY_ICONS: Record<string, string> = {
  SPORTS: '⚽', COOKING: '🍳', MUSIC: '🎵', ART: '🎨',
  NATURE: '🌿', CULTURE: '🏛️', FOOD: '🍜', ADVENTURE: '🧗',
};

export default function EditExperiencePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutate: update, isPending } = useUpdateExperience(id ?? '');
  const { mutate: deleteExp } = useDeleteExperience();

  const { data: exp, isLoading } = useQuery<Experience>({
    queryKey: ['experience', id],
    queryFn: () => api.get<Experience>(`/experiences/${id}`),
    enabled: !!id,
  });

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    duration: '',
    maxGuests: '',
    category: 'SPORTS',
    img: '',
  });

  useEffect(() => {
    if (exp) {
      setForm({
        title: exp.title,
        description: exp.description,
        location: exp.location,
        price: String(exp.price),
        duration: String(exp.duration),
        maxGuests: String(exp.maxGuests),
        category: exp.category,
        img: exp.img ?? '',
      });
    }
  }, [exp]);

  if (isLoading) return <Spinner />;
  if (!exp) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h2>Experience not found</h2>
    </div>
  );

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update(
      {
        ...form,
        price: Number(form.price),
        duration: Number(form.duration),
        maxGuests: Number(form.maxGuests),
      },
      {
        onSuccess: () => navigate(`/experiences/${id}`),
      }
    );
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this experience? This cannot be undone.')) {
      deleteExp(exp.id, {
        onSuccess: () => navigate('/experiences'),
      });
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 24px' }}>

      <button onClick={() => navigate(`/experiences/${id}`)} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: '14px', fontWeight: 500, color: '#222',
        marginBottom: '24px', padding: 0, display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        ← Back to Experience
      </button>

      <h1 style={{
        fontFamily: 'Fraunces, serif', fontSize: '32px',
        fontWeight: 700, marginBottom: '8px', color: '#222',
      }}>
        Edit Experience
      </h1>
      <p style={{ color: '#717171', marginBottom: '32px', fontSize: '14px' }}>
        Update the details of your experience.
      </p>

      <form onSubmit={handleSubmit}>

        {/* Basic Info */}
        <div style={sectionStyle}>
          <h2 style={sectionTitle}>Basic Info</h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              style={{ ...inputStyle, height: '120px', resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Image URL (optional)</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={form.img}
              onChange={(e) => set('img', e.target.value)}
              style={inputStyle}
            />
            {form.img && (
              <img
                src={form.img}
                alt="preview"
                style={{
                  marginTop: '10px', width: '100%', height: '200px',
                  objectFit: 'cover', borderRadius: '8px',
                }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
          </div>
        </div>

        {/* Details */}
        <div style={sectionStyle}>
          <h2 style={sectionTitle}>Details</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Price per person ($)</label>
              <input
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Duration (hours)</label>
              <input
                type="number"
                min="1"
                value={form.duration}
                onChange={(e) => set('duration', e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Max Guests</label>
              <input
                type="number"
                min="1"
                value={form.maxGuests}
                onChange={(e) => set('maxGuests', e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('category', c)}
                  style={{
                    padding: '10px 8px', borderRadius: '8px', cursor: 'pointer',
                    border: form.category === c ? '2px solid #ff385c' : '1.5px solid #e0ddd8',
                    background: form.category === c ? '#fff5f5' : '#fff',
                    color: form.category === c ? '#ff385c' : '#444',
                    fontSize: '12px', fontWeight: 500, textAlign: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{CATEGORY_ICONS[c]}</div>
                  {c.charAt(0) + c.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              background: '#fff', color: '#ff385c',
              border: '1.5px solid #ff385c', borderRadius: '8px',
              padding: '12px 20px', fontSize: '14px',
              fontWeight: 600, cursor: 'pointer',
            }}
          >
            🗑️ Delete Experience
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={() => navigate(`/experiences/${id}`)}
              style={cancelStyle}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{ ...submitStyle, opacity: isPending ? 0.7 : 1 }}
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

const sectionStyle: React.CSSProperties = {
  background: '#fff', border: '1px solid #f0ede8',
  borderRadius: '12px', padding: '24px', marginBottom: '20px',
};
const sectionTitle: React.CSSProperties = {
  fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#222',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '14px', fontWeight: 500,
  marginBottom: '6px', color: '#222',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #e0ddd8',
  borderRadius: '8px', fontSize: '15px', outline: 'none',
  boxSizing: 'border-box', color: '#222',
};
const submitStyle: React.CSSProperties = {
  background: '#ff385c', color: '#fff', border: 'none',
  borderRadius: '8px', padding: '12px 24px', fontSize: '15px',
  fontWeight: 600, cursor: 'pointer',
};
const cancelStyle: React.CSSProperties = {
  background: '#fff', color: '#222', border: '1.5px solid #e0ddd8',
  borderRadius: '8px', padding: '12px 24px', fontSize: '15px',
  fontWeight: 600, cursor: 'pointer',
};