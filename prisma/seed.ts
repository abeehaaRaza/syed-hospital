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
    { name: 'Emergency', slug: 'emergency', description: '24/7 emergency and urgent care services.', iconName: 'Ambulance', displayOrder: 1 },
    { name: 'Ophthalmology', slug: 'ophthalmology', description: 'Complete eye care, diagnosis, and treatment.', iconName: 'Eye', displayOrder: 2 },
    { name: 'Gynecology', slug: 'gynecology', description: 'Womens health, maternity, and reproductive care.', iconName: 'Baby', displayOrder: 3 },
    { name: 'Radiology', slug: 'radiology', description: 'X-ray, ultrasound (USG), and advanced imaging.', iconName: 'ScanLine', displayOrder: 4 },
    { name: 'Family Medicine', slug: 'family-medicine', description: 'Primary and continuous care for the whole family.', iconName: 'Stethoscope', displayOrder: 5 },
  ];

  const slugs = departments.map((d) => d.slug);
  await prisma.department.deleteMany({ where: { slug: { notIn: slugs } } });

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { slug: dept.slug },
      update: dept,
      create: dept,
    });
  }

  console.log('✓ Seed complete — departments updated');

  // Seed the 9 hospital licenses
  const licenseNames = [
    'Laboratory MOU',
    'Radiology MOU',
    'Punjab Transfusion of Safe Blood Ordinance 1999',
    'Punjab Hospital Waste Management Rules 2014',
    'Punjab Health Care Commission ACT 2010',
    'Civil Defense (Special Power) Rules 1951',
    'Fire Safety Requirements & Management (Building Code of Pakistan / Fire Provision ACT 2016)',
    'Procurement of Safe Pharmaceuticals: Pharmacy ACT 1967',
    'Generator Log Book',
  ];

  for (const name of licenseNames) {
    await prisma.hospitalLicense.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('✓ Seeded 9 hospital licenses');
}

main().finally(() => prisma.$disconnect());