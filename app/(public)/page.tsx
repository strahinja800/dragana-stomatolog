import { Suspense } from 'react';

import BlogSection from '@/module/public/home/components/blog/blog-section';
import { BookingSectionSkeleton } from '@/module/public/home/components/booking-section/booking-form-skeleton';
import BookingSection from '@/module/public/home/components/booking-section/booking-section';
import CtaSection from '@/module/public/home/components/cta/cta-section';
import HeroSection from '@/module/public/home/components/hero/home-hero-server';
import LeadDoctorSection from '@/module/public/home/components/lead-doctor/lead-doctor-section';
import LocationSection from '@/module/public/home/components/location/location-section';
import PortfolioSection from '@/module/public/home/components/portfolio-section/portflio';
import StatisticsSection from '@/module/public/home/components/statistics-section/statistics';
import TeamSection from '@/module/public/home/components/team-section/team-section';
import TestimonialsSection from '@/module/public/home/components/testimonials/testimonials-section';

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<BookingSectionSkeleton />}>
        <BookingSection />
      </Suspense>
      <LeadDoctorSection />
      <StatisticsSection />
      <PortfolioSection />
      <TeamSection />
      <TestimonialsSection />
      <BlogSection />
      <CtaSection />
      <LocationSection />
    </>
  );
}
