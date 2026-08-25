'use client';

import { useCallback, useEffect, useRef } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { POLL_INTERVALS } from '@/constants/polling';
import { useNotificationQueue } from '@/module/admin/dashboard/context/notification-context';
import { playNotificationSound } from '@/module/admin/dashboard/utils/play-notification-sound';
import { useTRPC } from '@/trpc/client';

import { NewBookingModal } from './new-booking-modal/new-booking-modal';

export function AppointmentNotifier() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { queue, addToQueue, removeFirst } = useNotificationQueue();

  const { data: unseenAppointments } = useQuery(
    trpc.appointment.getUnseen.queryOptions(undefined, {
      refetchInterval: POLL_INTERVALS.ADMIN_UNSEEN,
    })
  );

  // Termini koji su već prošli kroz queue. Bez ovoga bi se zvuk oglašavao
  // pri svakom polling ciklusu, jer refetch uvek vraća novu referencu niza.
  const notifiedIdsRef = useRef<Set<string>>(new Set());
  const hasLoadedOnceRef = useRef(false);

  const invalidateAppointmentLists = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: trpc.appointment.getPending.queryKey(),
    });
    void queryClient.invalidateQueries({
      queryKey: trpc.appointment.getToday.queryKey(),
    });
  }, [queryClient, trpc]);

  useEffect(() => {
    if (!unseenAppointments) return;

    const freshAppointments = unseenAppointments.filter(
      (appointment) => !notifiedIdsRef.current.has(appointment.appointmentId)
    );

    const isFirstLoad = !hasLoadedOnceRef.current;
    hasLoadedOnceRef.current = true;

    if (!freshAppointments.length) return;

    freshAppointments.forEach((appointment) => {
      notifiedIdsRef.current.add(appointment.appointmentId);
      addToQueue(appointment);
    });

    playNotificationSound();

    // Pri prvom učitavanju su liste ionako tek dovučene, pa nema šta da se osvežava.
    if (!isFirstLoad) {
      invalidateAppointmentLists();
    }
  }, [unseenAppointments, addToQueue, invalidateAppointmentLists]);

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
