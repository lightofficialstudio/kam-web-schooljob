// prisma.config.ts
import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    // ใช้ DATABASE_URL หรือ DATABASE_PRISMA_URL ที่ Vercel มีให้
    url: process.env.DATABASE_PRISMA_URL || process.env.DATABASE_URL || process.env.DIRECT_URL,
  },
});
