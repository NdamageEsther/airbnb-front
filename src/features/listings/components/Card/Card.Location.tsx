import { useCard } from './Card';

export function CardLocation(): React.ReactElement {
  const { listing } = useCard();
  return (
    <p style={{ fontSize: '13px', color: '#717171', marginBottom: '4px' }}>
      📍 {listing.location}
    </p>
  );
}