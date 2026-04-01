import { BookOpen, Home, Mail, Sparkles, Users } from '@/constants/icons';

export const NAV_LINKS = [
  { href: '/', key: 'home', icon: Home },
  { href: '/usluge', key: 'services', icon: Sparkles },
  { href: '/o-nama', key: 'about', icon: Users },
  { href: '/blog', key: 'blog', icon: BookOpen },
  { href: '/kontakt', key: 'contact', icon: Mail },
] as const;
