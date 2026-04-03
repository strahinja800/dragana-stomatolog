'use client';

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useSubscription } from '@trpc/tanstack-react-query';

import type { AppointmentCreatedEvent } from '@/lib/events';
import { useTRPC } from '@/trpc/client';

import { NewBookingModal } from './new-booking-modal/new-booking-modal';

export function DashboardAppointmentNotifier() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [event, setEvent] = useState<AppointmentCreatedEvent | null>(null);

  useSubscription(
    trpc.subscriptions.onNewAppointment.subscriptionOptions(undefined, {
      onData: (trackedEvent) => {
        setEvent(trackedEvent.data);
        void queryClient.invalidateQueries({
          queryKey: trpc.appointment.getPending.queryKey(),
        });
        void queryClient.invalidateQueries({
          queryKey: trpc.appointment.getToday.queryKey(),
        });
      },
    })
  );

  return (
    <NewBookingModal
      event={event}
      open={!!event}
      onClose={() => setEvent(null)}
    />
  );
}
