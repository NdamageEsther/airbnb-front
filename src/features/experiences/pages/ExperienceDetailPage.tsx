import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDeleteExperience } from '../hooks/useExperiences';
import { Spinner } from '../../../shared/components/Spinner';
import type { Experience } from '../hooks/useExperiences';

const CATEGORY_ICONS: Record<string, string> = {
  SPORTS: '⚽', COOKING: '🍳', MUSIC: '🎵', ART: '🎨',
  NATURE: '🌿', CULTURE: '🏛️', FOOD: '🍜', ADVENTURE: '🧗',
};

export default function ExperienceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { mutate: deleteExp } = useDeleteExperience();

  const { data: exp, isLoading } = useQuery<Experience>({
    queryKey: ['experience', id],
    queryFn: () => api.get<Experience>(`/experiences/${id}`),
    enabled: !!id,
  });

  if (isLoading) return <Spinner />;

  if (!exp) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
      <h2 style={{ marginBottom: '12px' }}>Experience not found</h2>
      <Link to="/experiences" style={{ color: '#ff385c', fontWeight: 600 }}>
        Browse experiences
      </Link>
    </div>
  );

  const isOwner = user?.id === exp.hostId;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Back button */}
      <button onClick={() => navigate(-1)} style={{
        background: 'none', border: '1px solid #e0ddd8', borderRadius: '8px',
        padding: '8px 16px', cursor: 'pointer', marginBottom: '24px',
        fontSize: '14px', fontWeight: 500,
      }}>
        ← Back
      </button>

      {/* Image */}
      <div style={{
        borderRadius: '16px', overflow: 'hidden',
        marginBottom: '32px', height: '400px', background: '#f0ede8',
      }}>
        {exp.img ? (
          <img src={exp.img} alt={exp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '96px',
          }}>
            {CATEGORY_ICONS[exp.category] ?? '🎯'}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '32px' }}>

        {/* Left — details */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{
              background: '#f0ede8', padding: '4px 12px',
              borderRadius: '20px', fontSize: '12px', fontWeight: 600,
            }}>
              {CATEGORY_ICONS[exp.category]} {exp.category.charAt(0) + exp.category.slice(1).toLowerCase()}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Fraunces, serif', fontSize: '32px',
            fontWeight: 700, marginBottom: '12px', color: '#222',
          }}>
            {exp.title}
          </h1>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', color: '#717171' }}>📍 {exp.location}</span>
            <span style={{ fontSize: '14px', color: '#717171' }}>⏱ {exp.duration} hours</span>
            <span style={{ fontSize: '14px', color: '#717171' }}>👥 Max {exp.maxGuests} guests</span>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '16px', background: '#f7f5f2', borderRadius: '12px', marginBottom: '24px',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: '#ff385c', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 700,
              flexShrink: 0,
            }}>
              {exp.host.name[0].toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#717171', margin: 0 }}>Hosted by</p>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#222', margin: 0 }}>
                {exp.host.name}
              </p>
            </div>
          </div>

          <div style={{
            paddingBottom: '24px', borderBottom: '1px solid #f0ede8', marginBottom: '24px',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#222' }}>
              About this experience
            </h2>
            <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.7, margin: 0 }}>
              {exp.description}
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#222' }}>
              What to expect
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '⏱', label: 'Duration', value: `${exp.duration} hour${exp.duration > 1 ? 's' : ''}` },
                { icon: '👥', label: 'Group size', value: `Up to ${exp.maxGuests} guests` },
                { icon: '📍', label: 'Location', value: exp.location },
                { icon: '🏷️', label: 'Category', value: exp.category.charAt(0) + exp.category.slice(1).toLowerCase() },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px', width: '28px' }}>{icon}</span>
                  <div>
                    <p style={{ fontSize: '12px', color: '#717171', margin: 0 }}>{label}</p>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#222', margin: 0 }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — booking card */}
        <div style={{ width: '340px', flexShrink: 0 }}>
          <div style={{
            border: '1px solid #e0ddd8', borderRadius: '16px',
            padding: '24px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            position: 'sticky', top: '80px',
          }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '26px', fontWeight: 700, color: '#222' }}>
                ${exp.price}
              </span>
              <span style={{ fontSize: '14px', color: '#717171' }}> / person</span>
            </div>

            {isAuthenticated && !isOwner && (
              <button style={{
                width: '100%', background: 'linear-gradient(to right, #e61e4d, #e31c5f, #d70466)',
                color: '#fff', border: 'none', borderRadius: '8px',
                padding: '14px', fontSize: '16px', fontWeight: 600,
                cursor: 'pointer', marginBottom: '12px',
              }}>
                Book Experience
              </button>
            )}

            {!isAuthenticated && (
              <Link to="/login" style={{
                display: 'block', textAlign: 'center', width: '100%',
                background: 'linear-gradient(to right, #e61e4d, #e31c5f, #d70466)',
                color: '#fff', textDecoration: 'none', borderRadius: '8px',
                padding: '14px', fontSize: '16px', fontWeight: 600,
                marginBottom: '12px', boxSizing: 'border-box',
              }}>
                Log in to book
              </Link>
            )}

            {isOwner && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to={`/experiences/${exp.id}/edit`} style={{
                  display: 'block', textAlign: 'center', background: '#222',
                  color: '#fff', textDecoration: 'none', padding: '12px',
                  borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                }}>
                  ✏️ Edit Experience
                </Link>
                <button onClick={() => {
                  if (window.confirm('Are you sure you want to delete this experience?')) {
                    deleteExp(exp.id);
                    navigate('/experiences');
                  }
                }} style={{
                  width: '100%', background: '#fff', color: '#ff385c',
                  border: '1.5px solid #ff385c', borderRadius: '8px',
                  padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                }}>
                  🗑️ Delete Experience
                </button>
              </div>
            )}

            <p style={{
              textAlign: 'center', fontSize: '12px',
              color: '#717171', margin: '12px 0 0',
            }}>
              You won't be charged yet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}