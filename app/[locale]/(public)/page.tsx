import BeforeAfterSection from '@/module/public/home/components/before-after/before-after-section';
import BlogSection from '@/module/public/home/components/blog/blog-section';
import BookingSection from '@/module/public/home/components/booking-section/booking-section-server';
import CtaSection from '@/module/public/home/components/cta/cta-section';
import HeroSection from '@/module/public/home/components/hero/home-hero-server';
import HomeFaqSection from '@/module/public/home/components/home-faq/home-faq-section';
import LeadDoctorSection from '@/module/public/home/components/lead-doctor/lead-doctor-section';
import LocationSection from '@/module/public/home/components/location/location-section';
import PortfolioSection from '@/module/public/home/components/portfolio-section/portflio';
import TeamSection from '@/module/public/home/components/team-section/team-section';
import TestimonialsSection from '@/module/public/home/components/testimonials/testimonials-section';
import { HydrateClient } from '@/trpc/hydrate-client';
import { prefetch, trpc } from '@/trpc/server';

export default async function HomePage() {
  void prefetch(trpc.blog.getPublishedPosts.queryOptions({ limit: 3 }));

  return (
    <>
      <HeroSection />
      <BookingSection />
      <PortfolioSection />
      <BeforeAfterSection />
      <LeadDoctorSection />
      <TeamSection />
      <TestimonialsSection />
      <HydrateClient>
        <BlogSection />
      </HydrateClient>
      <HomeFaqSection />
      <CtaSection />
      <LocationSection />
    </>
  );
}
