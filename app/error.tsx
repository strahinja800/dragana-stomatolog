'use client';

import { useEffect } from 'react';

import { ErrorFallback } from '@/components/shared/error-fallback';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error.message);
  }, [error]);

  return <ErrorFallback error={error} resetErrorBoundary={reset} />;
}
