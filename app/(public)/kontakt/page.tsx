'use client';

import Contact from '@/module/public/contact/views/contact-view/contact';
import ContactHero from '@/module/public/contact/views/contact-view/hero';

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <ContactHero />

      {/* Contact Section */}
      <Contact />
    </>
  );
}
