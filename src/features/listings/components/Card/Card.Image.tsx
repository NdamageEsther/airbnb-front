import { useCard } from './Card';

export function CardImage(): React.ReactElement {
  const { listing } = useCard();
  return (
    <img
      src={listing.img}
      alt={listing.title}
      style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
    />
  );
}