-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "followUpDate" TIMESTAMP(3),
ADD COLUMN     "followUpDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "followUpReason" TEXT;
