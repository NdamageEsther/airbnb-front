import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useListing } from '../../listings/hooks/useListing';
import { step1Schema, step2Schema, step3Schema } from '../schemas/booking';
import type { Step1Data, Step2Data, Step3Data } from '../schemas/booking';
import { Spinner } from '../../../shared/components/Spinner';
import { api } from '../../../lib/api';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

type AllData = Step1Data & Step2Data & Step3Data;

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: listing, isLoading } = useListing(id);
  const [step, setStep] = useState(1);
  const [allData, setAllData] = useState<Partial<AllData>>({});
  const [preview, setPreview] = useState<string>('');
  const [payOption, setPayOption] = useState<'now' | 'later'>('now');

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) as any });
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema) });
  const form3 = useForm<Step3Data>({ resolver: zodResolver(step3Schema) });

  if (isLoading) return <Spinner />;
  if (!listing) return <p>Listing not found</p>;

  const nights = allData.checkIn && allData.checkOut
    ? Math.max(1, Math.ceil((new Date(allData.checkOut).getTime() - new Date(allData.checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  const total = nights * listing.price;
  const cleaningFee = 25;
  const serviceFee = 18;
  const grandTotal = total + cleaningFee + serviceFee;

  const stepTitles = ['Dates & Guests', 'Guest Info', 'Payment', 'Confirm'];


  const handleConfirm = async () => {
   
    try {
      await api.post('/bookings', {
        listingId: String(listing.id),
        checkIn: allData.checkIn,
        checkOut: allData.checkOut,
      });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me'] });
      toast.success('Booking confirmed! 🎉');
      navigate('/bookings');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create booking');
    } finally {
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Circular, -apple-system, sans-serif' }}>

      {/* Top bar */}
      <div style={{ borderBottom: '1px solid #ebebeb', padding: '16px 40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#222' }}>←</button>
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#222' }}>Confirm and pay</span>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '64px' }}>

        {/* Left column */}
        <div>
          {/* Progress steps */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {stepTitles.map((title, i) => (
              <div key={title} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 4px',
                  background: step > i + 1 ? '#16a34a' : step === i + 1 ? '#ff385c' : '#e0e0e0',
                  color: step >= i + 1 ? '#fff' : '#717171',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 600,
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <p style={{ fontSize: '11px', color: step === i + 1 ? '#ff385c' : '#717171', margin: 0 }}>{title}</p>
              </div>
            ))}
          </div>

          {/* Step 1 - Dates & Guests */}
          {step === 1 && (
            <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>1. Choose when to pay</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {[
                  { value: 'now', label: `Pay $${grandTotal} now`, sub: '' },
                  { value: 'later', label: 'Pay $0 now', sub: `$${grandTotal} charged on ${allData.checkIn || 'check-in date'}. No extra fees.` },
                ].map((opt) => (
                  <label key={opt.value} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '12px', border: `1px solid ${payOption === opt.value ? '#222' : '#ddd'}`, borderRadius: '8px' }}>
                    <input type="radio" name="payOption" value={opt.value} checked={payOption === opt.value} onChange={() => setPayOption(opt.value as 'now' | 'later')} style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 500, color: '#222' }}>{opt.label}</div>
                      {opt.sub && <div style={{ fontSize: '13px', color: '#717171', marginTop: '2px' }}>{opt.sub}</div>}
                    </div>
                  </label>
                ))}
              </div>
              <form onSubmit={form1.handleSubmit((data) => { setAllData((prev) => ({ ...prev, ...data })); setStep(2); })}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={labelStyle}>Check-in</label>
                    <input type="date" {...form1.register('checkIn')} style={inputStyle} />
                    {form1.formState.errors.checkIn && <p style={errStyle}>{form1.formState.errors.checkIn?.message}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Check-out</label>
                    <input type="date" {...form1.register('checkOut')} style={inputStyle} />
                    {form1.formState.errors.checkOut && <p style={errStyle}>{form1.formState.errors.checkOut?.message}</p>}
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Guests</label>
                  <input type="number" min={1} max={16} {...form1.register('guests')} style={inputStyle} />
                  {form1.formState.errors.guests && <p style={errStyle}>{form1.formState.errors.guests.message}</p>}
                </div>
                <button type="submit" style={btnStyle}>Next →</button>
              </form>
            </div>
          )}

          {/* Step 2 - Guest Info */}
          {step === 2 && (
            <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>2. Add a payment method</h2>
              <form onSubmit={form2.handleSubmit((data) => { setAllData((prev) => ({ ...prev, ...data })); setStep(3); })}>
                {[
                  { name: 'name' as const, label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                  { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'john@example.com' },
                  { name: 'phone' as const, label: 'Phone', type: 'tel', placeholder: '+1 234 567 8900' },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name} style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>{label}</label>
                    <input type={type} placeholder={placeholder} {...form2.register(name)} style={inputStyle} />
                    {form2.formState.errors[name] && <p style={errStyle}>{form2.formState.errors[name]?.message}</p>}
                  </div>
                ))}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Profile Photo (optional)</label>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setPreview(URL.createObjectURL(file));
                  }} />
                  {preview && <img src={preview} alt="preview" style={{ marginTop: '10px', width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }} />}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setStep(1)} style={backBtnStyle}>← Back</button>
                  <button type="submit" style={btnStyle}>Next →</button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3 - Payment */}
          {step === 3 && (
            <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>3. Review your reservation</h2>
              <form onSubmit={form3.handleSubmit((data) => { setAllData((prev) => ({ ...prev, ...data })); setStep(4); })}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" {...form3.register('cardNumber')} style={inputStyle} maxLength={19} />
                  {form3.formState.errors.cardNumber && <p style={errStyle}>{form3.formState.errors.cardNumber.message}</p>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Expiry (MM/YY)</label>
                    <input type="text" placeholder="MM/YY" {...form3.register('expiry')} style={inputStyle} maxLength={5} />
                    {form3.formState.errors.expiry && <p style={errStyle}>{form3.formState.errors.expiry.message}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>CVV</label>
                    <input type="text" placeholder="123" {...form3.register('cvv')} style={inputStyle} maxLength={3} />
                    {form3.formState.errors.cvv && <p style={errStyle}>{form3.formState.errors.cvv.message}</p>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setStep(2)} style={backBtnStyle}>← Back</button>
                  <button type="submit" style={btnStyle}>Next →</button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4 - Confirm */}
          {step === 4 && (
            <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>4. Confirm your booking</h2>
              <div style={{ background: '#f7f7f7', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                {[
                  { label: 'Listing', value: listing.title },
                  { label: 'Check-in', value: allData.checkIn },
                  { label: 'Check-out', value: allData.checkOut },
                  { label: 'Nights', value: nights },
                  { label: 'Guests', value: allData.guests },
                  { label: 'Name', value: allData.name },
                  { label: 'Email', value: allData.email },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontSize: '14px', color: '#717171' }}>{row.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#222' }}>{String(row.value || '-')}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#222' }}>Total</span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#222' }}>${grandTotal}</span>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#717171', marginBottom: '20px' }}>
                By confirming, you agree to the booking terms and cancellation policy.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setStep(3)} style={backBtnStyle}>← Back</button>
                <button onClick={handleConfirm} style={{ ...btnStyle, flex: 1 }}>
                  Confirm Booking 🎉
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
          <div style={{ border: '1px solid #ddd', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <img src={listing.img} alt={listing.title} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#222', marginBottom: '4px' }}>{listing.title}</div>
                <div style={{ fontSize: '12px', color: '#717171' }}>⭐ {listing.rating} · Guest favorite</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #ddd', paddingTop: '16px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#222', marginBottom: '12px' }}>Price details</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#222' }}>${listing.price} × {nights} night{nights > 1 ? 's' : ''}</span>
                <span style={{ fontSize: '14px', color: '#222' }}>${total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#222' }}>Cleaning fee</span>
                <span style={{ fontSize: '14px', color: '#222' }}>${cleaningFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', color: '#222' }}>Service fee</span>
                <span style={{ fontSize: '14px', color: '#222' }}>${serviceFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #ddd' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#222' }}>Total USD</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#222' }}>${grandTotal}</span>
              </div>
            </div>

            {/* Free cancellation */}
            <div style={{ marginTop: '16px', padding: '12px', background: '#f7f7f7', borderRadius: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#222', marginBottom: '4px' }}>Free cancellation</div>
              <div style={{ fontSize: '12px', color: '#717171' }}>Cancel before check-in for a full refund.</div>
            </div>

            {/* Rare find */}
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#fff0f3', borderRadius: '8px' }}>
              <span style={{ fontSize: '20px' }}>💎</span>
              <span style={{ fontSize: '13px', color: '#222', fontWeight: 500 }}>Rare find! This place is usually booked.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: 600, color: '#222', marginBottom: '6px',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #e0ddd8',
  borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
};
const errStyle: React.CSSProperties = {
  color: '#dc2626', fontSize: '12px', marginTop: '4px',
};
const btnStyle: React.CSSProperties = {
  width: '100%', background: 'linear-gradient(to right, #e61e4d, #e31c5f, #d70466)',
  color: '#fff', border: 'none', borderRadius: '8px',
  padding: '14px', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
};
const backBtnStyle: React.CSSProperties = {
  padding: '14px 20px', background: '#fff', border: '1px solid #ddd',
  borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#222',
};