'use client';

import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type Doc, type Id } from '@/convex/_generated/dataModel';

import { AppointmentsTable } from './appointments-table';
import { NewAppointmentDrawer } from './new-appointment-drawer';

interface PatientAppointmentsProps {
  patient: Doc<'patients'>;
  appointments: Doc<'appointments'>[];
  allMedicalRecords: Doc<'medicalRecords'>[];
}

export function PatientAppointments({
  patient,
  appointments,
  allMedicalRecords,
}: PatientAppointmentsProps) {
  const [expandedAppointments, setExpandedAppointments] = useState<
    Set<Id<'appointments'>>
  >(new Set());

  const recordsByAppointment = allMedicalRecords.reduce(
    (acc, record) => {
      if (!acc[record.appointmentId]) {
        acc[record.appointmentId] = [];
      }
      acc[record.appointmentId].push(record);
      return acc;
    },
    {} as Record<Id<'appointments'>, Doc<'medicalRecords'>[]>
  );

  const toggleAppointment = (appointmentId: Id<'appointments'>) => {
    setExpandedAppointments((prev) => {
      const next = new Set(prev);
      if (next.has(appointmentId)) {
        next.delete(appointmentId);
      } else {
        next.add(appointmentId);
      }
      return next;
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Termini</CardTitle>
            <CardDescription>
              Zakazani i prošli termini pacijenta ({appointments.length})
            </CardDescription>
          </div>
          <NewAppointmentDrawer
            patientId={patient._id}
            patientName={`${patient.firstName} ${patient.lastName}`}
            patientPhone={patient.phone || ''}
          />
        </div>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nema zakazanih termina.
          </p>
        ) : (
          <AppointmentsTable
            appointments={appointments}
            recordsByAppointment={recordsByAppointment}
            expandedAppointments={expandedAppointments}
            onToggleAppointment={toggleAppointment}
          />
        )}
      </CardContent>
    </Card>
  );
}
