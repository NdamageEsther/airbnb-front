interface SavedBadgeProps {
  count: number;
}

export function SavedBadge({ count }: SavedBadgeProps) {
  if (count === 0) return null;
  return (
    <span className="saved-badge">
      {count} {count === 1 ? 'saved' : 'saved'}
    </span>
  );
}