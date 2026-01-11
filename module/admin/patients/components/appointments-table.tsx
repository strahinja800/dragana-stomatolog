'use client';

import { Fragment } from 'react';

import { ChevronDown, ChevronRight } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Doc, type Id } from '@/convex/_generated/dataModel';

import { MedicalRecordsList } from './medical-records-list';

interface AppointmentsTableProps {
  appointments: Doc<'appointments'>[];
  recordsByAppointment: Record<Id<'appointments'>, Doc<'medicalRecords'>[]>;
  expandedAppointments: Set<Id<'appointments'>>;
  onToggleAppointment: (appointmentId: Id<'appointments'>) => void;
}

export function AppointmentsTable({
  appointments,
  recordsByAppointment,
  expandedAppointments,
  onToggleAppointment,
}: AppointmentsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Datum</TableHead>
            <TableHead>Vreme</TableHead>
            <TableHead>Simptomi</TableHead>
            <TableHead>Napomena</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => {
            const startDate = new Date(appointment.startTime);
            const records = recordsByAppointment[appointment._id] || [];
            const isExpanded = expandedAppointments.has(appointment._id);

            return (
              <Fragment key={appointment._id}>
                <TableRow
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onToggleAppointment(appointment._id)}
                >
                  <TableCell>
                    {records.length > 0 &&
                      (isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      ))}
                  </TableCell>
                  <TableCell className="font-medium">
                    {startDate.toLocaleDateString('sr-RS')}
                  </TableCell>
                  <TableCell>
                    {startDate.toLocaleTimeString('sr-RS', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>{appointment.symptoms || '—'}</TableCell>
                  <TableCell>{appointment.notes || '—'}</TableCell>
                </TableRow>

                {/* Expanded Content */}
                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-muted/30 p-0">
                      <MedicalRecordsList
                        appointmentId={appointment._id}
                        records={records}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
