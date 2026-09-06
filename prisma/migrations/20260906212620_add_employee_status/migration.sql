-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "employmentStatus" TEXT NOT NULL DEFAULT 'Active',
ADD COLUMN     "leftDate" TIMESTAMP(3);
