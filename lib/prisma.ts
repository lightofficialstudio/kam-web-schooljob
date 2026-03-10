import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * 🗄️ Prisma Client Instance with PostgreSQL Adapter for Prisma v7
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

console.log("🔧 Initializing Prisma with connection:", {
  url: process.env.DATABASE_URL?.substring(0, 50) + "...",
  directUrl: process.env.DIRECT_URL?.substring(0, 50) + "...",
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    }),
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

console.log("✅ Prisma client initialized successfully");
