'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ArrowLeft, User } from '@/constants/icons';
import BookingForm from '@/module/public/home/components/booking-section/booking-form';
import { useTRPC } from '@/trpc/client';

interface ScheduleAppointmentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SelectedPatient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
}

export function ScheduleAppointmentDrawer({
  open,
  onOpenChange,
}: ScheduleAppointmentDrawerProps) {
  const [query, setQuery] = useState('');
  const [selectedPatient, setSelectedPatient] =
    useState<SelectedPatient | null>(null);

  const trpc = useTRPC();

  const { data: patients = [] } = useQuery({
    ...trpc.patient.search.queryOptions({ query }),
    enabled: query.length >= 2,
  });

  const handleSuccess = () => {
    onOpenChange(false);
    toast.success('Termin je uspešno zakazan');
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedPatient(null);
      setQuery('');
    }
    onOpenChange(nextOpen);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} direction="right">
      <DrawerContent className="left-auto right-0 top-0 mt-0 h-screen w-full max-w-2xl rounded-none">
        {selectedPatient ? (
          <>
            <DrawerHeader className="flex-row items-center gap-3 border-b px-6 py-4">
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-4" />
              </button>
              <DrawerTitle>Zakaži termin</DrawerTitle>
            </DrawerHeader>
            <BookingForm
              patientId={selectedPatient.id}
              defaultName={`${selectedPatient.firstName} ${selectedPatient.lastName}`.trim()}
              defaultPhone={selectedPatient.phone ?? ''}
              onSuccess={handleSuccess}
              hideHeader
            />
          </>
        ) : (
          <>
            <DrawerHeader className="border-b px-6 py-4">
              <DrawerTitle>Odaberi pacijenta</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Pretraži po imenu ili telefonu..."
                  value={query}
                  onValueChange={setQuery}
                />
                <CommandList>
                  {query.length >= 2 && patients.length === 0 && (
                    <CommandEmpty>Nema rezultata</CommandEmpty>
                  )}
                  {patients.length > 0 && (
                    <CommandGroup>
                      {patients.map((patient) => (
                        <CommandItem
                          key={patient.id}
                          value={patient.id}
                          onSelect={() => setSelectedPatient(patient)}
                        >
                          <User className="size-4 text-muted-foreground" />
                          <span>
                            {patient.firstName} {patient.lastName}
                          </span>
                          {patient.phone && (
                            <span className="ml-auto text-xs text-muted-foreground">
                              {patient.phone}
                            </span>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
