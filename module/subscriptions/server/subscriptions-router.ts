import { tracked } from '@trpc/server';
import { on } from 'events';
import { z } from 'zod';

import {
  type AppointmentCreatedEvent,
  ee,
  EVENT_NAMES,
  type SettingsUpdateEvent,
} from '@/lib/events';
import { adminProcedure, createTRPCRouter, publicProcedure } from '@/trpc/init';

export const subscriptionsRouter = createTRPCRouter({
  /**
   * Subscribe to settings updates.
   * Uses Server-Sent Events (SSE) for real-time communication.
   * This is used on the booking form to receive updates when admin changes settings.
   *
   * Supports automatic reconnection via lastEventId - when client reconnects,
   * it sends the last received event ID to resume from where it left off.
   */

  onSettingsUpdate: publicProcedure
    .input(
      z
        .object({
          // lastEventId is the last event id that the client has received
          // On the first call, it will be whatever was passed in the initial setup
          // If the client reconnects, it will be the last event id that the client received
          lastEventId: z.string().nullish(),
        })
        .optional()
    )
    .subscription(async function* (opts) {
      const eventName = EVENT_NAMES.SETTINGS_UPDATE;
      const lastEventId = opts.input?.lastEventId;

      console.log(
        `[SSE] Settings subscription started, lastEventId: ${lastEventId}, listener count:`,
        ee.listenerCount(eventName)
      );

      // Note: For settings updates, we don't need to replay missed events
      // because the client will refetch the data anyway when it receives any update.
      // If needed in the future, we could store recent events and replay them here.

      try {
        for await (const [data] of on(ee, eventName, {
          signal: opts.signal,
        })) {
          const event = data as SettingsUpdateEvent;
          console.log(`[SSE] Settings event received:`, event);
          yield tracked(String(event.timestamp), event);
        }
      } finally {
        console.log(`[SSE] Settings subscription ended`);
      }
    }),

  /**
   * Subscribe to new appointment notifications (admin only).
   * Emitted when a patient submits a new booking request.
   */
  onNewAppointment: adminProcedure.subscription(async function* (opts) {
    const eventName = EVENT_NAMES.APPOINTMENT_CREATED;

    try {
      for await (const [data] of on(ee, eventName, { signal: opts.signal })) {
        const event = data as AppointmentCreatedEvent;
        yield tracked(String(event.timestamp), event);
      }
    } finally {
      console.log(`[SSE] Appointment subscription ended`);
    }
  }),
});
