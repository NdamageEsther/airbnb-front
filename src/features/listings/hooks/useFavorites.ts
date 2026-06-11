import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import toast from 'react-hot-toast';

interface UseFavoritesReturn {
  saved: number[];
  toggle: (id: number, title: string) => void;
  isSaved: (id: number) => boolean;
  count: number;
}

export function useFavorites(): UseFavoritesReturn {
  const [saved, setSaved] = useLocalStorage<number[]>('saved-listings', []);

  const toggle = (id: number, title: string): void => {
    const next = saved.includes(id)
      ? saved.filter((s) => s !== id)
      : [...saved, id];
    setSaved(next);
    toast(saved.includes(id) ? `Removed ${title}` : `Saved ${title} ♥`);
  };

  const isSaved = (id: number): boolean => saved.includes(id);

  return { saved, toggle, isSaved, count: saved.length };
}