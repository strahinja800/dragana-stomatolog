import ContactForm from '@/module/public/contact/components/contact-form';
import ContactInfo from '@/module/public/contact/components/contact-info';

export default function Contact() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <ContactInfo />

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
