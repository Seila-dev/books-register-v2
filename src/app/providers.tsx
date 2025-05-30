'use client';

import { SearchProvider } from '@/contexts/SearchContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
  throw new Error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID in environment variables");
}

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <SearchProvider >
      {children}
      </SearchProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}