import { prisma } from './prisma';
import { DepartmentType } from '@prisma/client';

/**
 * Format per SOP: MR{DEPT}{DD}{MM}{YYYY}{PCN}
 * Example: MROPD08072026001
 * PCN resets to 1 at the start of each month, per department.
 */
export async function generateMRNumber(
  department: DepartmentType,
  visitDate: Date = new Date()
) {
  const day = String(visitDate.getDate()).padStart(2, '0');
  const month = visitDate.getMonth() + 1;
  const year = visitDate.getFullYear();
  const monthStr = String(month).padStart(2, '0');

  // Atomic transaction — prevents two receptionists getting the same number
  const counter = await prisma.$transaction(async (tx) => {
    const existing = await tx.mRCounter.findUnique({
      where: { department_year_month: { department, year, month } },
    });
    if (existing) {
      return await tx.mRCounter.update({
        where: { id: existing.id },
        data: { currentCount: { increment: 1 } },
      });
    }
    return await tx.mRCounter.create({
      data: { department, year, month, currentCount: 1 },
    });
  });

  const pcn = String(counter.currentCount).padStart(3, '0');
  const mrNumber = `MR${department}${day}${monthStr}${year}${pcn}`;
  return { mrNumber, patientCount: counter.currentCount };
}