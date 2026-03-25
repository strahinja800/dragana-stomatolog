export const statusConfig = {
  accepted: {
    icon: '✓',
    iconColor: '#2e7d5e',
    title: 'Termin prihvaćen',
    message: 'Uspešno ste prihvatili novi termin. Vidimo se uskoro!',
  },
  rejected: {
    icon: '×',
    iconColor: '#c0392b',
    title: 'Termin odbijen',
    message:
      'Dali ste do znanja da vam novi termin ne odgovara. Kontaktiraćemo vas radi dogovora.',
  },
  expired: {
    icon: '◷',
    iconColor: '#e6a817',
    title: 'Link je istekao',
    message: 'Ovaj link je istekao. Molimo vas kontaktirajte ordinaciju.',
  },
} as const;

export const defaultConfig = {
  icon: '!',
  iconColor: '#888888',
  title: 'Nevažeći link',
  message: 'Ovaj link nije validan ili je već iskorišćen.',
};
