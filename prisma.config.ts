import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: "postgresql://postgres:mppPlWQmQcQADIVwGELLBjUnuYRBmEfX@sakura.proxy.rlwy.net:18634/railway",
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
});