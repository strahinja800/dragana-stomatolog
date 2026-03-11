'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { LucideIcon } from '@/constants/icons';
import {
  Activity,
  Award,
  CheckCircle,
  Clock,
  Eye,
  Gem,
  GraduationCap,
  HandHeart,
  Handshake,
  Heart,
  HeartPulse,
  Leaf,
  Lightbulb,
  Shield,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  Sun,
  Target,
  ThumbsUp,
  Trophy,
  Users,
  Zap,
} from '@/constants/icons';
import { cn } from '@/lib/utils';

export const AVAILABLE_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: 'Heart', icon: Heart },
  { name: 'Award', icon: Award },
  { name: 'Users', icon: Users },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Shield', icon: Shield },
  { name: 'Star', icon: Star },
  { name: 'Clock', icon: Clock },
  { name: 'Smile', icon: Smile },
  { name: 'ThumbsUp', icon: ThumbsUp },
  { name: 'Stethoscope', icon: Stethoscope },
  { name: 'Activity', icon: Activity },
  { name: 'Gem', icon: Gem },
  { name: 'HandHeart', icon: HandHeart },
  { name: 'HeartPulse', icon: HeartPulse },
  { name: 'ShieldCheck', icon: ShieldCheck },
  { name: 'Trophy', icon: Trophy },
  { name: 'Target', icon: Target },
  { name: 'Lightbulb', icon: Lightbulb },
  { name: 'Handshake', icon: Handshake },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Eye', icon: Eye },
  { name: 'Zap', icon: Zap },
  { name: 'Sun', icon: Sun },
  { name: 'Leaf', icon: Leaf },
  { name: 'CheckCircle', icon: CheckCircle },
];

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedIcon = AVAILABLE_ICONS.find((i) => i.name === value);
  const SelectedIconComponent = selectedIcon?.icon;

  const filteredIcons = search
    ? AVAILABLE_ICONS.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      )
    : AVAILABLE_ICONS;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'w-full justify-start gap-3 font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          {SelectedIconComponent ? (
            <>
              <SelectedIconComponent className="size-4" />
              <span>{value}</span>
            </>
          ) : (
            <span>Izaberi ikonu...</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <Input
          placeholder="Pretraži ikone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />
        <div className="grid max-h-64 grid-cols-5 gap-1 overflow-y-auto">
          {filteredIcons.map((item) => {
            const Icon = item.icon;
            const isSelected = value === item.name;

            return (
              <button
                key={item.name}
                type="button"
                title={item.name}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-md p-2 text-xs transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isSelected &&
                    'bg-primary/10 text-primary ring-1 ring-primary/30'
                )}
                onClick={() => {
                  onChange(item.name);
                  setOpen(false);
                  setSearch('');
                }}
              >
                <Icon className="size-5" />
                <span className="truncate text-[10px] leading-tight">
                  {item.name}
                </span>
              </button>
            );
          })}
          {filteredIcons.length === 0 && (
            <p className="col-span-5 py-4 text-center text-sm text-muted-foreground">
              Nema rezultata
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
