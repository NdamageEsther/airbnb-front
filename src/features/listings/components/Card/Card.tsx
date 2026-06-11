import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Listing } from '../../types';

interface CardContextValue {
  listing: Listing;
}

const CardContext = createContext<CardContextValue | null>(null);

export function useCard(): CardContextValue {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error('useCard must be used inside <Card>');
  return ctx;
}

interface CardProps {
  listing: Listing;
  children: ReactNode;
  onClick?: () => void;
}

export function Card({ listing, children, onClick }: CardProps): React.ReactElement {
  return (
    <CardContext.Provider value={{ listing }}>
      <div
        onClick={onClick}
        style={{
          background: '#fff',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #f0ede8',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}