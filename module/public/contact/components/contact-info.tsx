import { CONTACT_INFO } from '@/constants/contact-page';

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Kontakt informacije
        </h2>
        <p className="mt-3 text-muted-foreground">
          Dostupni smo telefonom i email-om. Ukoliko želite, možete odmah
          poslati upit kroz formu i dobiti odgovor u najkraćem roku.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {CONTACT_INFO.map((info, index) => (
          <article key={index} className="section-shell p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl gradient-accent">
              <info.icon className="h-5 w-5 text-foreground" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">{info.title}</h3>
            {info.link ? (
              <a
                href={info.link}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {info.content}
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">{info.content}</p>
            )}
          </article>
        ))}
      </div>

      <div className="section-shell overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.378542699867!2d20.4729!3d44.8125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDQ4JzQ1LjAiTiAyMMKwMjgnMjIuNCJF!5e0!3m2!1sen!2srs!4v1234567890"
          width="100%"
          height="320"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokacija ordinacije"
        />
      </div>
    </div>
  );
}
