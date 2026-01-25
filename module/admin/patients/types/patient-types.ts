import type {
  Appointment,
  Attachment,
  Dentist,
  Invoice,
  MedicalRecord,
  Patient,
  ServiceType,
} from '@/lib/generated/prisma/client';

// Base patient type from Prisma
export type PatientData = Patient;

// Patient with included relations
export type PatientWithAppointments = Patient & {
  appointments: (Appointment & {
    serviceType: ServiceType | null;
    dentist: Dentist | null;
  })[];
  medicalRecords: (MedicalRecord & {
    appointment: Appointment;
    attachments: Attachment[];
  })[];
  invoices: Invoice[];
};

// Appointment with relations
export type AppointmentWithRelations = Appointment & {
  serviceType: ServiceType | null;
  dentist: Dentist | null;
};

// Medical record with relations
export type MedicalRecordWithRelations = MedicalRecord & {
  appointment: Appointment;
  attachments: Attachment[];
};
