/**
 * Intervali za polling upita koji su ranije bili pokrivani SSE subscription-ima.
 * Serverless okruženje ne može da drži deljeni EventEmitter između instanci,
 * pa se svežina podataka postiže periodičnim refetch-om.
 */
export const POLL_INTERVALS = {
  ADMIN_UNSEEN: 15_000,
  BOOKING_SLOTS: 30_000,
} as const;
