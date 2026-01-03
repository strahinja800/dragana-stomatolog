/*
  Warnings:

  - You are about to drop the column `dentistId` on the `medical_record` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "medical_record" DROP CONSTRAINT "medical_record_dentistId_fkey";

-- DropIndex
DROP INDEX "medical_record_dentistId_idx";

-- AlterTable
ALTER TABLE "medical_record" DROP COLUMN "dentistId";
