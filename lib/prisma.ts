import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * 🗄️ Prisma Client Singleton — ใช้ global เพื่อป้องกัน connection leak ทั้ง dev และ production
 * จำกัด pool ที่ 2 เพื่อรองรับ Supabase PgBouncer Session mode
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      // ✅ จำกัด connection pool — สำคัญมากสำหรับ Supabase PgBouncer Session mode
      max: 2,
    }),
    log: ["error", "warn"],
  });

// ✅ ใช้ singleton ทั้ง dev และ production ป้องกัน connection exhaust
globalForPrisma.prisma = prisma;
