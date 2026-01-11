import { CONTACT_INFO } from '@/constants/contact-page';

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
          Kontakt informacije
        </h2>
        <p className="text-muted-foreground">
          Možete nas kontaktirati putem telefona, emaila, ili nas posetite u
          našoj ordinaciji u centru Beograda.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {CONTACT_INFO.map((info, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-hover transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-4">
              <info.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-2">
              {info.title}
            </h3>
            {info.link ? (
              <a
                href={info.link}
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                {info.content}
              </a>
            ) : (
              <p className="text-muted-foreground text-sm">{info.content}</p>
            )}
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <div className="rounded-2xl overflow-hidden shadow-card">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.378542699867!2d20.4729!3d44.8125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDQ4JzQ1LjAiTiAyMMKwMjgnMjIuNCJF!5e0!3m2!1sen!2srs!4v1234567890"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokacija ordinacije"
          className="grayscale hover:grayscale-0 transition-all duration-500"
        />
      </div>
    </div>
  );
}
