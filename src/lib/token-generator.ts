import { prisma } from '@/lib/prisma';

export async function generateTokenNumber(): Promise<number> {
  const todayKey = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Karachi',
  });

  const counter = await prisma.tokenCounter.upsert({
    where: { date: todayKey },
    update: { currentCount: { increment: 1 } },
    create: { date: todayKey, currentCount: 1 },
  });

  return counter.currentCount;
}