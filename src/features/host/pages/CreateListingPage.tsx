import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { listingSchema, type ListingFormData } from '../schemas/listing';
import { useCreateListing } from '../hooks/useCreateListing';

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { mutate: createListing, isPending } = useCreateListing();

  const { register, handleSubmit, formState: { errors } } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema) as any,
    defaultValues: { available: true, superhost: false, category: 'beach' },
  });

  const onSubmit = (data: ListingFormData) => createListing({
    ...data,
    img: imageBase64 || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    imageFile: imageFile || undefined,
  } as any);

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', marginBottom: '24px' }}>
        Add New Listing
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>Basic Info</h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Title</label>
            <input {...register('title')} placeholder="Cozy beachfront villa..." style={inputStyle} />
            {errors.title && <p style={errStyle}>{errors.title.message}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Description</label>
            <textarea {...register('description')} placeholder="Describe your place (min 50 chars)..." style={{ ...inputStyle, height: '100px', resize: 'vertical' }} />
            {errors.description && <p style={errStyle}>{errors.description.message}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Location</label>
            <input {...register('location')} placeholder="City, Country" style={inputStyle} />
            {errors.location && <p style={errStyle}>{errors.location.message}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Price per night ($)</label>
            <input type="number" {...register('price')} placeholder="150" style={inputStyle} />
            {errors.price && <p style={errStyle}>{errors.price.message}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) {
                  alert('File must be under 5MB');
                  return;
                }
                setImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64 = reader.result as string;
                  setPreview(base64);
                  setImageBase64(base64);
                };
                reader.readAsDataURL(file);
              }}
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{ marginTop: '10px', width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
              />
            )}
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitle}>Details & Availability</h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Category</label>
            <select {...register('category')} style={inputStyle}>
              {['beach', 'mountain', 'city', 'countryside'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p style={errStyle}>{errors.category.message}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Available From</label>
            <input type="date" {...register('availableFrom')} style={inputStyle} />
            {errors.availableFrom && <p style={errStyle}>{errors.availableFrom.message}</p>}
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" {...register('superhost')} /> Superhost
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" {...register('available')} /> Available now
            </label>
          </div>
        </section>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" onClick={() => navigate('/host/dashboard')} style={cancelStyle}>
            Cancel
          </button>
          <button type="submit" disabled={isPending} style={{ ...submitStyle, opacity: isPending ? 0.7 : 1 }}>
            {isPending ? 'Saving...' : 'Save Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}

const sectionStyle: React.CSSProperties = { background: '#fff', border: '1px solid #f0ede8', borderRadius: '12px', padding: '24px', marginBottom: '20px' };
const sectionTitle: React.CSSProperties = { fontSize: '16px', fontWeight: 600, marginBottom: '16px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1.5px solid #e0ddd8', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' };
const errStyle: React.CSSProperties = { color: '#dc2626', fontSize: '12px', marginTop: '4px' };
const submitStyle: React.CSSProperties = { background: '#ff385c', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' };
const cancelStyle: React.CSSProperties = { background: '#fff', color: '#222', border: '1.5px solid #e0ddd8', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' };