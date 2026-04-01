'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Loader2, Send } from '@/constants/icons';

type ContactResponse = {
  success: boolean;
  message?: string;
};

export default function ContactForm() {
  const t = useTranslations('contact.form');
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
        throw new Error(result.message ?? t('errorDefault'));
      }

      toast.success(t('successTitle'), {
        description: t('successDescription'),
      });

      e.currentTarget.reset();
    } catch (error) {
      toast.error(t('errorTitle'), {
        description:
          error instanceof Error ? error.message : t('errorDescription'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-shell p-8 md:p-9">
      <h2 className="text-2xl font-bold text-foreground md:text-3xl">
        {t('title')}
      </h2>
      <p className="mt-2 text-muted-foreground">{t('description')}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t('firstNameLabel')}</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder={t('firstNamePlaceholder')}
              required
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t('lastNameLabel')}</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder={t('lastNamePlaceholder')}
              required
              className="h-12 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t('emailLabel')}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t('emailPlaceholder')}
            required
            className="h-12 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t('phoneLabel')}</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder={t('phonePlaceholder')}
            required
            className="h-12 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service">{t('serviceLabel')}</Label>
          <select
            id="service"
            name="service"
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm ring-offset-background transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
            required
          >
            <option value="">{t('serviceDefault')}</option>
            <option value="preventiva">{t('servicePreventiva')}</option>
            <option value="estetska">{t('serviceEstetska')}</option>
            <option value="implanti">{t('serviceImplanti')}</option>
            <option value="ortodoncija">{t('serviceOrtodoncija')}</option>
            <option value="ostalo">{t('serviceOstalo')}</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">{t('messageLabel')}</Label>
          <Textarea
            id="message"
            name="message"
            placeholder={t('messagePlaceholder')}
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
              {t('submittingButton')}
            </>
          ) : (
            <>
              {t('submitButton')}
              <Send className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <div className="flex items-start gap-3 pt-1">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">{t('privacyNote')}</p>
        </div>
      </form>
    </div>
  );
}
