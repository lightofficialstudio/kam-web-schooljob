import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  await prisma.$executeRawUnsafe(
    `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS image_url TEXT;`
  );
  console.log("✅ Column image_url added to notifications table");
}

main().finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
