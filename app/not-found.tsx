import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { FileQuestion, Home } from '@/constants/icons';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 gradient-hero">
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
            <FileQuestion
              className="mb-6 size-16 text-primary"
              strokeWidth={1.5}
            />

            {/* Title */}
            <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Stranica nije pronađena
            </h1>

            {/* Description */}
            <p className="mb-8 text-base leading-relaxed text-muted-foreground">
              Tražena stranica ne postoji ili je premeštena.
            </p>

            {/* CTA Button */}
            <Button className="group gap-2.5 rounded-3xl px-10" asChild>
              <Link href="/">
                <Home className="size-5 transition-transform duration-300 group-hover:scale-110" />
                Nazad na početnu
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
