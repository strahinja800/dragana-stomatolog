import { defaultConfig, statusConfig } from './response-config';

interface Props {
  searchParams: { status?: string };
}

export default function AppointmentResponsePage({ searchParams }: Props) {
  const { status } = searchParams;
  const config =
    status && status in statusConfig
      ? statusConfig[status as keyof typeof statusConfig]
      : defaultConfig;

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
          {config.title}
        </h1>
        <p className="text-gray-500">{config.message}</p>
      </div>
    </div>
  );
}
