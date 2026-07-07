import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const defaultTenant = await prisma.tenant.upsert({
    where: { subdomain: 'default' },
    update: {},
    create: {
      name: 'Default Cooperative',
      subdomain: 'default',
      isActive: true,
    },
  });

  const hashedPassword = await bcrypt.hash('SuperAdmin@123', 12);

  await prisma.user.upsert({
    where: { email: 'superadmin@dairycoop.com' },
    update: {},
    create: {
      email: 'superadmin@dairycoop.com',
      passwordHash: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      tenantId: defaultTenant.id,
      isEmailVerified: true,
      isActive: true,
    },
  });

  const adminPassword = await bcrypt.hash('Admin@123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@dairycoop.com' },
    update: {},
    create: {
      email: 'admin@dairycoop.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      tenantId: defaultTenant.id,
      isEmailVerified: true,
      isActive: true,
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
