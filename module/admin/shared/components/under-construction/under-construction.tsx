import { Construction } from 'lucide-react';

interface UnderConstructionProps {
  title: string;
}

export function UnderConstruction({ title }: UnderConstructionProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/10 p-8">
      <div className="rounded-full bg-muted p-4">
        <Construction className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-muted-foreground">
          Ova stranica je trenutno u izradi
        </p>
      </div>
    </div>
  );
}
