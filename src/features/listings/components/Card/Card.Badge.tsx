import { useCard } from './Card';

export function CardBadge(): React.ReactElement | null {
  const { listing } = useCard();
  if (!listing.superhost) return null;
  return (
    <span style={{
      background: '#f0ede8', padding: '2px 10px',
      borderRadius: '20px', fontSize: '11px', fontWeight: 600,
    }}>
      Superhost
    </span>
  );
}