# Plan Migracije: Convex → Prisma + Neon + tRPC + Better Auth

## Pregled Trenutnog Stanja

**Trenutni Stack:**

- **Backend**: Convex (serverless DB + real-time + funkcije)
- **Auth**: Better Auth sa Convex adapterom (već implementiran)
- **API**: Convex queries/mutations (11 tabela, ~15 funkcija)
- **Frontend**: Next.js 16 + React Query + shadcn/ui

**Ciljani Stack:**

- **Database**: PostgreSQL (Neon DB - serverless)
- **ORM**: Prisma
- **API**: tRPC v11 (type-safe API layer)
- **Auth**: Better Auth sa Prisma adapterom

---

## Obim Migracije

### Database Schema (11 tabela)

| Convex Tabela    | Prisma Model    | Napomena              |
| ---------------- | --------------- | --------------------- |
| `workingHours`   | `WorkingHour`   | Radno vreme klinike   |
| `nonWorkingDays` | `NonWorkingDay` | Praznici/neradni dani |
| `serviceTypes`   | `ServiceType`   | Vrste usluga          |
| `dentists`       | `Dentist`       | Stomatolozi           |
| `patients`       | `Patient`       | Pacijenti             |
| `appointments`   | `Appointment`   | Termini               |
| `medicalRecords` | `MedicalRecord` | Medicinski kartoni    |
| `attachments`    | `Attachment`    | Prilozi (fajlovi)     |
| `invoices`       | `Invoice`       | Fakture               |
| `aboutValues`    | `AboutValue`    | O nama - vrednosti    |
| `milestones`     | `Milestone`     | Istorija klinike      |
| `teamMembers`    | `TeamMember`    | Tim                   |

**Better Auth tabele** (automatski se generišu):

- `user`, `session`, `account`, `verification`

### API Layer (Convex → tRPC)

| Convex Modul        | tRPC Router           | Funkcije     |
| ------------------- | --------------------- | ------------ |
| `appointments.ts`   | `appointmentRouter`   | 8 procedura  |
| `patients.ts`       | `patientRouter`       | ~5 procedura |
| `settings.ts`       | `settingsRouter`      | ~6 procedura |
| `medicalRecords.ts` | `medicalRecordRouter` | ~4 procedure |
| `aboutValues.ts`    | `aboutRouter`         | ~4 procedure |
| `milestones.ts`     | `milestoneRouter`     | ~4 procedure |
| `teamMembers.ts`    | `teamMemberRouter`    | ~4 procedure |

---

## Faze Implementacije

### Faza 1: Setup Infrastrukture (Temelj)

**1.1 Neon PostgreSQL**

```bash
# Kreiranje Neon projekta via dashboard ili CLI
npx neon init
```

- Kreirati projekat u Neon dashboard-u
- Dobiti connection string
- Dodati `DATABASE_URL` u `.env`

**1.2 Prisma Setup**

```bash
npm install prisma @prisma/client
npx prisma init
```

**Fajlovi za kreiranje:**

- `prisma/schema.prisma` - Database schema
- `lib/prisma.ts` - Prisma client singleton

**1.3 tRPC Setup**

```bash
npm install @trpc/server@11 @trpc/client@11 @trpc/tanstack-react-query@11 superjson
```

**Struktura direktorijuma (modular-architecture):**

```
module/
├── appointment/
│   ├── server/
│   │   └── appointment-router.ts    # Appointment tRPC router
│   ├── types/
│   │   └── appointment-schemas.ts   # Zod validation schemas
│   ├── ui/
│   │   ├── components/
│   │   └── views/
│   └── hooks/
├── patient/
│   ├── server/
│   │   └── patient-router.ts
│   └── types/
├── settings/
│   ├── server/
│   │   └── settings-router.ts       # Working hours, services, non-working days
│   └── types/
├── about/
│   ├── server/
│   │   └── about-router.ts          # AboutValues, Milestones, TeamMembers
│   └── types/
├── medical-record/
│   ├── server/
│   │   └── medical-record-router.ts
│   └── types/
├── upload/
│   └── server/
│       └── upload-router.ts         # MinIO file upload
└── shared/
    └── server/
        └── trpc/
            ├── init.ts              # tRPC initialization + middleware
            ├── context.ts           # Request context (prisma, auth)
            └── root-router.ts       # Combines all module routers

lib/
├── prisma.ts                        # Prisma client singleton
└── minio.ts                         # MinIO client

app/api/trpc/[trpc]/route.ts         # Next.js API route handler
```

**1.4 Better Auth Migracija**

- Promeniti adapter: `@convex-dev/better-auth` → `better-auth/adapters/prisma`
- Ažurirati `lib/auth-server.ts` i `lib/auth-client.ts`
- Generisati Better Auth tabele: `npx @better-auth/cli generate`

---

### Faza 2: Database Schema (Prisma)

**Kreirati `prisma/schema.prisma`:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// BETTER AUTH TABLES
// ============================================
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  role          UserRole  @default(patient)

  sessions      Session[]
  accounts      Account[]
  patient       Patient?
  dentist       Dentist?
}

model Session {
  id        String   @id @default(cuid())
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                    String  @id @default(cuid())
  accountId             String
  providerId            String
  userId                String
  user                  User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  expiresAt             DateTime?
  password              String?

  @@unique([providerId, accountId])
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// ============================================
// CLINIC SETTINGS
// ============================================
model WorkingHour {
  id        String   @id @default(cuid())
  dayOfWeek Int      // 0=Sunday ... 6=Saturday
  startTime String   // "08:00"
  endTime   String   // "17:00"
  isOpen    Boolean  @default(true)

  @@unique([dayOfWeek])
}

model NonWorkingDay {
  id     String   @id @default(cuid())
  date   DateTime
  reason String?

  @@index([date])
}

model ServiceType {
  id              String        @id @default(cuid())
  name            String
  durationMinutes Int
  description     String?
  isActive        Boolean       @default(true)
  sortOrder       Int           @default(0)
  appointments    Appointment[]
}

// ============================================
// USERS & STAFF
// ============================================
enum UserRole {
  patient
  dentist
  admin
}

enum Gender {
  MALE
  FEMALE
}

model Dentist {
  id             String        @id @default(cuid())
  userId         String?       @unique
  user           User?         @relation(fields: [userId], references: [id])
  firstName      String
  lastName       String
  email          String        @unique
  phone          String?
  specialization String?
  bio            String?
  imageUrl       String?
  isActive       Boolean       @default(true)
  appointments   Appointment[]
}

model Patient {
  id          String        @id @default(cuid())
  userId      String?       @unique
  user        User?         @relation(fields: [userId], references: [id])
  firstName   String
  lastName    String
  email       String?
  phone       String?
  dateOfBirth DateTime?
  gender      Gender?
  allergies   String?
  medications String?
  notes       String?
  isMain      Boolean       @default(false)

  appointments   Appointment[]
  invoices       Invoice[]
  medicalRecords MedicalRecord[]

  @@index([phone])
  @@index([email])
}

// ============================================
// APPOINTMENTS
// ============================================
enum AppointmentStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
  NO_SHOW
}

model Appointment {
  id                 String            @id @default(cuid())
  patientId          String
  patient            Patient           @relation(fields: [patientId], references: [id])
  dentistId          String?
  dentist            Dentist?          @relation(fields: [dentistId], references: [id])
  serviceTypeId      String?
  serviceType        ServiceType?      @relation(fields: [serviceTypeId], references: [id])
  isExternal         Boolean           @default(true)
  serviceDescription String?
  status             AppointmentStatus @default(PENDING)
  startTime          DateTime
  endTime            DateTime
  notes              String?
  phone              String?
  symptoms           String?
  rejectionReason    String?
  reminderSent       Boolean           @default(false)
  reminderSentAt     DateTime?
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt

  medicalRecords     MedicalRecord[]

  @@index([patientId])
  @@index([dentistId])
  @@index([status])
  @@index([startTime])
  @@index([status, startTime])
}

// ============================================
// MEDICAL RECORDS
// ============================================
model MedicalRecord {
  id            String       @id @default(cuid())
  appointmentId String
  appointment   Appointment  @relation(fields: [appointmentId], references: [id])
  patientId     String
  patient       Patient      @relation(fields: [patientId], references: [id])
  tooth         String?
  diagnosis     String?
  treatment     String
  notes         String?
  invoiceId     String?
  invoice       Invoice?     @relation(fields: [invoiceId], references: [id])
  createdAt     DateTime     @default(now())

  attachments   Attachment[]

  @@index([appointmentId])
}

model Attachment {
  id              String        @id @default(cuid())
  medicalRecordId String
  medicalRecord   MedicalRecord @relation(fields: [medicalRecordId], references: [id])
  fileUrl         String        // URL iz storage providera
  fileName        String
  fileType        String
  fileSize        Int?
  description     String?
  uploadedAt      DateTime      @default(now())

  @@index([medicalRecordId])
}

// ============================================
// BILLING
// ============================================
enum InvoiceStatus {
  PENDING
  PAID
  CANCELLED
}

model Invoice {
  id             String         @id @default(cuid())
  patientId      String
  patient        Patient        @relation(fields: [patientId], references: [id])
  totalAmount    Int            // Store as smallest unit (dinari)
  status         InvoiceStatus  @default(PENDING)
  paidAt         DateTime?
  notes          String?
  createdAt      DateTime       @default(now())

  medicalRecords MedicalRecord[]

  @@index([patientId])
  @@index([status])
}

// ============================================
// CMS CONTENT
// ============================================
model AboutValue {
  id          String   @id @default(cuid())
  icon        String
  title       String
  description String
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([sortOrder])
  @@index([isActive, sortOrder])
}

model Milestone {
  id          String   @id @default(cuid())
  year        String
  title       String
  description String
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([sortOrder])
}

model TeamMember {
  id        String   @id @default(cuid())
  name      String
  role      String
  specialty String?
  bio       String?
  imageUrl  String?
  imageAlt  String?
  sortOrder Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([sortOrder])
}
```

---

### Faza 3: tRPC Implementacija

**3.1 tRPC Initialization (`module/shared/server/trpc/init.ts`)**

```typescript
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { type Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, session: ctx.session } });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});
```

**3.2 Context (`module/shared/server/trpc/context.ts`)**

```typescript
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth-server';
import { headers } from 'next/headers';

export async function createTRPCContext() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return {
    prisma,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
```

**3.3 Root Router (`module/shared/server/trpc/root-router.ts`)**

```typescript
import { router } from './init';
import { appointmentRouter } from '@/module/appointment/server/appointment-router';
import { patientRouter } from '@/module/patient/server/patient-router';
import { settingsRouter } from '@/module/settings/server/settings-router';
import { aboutRouter } from '@/module/about/server/about-router';
import { uploadRouter } from '@/module/upload/server/upload-router';

export const appRouter = router({
  appointment: appointmentRouter,
  patient: patientRouter,
  settings: settingsRouter,
  about: aboutRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
```

**3.4 Module Router Example (`module/appointment/server/appointment-router.ts`)**

```typescript
import { z } from 'zod';
import { router, publicProcedure, adminProcedure } from '../init';
import { TRPCError } from '@trpc/server';

export const appointmentRouter = router({
  // Public: Get time slots
  getTimeSlotsForDate: publicProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      // ... logika iz convex/appointments.ts
    }),

  // Public: Create appointment
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string(),
        date: z.date(),
        time: z.string(),
        symptoms: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // ... logika iz convex/appointments.ts
    }),

  // Admin: Get all appointments
  getAll: adminProcedure
    .input(
      z.object({
        status: z
          .enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'])
          .optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // ... logika sa Prisma
    }),

  // Admin: Confirm appointment
  confirm: adminProcedure
    .input(
      z.object({
        id: z.string(),
        serviceTypeId: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // ... logika
    }),
});
```

---

### Faza 4: Frontend Integracija

**4.1 tRPC Client Setup**

```typescript
// lib/trpc.ts
'use client';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import superjson from 'superjson';
import type { AppRouter } from '@/server/trpc/routers/_app';

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      transformer: superjson,
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
});
```

**4.2 Provider Update**

```typescript
// components/providers/trpc-provider.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**4.3 Zamena Convex Hook-ova**

```typescript
// Staro (Convex)
const data = useQuery(api.appointments.getTimeSlotsForDate, { date });

// Novo (tRPC)
const { data } = useQuery(
  trpc.appointment.getTimeSlotsForDate.queryOptions({ date })
);
```

---

### Faza 5: Better Auth Migracija

**5.1 Server Config (`lib/auth-server.ts`)**

```typescript
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: 'patient',
      adminRoles: ['admin'],
    }),
  ],
});
```

**5.2 API Route (`app/api/auth/[...all]/route.ts`)**

```typescript
import { auth } from '@/lib/auth-server';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth.handler);
```

---

### Faza 6: File Storage (MinIO)

**Odluka:** MinIO - self-hosted S3-compatible storage

**6.1 Setup MinIO**

```bash
npm install minio @types/minio
```

**6.2 MinIO Client (`lib/minio.ts`)**

```typescript
import { Client } from 'minio';

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const BUCKET_NAME = process.env.MINIO_BUCKET || 'dental-clinic';
```

**6.3 Environment Variables**

```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=dental-clinic
```

**6.4 tRPC Procedure za Upload**

```typescript
// server/trpc/routers/upload.ts
import { z } from 'zod';
import { router, protectedProcedure } from '../init';
import { minioClient, BUCKET_NAME } from '@/lib/minio';

export const uploadRouter = router({
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const key = `uploads/${Date.now()}-${input.fileName}`;
      const url = await minioClient.presignedPutObject(
        BUCKET_NAME,
        key,
        60 * 60 // 1 hour expiry
      );
      return { url, key };
    }),

  deleteFile: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      await minioClient.removeObject(BUCKET_NAME, input.key);
      return { success: true };
    }),
});
```

---

### Faza 7: Real-time sa tRPC SSE

**Odluka:** Server-Sent Events (SSE) preko tRPC za real-time updates

**7.1 SSE Setup**

```bash
npm install @trpc/server@next # Za SSE support
```

**7.2 SSE Subscription (`server/trpc/routers/appointment.ts`)**

```typescript
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';

// Event emitter za appointment updates
const appointmentEvents = new EventEmitter();

export const appointmentRouter = router({
  // ... postojeće procedure

  // SSE subscription za real-time updates
  onAppointmentChange: publicProcedure.subscription(() => {
    return observable<{ type: string; data: unknown }>((emit) => {
      const handler = (event: { type: string; data: unknown }) => {
        emit.next(event);
      };

      appointmentEvents.on('change', handler);

      return () => {
        appointmentEvents.off('change', handler);
      };
    });
  }),
});

// Helper za emitovanje događaja (poziva se iz mutation-a)
export function emitAppointmentChange(type: string, data: unknown) {
  appointmentEvents.emit('change', { type, data });
}
```

**7.3 SSE API Route (`app/api/trpc/[trpc]/route.ts`)**

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/trpc/routers/_app';
import { createTRPCContext } from '@/server/trpc/context';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

**7.4 Frontend Subscription**

```typescript
// Korišćenje SSE subscription-a
const { data } = trpc.appointment.onAppointmentChange.useSubscription(
  undefined,
  {
    onData: (event) => {
      // Invalidate queries za refresh
      queryClient.invalidateQueries({ queryKey: ['appointment'] });
    },
  }
);
```

---

## Kritični Fajlovi za Modifikaciju

| Fajl                             | Akcija                                             |
| -------------------------------- | -------------------------------------------------- |
| `.env`                           | Dodati DATABASE*URL, MINIO*\_, ukloniti CONVEX\_\_ |
| `prisma/schema.prisma`           | Kreirati (nova)                                    |
| `lib/prisma.ts`                  | Kreirati (nova)                                    |
| `lib/minio.ts`                   | Kreirati (nova)                                    |
| `lib/auth-server.ts`             | Ažurirati adapter                                  |
| `lib/auth-client.ts`             | Minimalne izmene                                   |
| `server/trpc/**`                 | Kreirati celu strukturu                            |
| `app/api/trpc/[trpc]/route.ts`   | Kreirati                                           |
| `app/api/auth/[...all]/route.ts` | Ažurirati                                          |
| `components/providers/`          | Zameniti Convex sa tRPC                            |
| `module/**/`                     | Ažurirati sve data fetching                        |
| `convex/`                        | Obrisati ceo folder                                |
| `package.json`                   | Ukloniti convex pakete, dodati nove                |

---

## Environment Variables

```env
# Database (Neon)
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=<32+ char secret>
BETTER_AUTH_URL=http://localhost:3000

# MinIO Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=dental-clinic

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Verifikacija (Test Plan)

1. **Database**:
   - `npx prisma db push` - schema sync
   - `npx prisma studio` - visual data browser

2. **Auth**:
   - Test registracija novog korisnika
   - Test login/logout flow
   - Test admin zaštite ruta

3. **API**:
   - Test svake tRPC procedure kroz Postman/curl
   - Test SSE subscription za real-time

4. **Frontend**:
   - Test svih public stranica (/, /usluge, /kontakt, /o-nama)
   - Test booking flow
   - Test admin panel (dashboard, termini, pacijenti, podešavanja)

5. **File Storage**:
   - Test upload fajla
   - Test download/preview
   - Test brisanje

---

## Procena Kompleksnosti

| Komponenta         | Nivo    | Napomena                                      |
| ------------------ | ------- | --------------------------------------------- |
| Prisma Schema      | Srednji | Direktna konverzija iz Convex                 |
| tRPC Setup         | Srednji | Slična struktura kao Convex queries/mutations |
| Better Auth        | Nizak   | Samo promena adaptera (Convex → Prisma)       |
| MinIO Setup        | Nizak   | Standardna S3 integracija                     |
| SSE Real-time      | Srednji | tRPC subscription pattern                     |
| Frontend Migration | Visok   | ~30 fajlova za update hook-ova                |

---

## Odluke (Potvrđeno)

| Pitanje            | Odluka                               |
| ------------------ | ------------------------------------ |
| File Storage       | MinIO (self-hosted S3-compatible)    |
| Real-time          | SSE preko tRPC subscriptions         |
| Data Migration     | Nije potrebna (samo test podaci)     |
| Rollout strategija | Big-bang (kompletna zamena odjednom) |

---

## Redosled Implementacije

1. **Setup Neon DB** - Kreirati projekat, dobiti connection string
2. **Prisma Schema** - Definisati sve modele
3. **tRPC Infrastructure** - Init, context, routers
4. **Better Auth Migration** - Promeniti adapter
5. **MinIO Setup** - Konfigurisati storage
6. **Frontend Migration** - Ažurirati sve komponente
7. **Cleanup** - Obrisati Convex folder i zavisnosti
8. **Testing** - End-to-end verifikacija
