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

  const dairyProducts = [
    {
      itemCode: 'MILK-001',
      itemName: 'Fresh Whole Milk',
      category: 'OTHER',
      unit: 'Liter',
      currentStock: 500,
      minStock: 50,
      maxStock: 1000,
      unitPrice: 60,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    },
    {
      itemCode: 'MILK-002',
      itemName: 'Skimmed Milk',
      category: 'OTHER',
      unit: 'Liter',
      currentStock: 300,
      minStock: 30,
      maxStock: 600,
      unitPrice: 55,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    },
    {
      itemCode: 'MILK-003',
      itemName: 'Low-Fat Milk',
      category: 'OTHER',
      unit: 'Liter',
      currentStock: 250,
      minStock: 25,
      maxStock: 500,
      unitPrice: 58,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400',
    },
    {
      itemCode: 'YOGURT-001',
      itemName: 'Plain Yogurt',
      category: 'OTHER',
      unit: 'kg',
      currentStock: 150,
      minStock: 20,
      maxStock: 300,
      unitPrice: 120,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    },
    {
      itemCode: 'YOGURT-002',
      itemName: 'Strawberry Yogurt',
      category: 'OTHER',
      unit: 'kg',
      currentStock: 100,
      minStock: 15,
      maxStock: 200,
      unitPrice: 150,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1571212515416-fca5ec2c9490?w=400',
    },
    {
      itemCode: 'YOGURT-003',
      itemName: 'Mango Yogurt',
      category: 'OTHER',
      unit: 'kg',
      currentStock: 80,
      minStock: 15,
      maxStock: 200,
      unitPrice: 150,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1623948001761-76c4fe0b9ec6?w=400',
    },
    {
      itemCode: 'BUTTER-001',
      itemName: 'Salted Butter',
      category: 'OTHER',
      unit: 'kg',
      currentStock: 75,
      minStock: 10,
      maxStock: 150,
      unitPrice: 450,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400',
    },
    {
      itemCode: 'BUTTER-002',
      itemName: 'Unsalted Butter',
      category: 'OTHER',
      unit: 'kg',
      currentStock: 60,
      minStock: 10,
      maxStock: 120,
      unitPrice: 450,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1596040008861-5f635c9c7261?w=400',
    },
    {
      itemCode: 'CHEESE-001',
      itemName: 'Cheddar Cheese',
      category: 'OTHER',
      unit: 'kg',
      currentStock: 40,
      minStock: 5,
      maxStock: 100,
      unitPrice: 800,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400',
    },
    {
      itemCode: 'CHEESE-002',
      itemName: 'Mozzarella Cheese',
      category: 'OTHER',
      unit: 'kg',
      currentStock: 35,
      minStock: 5,
      maxStock: 80,
      unitPrice: 850,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400',
    },
    {
      itemCode: 'CHEESE-003',
      itemName: 'Gouda Cheese',
      category: 'OTHER',
      unit: 'kg',
      currentStock: 25,
      minStock: 5,
      maxStock: 60,
      unitPrice: 900,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
    },
    {
      itemCode: 'GHEE-001',
      itemName: 'Pure Cow Ghee',
      category: 'OTHER',
      unit: 'kg',
      currentStock: 50,
      minStock: 10,
      maxStock: 100,
      unitPrice: 650,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1614967270507-45e0c4e0a3da?w=400',
    },
    {
      itemCode: 'CREAM-001',
      itemName: 'Heavy Cream',
      category: 'OTHER',
      unit: 'Liter',
      currentStock: 45,
      minStock: 10,
      maxStock: 100,
      unitPrice: 250,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1628337162723-cb0f5c138c64?w=400',
    },
    {
      itemCode: 'CREAM-002',
      itemName: 'Whipping Cream',
      category: 'OTHER',
      unit: 'Liter',
      currentStock: 40,
      minStock: 10,
      maxStock: 90,
      unitPrice: 280,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1594005305639-2f16b2d4fcaa?w=400',
    },
    {
      itemCode: 'PANEER-001',
      itemName: 'Fresh Paneer',
      category: 'OTHER',
      unit: 'kg',
      currentStock: 30,
      minStock: 5,
      maxStock: 80,
      unitPrice: 350,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400',
    },
    {
      itemCode: 'CURD-001',
      itemName: 'Fresh Curd',
      category: 'OTHER',
      unit: 'kg',
      currentStock: 100,
      minStock: 15,
      maxStock: 200,
      unitPrice: 80,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1625081063176-a45e2e5e2c33?w=400',
    },
    {
      itemCode: 'LASSI-001',
      itemName: 'Sweet Lassi',
      category: 'OTHER',
      unit: 'Liter',
      currentStock: 60,
      minStock: 10,
      maxStock: 120,
      unitPrice: 70,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1569418110787-2b06209a2945?w=400',
    },
    {
      itemCode: 'LASSI-002',
      itemName: 'Mango Lassi',
      category: 'OTHER',
      unit: 'Liter',
      currentStock: 50,
      minStock: 10,
      maxStock: 100,
      unitPrice: 90,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400',
    },
    {
      itemCode: 'ICECREAM-001',
      itemName: 'Vanilla Ice Cream',
      category: 'OTHER',
      unit: 'Liter',
      currentStock: 40,
      minStock: 10,
      maxStock: 100,
      unitPrice: 350,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    },
    {
      itemCode: 'ICECREAM-002',
      itemName: 'Chocolate Ice Cream',
      category: 'OTHER',
      unit: 'Liter',
      currentStock: 35,
      minStock: 10,
      maxStock: 90,
      unitPrice: 380,
      status: 'IN_STOCK',
      imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400',
    },
  ];

  for (const product of dairyProducts) {
    const totalValue = Number(product.currentStock) * Number(product.unitPrice);
    
    await prisma.inventoryItem.upsert({
      where: {
        tenantId_itemCode: {
          tenantId: defaultTenant.id,
          itemCode: product.itemCode,
        },
      },
      update: {},
      create: {
        ...product,
        totalValue,
        tenantId: defaultTenant.id,
      },
    });

    console.log(`✓ Created product: ${product.itemName} (${product.itemCode})`);
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
