import type React from 'react';

import { Resend } from 'resend';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  from?: string;
}

interface SendEmailResult {
  success: boolean;
  id?: string;
  message?: string;
}

export async function sendEmail({
  to,
  subject,
  react,
  from,
}: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const defaultFrom = process.env.EMAIL_FROM;

  if (!apiKey) {
    return { success: false, message: 'RESEND_API_KEY nije konfigurisan' };
  }

  if (!defaultFrom && !from) {
    return { success: false, message: 'EMAIL_FROM nije konfigurisan' };
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: from ?? defaultFrom!,
    to: Array.isArray(to) ? to : [to],
    subject,
    react,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, id: data?.id };
}
