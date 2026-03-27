import AboutCta from '@/module/public/about/views/about-view/cta';
import AboutHero from '@/module/public/about/views/about-view/hero';
import AboutTeam from '@/module/public/about/views/about-view/team';
import AboutTimeline from '@/module/public/about/views/about-view/timeline';
import AboutValues from '@/module/public/about/views/about-view/values';

export function AboutView() {
  return (
    <>
      <AboutHero />
      <AboutValues />
      <AboutTeam />
      <AboutTimeline />
      <AboutCta />
    </>
  );
}
