'use client';

import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type {
  AppointmentWithRelations,
  MedicalRecordWithRelations,
  PatientData,
} from '@/module/admin/patients/types/patient-types';

import { AppointmentDetailsDrawer } from './appointment-details-drawer';
import { AppointmentsTable } from './appointments-table';
import { NewAppointmentDrawer } from './new-appointment-drawer';

interface PatientAppointmentsProps {
  patient: PatientData;
  appointments: AppointmentWithRelations[];
  allMedicalRecords: MedicalRecordWithRelations[];
}

export function PatientAppointments({
  patient,
  appointments,
  allMedicalRecords,
}: PatientAppointmentsProps) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

  const recordsByAppointment = allMedicalRecords.reduce(
    (acc, record) => {
      if (!acc[record.appointmentId]) {
        acc[record.appointmentId] = [];
      }
      acc[record.appointmentId].push(record);
      return acc;
    },
    {} as Record<string, MedicalRecordWithRelations[]>
  );

  const selectedAppointment =
    appointments.find((a) => a.id === selectedAppointmentId) ?? null;

  return (
    <>
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
              patientId={patient.id}
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
              onSelectAppointment={setSelectedAppointmentId}
            />
          )}
        </CardContent>
      </Card>

      <AppointmentDetailsDrawer
        appointment={selectedAppointment}
        records={
          selectedAppointmentId
            ? (recordsByAppointment[selectedAppointmentId] ?? [])
            : []
        }
        patientId={patient.id}
        open={!!selectedAppointmentId}
        onOpenChange={(open) => !open && setSelectedAppointmentId(null)}
      />
    </>
  );
}
