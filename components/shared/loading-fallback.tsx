'use client';

import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LoadingFallbackProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'size-6',
  md: 'size-10',
  lg: 'size-16',
} as const;

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
} as const;

export function LoadingFallback({
  text = 'Učitavanje...',
  size = 'md',
  className,
  fullScreen = false,
}: LoadingFallbackProps) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <Loader2
        className={cn(sizeClasses[size], 'animate-spin text-primary')}
        strokeWidth={1.5}
      />
      {text && (
        <span className={cn(textSizeClasses[size], 'text-muted-foreground')}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={cn(
          'relative flex min-h-screen w-full items-center justify-center overflow-hidden gradient-hero',
          className
        )}
      >
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 size-96 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 size-80 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="relative z-10 animate-fade-up">{content}</div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      {content}
    </div>
  );
}
