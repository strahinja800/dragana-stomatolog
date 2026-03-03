interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

interface SendEmailResult {
  success: boolean;
  id?: string;
  message?: string;
}

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
}: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const defaultFrom = process.env.EMAIL_FROM;

  if (!apiKey) {
    return {
      success: false,
      message: 'RESEND_API_KEY nije konfigurisan',
    };
  }

  if (!defaultFrom && !from) {
    return {
      success: false,
      message: 'EMAIL_FROM nije konfigurisan',
    };
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: from ?? defaultFrom,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    }),
  });

  const data = (await response.json()) as {
    id?: string;
    message?: string;
    error?: string;
  };

  if (!response.ok) {
    return {
      success: false,
      message: data.message ?? data.error ?? 'Neuspešno slanje email-a',
    };
  }

  return {
    success: true,
    id: data.id,
  };
}
