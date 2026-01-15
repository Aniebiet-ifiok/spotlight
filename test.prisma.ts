// test-prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(users); // prints all users in DB
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
