'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { CalendarPlus, FileText, Plus } from '@/constants/icons';
import { BlogPostForm } from '@/module/admin/blog/components/blog-posts-form/blog-posts-form';
import { NewPatientDrawer } from '@/module/admin/patients/components/new-patient-drawer';

import { ScheduleAppointmentDrawer } from './schedule-appointment-drawer';

export function DashboardQuickActions() {
  const t = useTranslations('admin.dashboard');
  const [scheduleDrawerOpen, setScheduleDrawerOpen] = useState(false);
  const [patientDrawerOpen, setPatientDrawerOpen] = useState(false);
  const [blogPostId, setBlogPostId] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => setScheduleDrawerOpen(true)}>
          <CalendarPlus className="mr-2 size-4" />
          {t('quickBookAppointment')}
        </Button>
        <Button variant="outline" onClick={() => setPatientDrawerOpen(true)}>
          <Plus className="mr-2 size-4" />
          {t('quickAddPatient')}
        </Button>
        <Button variant="outline" onClick={() => setBlogPostId('new')}>
          <FileText className="mr-2 size-4" />
          {t('quickNewPost')}
        </Button>
      </div>

      <ScheduleAppointmentDrawer
        open={scheduleDrawerOpen}
        onOpenChange={setScheduleDrawerOpen}
      />
      <NewPatientDrawer
        open={patientDrawerOpen}
        onOpenChange={setPatientDrawerOpen}
      />
      <BlogPostForm
        blogPostId={blogPostId}
        onClose={() => setBlogPostId(null)}
      />
    </>
  );
}
