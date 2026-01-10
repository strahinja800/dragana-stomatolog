import {
  CalendarClock,
  FileText,
  FolderHeart,
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
    label: 'Korisnici',
    href: '/admin/korisnici',
    icon: Users,
  },
  {
    label: 'Kartoni',
    href: '/admin/kartoni',
    icon: FolderHeart,
  },
  {
    label: 'Blog',
    href: '/admin/blog',
    icon: FileText,
  },
  {
    label: 'Podešavanja',
    href: '/admin/podesavanja',
    icon: Settings,
  },
];

export const ADMIN_BRAND = {
  name: 'DentalCare',
  subtitle: 'Admin Panel',
  mobileTitle: 'DentalCare Admin',
};

export const ADMIN_ACTIONS = {
  signOut: 'Odjavi se',
};
