'use client';

import { type FallbackProps } from 'react-error-boundary';

import { AlertCircle, RefreshCw } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

/**
 * A reusable error fallback component that can be used with ErrorBoundary
 * Follows the project's design system and provides a consistent error UI
 */
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : 'Neočekivana greška. Molimo pokušajte ponovo.';

  return (
    <div className="flex min-h-[200px] items-center justify-center p-3">
      <div className="w-full max-w-[400px]">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Došlo je do greške</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>

        <div className="mt-4 flex justify-center">
          <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
            <RefreshCw className="size-4" />
            Pokušaj ponovo
          </Button>
        </div>
      </div>
    </div>
  );
}
