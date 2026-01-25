import { endOfDay, set, startOfDay } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

const SERBIA_TZ = 'Europe/Belgrade';

/** Konvertuje UTC timestamp u početak dana u srpskoj timezone */
export function getLocalDayStart(utcTimestamp: number): Date {
  const zonedDate = toZonedTime(new Date(utcTimestamp), SERBIA_TZ);
  return fromZonedTime(startOfDay(zonedDate), SERBIA_TZ);
}

/** Konvertuje UTC timestamp u kraj dana u srpskoj timezone */
export function getLocalDayEnd(utcTimestamp: number): Date {
  const zonedDate = toZonedTime(new Date(utcTimestamp), SERBIA_TZ);
  return fromZonedTime(endOfDay(zonedDate), SERBIA_TZ);
}

/** Dobija dan u nedelji za srpsku timezone (0=Ned, 1=Pon, ..., 6=Sub) */
export function getLocalDayOfWeek(utcTimestamp: number): number {
  const zonedDate = toZonedTime(new Date(utcTimestamp), SERBIA_TZ);
  return zonedDate.getDay();
}

/** Parsira vreme (HH:MM) za dati datum u srpskoj timezone i vraća Date */
export function parseLocalTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const zonedDate = toZonedTime(date, SERBIA_TZ);
  const withTime = set(zonedDate, {
    hours,
    minutes,
    seconds: 0,
    milliseconds: 0,
  });
  return fromZonedTime(withTime, SERBIA_TZ);
}

/** Proverava da li je izabrani datum danas u srpskoj timezone */
export function isLocalToday(date: Date): boolean {
  const now = toZonedTime(new Date(), SERBIA_TZ);
  const selected = toZonedTime(date, SERBIA_TZ);
  return (
    now.getFullYear() === selected.getFullYear() &&
    now.getMonth() === selected.getMonth() &&
    now.getDate() === selected.getDate()
  );
}

/** Vraća trenutno vreme u minutama od ponoći u srpskoj timezone */
export function getCurrentLocalTimeMinutes(): number {
  const now = toZonedTime(new Date(), SERBIA_TZ);
  return now.getHours() * 60 + now.getMinutes();
}

/** Formatira Date kao HH:mm u srpskoj timezone */
export function formatLocalTime(date: Date): string {
  const zonedDate = toZonedTime(date, SERBIA_TZ);
  const hours = zonedDate.getHours().toString().padStart(2, '0');
  const minutes = zonedDate.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
