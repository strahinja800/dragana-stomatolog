'use client';

import { createContext, useCallback, useContext, useState } from 'react';

import type { UnseenAppointment } from '@/module/admin/dashboard/types/notification-types';

interface NotificationContextValue {
  queue: UnseenAppointment[];
  addToQueue: (event: UnseenAppointment) => boolean;
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
  const [queue, setQueue] = useState<UnseenAppointment[]>([]);

  const addToQueue = useCallback((event: UnseenAppointment) => {
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
