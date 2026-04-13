'use client';

import { createContext, useCallback, useContext, useState } from 'react';

import type { AppointmentCreatedEvent } from '@/lib/events';

interface NotificationContextValue {
  queue: AppointmentCreatedEvent[];
  addToQueue: (event: AppointmentCreatedEvent) => boolean;
  removeFirst: () => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  queue: [],
  addToQueue: () => false,
  removeFirst: () => {},
});

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queue, setQueue] = useState<AppointmentCreatedEvent[]>([]);

  const addToQueue = useCallback((event: AppointmentCreatedEvent) => {
    let added = false;
    setQueue((prev) => {
      if (prev.some((e) => e.appointmentId === event.appointmentId))
        return prev;
      added = true;
      return [...prev, event];
    });
    return added;
  }, []);

  const removeFirst = useCallback(() => {
    setQueue((prev) => prev.slice(1));
  }, []);

  return (
    <NotificationContext.Provider value={{ queue, addToQueue, removeFirst }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationQueue() {
  return useContext(NotificationContext);
}

export function useNotificationCount() {
  return useContext(NotificationContext).queue.length;
}
