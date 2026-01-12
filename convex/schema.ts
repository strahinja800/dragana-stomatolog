import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// Enum validators
const appointmentStatus = v.union(
  v.literal('PENDING'),
  v.literal('CONFIRMED'),
  v.literal('CANCELLED'),
  v.literal('COMPLETED'),
  v.literal('NO_SHOW')
);

export const gender = v.union(v.literal('MALE'), v.literal('FEMALE'));

const invoiceStatus = v.union(
  v.literal('PENDING'),
  v.literal('PAID'),
  v.literal('CANCELLED')
);

const userRole = v.union(
  v.literal('patient'),
  v.literal('dentist'),
  v.literal('admin')
);

export default defineSchema({
  // ============================================
  // CLINIC SETTINGS
  // ============================================

  workingHours: defineTable({
    dayOfWeek: v.number(), // 0=Nedelja, 1=Ponedeljak... 6=Subota
    startTime: v.string(), // "08:00"
    endTime: v.string(), // "17:00"
    isOpen: v.boolean(),
  }).index('by_dayOfWeek', ['dayOfWeek']),

  nonWorkingDays: defineTable({
    date: v.number(), // Unix timestamp (start of day)
    reason: v.optional(v.string()),
  }).index('by_date', ['date']),

  serviceTypes: defineTable({
    name: v.string(),
    durationMinutes: v.number(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    sortOrder: v.number(),
  }).index('by_sortOrder', ['sortOrder']),

  // ============================================
  // USERS & STAFF
  // ============================================

  dentists: defineTable({
    authId: v.optional(v.string()), // Better Auth user ID
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    specialization: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index('by_email', ['email'])
    .index('by_authId', ['authId']),

  patients: defineTable({
    authId: v.optional(v.string()), // Better Auth user ID (for registered patients)
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()), // Unix timestamp
    gender: v.optional(gender),
    allergies: v.optional(v.string()),
    medications: v.optional(v.string()),
    notes: v.optional(v.string()),
    isMain: v.boolean(),
  })
    .index('by_phone', ['phone'])
    .index('by_email', ['email'])
    .index('by_authId', ['authId']),

  // ============================================
  // APPOINTMENTS
  // ============================================

  appointments: defineTable({
    patientId: v.id('patients'),
    dentistId: v.optional(v.id('dentists')),
    serviceTypeId: v.optional(v.id('serviceTypes')),
    isExternal: v.boolean(),
    serviceDescription: v.optional(v.string()),
    status: appointmentStatus,
    startTime: v.number(), // Unix timestamp
    endTime: v.number(), // Unix timestamp
    notes: v.optional(v.string()),
    phone: v.optional(v.string()),
    symptoms: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
    reminderSent: v.boolean(),
    reminderSentAt: v.optional(v.number()),
  })
    .index('by_patientId', ['patientId'])
    .index('by_dentistId', ['dentistId'])
    .index('by_serviceTypeId', ['serviceTypeId'])
    .index('by_status', ['status'])
    .index('by_startTime', ['startTime'])
    .index('by_status_startTime', ['status', 'startTime']),

  // ============================================
  // MEDICAL RECORDS
  // ============================================

  medicalRecords: defineTable({
    appointmentId: v.id('appointments'),
    tooth: v.optional(v.string()),
    diagnosis: v.optional(v.string()),
    treatment: v.string(),
    notes: v.optional(v.string()),
    invoiceId: v.optional(v.id('invoices')),
  }).index('by_appointmentId', ['appointmentId']),

  attachments: defineTable({
    medicalRecordId: v.id("medicalRecords"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.optional(v.number()),
    description: v.optional(v.string()),
    uploadedAt: v.number(),
  })
    .index("by_medicalRecordId", ["medicalRecordId"])
    .index("by_storageId", ["storageId"]),

  // ============================================
  // BILLING
  // ============================================

  invoices: defineTable({
    patientId: v.id('patients'),
    totalAmount: v.number(), // Store as smallest unit (dinari) for precision
    status: invoiceStatus,
    paidAt: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index('by_patientId', ['patientId'])
    .index('by_status', ['status']),

  // ============================================
  // About Values
  // ============================================
  aboutValues: defineTable({
    icon: v.string(),
    title: v.string(),
    description: v.string(),
    sortOrder: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    })
    .index('by_sortOrder', ['sortOrder'])
    .index('by_isActive_sortOrder', ['isActive', 'sortOrder']),


  // ============================================
  // Milestones
  // ============================================
  milestones: defineTable({
    year: v.string(),
    title: v.string(),
    description: v.string(),
    sortOrder: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    })
    .index('by_sortOrder', ['sortOrder'])
    .index('by_isActive_sortOrder', ['isActive', 'sortOrder']),
});

// Export types for use in functions
export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW';

export type Gender = 'MALE' | 'FEMALE';

export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export type UserRole = 'patient' | 'dentist' | 'admin';
