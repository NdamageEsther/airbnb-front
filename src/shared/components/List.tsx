import type { ReactNode } from 'react';
import { Spinner } from './Spinner';

interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

export function List<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No items found.',
  loading = false,
  className,
}: ListProps<T>): React.ReactElement {
  if (loading) return <Spinner />;
  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <p>{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={keyExtractor(item)}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
}