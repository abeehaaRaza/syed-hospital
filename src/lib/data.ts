import { prisma } from './prisma';

export async function getDepartments() {
  try {
    return await prisma.department.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  } catch {
    return [];
  }
}

export async function getTodaysPatients() {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.patient.findMany({
      where: {
        visitDate: { gte: startOfDay, lte: endOfDay },
        isVisible: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export async function getAdminStats() {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [total, today, month, staff] = await Promise.all([
      prisma.patient.count({ where: { isVisible: true } }),
      prisma.patient.count({ where: { visitDate: { gte: startOfDay }, isVisible: true } }),
      prisma.patient.count({ where: { visitDate: { gte: startOfMonth }, isVisible: true } }),
      prisma.user.count({ where: { isActive: true } }),
    ]);

    return { total, today, month, staff };
  } catch {
    return { total: 0, today: 0, month: 0, staff: 0 };
  }
}

export async function getAllPatients(search?: string, showArchived = false) {
  try {
    return await prisma.patient.findMany({
      where: {
        isVisible: showArchived ? undefined : true,
        ...(search
          ? {
              OR: [
                { fullName: { contains: search, mode: 'insensitive' as const } },
                { mrNumber: { contains: search, mode: 'insensitive' as const } },
                { mobile: { contains: search } },
                { cnicNumber: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  } catch {
    return [];
  }
}

export async function getStaff() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, username: true, fullName: true, email: true,
        role: true, isActive: true, lastLogin: true, createdAt: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getPatientById(id: string) {
  try {
    return await prisma.patient.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function getAuditLogs(limit = 200) {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const userIds = [...new Set(logs.map((l) => l.userId).filter(Boolean))] as string[];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, fullName: true, username: true },
    });
    const map = new Map(users.map((u) => [u.id, u]));

    return logs.map((l) => ({
      ...l,
      userName: map.get(l.userId ?? '')?.fullName ?? 'Unknown',
      userLogin: map.get(l.userId ?? '')?.username ?? '—',
    }));
  } catch {
    return [];
  }
}

export async function getPatientsForExport() {
  try {
    return await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}
export async function getReceptionStats() {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [today, er, opd, ind, recent] = await Promise.all([
      prisma.patient.count({ where: { visitDate: { gte: startOfDay }, isVisible: true } }),
      prisma.patient.count({ where: { visitDate: { gte: startOfDay }, department: 'ER', isVisible: true } }),
      prisma.patient.count({ where: { visitDate: { gte: startOfDay }, department: 'OPD', isVisible: true } }),
      prisma.patient.count({ where: { visitDate: { gte: startOfDay }, department: 'IND', isVisible: true } }),
      prisma.patient.findMany({
        where: { isVisible: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return { today, er, opd, ind, recent };
  } catch {
    return { today: 0, er: 0, opd: 0, ind: 0, recent: [] };
  }
}