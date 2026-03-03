import {
  CalendarClock,
  FileText,
  Heart,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';

export const ADMIN_NAV_ITEMS = [
  {
    label: 'Kontrolna tabla',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Termini',
    href: '/admin/termini',
    icon: CalendarClock,
  },
  {
    label: 'Pacijenti',
    href: '/admin/patients',
    icon: Users,
  },
  {
    label: 'O Nama',
    href: '/admin/o-nama',
    icon: Heart,
  },
  {
    label: 'Blog',
    href: '/admin/blog',
    icon: FileText,
  },
  {
    label: 'Podešavanja',
    href: '/admin/settings',
    icon: Settings,
  },
];

export const ADMIN_BRAND = {
  name: 'DENTALHOLIST',
  subtitle: 'Admin Panel',
  mobileTitle: 'DENTALHOLIST Admin',
};

export const ADMIN_ACTIONS = {
  signOut: 'Odjavi se',
  backToSite: 'Povratak na sajt',
};
