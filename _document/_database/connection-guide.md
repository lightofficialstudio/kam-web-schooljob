# Database Connection Guide
## KAM-WEB-SCHOOLJOB — สำหรับ Claude อ่านก่อนทำงานทุกครั้ง

---

## ⚠️ สิ่งที่ต้องรู้ก่อนเริ่มต้น

### Prisma Version: 7.6.0
Prisma 7 เปลี่ยน architecture ใหม่ — **ห้ามทำสิ่งเหล่านี้:**

```prisma
// ❌ ผิด — Prisma 7 ไม่รองรับ url ใน schema.prisma แล้ว
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // ← Error: no longer supported
  directUrl = env("DIRECT_URL")     // ← Error: no longer supported
}
```

```prisma
// ✅ ถูก — schema.prisma ต้องไม่มี url
datasource db {
  provider = "postgresql"
}
```

Connection URL ต้องอยู่ใน `prisma.config.ts` เท่านั้น

---

## 📁 ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
|------|---------|
| `prisma/schema.prisma` | Schema definitions (ไม่มี url) |
| `prisma.config.ts` | Connection URL config สำหรับ Prisma CLI |
| `.env` | Environment variables |
| `lib/prisma.ts` | Prisma client singleton สำหรับ app |

---

## 🔌 โครงสร้าง Connection URL ที่ถูกต้อง

### `.env`
```env
# Transaction Pooler — สำหรับ Runtime (Prisma Client ใน app)
DATABASE_URL=postgresql://postgres.seyhbpldvjcalqqybmzl:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Session Pooler — สำหรับ db push / migrate (รองรับ IPv4)
DIRECT_URL=postgresql://postgres.seyhbpldvjcalqqybmzl:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```

### `prisma.config.ts`
```typescript
import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export default defineConfig({
  datasource: {
    // ใช้ DIRECT_URL (session pooler) สำหรับ db push / migrate
    url: process.env.DIRECT_URL!,
  },
});
```

---

## 🚨 ปัญหาที่เคยเจอและวิธีแก้

### 1. `FATAL: Tenant or user not found`
**สาเหตุ:** ใช้ Transaction pooler (`aws-0-...` port 6543) สำหรับ `db push`
**แก้:** เปลี่ยนไปใช้ **Session pooler** (`aws-1-...` port 5432) ใน `prisma.config.ts`

```
// ❌ ทำให้เกิด error
aws-0-ap-southeast-1.pooler.supabase.com:6543

// ✅ ใช้อันนี้สำหรับ db push
aws-1-ap-southeast-1.pooler.supabase.com:5432
```

### 2. `P1001: Can't reach database server at db.xxx.supabase.co:5432`
**สาเหตุ:** Direct connection (`db.` prefix) ถูกบล็อกจาก ISP/network บนเครื่องนี้
**แก้:** ใช้ Pooler URL เสมอ (ทั้ง Session และ Transaction) — ห้ามใช้ `db.` host

### 3. `datasource.url property is required in your Prisma config file`
**สาเหตุ:** `prisma.config.ts` ไม่ได้โหลด `.env` ก่อนอ่าน `process.env`
**แก้:** ต้อง `dotenv.config()` ก่อน `defineConfig()`

### 4. `url is no longer supported in schema files`
**สาเหตุ:** ใส่ `url = env("DATABASE_URL")` ใน `schema.prisma`
**แก้:** ลบออกจาก schema — ย้ายไปไว้ใน `prisma.config.ts` เท่านั้น

---

## 🛠️ Commands ที่ใช้บ่อย

```bash
# Push schema ไป database (ใช้ DIRECT_URL ใน prisma.config.ts)
bunx prisma db push

# Generate Prisma Client หลัง schema เปลี่ยน
bunx prisma generate

# เปิด Prisma Studio GUI
bunx prisma studio

# ดู schema ปัจจุบันใน database
bunx prisma db pull
```

---

## 🗄️ Supabase Project Info

| Item | Value |
|------|-------|
| Project Ref | `seyhbpldvjcalqqybmzl` |
| Region | ap-southeast-1 (Singapore) |
| Compute | Nano |
| Dashboard | `https://supabase.com/dashboard/project/seyhbpldvjcalqqybmzl` |
| SQL Editor | `https://supabase.com/dashboard/project/seyhbpldvjcalqqybmzl/sql/new` |

---

## 📌 กฎเหล็ก (อย่าลืม)

1. **`db push` ใช้ Session pooler** (`aws-1-` port 5432) — ไม่ใช่ Transaction pooler
2. **`schema.prisma` ต้องไม่มี `url`** — Prisma 7 บังคับใช้ `prisma.config.ts`
3. **ห้ามใช้ `db.` host** — ถูกบล็อกจาก network ของเครื่องนี้
4. **`dotenv.config()` ต้องอยู่บนสุด** ของ `prisma.config.ts` ก่อน `defineConfig()`
5. **`DATABASE_URL`** (Transaction pooler + `?pgbouncer=true`) ใช้สำหรับ **app runtime**
6. **`DIRECT_URL`** (Session pooler) ใช้สำหรับ **CLI commands เท่านั้น**
