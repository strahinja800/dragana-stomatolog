type AppointmentEmailPayload = {
  patientName: string;
  clinicName?: string;
  startTime: Date;
  serviceName?: string | null;
  timezone?: string;
};

const DEFAULT_CLINIC_NAME = 'DENTALHOLIST KONCEPT';
const DEFAULT_TIMEZONE = 'Europe/Belgrade';

function formatDateTime(date: Date, timezone?: string): string {
  const tz = timezone ?? process.env.CLINIC_TIMEZONE ?? DEFAULT_TIMEZONE;

  return new Intl.DateTimeFormat('sr-RS', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: tz,
  }).format(date);
}

function buildBaseTemplate({
  title,
  intro,
  details,
  footer,
}: {
  title: string;
  intro: string;
  details: string;
  footer: string;
}): string {
  return `
  <div style="font-family: Ebrima, Arial, sans-serif; background:#f7f6f2; padding:24px; color:#1c2a2f;">
    <div style="max-width:620px; margin:0 auto; background:#ffffff; border:1px solid #d7ddd9; border-radius:16px; overflow:hidden;">
      <div style="background:linear-gradient(135deg,#03909f,#016f7e); padding:20px 24px; color:white;">
        <p style="margin:0; letter-spacing:0.16em; text-transform:uppercase; font-size:11px; opacity:0.9;">DENTALHOLIST KONCEPT</p>
        <h1 style="margin:8px 0 0; font-family: Georgia, serif; font-size:26px; line-height:1.25;">${title}</h1>
      </div>
      <div style="padding:24px;">
        <p style="margin:0 0 14px; font-size:15px; line-height:1.65;">${intro}</p>
        <div style="margin:18px 0; padding:16px; border-radius:12px; background:#deeff1; border:1px solid #b7dfe3; font-size:14px; line-height:1.6;">${details}</div>
        <p style="margin:0; font-size:14px; line-height:1.65; color:#5a666b;">${footer}</p>
      </div>
    </div>
  </div>`;
}

export function getBookingReceivedEmail(payload: AppointmentEmailPayload) {
  const clinicName = payload.clinicName ?? DEFAULT_CLINIC_NAME;
  const when = formatDateTime(payload.startTime, payload.timezone);

  return {
    subject: `Potvrda prijema zahteva - ${clinicName}`,
    text: `Poštovani ${payload.patientName}, vaš zahtev za termin je primljen. Predloženi termin: ${when}. Uskoro ćete dobiti potvrdu termina.`,
    html: buildBaseTemplate({
      title: 'Zahtev za termin je primljen',
      intro: `Poštovani ${payload.patientName}, hvala vam na poverenju. Vaš zahtev je uspešno evidentiran i naš tim će ga potvrditi u najkraćem roku.`,
      details: `<strong>Predloženi termin:</strong> ${when}<br/><strong>Ordinacija:</strong> ${clinicName}`,
      footer:
        'Nakon potvrde termina dobićete dodatni email sa konačnim detaljima i podsetnikom 24h pre pregleda.',
    }),
  };
}

export function getBookingConfirmedEmail(payload: AppointmentEmailPayload) {
  const clinicName = payload.clinicName ?? DEFAULT_CLINIC_NAME;
  const when = formatDateTime(payload.startTime, payload.timezone);

  return {
    subject: `Termin potvrđen - ${clinicName}`,
    text: `Poštovani ${payload.patientName}, vaš termin je potvrđen za ${when}.`,
    html: buildBaseTemplate({
      title: 'Vaš termin je potvrđen',
      intro: `Poštovani ${payload.patientName}, termin je uspešno potvrđen. Radujemo se vašem dolasku.`,
      details: `<strong>Datum i vreme:</strong> ${when}<br/><strong>Usluga:</strong> ${payload.serviceName ?? 'Stomatološki pregled'}<br/><strong>Ordinacija:</strong> ${clinicName}`,
      footer: 'Automatski podsetnik će vam stići email-om 24 sata pre termina.',
    }),
  };
}

export function getAppointmentReminderEmail(payload: AppointmentEmailPayload) {
  const clinicName = payload.clinicName ?? DEFAULT_CLINIC_NAME;
  const when = formatDateTime(payload.startTime, payload.timezone);

  return {
    subject: `Podsetnik: termin je sutra - ${clinicName}`,
    text: `Poštovani ${payload.patientName}, podsećamo vas da je vaš termin zakazan za ${when}.`,
    html: buildBaseTemplate({
      title: 'Podsetnik za sutrašnji termin',
      intro: `Poštovani ${payload.patientName}, podsećamo vas da je vaš pregled zakazan za sutra.`,
      details: `<strong>Datum i vreme:</strong> ${when}<br/><strong>Usluga:</strong> ${payload.serviceName ?? 'Stomatološki pregled'}<br/><strong>Ordinacija:</strong> ${clinicName}`,
      footer:
        'Ukoliko je potrebna promena termina, molimo vas da nas kontaktirate što pre.',
    }),
  };
}
