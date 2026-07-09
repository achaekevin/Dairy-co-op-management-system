import { PrismaClient } from '@prisma/client';
import config from '@config/env.js';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: config.env === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'minimal',
    datasources: {
      db: {
        url: config.database.url,
      },
    },
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (config.env !== 'production') globalThis.prismaGlobal = prisma;

export default prisma;

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};

export const connectDatabase = async () => {
  await prisma.$connect();
};
