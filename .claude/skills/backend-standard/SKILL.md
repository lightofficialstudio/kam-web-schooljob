---
name: backend-standard
description: Backend API Master Standard สำหรับพัฒนา API ด้วย Next.js App Router + Prisma ORM + Zod ตาม Clean Architecture อย่างเคร่งครัด ใช้เมื่อสร้าง API route ใหม่ เพิ่ม feature หรือแก้ไข service/validation ใดๆ ในโปรเจกต์นี้
type: project
---

# Backend API Standard (Flat Pattern)

## โครงสร้างไฟล์ (Flat Pattern — ใช้กับงานใหม่ทั้งหมด)

```
{feature}/
├── route.ts                        # Controller: GET list, POST create
├── [id]/route.ts                   # Controller: GET one, PATCH, DELETE
├── {action}/route.ts               # Controller: non-CRUD (toggle, seed)
├── {feature}.service.ts            # Business logic — throws AppError
├── {feature}.repository.ts         # Prisma queries only
├── {feature}.schema.ts             # Zod schema + DTO type (z.infer)
└── _docs/{operation}-spec.md       # Required สำหรับ create/update routes
```

Flow: `route.ts → .service → .repository → Database`

**Legacy pattern** (มีในโค้ดเก่า — ห้ามใช้กับงานใหม่):
`{feature}/create/route.ts`, `{feature}/read/route.ts`, `{feature}/service/`, `{feature}/validation/`

## Naming Convention

- Files/Folders: kebab-case
- File names in feature: dot-separated (`feature.service.ts`, `feature.schema.ts`)
- API payload (req/res): snake_case
- Variables/Functions: camelCase
- Comments: Thai, 1 บรรทัด, รูปแบบ `// ✨ คำอธิบาย` (emoji เฉพาะ function comment)

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

## Rules
- `route.ts` → รับ Request + Validate + เรียก Service เท่านั้น
- Business Logic ทั้งหมด → `service/` เท่านั้น
- Validate ก่อนเรียก Service ทุกครั้ง
- Try-Catch ทุก Route
- `prisma.$transaction()` เมื่อเขียนหลาย Table
- ห้าม Log sensitive data (password, token)
- HTTP method คือ verb — ไม่ใช้ `/create`, `/read`, `/update`, `/delete` ใน URL งานใหม่

## Naming
| ประเภท | รูปแบบ |
|--------|--------|
| Files/Folders | `kebab-case` |
| Variables/Functions | `camelCase` |
| API Payload | `snake_case` |
| Prisma Models | `PascalCase` |

## Response Format (การตอบกลับ)
1. แสดง file path ก่อน code block
2. Code เฉพาะ scope ที่ขอ
3. Step ถัดไป 1-2 บรรทัด
