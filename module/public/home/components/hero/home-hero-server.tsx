import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, Phone, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  dentist1,
  dentist2,
  heroImage,
  logoGoldTransparent,
} from '@/data/data';

export default function HeroSection() {
  return (
    <section className="relative mt-20 min-h-[calc(100svh-5rem)] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="DENTALHOLIST moderna stomatološka ordinacija"
          className="h-full w-full object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-b from-foreground/58 via-foreground/46 to-foreground/65" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] items-center px-4 py-10 md:py-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center animate-fade-up">
          <Image
            src={logoGoldTransparent}
            alt="DENTALHOLIST"
            width={951}
            height={459}
            className="mx-auto w-50 md:w-90 lg:w-110 h-auto"
          />

          <p className="mx-auto max-w-3xl text-lg text-primary-foreground/88 ">
            Precizna dijagnostika, individualni plan terapije i digitalno vođeno
            iskustvo uz besprekoran standard nege.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-center">
            <Button asChild size="xl" className="btn-shimmer rounded-full px-8">
              <Link href="#zakazivanje">
                Zakaži online
                <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="rounded-full border-primary/50 bg-white/10 px-8 text-primary-foreground backdrop-blur hover:bg-white/15 hover:text-primary-foreground"
            >
              <a href="tel:+381111234567">
                <Phone className="mr-1 h-5 w-5" />
                Pozovi odmah
              </a>
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row sm:items-center">
            <div className="flex -space-x-3">
              {[dentist1, dentist2].map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt={`DENTALHOLIST tim ${i + 1}`}
                  className="h-12 w-12 rounded-full border-2 border-primary-foreground object-cover"
                />
              ))}
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-foreground bg-primary">
                <span className="text-sm font-semibold text-primary-foreground">
                  +7
                </span>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center gap-1 sm:justify-start">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mt-1 text-sm text-primary-foreground/84">
                10.000+ zadovoljnih pacijenata i ocena 5.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
