// src/createWebinarDev.ts
import { prismaClient } from './lib/prismaClient';

async function main() {
  try {
    const webinar = await prismaClient.webinar.create({
      data: {
        title: "Test Webinar",
        description: "Testing Prisma without Clerk",
        startTime: new Date(Date.now() + 3600 * 1000), // 1 hour from now
        tags: ["test", "prisma"],
        ctaLabel: "Join Now",
        ctaType: "BOOK_A_CALL",
        presenterId: "dev-user-id", // hard-coded for testing
      },
    });

    console.log("✅ Webinar created:", webinar);
  } catch (err) {
    console.error("❌ Error creating webinar:", err);
  } finally {
    await prismaClient.$disconnect();
  }
}

main();
