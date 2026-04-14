---
name: backend-standard
description: Backend API Master Standard สำหรับพัฒนา API ด้วย Next.js App Router + Prisma ORM + Zod ตาม Clean Architecture อย่างเคร่งครัด ใช้เมื่อสร้าง API route ใหม่ เพิ่ม feature หรือแก้ไข service/validation ใดๆ ในโปรเจกต์นี้
---

# Backend Standard

## API Naming
```
/api/v1/{role}/{feature}/{action}
role: employer | employee | admin
```

## Directory Structure
```
app/api/v1/{role}/{feature}/
├── create/route.ts
├── read/route.ts
├── update/route.ts
├── delete/route.ts
├── service/{feature}-service.ts   # Business Logic
├── validation/{feature}-schema.ts # Zod Schemas
└── docs/{action}-spec.md
```

## Rules
- `route.ts` → รับ Request + Validate + เรียก Service เท่านั้น
- Business Logic ทั้งหมด → `service/` เท่านั้น
- Validate ก่อนเรียก Service ทุกครั้ง
- Try-Catch ทุก Route
- `prisma.$transaction()` เมื่อเขียนหลาย Table
- ห้าม Log sensitive data (password, token)

## Naming
| ประเภท | รูปแบบ |
|--------|--------|
| Files/Folders | `kebab-case` |
| Variables/Functions | `camelCase` |
| API Payload | `snake_case` |
| Prisma Models | `PascalCase` |

## Comment Standard
```typescript
// ✨ ดึงรายการ... (ภาษาไทย + emoji)
export const getAllOpenJobs = async () => { ... }
```

## Response Format
```typescript
// Success
{ status_code: 200, message_th: "...", message_en: "...", data: {...} }
// Error
{ status_code: 400, message_th: "...", message_en: "...", data: null }
```
Status: 200, 201, 400, 401, 404, 409, 500

## Route Pattern
```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return Response.json({ status_code: 400, ... }, { status: 400 });
    const result = await createService(parsed.data);
    return Response.json({ status_code: 201, ..., data: result }, { status: 201 });
  } catch (error) {
    return Response.json({ status_code: 500, ..., data: null }, { status: 500 });
  }
}
```

## Response Format (การตอบกลับ)
1. แสดง file path ก่อน code block
2. Code เฉพาะ scope ที่ขอ
3. สร้าง docs spec ทุกครั้งที่สร้าง/แก้ไข API
4. Step ถัดไป 1-2 บรรทัด
