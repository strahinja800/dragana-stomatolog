import HeroSection from '@/module/public/home/components/hero/home-hero-server';
import EmergencySection from '../../module/public/home/components/emergency/emergency-section';
import LeadDoctorSection from '../../module/public/home/components/lead-doctor/lead-doctor-section';
import StatisticsSection from '../../module/public/home/components/statistics-section/statistics';

export default function Page() {
  return (
    <>
      <HeroSection />
      <EmergencySection />
      <LeadDoctorSection />
      <StatisticsSection />
    </>
  );
}
