import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const defaultTenant = await prisma.tenant.upsert({
    where: { subdomain: 'default' },
    update: {},
    create: {
      name: 'Default Cooperative',
      slug: 'default',
      subdomain: 'default',
      isActive: true,
    },
  });

  // ⚠️ WARNING: These are TEST/DEMO credentials ONLY
  // DO NOT use these passwords in production environments
  // Change all default passwords immediately after deployment
  const users = [
    {
      email: 'superadmin@dairycoop.com',
      password: 'SuperAdmin@123',
      firstName: 'Super',
      lastName: 'Administrator',
      role: 'SUPER_ADMIN',
      phoneNumber: '+254700000001',
    },
    {
      email: 'admin@dairycoop.com',
      password: 'Admin@123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      phoneNumber: '+254700000009',
    },
    {
      email: 'manager@dairycoop.com',
      password: 'Manager@123',
      firstName: 'John',
      lastName: 'Kamau',
      role: 'MANAGER',
      phoneNumber: '+254700000002',
    },
    {
      email: 'collection@dairycoop.com',
      password: 'Collection@123',
      firstName: 'Peter',
      lastName: 'Mwangi',
      role: 'OPERATOR',
      phoneNumber: '+254700000003',
    },
    {
      email: 'accountant@dairycoop.com',
      password: 'Accountant@123',
      firstName: 'Jane',
      lastName: 'Wanjiku',
      role: 'ACCOUNTANT',
      phoneNumber: '+254700000004',
    },
    {
      email: 'store@dairycoop.com',
      password: 'Store@123',
      firstName: 'David',
      lastName: 'Ochieng',
      role: 'STORE_MANAGER',
      phoneNumber: '+254700000005',
    },
    {
      email: 'vet@dairycoop.com',
      password: 'Vet@123',
      firstName: 'Dr. Sarah',
      lastName: 'Njeri',
      role: 'VETERINARIAN',
      phoneNumber: '+254700000006',
    },
    {
      email: 'farmer@dairycoop.com',
      password: 'Farmer@123',
      firstName: 'James',
      lastName: 'Kiprop',
      role: 'FARMER',
      phoneNumber: '+254700000007',
    },
    {
      email: 'customer@dairycoop.com',
      password: 'Customer@123',
      firstName: 'Mary',
      lastName: 'Achieng',
      role: 'CUSTOMER',
      phoneNumber: '+254700000008',
    },
  ];

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    await prisma.user.upsert({
      where: {
        tenantId_email: {
          tenantId: defaultTenant.id,
          email: userData.email,
        },
      },
      update: {},
      create: {
        email: userData.email,
        passwordHash: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        tenantId: defaultTenant.id,
        isEmailVerified: true,
        isActive: true,
      },
    });

    console.log(`✓ Created user: ${userData.email} (${userData.role})`);
  }

  console.log('\n✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
