export const statusConfig = {
  accepted: {
    icon: '✓',
    iconColor: '#2e7d5e',
  },
  rejected: {
    icon: '×',
    iconColor: '#c0392b',
  },
  expired: {
    icon: '◷',
    iconColor: '#e6a817',
  },
} as const;

export const defaultConfig = {
  icon: '!',
  iconColor: '#888888',
};
