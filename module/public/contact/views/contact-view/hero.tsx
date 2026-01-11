export default function ContactHero() {
  return (
    <section className="py-32 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full bg-(--primary-light) text-primary text-sm font-medium mb-6">
            Kontakt
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Tu smo za vas
          </h1>
          <p className="text-lg text-muted-foreground">
            Imate pitanja ili želite da zakažete pregled? Javite nam se i rado
            ćemo vam pomoći.
          </p>
        </div>
      </div>
    </section>
  );
}
