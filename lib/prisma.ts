import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

/**
 * 🗄️ Prisma Client Singleton — ใช้ global เพื่อป้องกัน connection leak ทั้ง dev และ production
 * DATABASE_URL → port 6543 (Transaction mode) = PgBouncer คืน connection ทันทีหลัง query เสร็จ
 * DIRECT_URL   → port 5432 (direct) = ใช้สำหรับ prisma migrate / db push เท่านั้น
 */
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  pgPool: Pool;
};

// ✅ pg.Pool singleton — Transaction mode คืน connection ทันที จึงใช้ max: 2 ได้อย่างปลอดภัย
const pgPool =
  globalForPrisma.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 2, // ✅ จำกัด connection pool ป้องกัน exhaust Supabase free tier
    idleTimeoutMillis: 10000, // ✅ คืน idle connection เร็วขึ้น
    connectionTimeoutMillis: 5000, // ✅ fail fast ถ้า pool เต็ม
  });

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaPg(pgPool),
    log: ["error", "warn"],
  });

// ✅ persist singleton ทั้ง dev และ production
globalForPrisma.pgPool = pgPool;
globalForPrisma.prisma = prisma;
