import { useCard } from './Card';

export function CardPrice(): React.ReactElement {
  const { listing } = useCard();
  return (
    <p style={{ fontSize: '14px', fontWeight: 700 }}>
      ${listing.price}
      <span style={{ fontWeight: 400, color: '#717171', fontSize: '13px' }}>/night</span>
    </p>
  );
}