import { useCard } from './Card';

export function CardTitle(): React.ReactElement {
  const { listing } = useCard();
  return (
    <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>
      {listing.title}
    </p>
  );
}