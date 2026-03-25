'use client';

import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { useSubscription } from '@trpc/tanstack-react-query';
import { toast } from 'sonner';

import { useTRPC } from '@/trpc/client';

export function DashboardAppointmentNotifier() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  useSubscription(
    trpc.subscriptions.onNewAppointment.subscriptionOptions(undefined, {
      onData: (trackedEvent) => {
        const event = trackedEvent.data;
        const date = new Date(event.startTime);
        const formatted = date.toLocaleString('sr-RS', {
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Belgrade',
        });

        toast('Novi zahtev za termin', {
          description: `${event.patientName} — ${formatted}`,
          action: {
            label: 'Pogledaj',
            onClick: () => router.push('/admin'),
          },
          duration: 10000,
        });

        void queryClient.invalidateQueries({
          queryKey: trpc.appointment.getPending.queryKey(),
        });
        void queryClient.invalidateQueries({
          queryKey: trpc.appointment.getToday.queryKey(),
        });
      },
    })
  );

  return null;
}
