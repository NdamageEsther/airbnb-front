import { useCard } from './Card';

export function CardRating(): React.ReactElement {
  const { listing } = useCard();
  return (
    <p style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
      ⭐ {listing.rating}
    </p>
  );
}