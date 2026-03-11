'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Plus } from '@/constants/icons';
import BookingForm from '@/module/public/home/components/booking-section/booking-form';

interface NewAppointmentDrawerProps {
  patientId: string;
  patientName: string;
  patientPhone: string;
}

export function NewAppointmentDrawer({
  patientId,
  patientName,
  patientPhone,
}: NewAppointmentDrawerProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    toast.success('Termin je uspešno zakazan');
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Dodaj termin
        </Button>
      </DrawerTrigger>
      <DrawerContent className="left-auto right-0 top-0 mt-0 h-screen w-full max-w-2xl rounded-none">
        <BookingForm
          patientId={patientId}
          defaultName={patientName}
          defaultPhone={patientPhone}
          onSuccess={handleSuccess}
          hideHeader
        />
      </DrawerContent>
    </Drawer>
  );
}
