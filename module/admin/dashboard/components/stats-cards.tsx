'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Shield, TrendingUp, UserCheck, Users } from '@/constants/icons';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  totalUsers: number;
  adminCount: number;
  activeUsers: number;
  newThisMonth: number;
}

const stats = [
  {
    key: 'totalUsers',
    label: 'Ukupno korisnika',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    key: 'adminCount',
    label: 'Administratori',
    icon: Shield,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    key: 'activeUsers',
    label: 'Aktivni korisnici',
    icon: UserCheck,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    key: 'newThisMonth',
    label: 'Novi ovog meseca',
    icon: TrendingUp,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
  },
] as const;

export function StatsCards({
  totalUsers,
  adminCount,
  activeUsers,
  newThisMonth,
}: StatsCardsProps) {
  const values = {
    totalUsers,
    adminCount,
    activeUsers,
    newThisMonth,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.key}
          className={cn(
            'group cursor-default overflow-hidden border-0 shadow-card transition-all duration-300',
            'hover:-translate-y-1 hover:shadow-hover'
          )}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div
              className={cn(
                'flex size-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                stat.bgColor
              )}
            >
              <stat.icon className={cn('size-6', stat.color)} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {values[stat.key]}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
