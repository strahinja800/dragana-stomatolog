'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useSubscription } from '@trpc/tanstack-react-query';

import { useNotificationQueue } from '@/module/admin/dashboard/context/notification-context';
import { playNotificationSound } from '@/module/admin/dashboard/utils/play-notification-sound';
import { useTRPC } from '@/trpc/client';

import { NewBookingModal } from './new-booking-modal/new-booking-modal';

export function AppointmentNotifier() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { queue, addToQueue, removeFirst } = useNotificationQueue();

  useSubscription(
    trpc.subscriptions.onNewAppointment.subscriptionOptions(undefined, {
      onData: (trackedEvent) => {
        playNotificationSound();
        addToQueue(trackedEvent.data);
        void queryClient.invalidateQueries({
          queryKey: trpc.appointment.getPending.queryKey(),
        });
        void queryClient.invalidateQueries({
          queryKey: trpc.appointment.getToday.queryKey(),
        });
      },
    })
  );

  const currentEvent = queue[0] ?? null;

  return (
    <NewBookingModal
      key={currentEvent?.appointmentId ?? 'empty'}
      event={currentEvent}
      open={!!currentEvent}
      onClose={removeFirst}
    />
  );
}
