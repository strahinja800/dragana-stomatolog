import Image from 'next/image';

import { Sparkles, Star } from 'lucide-react';

import { dentist1, dentist2, heroImage } from '@/data/data';

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden md:mt-16">
      {/* Full background image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Moderna stomatološka ordinacija"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm text-primary-foreground text-sm font-medium border border-primary/30">
            <Sparkles className="w-4 h-4" />
            <span>Vaš savršen osmeh počinje ovde</span>
          </div>

          <h1 className="text-4xl md:text-6xl xl:text-8xl font-heading font-bold text-primary-foreground leading-tighter">
            Stomatologija koja
            <span className="block text-primary"> inspiriše osmeh</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Bilo da niste bili kod zubara 6 meseci ili 6 godina, olakšavamo vam
            povratak sa nežnom negom i bez osude.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <div className="flex -space-x-3">
              {[dentist1, dentist2].map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt={`Tim ${i + 1}`}
                  className="w-12 h-12 rounded-full border-2 border-primary-foreground object-cover"
                />
              ))}
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border-2 border-primary-foreground">
                <span className="text-primary-foreground text-sm font-semibold">
                  +5
                </span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-primary-foreground/70">
                Preko 500+ recenzija
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
