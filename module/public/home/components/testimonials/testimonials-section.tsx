import { getTranslations } from 'next-intl/server';

import { Star } from '@/constants/icons';
import { testimonials } from '@/data/data';

export default async function TestimonialsSection() {
  const t = await getTranslations('home.testimonials');

  const items = testimonials.map((item, i) => ({
    rating: item.rating,
    name: t(`t${i + 1}Name`),
    role: t(`t${i + 1}Role`),
    content: t(`t${i + 1}Content`),
  }));

  return (
    <section className="gradient-hero py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-kicker">{t('kicker')}</span>
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">
            {t('title')}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((testimonial, index) => (
            <article
              key={index}
              className="section-shell h-full p-7 transition-smooth hover:-translate-y-1 hover:shadow-hover"
            >
              <div className="mb-5 flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="mb-6 text-foreground/90">
                {`"`}
                {testimonial.content}
                {`"`}
              </p>
              <div>
                <p className="font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
