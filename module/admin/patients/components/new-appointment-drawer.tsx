'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Plus } from '@/constants/icons';
import BookingForm from '@/module/public/home/components/booking-section/booking-form';

interface NewAppointmentDrawerProps {
  patientId: string;
}

export function NewAppointmentDrawer({ patientId }: NewAppointmentDrawerProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('admin.patients');

  const handleSuccess = () => {
    setOpen(false);
    toast.success(t('appointmentBooked'));
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t('addAppointment')}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="left-auto right-0 top-0 mt-0 h-screen w-full max-w-2xl rounded-none">
        <BookingForm
          patientId={patientId}
          onSuccess={handleSuccess}
          hideHeader
        />
      </DrawerContent>
    </Drawer>
  );
}
