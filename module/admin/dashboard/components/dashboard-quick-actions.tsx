'use client';

import { Button } from '@/components/ui/button';
import { CalendarPlus, FileText, Plus } from '@/constants/icons';

export function DashboardQuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button>
        <CalendarPlus className="mr-2 size-4" />
        Zakaži termin
      </Button>
      <Button variant="outline">
        <Plus className="mr-2 size-4" />
        Dodaj pacijenta
      </Button>
      <Button variant="outline">
        <FileText className="mr-2 size-4" />
        Novi blog post
      </Button>
    </div>
  );
}
