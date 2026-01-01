import BlogSection from '@/module/public/home/components/blog/blog-section';
import CtaSection from '@/module/public/home/components/cta/cta-section';
import EmergencySection from '@/module/public/home/components/emergency/emergency-section';
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
      <EmergencySection />
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
