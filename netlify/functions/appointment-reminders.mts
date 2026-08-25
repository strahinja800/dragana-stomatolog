import type { Config } from '@netlify/functions';

/**
 * Zakazani poziv podsetnika za termine.
 *
 * Netlify Scheduled Functions ne mogu direktno da pozovu Next.js rutu, pa ova
 * funkcija samo kuca na /api/cron/appointment-reminders sa CRON_SECRET-om.
 * Sva logika ostaje u toj ruti, ovde nema ništa osim poziva.
 *
 * Napomena: zakazane funkcije se izvršavaju samo na objavljenim deploy-ovima
 * i ne mogu se pozvati preko URL-a.
 */
export default async () => {
  const siteUrl = process.env.URL;
  const cronSecret = process.env.CRON_SECRET;

  if (!siteUrl) {
    throw new Error('URL nije dostupan, Netlify ga postavlja automatski');
  }

  if (!cronSecret) {
    throw new Error('CRON_SECRET nije postavljen');
  }

  const response = await fetch(`${siteUrl}/api/cron/appointment-reminders`, {
    method: 'POST',
    headers: { authorization: `Bearer ${cronSecret}` },
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Podsetnici nisu poslati: HTTP ${response.status} ${body}`);
  }

  console.log('Podsetnici poslati:', body);
};

export const config: Config = {
  schedule: '0 9 * * *',
};
