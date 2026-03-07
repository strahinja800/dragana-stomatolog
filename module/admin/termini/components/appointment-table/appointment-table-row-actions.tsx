'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, MoreHorizontal, RefreshCw, X } from '@/constants/icons';

import { type Appointment } from './appointment-table-columns';

interface AppointmentTableRowActionsProps {
  appointment: Appointment;
  onConfirm?: (appointment: Appointment) => void;
  onReject?: (appointment: Appointment) => void;
  onReschedule?: (appointment: Appointment) => void;
}

export function AppointmentTableRowActions({
  appointment,
  onConfirm,
  onReject,
  onReschedule,
}: AppointmentTableRowActionsProps) {
  if (appointment.status === 'PENDING') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Otvori meni</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => onConfirm?.(appointment)}
            className="text-emerald-600 focus:text-emerald-600 dark:text-emerald-400"
          >
            <Check className="mr-2 size-4" />
            Potvrdi termin
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onReschedule?.(appointment)}>
            <RefreshCw className="mr-2 size-4" />
            Predloži drugo vreme
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onReject?.(appointment)}
            className="text-destructive focus:text-destructive"
          >
            <X className="mr-2 size-4" />
            Odbij termin
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Otvori meni</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onReschedule?.(appointment)}>
          <RefreshCw className="mr-2 size-4" />
          Promeni vreme
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
