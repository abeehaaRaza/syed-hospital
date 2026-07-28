import { prisma } from './prisma';
import { DepartmentType } from '@prisma/client';

// Pads a number to 3 digits: 1 → "001"
function pad(n: number) {
  return String(n).padStart(3, '0');
}

// Formats: MR + DEPT + DD + MM + YYYY + PCN  → e.g. MROPD08072026001
function buildMR(department: string, date: Date, pcn: number) {
  const dd = pad(date.getDate()).slice(-2);
  const mm = pad(date.getMonth() + 1).slice(-2);
  const yyyy = date.getFullYear();
  return `MR${department}${dd}${mm}${yyyy}${pad(pcn)}`;
}

/**
 * Generates an MR number following the hospital policy.
 * PCN resets to 1 each month, per department.
 */
export async function generateMRNumber(
  department: DepartmentType,
  visitDate: Date = new Date()
) {
  const year = visitDate.getFullYear();
  const month = visitDate.getMonth() + 1;

  // Atomic counter: increments per department, per month
  const counter = await prisma.mRCounter.upsert({
    where: {
      department_year_month: { department, year, month },
    },
    update: { currentCount: { increment: 1 } },
    create: { department, year, month, currentCount: 1 },
  });

  const mrNumber = buildMR(department, visitDate, counter.currentCount);
  return { mrNumber, patientCount: counter.currentCount };
}