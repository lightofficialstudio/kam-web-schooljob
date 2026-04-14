import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import path from "path";

// ✨ โหลด .env ก่อนสร้าง PrismaClient (จำเป็นสำหรับ tsx ที่รันนอก Next.js)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ✨ Seed ConfigOptions — ตัวเลือก dropdown ที่ Admin จัดการได้ (ข้อมูลตั้งต้น)
async function main() {
  await prisma.configOption.createMany({
    data: [
      // ── ประเภทโรงเรียน ──
      { group: "school_type", label: "โรงเรียนรัฐบาล",            value: "โรงเรียนรัฐบาล",            sortOrder: 1 },
      { group: "school_type", label: "โรงเรียนเอกชน (สามัญ)",     value: "โรงเรียนเอกชน (สามัญ)",     sortOrder: 2 },
      { group: "school_type", label: "โรงเรียนเอกชน (นานาชาติ)",  value: "โรงเรียนเอกชน (นานาชาติ)",  sortOrder: 3 },
      { group: "school_type", label: "โรงเรียนสาธิต",             value: "โรงเรียนสาธิต",             sortOrder: 4 },
      { group: "school_type", label: "โรงเรียน กศน.",             value: "โรงเรียน กศน.",             sortOrder: 5 },
      { group: "school_type", label: "ศูนย์รวมการเรียนรู้",        value: "ศูนย์รวมการเรียนรู้",        sortOrder: 6 },
      { group: "school_type", label: "โรงเรียนตำรวจตระเวนชายแดน", value: "โรงเรียนตำรวจตระเวนชายแดน", sortOrder: 7 },
      { group: "school_type", label: "โรงเรียนสงเคราะห์",         value: "โรงเรียนสงเคราะห์",         sortOrder: 8 },

      // ── ระดับชั้นที่เปิดสอน ──
      { group: "school_level", label: "อนุบาล",                    value: "อนุบาล",                    sortOrder: 1 },
      { group: "school_level", label: "ประถมศึกษาตอนต้น",           value: "ประถมศึกษาตอนต้น",           sortOrder: 2 },
      { group: "school_level", label: "ประถมศึกษาตอนปลาย",          value: "ประถมศึกษาตอนปลาย",          sortOrder: 3 },
      { group: "school_level", label: "มัธยมศึกษาตอนต้น",           value: "มัธยมศึกษาตอนต้น",           sortOrder: 4 },
      { group: "school_level", label: "มัธยมศึกษาตอนปลาย",          value: "มัธยมศึกษาตอนปลาย",          sortOrder: 5 },
      { group: "school_level", label: "ประกาศนียบัตรวิชาชีพ (ปวช.)", value: "ประกาศนียบัตรวิชาชีพ (ปวช.)", sortOrder: 6 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Seeded ConfigOptions: school_type (8), school_level (6)");
}

main()
  .catch((e) => {
    console.error("❌ Seed config failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
