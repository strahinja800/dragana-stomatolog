import { useState } from 'react';

import { CheckCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(
      'Poruka uspešno poslata! Javićemo vam se u najkraćem mogućem roku.'
    );

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="p-8 rounded-2xl bg-card border border-border shadow-card">
      <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
        Pošaljite nam poruku
      </h2>
      <p className="text-muted-foreground mb-8">
        Popunite formu ispod i javićemo vam se u najkraćem mogućem roku.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">Ime</Label>
            <Input
              id="firstName"
              placeholder="Vaše ime"
              required
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Prezime</Label>
            <Input
              id="lastName"
              placeholder="Vaše prezime"
              required
              className="h-12 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="vas.email@primer.com"
            required
            className="h-12 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+381 11 123 4567"
            required
            className="h-12 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service">Usluga koja vas zanima</Label>
          <select
            id="service"
            className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            required
          >
            <option value="">Izaberite uslugu</option>
            <option value="preventiva">Preventivni pregled</option>
            <option value="estetska">Estetska stomatologija</option>
            <option value="implanti">Implantologija</option>
            <option value="ortodoncija">Ortodoncija</option>
            <option value="ostalo">Ostalo</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Poruka</Label>
          <Textarea
            id="message"
            placeholder="Opišite šta vas zanima ili koji je razlog vašeg dolaska..."
            required
            rows={5}
            className="rounded-xl resize-none"
          />
        </div>

        <Button
          type="submit"
          size="xl"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Šaljem...
            </>
          ) : (
            <>
              Pošalji poruku
              <Send className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        <div className="flex items-start gap-3 pt-4">
          <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Vaši podaci su sigurni. Koristimo ih isključivo za kontaktiranje u
            vezi sa vašim upitom.
          </p>
        </div>
      </form>
    </div>
  );
}
