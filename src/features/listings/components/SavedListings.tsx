import { Transition } from '@headlessui/react';
import { useStore } from '../../../store/StoreContext';

interface SavedListingsProps {
  show: boolean;
}

export function SavedListings({ show }: SavedListingsProps) {
  const { state } = useStore();
  const savedListings = state.listings.filter((l) =>
    state.saved.includes(l.id)
  );

  return (
    <Transition
      show={show}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0 translate-x-full"
      enterTo="opacity-100 translate-x-0"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-full"
    >
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '320px',
        height: '100vh',
        background: '#fff',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        padding: '24px',
        overflowY: 'auto',
        zIndex: 100,
      }}>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', marginBottom: '20px' }}>
          Saved Places
        </h2>
        {savedListings.length === 0 ? (
          <p style={{ color: '#717171', fontSize: '14px' }}>No saved listings yet.</p>
        ) : (
          savedListings.map((l) => (
            <div key={l.id} style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid #f0ede8',
            }}>
              <img src={l.img} alt={l.title} style={{
                width: '72px',
                height: '56px',
                objectFit: 'cover',
                borderRadius: '8px',
                flexShrink: 0,
              }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#222', marginBottom: '2px' }}>
                  {l.title}
                </p>
                <p style={{ fontSize: '12px', color: '#717171', marginBottom: '2px' }}>
                  {l.location}
                </p>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#222' }}>
                  ${l.price}<span style={{ fontWeight: 400, color: '#717171' }}>/night</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Transition>
  );
}