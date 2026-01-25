import React, { Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { ErrorFallback } from '@/components/error-fallback';
import { LoadingFallback } from '@/components/loading-fallback';
import { getQueryClient } from '@/trpc/server';

import 'server-only'; // <-- ensure this file cannot be imported from the client

// Enhanced TypeScript interface for HydrateClient props
interface HydrateClientProps {
  children: React.ReactNode;
  /**
   * Optional loading fallback component shown during Suspense
   * If not provided, a default loading spinner will be used
   */
  loadingFallback?: React.ReactNode;
  /**
   * Optional error fallback component for ErrorBoundary
   * If not provided, a default error UI will be used
   */
  errorFallback?: React.ComponentType<FallbackProps>;
  /**
   * Optional reset keys that will reset the error boundary when changed
   * Useful for resetting errors when props change
   */
  resetKeys?: Array<unknown>;
  /**
   * Optional loading message for default loading fallback
   */
  loadingMessage?: string;
}

/**
 * Enhanced HydrateClient component that combines React Query's HydrationBoundary,
 * ErrorBoundary, and Suspense for robust error handling and loading states.
 *
 * Features:
 * - Built-in ErrorBoundary with customizable fallback
 * - Built-in Suspense with customizable loading state
 * - TypeScript support with comprehensive interfaces
 * - Reset keys for automatic error recovery
 * - Default fallbacks following design system
 */
export function HydrateClient({
  children,
  loadingFallback,
  errorFallback = ErrorFallback,
  resetKeys,
  loadingMessage = 'Loading...',
}: HydrateClientProps) {
  const queryClient = getQueryClient();

  const defaultLoadingFallback = loadingFallback || (
    <LoadingFallback message={loadingMessage} />
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary FallbackComponent={errorFallback} resetKeys={resetKeys}>
        <Suspense fallback={defaultLoadingFallback}>{children}</Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
