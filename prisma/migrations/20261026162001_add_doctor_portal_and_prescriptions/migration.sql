-- CreateEnum
CREATE TYPE "DoctorSpecialty" AS ENUM ('GENERAL_PHYSICIAN', 'OPHTHALMOLOGY', 'GYNECOLOGY', 'PEDIATRICS', 'SURGERY');

-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('WAITING', 'IN_PROGRESS', 'COMPLETED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'DOCTOR';

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "assignedDoctorId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pmdcNumber" TEXT,
ADD COLUMN     "qualification" TEXT,
ADD COLUMN     "specialty" "DoctorSpecialty";

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "doctorId" TEXT;

-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "visitId" TEXT,
    "doctorId" TEXT NOT NULL,
    "templateType" "DoctorSpecialty" NOT NULL,
    "status" "ConsultationStatus" NOT NULL DEFAULT 'COMPLETED',
    "vitals" JSONB,
    "clinicalFindings" JSONB,
    "diagnosis" TEXT,
    "medications" JSONB,
    "instructions" TEXT,
    "followUpDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prescription_patientId_idx" ON "Prescription"("patientId");

-- CreateIndex
CREATE INDEX "Prescription_doctorId_createdAt_idx" ON "Prescription"("doctorId", "createdAt");

-- CreateIndex
CREATE INDEX "Patient_assignedDoctorId_visitDate_idx" ON "Patient"("assignedDoctorId", "visitDate");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_assignedDoctorId_fkey" FOREIGN KEY ("assignedDoctorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
