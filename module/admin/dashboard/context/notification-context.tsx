'use client';

import { createContext, useCallback, useContext, useState } from 'react';

import type { AppointmentCreatedEvent } from '@/lib/events';

interface NotificationContextValue {
  queue: AppointmentCreatedEvent[];
  addToQueue: (event: AppointmentCreatedEvent) => void;
  removeFirst: () => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  queue: [],
  addToQueue: () => {},
  removeFirst: () => {},
});

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queue, setQueue] = useState<AppointmentCreatedEvent[]>([]);

  const addToQueue = useCallback((event: AppointmentCreatedEvent) => {
    setQueue((prev) => [...prev, event]);
  }, []);

  const removeFirst = useCallback(() => {
    setQueue((prev) => prev.slice(1));
  }, []);

  return (
    <NotificationContext value={{ queue, addToQueue, removeFirst }}>
      {children}
    </NotificationContext>
  );
}

export function useNotificationQueue() {
  return useContext(NotificationContext);
}

export function useNotificationCount() {
  return useContext(NotificationContext).queue.length;
}
