import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { listingSchema, type ListingFormData } from '../schemas/listing';
import { useUpdateListing } from '../hooks/useUpdateListing';
import { useListing } from '../../listings/hooks/useListing';
import { Spinner } from '../../../shared/components/Spinner';

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: listing, isLoading } = useListing(id);
  const { mutate: updateListing, isPending } = useUpdateListing(id ?? '');

  const { register, handleSubmit, formState: { errors } } = useForm<ListingFormData>({
  resolver: zodResolver(listingSchema) as any,
  values: listing ? {
      title: listing.title,
      description: listing.description ?? 'Existing listing description goes here for editing.',
      location: listing.location,
      price: listing.price,
      category: listing.category,
      superhost: listing.superhost,
      available: listing.available,
      availableFrom: listing.availableFrom,
    } : undefined,
  });

  if (isLoading) return <Spinner />;
  if (!listing) return <p>Listing not found.</p>;

  const onSubmit = (data: ListingFormData) => updateListing(data);

  const handleDelete = () => {
    if (window.confirm('Delete this listing?')) navigate('/host/dashboard');
  };

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', marginBottom: '24px' }}>
        Edit Listing
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section style={sectionStyle}>
          {[
            { name: 'title' as const, label: 'Title', type: 'text' },
            { name: 'location' as const, label: 'Location', type: 'text' },
            { name: 'price' as const, label: 'Price per night ($)', type: 'number' },
          ].map(({ name, label, type }) => (
            <div key={name} style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>{label}</label>
              <input type={type} {...register(name)} style={inputStyle} />
              {errors[name] && <p style={errStyle}>{errors[name]?.message}</p>}
            </div>
          ))}

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Description</label>
            <textarea {...register('description')} style={{ ...inputStyle, height: '100px', resize: 'vertical' }} />
            {errors.description && <p style={errStyle}>{errors.description.message}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Category</label>
            <select {...register('category')} style={inputStyle}>
              {['beach', 'mountain', 'city', 'countryside'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Available From</label>
            <input type="date" {...register('availableFrom')} style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input type="checkbox" {...register('superhost')} /> Superhost
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input type="checkbox" {...register('available')} /> Available
            </label>
          </div>
        </section>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="button" onClick={handleDelete} style={{ ...cancelStyle, color: '#ff385c', borderColor: '#ff385c' }}>
            Delete Listing
          </button>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={() => navigate('/host/dashboard')} style={cancelStyle}>Cancel</button>
            <button type="submit" disabled={isPending} style={{ ...submitStyle, opacity: isPending ? 0.7 : 1 }}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const sectionStyle: React.CSSProperties = { background: '#fff', border: '1px solid #f0ede8', borderRadius: '12px', padding: '24px', marginBottom: '20px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1.5px solid #e0ddd8', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' };
const errStyle: React.CSSProperties = { color: '#dc2626', fontSize: '12px', marginTop: '4px' };
const submitStyle: React.CSSProperties = { background: '#ff385c', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' };
const cancelStyle: React.CSSProperties = { background: '#fff', color: '#222', border: '1.5px solid #e0ddd8', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' };