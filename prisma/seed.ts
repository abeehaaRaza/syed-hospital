import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('ChangeMe@123', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@syedhospital.com',
      passwordHash,
      fullName: 'Dr. Zain',
      role: Role.ADMIN,
    },
  });

  const departments = [
    { name: 'Emergency Care', slug: 'emergency', description: '24/7 emergency services', iconName: 'Ambulance', displayOrder: 1 },
    { name: 'Pediatric Department', slug: 'pediatric', description: 'Specialized care for children', iconName: 'Baby', displayOrder: 2 },
    { name: 'Cardiology', slug: 'cardiology', description: 'Heart and vascular care', iconName: 'HeartPulse', displayOrder: 3 },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({ where: { slug: dept.slug }, update: {}, create: dept });
  }

  console.log('✓ Seed complete — Login: admin / ChangeMe@123');
}

main().finally(() => prisma.$disconnect());