export function AboutHeader() {
  return (
    <div className="relative">
      <div className="absolute -left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-primary via-primary/50 to-transparent" />
      <div className="pl-4">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          O Nama
        </h1>
        <p className="mt-1 text-muted-foreground">
          Upravljajte sadržajem koji se prikazuje na &quot;O Nama&quot; stranici
        </p>
      </div>
    </div>
  );
}
