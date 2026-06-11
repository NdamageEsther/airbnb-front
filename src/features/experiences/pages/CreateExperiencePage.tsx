import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateExperience } from '../hooks/useExperiences';

const CATEGORIES = ['SPORTS', 'COOKING', 'MUSIC', 'ART', 'NATURE', 'CULTURE', 'FOOD', 'ADVENTURE'];

const CATEGORY_ICONS: Record<string, string> = {
  SPORTS: '⚽', COOKING: '🍳', MUSIC: '🎵', ART: '🎨',
  NATURE: '🌿', CULTURE: '🏛️', FOOD: '🍜', ADVENTURE: '🧗',
};

export default function CreateExperiencePage() {
  const navigate = useNavigate();
  const { mutate: create, isPending } = useCreateExperience();
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

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create(
      {
        ...form,
        price: Number(form.price),
        duration: Number(form.duration),
        maxGuests: Number(form.maxGuests),
      },
      {
        onSuccess: () => navigate('/experiences'),
      }
    );
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 24px' }}>

      <button onClick={() => navigate('/experiences')} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: '14px', fontWeight: 500, color: '#222',
        marginBottom: '24px', padding: 0, display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        ← Back to Experiences
      </button>

      <h1 style={{
        fontFamily: 'Fraunces, serif', fontSize: '32px',
        fontWeight: 700, marginBottom: '8px', color: '#222',
      }}>
        Create an Experience
      </h1>
      <p style={{ color: '#717171', marginBottom: '32px', fontSize: '14px' }}>
        Share your passion with guests from around the world.
      </p>

      <form onSubmit={handleSubmit}>

        {/* Basic Info */}
        <div style={sectionStyle}>
          <h2 style={sectionTitle}>Basic Info</h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              placeholder="e.g. Cooking class with a local chef..."
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              placeholder="Describe your experience in detail. What will guests do? What will they learn?"
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
              placeholder="City, Country"
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
                placeholder="50"
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
                placeholder="3"
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
                placeholder="10"
                min="1"
                value={form.maxGuests}
                onChange={(e) => set('maxGuests', e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/experiences')}
            style={cancelStyle}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            style={{ ...submitStyle, opacity: isPending ? 0.7 : 1 }}
          >
            {isPending ? 'Creating...' : '✦ Create Experience'}
          </button>
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
  flex: 1, background: '#ff385c', color: '#fff', border: 'none',
  borderRadius: '8px', padding: '12px', fontSize: '15px',
  fontWeight: 600, cursor: 'pointer',
};
const cancelStyle: React.CSSProperties = {
  background: '#fff', color: '#222', border: '1.5px solid #e0ddd8',
  borderRadius: '8px', padding: '12px 24px', fontSize: '15px',
  fontWeight: 600, cursor: 'pointer',
};