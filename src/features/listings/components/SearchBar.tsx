import { useEffect, useRef, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';
import { debounce } from 'lodash';
import { useStore } from '../../../store/StoreContext';

export function SearchBar() {
  const { dispatch } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const debouncedDispatch = useCallback(
    debounce((value: string) => {
      dispatch({ type: 'SET_FILTER', payload: value });
    }, 300),
    [dispatch]
  );

  return (
    <div className="search-bar">
      <FiSearch className="search-icon" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search by title or location..."
        onChange={(e) => debouncedDispatch(e.target.value)}
        className="search-input"
      />
    </div>
  );
}