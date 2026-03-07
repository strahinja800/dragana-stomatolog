'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ADMIN_BRAND } from '@/constants/admin-navigation';
import { Menu } from '@/constants/icons';
import { cn } from '@/lib/utils';
import { AdminSidebar } from '@/module/admin/shared/components/admin-sidebar/admin-sidebar';
import { AdminSidebarMobile } from '@/module/admin/shared/components/admin-sidebar/admin-sidebar-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Mobile Menu Button */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border/50 bg-card/80 px-4 backdrop-blur-lg lg:hidden">
        <span className="text-sm font-semibold">{ADMIN_BRAND.mobileTitle}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <AdminSidebarMobile
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen pt-16 lg:ml-64 lg:pt-0',
          'transition-all duration-300'
        )}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
