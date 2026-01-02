'use client';

import { useState } from 'react';

import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AdminSidebar } from '@/module/admin/components/admin-sidebar/admin-sidebar';

import { AdminSidebarMobile } from './admin-sidebar-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-muted/30 min-h-screen">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Mobile Menu Button */}
      <div className="bg-card/80 border-border/50 fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b px-4 backdrop-blur-lg lg:hidden">
        <span className="text-sm font-semibold">DentalCare Admin</span>
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
