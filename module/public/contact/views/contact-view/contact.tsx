import ContactForm from '@/module/public/contact/components/contact-form';
import ContactInfo from '@/module/public/contact/components/contact-info';

export default function Contact() {
  return (
    <section className="pb-16 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
