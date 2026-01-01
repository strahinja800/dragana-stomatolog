'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SerializableErrorShape {
  originalMessage?: string;
  trpcCode?: string;
}

interface ErrorFallbackProps {
  error: Error & SerializableErrorShape;
  resetErrorBoundary: () => void;
  title?: string;
  description?: string;
  className?: string;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  title = 'Došlo je do greške',
  description,
  className,
}: ErrorFallbackProps) {
  const originalMessage = (error as SerializableErrorShape).originalMessage;
  const isRedacted = error.message === 'redacted';

  const errorMessage =
    description ||
    (!isRedacted && error.message) ||
    originalMessage ||
    'Nešto je pošlo po zlu. Molimo pokušajte ponovo.';

  return (
    <div
      className={cn(
        'relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 gradient-hero',
        className
      )}
    >
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-up">
        <div className="rounded-3xl border border-border/50 bg-card p-8 shadow-card backdrop-blur-sm md:p-12">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <AlertTriangle
              className="mb-6 size-16 text-primary"
              strokeWidth={1.5}
            />

            {/* Title */}
            <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {title}
            </h1>

            {/* Description */}
            <p className="mb-8 text-base leading-relaxed text-muted-foreground">
              {errorMessage}
            </p>

            {/* CTA Button */}
            <Button
              variant="hero"
              size="xl"
              onClick={resetErrorBoundary}
              className="group gap-2.5 rounded-3xl px-10"
            >
              <RefreshCw className="size-5 transition-transform duration-300 group-hover:rotate-180" />
              Pokušaj ponovo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
