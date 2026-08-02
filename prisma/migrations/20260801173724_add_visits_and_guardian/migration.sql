/*
  Warnings:

  - Added the required column `department` to the `Visit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "guardianCnic" TEXT,
ADD COLUMN     "guardianMobile" TEXT;

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "department" "DepartmentType" NOT NULL,
ADD COLUMN     "serviceRequired" TEXT,
ADD COLUMN     "visitNumber" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "reason" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Visit_patientId_visitNumber_idx" ON "Visit"("patientId", "visitNumber");
