'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';

import { GripVertical } from '@/constants/icons';
import { cn } from '@/lib/utils';

export type BeforeAfterCompareCardProps = {
  title: string;
  summary: string;
  beforeImage: string | StaticImageData;
  afterImage: string | StaticImageData;
  beforeLabel: string;
  afterLabel: string;
  initialPosition?: number;
  className?: string;
  style?: CSSProperties;
};

export default function BeforeAfterCompareCard({
  title,
  summary,
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  initialPosition = 50,
  className,
  style,
}: BeforeAfterCompareCardProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isFocused, setIsFocused] = useState(false);

  const safePosition = Math.min(98, Math.max(2, position));

  return (
    <article
      className={cn('section-shell overflow-hidden', className)}
      style={style}
    >
      <div className="relative aspect-[8/5] w-full overflow-hidden">
        <Image
          src={beforeImage}
          alt={`${title} - ${beforeLabel}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 560px"
          className="object-cover select-none"
          draggable={false}
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - safePosition}% 0 0)` }}
        >
          <Image
            src={afterImage}
            alt={`${title} - ${afterLabel}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 560px"
            className="object-cover select-none"
            draggable={false}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 z-10"
          style={{ left: `${safePosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="relative h-full w-0.5 bg-white/85 shadow-[0_0_0_1px_rgba(28,42,47,0.2)]">
            <div
              className={cn(
                'absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/85 bg-foreground/70 text-white shadow-lg transition-shadow',
                isFocused && 'shadow-[0_0_0_4px_rgba(214,181,107,0.45)]'
              )}
            >
              <GripVertical className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-black/55 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.18em] text-white uppercase">
          {beforeLabel}
        </span>
        <span className="absolute top-2.5 right-2.5 z-10 rounded-full bg-white/85 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.18em] text-foreground uppercase">
          {afterLabel}
        </span>

        <input
          type="range"
          min={2}
          max={98}
          step={1}
          value={safePosition}
          onChange={(event) => setPosition(Number(event.target.value))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute inset-0 z-20 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
          aria-label={`Pomerite klizač za prikaz pre i posle rezultata: ${title}`}
        />
      </div>

      <div className="px-5 py-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{summary}</p>
      </div>
    </article>
  );
}
