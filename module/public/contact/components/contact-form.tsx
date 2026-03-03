'use client';

import { useState } from 'react';

import { CheckCircle, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ContactResponse = {
  success: boolean;
  message?: string;
};

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      firstName: String(formData.get('firstName') ?? ''),
      lastName: String(formData.get('lastName') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      service: String(formData.get('service') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as ContactResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ?? 'Došlo je do greške prilikom slanja.'
        );
      }

      toast.success('Poruka uspešno poslata', {
        description: 'Hvala vam. Javićemo vam se u najkraćem roku.',
      });

      e.currentTarget.reset();
    } catch (error) {
      toast.error('Slanje nije uspelo', {
        description:
          error instanceof Error
            ? error.message
            : 'Pokušajte ponovo za nekoliko minuta.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-shell p-8 md:p-9">
      <h2 className="text-2xl font-bold text-foreground md:text-3xl">
        Pošaljite nam poruku
      </h2>
      <p className="mt-2 text-muted-foreground">
        Popunite formu i odgovor dobijate email-om ili telefonom.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Ime</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Vaše ime"
              required
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Prezime</Label>
            <Input
              id="lastName"
              name="lastName"
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
            name="email"
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
            name="phone"
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
            name="service"
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm ring-offset-background transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
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
            name="message"
            placeholder="Opišite šta vas zanima ili koji je razlog vašeg dolaska..."
            required
            rows={5}
            className="resize-none rounded-xl"
          />
        </div>

        <Button
          type="submit"
          size="xl"
          className="btn-shimmer w-full rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Šaljem...
            </>
          ) : (
            <>
              Pošalji poruku
              <Send className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <div className="flex items-start gap-3 pt-1">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            Vaši podaci su sigurni i koriste se isključivo za komunikaciju o
            vašem upitu.
          </p>
        </div>
      </form>
    </div>
  );
}
