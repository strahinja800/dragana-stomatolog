'use client';

import { Spinner } from '@/components/ui/spinner';

/**
 * A reusable loading fallback component for Suspense boundaries
 * Provides different loading states based on the context
 */
export function LoadingFallback({
  message = 'Učitavanje...',
}: {
  message?: string;
}) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex items-center gap-2">
        <Spinner className="size-5" />
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    </div>
  );
}

/**
 * A minimal loading spinner for inline use
 */
export function SpinnerFallback() {
  return (
    <div className="flex items-center justify-center p-1">
      <Spinner className="size-4" />
    </div>
  );
}
