'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { ADMIN_BRAND } from '@/constants/admin-navigation';
import { BellRing, Menu } from '@/constants/icons';
import { cn } from '@/lib/utils';
import { AppointmentNotifier } from '@/module/admin/dashboard/components/appointment-notifier';
import {
  NotificationProvider,
  useNotificationCount,
} from '@/module/admin/dashboard/context/notification-context';
import { AdminSidebar } from '@/module/admin/shared/components/admin-sidebar/admin-sidebar';
import { AdminSidebarMobile } from '@/module/admin/shared/components/admin-sidebar/admin-sidebar-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
}

function MobileHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('admin.nav');
  const count = useNotificationCount();

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border/50 bg-card/80 px-4 backdrop-blur-lg lg:hidden">
        <span className="text-sm font-semibold">
          {ADMIN_BRAND.name} {t('mobileTitle').replace('DENTALHOLIST ', '')}
        </span>
        <div className="flex items-center gap-3">
          {count > 0 && (
            <div className="relative">
              <BellRing className="size-5 animate-pulse text-amber-500" />
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                {count}
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>
      <AdminSidebarMobile
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-muted/30">
        <AppointmentNotifier />
        <AdminSidebar />
        <MobileHeader />

        <main
          className={cn(
            'min-h-screen pt-16 lg:ml-64 lg:pt-0',
            'transition-all duration-300'
          )}
        >
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </NotificationProvider>
  );
}
