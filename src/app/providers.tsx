'use client';

import { SearchProvider } from '@/contexts/SearchContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider >
      {children}
      </SearchProvider>
    </QueryClientProvider>
  );
}