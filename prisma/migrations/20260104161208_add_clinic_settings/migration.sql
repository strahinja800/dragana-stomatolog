/*
  Warnings:

  - You are about to drop the column `serviceType` on the `appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "appointment" DROP COLUMN "serviceType",
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "serviceDescription" TEXT,
ADD COLUMN     "serviceTypeId" TEXT,
ADD COLUMN     "symptoms" TEXT;

-- CreateTable
CREATE TABLE "working_hours" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "working_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "non_working_day" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "non_working_day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_type" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "working_hours_dayOfWeek_key" ON "working_hours"("dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "non_working_day_date_key" ON "non_working_day"("date");

-- CreateIndex
CREATE INDEX "appointment_serviceTypeId_idx" ON "appointment"("serviceTypeId");

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "service_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;
