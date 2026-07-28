-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "consentGiven" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "details" TEXT,
ADD COLUMN     "disposal" TEXT,
ADD COLUMN     "fee" INTEGER,
ADD COLUMN     "guardianName" TEXT,
ADD COLUMN     "serviceRequired" TEXT;
