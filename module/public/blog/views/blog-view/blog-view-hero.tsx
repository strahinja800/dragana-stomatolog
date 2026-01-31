export default function BlogViewHero() {
  return (
    <section className="py-40 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full bg-(--primary-light) text-primary text-sm font-medium mb-6">
            Blog
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6">
            Korisni saveti i novosti
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pratite naš blog za najnovije savete o oralnom zdravlju,
            stomatološkim tretmanima i zdravim navikama za celu porodicu.
          </p>
        </div>
      </div>
    </section>
  );
}
