import type { LucideIcon } from 'lucide-react';
import {
  Award,
  Clock,
  Heart,
  Shield,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  Heart,
  Award,
  Users,
  Sparkles,
  Shield,
  Star,
  Clock,
};

export function getIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Heart;
}
