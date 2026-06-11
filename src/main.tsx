import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StoreProvider } from './store/StoreContext';
import { AuthProvider } from './features/auth/context/AuthContext';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <AuthProvider>
          <App />
          <Toaster position="bottom-right" />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </StoreProvider>
    </QueryClientProvider>
  </StrictMode>
);