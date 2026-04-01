import {
  CalendarClock,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from '@/constants/icons';

export const ADMIN_NAV_ITEMS = [
  {
    key: 'dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    key: 'appointments',
    href: '/admin/termini',
    icon: CalendarClock,
  },
  {
    key: 'patients',
    href: '/admin/patients',
    icon: Users,
  },
  {
    key: 'blog',
    href: '/admin/blog',
    icon: FileText,
  },
  {
    key: 'settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export const ADMIN_BRAND = {
  name: 'DENTALHOLIST',
};
