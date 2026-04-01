import { getTranslations } from 'next-intl/server';

import { defaultConfig, statusConfig } from './response-config';

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function AppointmentResponsePage({ searchParams }: Props) {
  const { status } = await searchParams;
  const t = await getTranslations('appointmentResponse');

  const config =
    status && status in statusConfig
      ? statusConfig[status as keyof typeof statusConfig]
      : defaultConfig;

  const statusKey =
    status && status in statusConfig
      ? (status as keyof typeof statusConfig)
      : 'invalid';

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-3xl font-bold text-white"
          style={{ backgroundColor: config.iconColor }}
        >
          {config.icon}
        </div>
        <h1 className="mb-3 text-2xl font-semibold text-gray-900">
          {t(`${statusKey}.title`)}
        </h1>
        <p className="text-gray-500">{t(`${statusKey}.message`)}</p>
      </div>
    </div>
  );
}
