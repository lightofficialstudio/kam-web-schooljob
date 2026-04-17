import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

/**
 * 🗄️ Prisma Client Singleton — ใช้ global เพื่อป้องกัน connection leak ทั้ง dev และ production
 * ใช้ pg.Pool แบบ explicit เพื่อควบคุม pool lifecycle และจำกัด connection
 * Supabase free tier: max 60 connections — ต้องประหยัด, ใช้ max: 1 ต่อ instance
 */
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  pgPool: Pool;
};

// ✅ สร้าง pg.Pool แยก เพื่อ reuse connection ข้าม request — ไม่ให้ pool ถูกสร้างใหม่
const pgPool =
  globalForPrisma.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1, // ✅ จำกัด 1 connection ต่อ instance — Supabase Session mode limit
    idleTimeoutMillis: 30000, // ✅ คืน connection กลับ pool หลัง idle 30s
    connectionTimeoutMillis: 10000, // ✅ timeout ถ้าขอ connection ไม่ได้ใน 10s
  });

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaPg(pgPool),
    log: ["error", "warn"],
  });

// ✅ ใช้ singleton ทั้ง dev และ production ป้องกัน connection exhaust
globalForPrisma.pgPool = pgPool;
globalForPrisma.prisma = prisma;
