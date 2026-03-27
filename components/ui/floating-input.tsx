'use client';

import { CheckCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface FloatingInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  icon: React.ReactNode;
  step: number;
  isInvalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  placeholder?: string;
  compact?: boolean;
}

function FloatingInput({
  id,
  label,
  type,
  value,
  onChange,
  onBlur,
  icon,
  step,
  isInvalid,
  errorMessage,
  disabled,
  placeholder,
  compact = false,
}: FloatingInputProps) {
  const isFilled = value.length > 0;

  return (
    <div
      className="group animate-fade-up"
      style={{ animationDelay: `${step * 100}ms`, animationFillMode: 'both' }}
    >
      <div
        className={cn('flex items-center gap-3', compact ? 'mb-1.5' : 'mb-2')}
      >
        <span
          className={cn(
            'flex items-center justify-center rounded-full bg-primary/10 font-semibold text-primary',
            compact ? 'size-5 text-[10px]' : 'size-6 text-xs'
          )}
        >
          {step}
        </span>
        <label
          htmlFor={id}
          className={cn(
            'font-medium text-foreground/80 transition-colors group-focus-within:text-primary',
            compact ? 'text-xs' : 'text-sm'
          )}
        >
          {label}
        </label>
      </div>

      <div className="relative">
        <div
          className={cn(
            'absolute top-1/2 z-10 -translate-y-1/2 transition-all duration-300',
            compact ? 'left-3.5' : 'left-4',
            'text-muted-foreground group-focus-within:text-primary',
            isInvalid && 'text-destructive'
          )}
        >
          {icon}
        </div>

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={isInvalid}
          className={cn(
            'peer w-full pr-4',
            compact
              ? 'h-11 rounded-xl pl-11 text-sm'
              : 'h-12 rounded-2xl pl-12 text-base',
            'bg-background/50 backdrop-blur-sm',
            'border-2 border-border/50',
            'text-foreground placeholder:text-muted-foreground/60',
            'transition-all duration-300',
            'focus:border-primary/50 focus:outline-none',
            'focus:bg-background/80 focus:shadow-[0_0_0_4px_rgba(3,144,159,0.14)]',
            'hover:border-border hover:bg-background/60',
            'disabled:cursor-not-allowed disabled:opacity-50',
            isInvalid && [
              'border-destructive/50 focus:border-destructive/70',
              'focus:shadow-[0_0_0_4px_hsl(0_84%_60%/0.1)]',
            ]
          )}
        />

        {isFilled && !isInvalid && (
          <div className="animate-fade-in absolute right-4 top-1/2 -translate-y-1/2">
            <CheckCircle className="size-5 text-primary" />
          </div>
        )}
      </div>

      {isInvalid && errorMessage && (
        <p
          className={cn(
            'animate-fade-in mt-2 flex items-center gap-1.5 text-destructive',
            compact ? 'text-xs' : 'text-sm'
          )}
        >
          <span className="inline-block size-1 rounded-full bg-destructive" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export { FloatingInput, type FloatingInputProps };
