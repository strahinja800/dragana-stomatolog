import { EventEmitter } from 'events';

// Singleton EventEmitter za SSE evente
export const ee = new EventEmitter();
ee.setMaxListeners(100);

// Event names (channels)
export const EVENT_NAMES = {
  SETTINGS_UPDATE: 'settings:update',
  APPOINTMENT_CREATED: 'appointment:created',
} as const;

// Settings event type constants
export const SETTINGS_EVENT_TYPES = {
  WORKING_HOURS_UPDATED: 'WORKING_HOURS_UPDATED',
  NON_WORKING_DAY_CREATED: 'NON_WORKING_DAY_CREATED',
  NON_WORKING_DAY_DELETED: 'NON_WORKING_DAY_DELETED',
} as const;

// Event types
export type SettingsUpdateEvent = {
  type: (typeof SETTINGS_EVENT_TYPES)[keyof typeof SETTINGS_EVENT_TYPES];
  timestamp: number;
};

export type AppointmentCreatedEvent = {
  appointmentId: string;
  patientName: string;
  serviceName: string | null;
  startTime: string;
  phone: string;
  email: string;
  symptoms: string | null;
  timestamp: number;
};

export function emitAppointmentCreated(
  payload: Omit<AppointmentCreatedEvent, 'timestamp'>
) {
  const event: AppointmentCreatedEvent = { ...payload, timestamp: Date.now() };
  ee.emit(EVENT_NAMES.APPOINTMENT_CREATED, event);
}

// Emit helper
export function emitSettingsUpdate(type: SettingsUpdateEvent['type']) {
  const event: SettingsUpdateEvent = {
    type,
    timestamp: Date.now(),
  };

  const listenerCount = ee.listenerCount(EVENT_NAMES.SETTINGS_UPDATE);
  console.log(
    `[SSE] Emitting settings event, listeners: ${listenerCount}`,
    event
  );

  ee.emit(EVENT_NAMES.SETTINGS_UPDATE, event);
}
