// prisma.config.ts
import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";
import path from "path";

// ✨ [โหลด .env ก่อน เพื่อให้ process.env พร้อมใช้งาน]
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export default defineConfig({
  datasource: {
    // ใช้ DIRECT_URL (session pooler) สำหรับ db push
    url: process.env.DIRECT_URL!,
  },
});
