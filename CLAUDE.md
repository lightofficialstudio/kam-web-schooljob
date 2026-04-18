# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# CLAUDE.md — KAM-WEB-SCHOOLJOB

Thai education job marketplace — เชื่อม **ครู (EMPLOYEE)** กับ **โรงเรียน (EMPLOYER)**
UI ภาษาไทย, ฟอนต์ Kanit, comments ภาษาไทย

---

## Commands

```bash
bun dev            # dev server
bun build          # production build — รันทุกครั้งหลังแก้โค้ด
bun lint           # ESLint
bunx prisma db push        # push schema → DB
bunx prisma generate       # re-generate client
bunx prisma studio         # GUI
```

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Framework | Next.js 16 (App Router) + React 19 |
| UI | Ant Design 6 + Tailwind CSS 4 |
| State | Zustand 5 (localStorage persist) |
| DB | PostgreSQL + Prisma 7 |
| Auth | Supabase Auth + Prisma Profile sync |
| Validation | Zod 4 |
| Package Manager | Bun |
| Font | Kanit (Thai + Latin) |

---

## Rules (ห้ามละเมิด)

- **Comments** → ภาษาไทยเสมอ + emoji (`// ✨ ดึงรายการ...`)
- **API calls (client)** → Axios เท่านั้น — ห้าม native `fetch()`
- **State** → Zustand `_stores/` เสมอ — ห้าม `useState` สำหรับ shared state
- **Build** → `bun run build` ทุกครั้งหลังแก้ไข ตรวจ error ก่อนรายงาน done
- **Scope** → ห้ามเพิ่ม feature / refactor นอก scope ที่ขอ
- **Response format** → `{ status_code, message_th, message_en, data }` ทุก API

---

## Architecture

### Page Module Pattern

ทุก page ที่มี state/data จะมี local modules ในรูปแบบ:

```
app/pages/<role>/<page>/
├── page.tsx               # Server/Client component หลัก
├── _components/           # UI components เฉพาะหน้านี้
├── _stores/               # Zustand store เฉพาะหน้า (ถ้า state ซับซ้อน)
└── _api/                  # Axios API calls ไปยัง /api/v1/...
```

- `_stores/` คือ page-level Zustand ที่ไม่ persist — ต่างจาก `app/stores/` (global, persisted)
- `_api/` รับผิดชอบ Axios calls ทั้งหมด ไม่มี fetch() ใน component

### API Layer Pattern

ทุก API route ใช้โครงสร้าง 3 ชั้น:

```
app/api/v1/<domain>/<action>/
├── route.ts               # HTTP handler: validate → call service → return JSON
├── validation/            # Zod schemas
└── service/               # Business logic + Prisma queries
```

- `route.ts` ไม่มี Prisma โดยตรง — delegate ทั้งหมดไปที่ service
- Service ใช้ `prisma.$transaction()` สำหรับ upsert หลาย relation พร้อมกัน
- Soft-delete: ใช้ `isDeleted: true` แทนการลบจริง — query ทุกจุดต้อง filter `where: { isDeleted: false }`

### Dual Auth System

Signup/Signin ใช้สองระบบพร้อมกัน:

1. **Supabase Auth** — จัดการ credential, session, JWT
2. **Prisma `Profile`** — เก็บ role, name, school info, และ relations ทั้งหมด

Flow:
- Signup: สร้าง Supabase user → upsert Prisma Profile (fail gracefully ถ้า Prisma error)
- Signin: auth กับ Supabase → ดึง Prisma Profile (รวม schoolProfile สำหรับ EMPLOYER) → merge เป็น `User` object ใน `useAuthStore`
- `useAuthStore` (persisted localStorage) คือ source of truth ฝั่ง client

### Layout & Routing Guard

`app/components/layouts/layout-selector.tsx` wrap ทุก page:
- path `/pages/admin/*` → `AdminLayout` (guard: redirect ถ้าไม่ใช่ ADMIN)
- ทุก path อื่น → `LandingLayout`
- Role-home map: `EMPLOYEE → /pages/employee/profile`, `EMPLOYER → /pages/employer/profile`

### Theme System

`app/contexts/theme-context.tsx` wrap ทั้งแอปด้วย Ant Design `ConfigProvider`:
- primary color: `#11b6f5` — ห้าม hardcode สีอื่น
- dark mode toggle เก็บใน localStorage `"app-theme"`
- ใช้ `antTheme.useToken()` เพื่อดึง token ใน component — ห้าม hardcode hex ที่ไม่ใช่ primary

---

## Pages Inventory

### Public
| Path | หน้า |
|------|------|
| `/pages/landing` | Landing Page |
| `/pages/signin` | เข้าสู่ระบบ |
| `/pages/signup` | สมัครสมาชิก |
| `/pages/job` | ค้นหางาน (Lazy Loading) |
| `/pages/job/[job_id]/apply` | สมัครงาน |
| `/pages/blog` | รายการบทความ |
| `/pages/blog/[blog_id]` | อ่านบทความ |

### EMPLOYEE (ครู)
| Path | หน้า |
|------|------|
| `/pages/employee/profile` | โปรไฟล์ครู |
| `/pages/employee/school` | ค้นหาโรงเรียน |
| `/pages/employee/account-setting` | ตั้งค่าบัญชี |

### EMPLOYER (โรงเรียน)
| Path | หน้า |
|------|------|
| `/pages/employer/profile` | โปรไฟล์โรงเรียน |
| `/pages/employer/job/post` | ประกาศงานใหม่ |
| `/pages/employer/job/post/[id]` | แก้ไขประกาศงาน |
| `/pages/employer/job/read` | จัดการประกาศงาน |
| `/pages/employer/school-management` | จัดการสมาชิก + RBAC |
| `/pages/employer/delegated-access` | การเข้าถึงแบบมอบหมาย |
| `/pages/employer/account-setting` | ตั้งค่าบัญชี |

### ADMIN
| Path | หน้า |
|------|------|
| `/pages/admin` | Dashboard |
| `/pages/admin/user-management` | จัดการผู้ใช้ |

---

## API Inventory

### Public
```
GET  /api/v1/jobs                    ค้นหางาน (cursor-based lazy loading)
GET  /api/v1/jobs/latest             งานล่าสุด 8 อัน (landing)
GET  /api/v1/jobs/[job_id]           รายละเอียดงาน
GET  /api/v1/blogs/read              รายการบทความ
GET  /api/v1/blogs/[blog_id]         รายละเอียดบทความ
```

### Auth
```
POST /api/v1/authenticate/signup     สมัครสมาชิก
POST /api/v1/authenticate/signin     เข้าสู่ระบบ
```

### Employee
```
GET  /api/v1/employee/profile/read        ดึงโปรไฟล์ครู
PUT  /api/v1/employee/profile/update      อัปเดตโปรไฟล์
GET  /api/v1/employee/applications/read   ดึงใบสมัครของฉัน
POST /api/v1/employee/applications/create สมัครงาน
GET  /api/v1/employee/schools/read        ค้นหาโรงเรียน
```

### Employer
```
GET  /api/v1/employer/profile/read             ดึงโปรไฟล์โรงเรียน
PUT  /api/v1/employer/profile/update           อัปเดตโปรไฟล์
POST /api/v1/employer/jobs/create              สร้างประกาศงาน
GET  /api/v1/employer/jobs/read                รายการประกาศงาน
PUT  /api/v1/employer/jobs/update              แก้ไขประกาศงาน
PUT  /api/v1/employer/jobs/close               ปิดรับสมัคร
GET  /api/v1/employer/jobs/stats/read          สถิติงาน
GET  /api/v1/employer/jobs/applicants/read     รายการผู้สมัคร
PUT  /api/v1/employer/jobs/applicants/update-status  อัปเดตสถานะผู้สมัคร
GET  /api/v1/employer/jobs/pipeline            pipeline ผู้สมัคร
GET  /api/v1/employer/organization/roles       จัดการ Roles (RBAC)
PUT  /api/v1/employer/organization/roles/permissions  แก้ไข permissions
GET  /api/v1/employer/organization/members     รายการสมาชิก
GET  /api/v1/employer/organization/invites     คำเชิญ
POST /api/v1/employer/organization/invites/accept  ยอมรับคำเชิญ
GET  /api/v1/employer/organization/delegated   delegated access
```

### Admin & Storage
```
GET  /api/v1/admin/users             รายการผู้ใช้
POST /api/v1/storage/upload          อัปโหลดไฟล์ → Supabase Storage
DELETE /api/v1/storage/delete        ลบไฟล์
```

---

## Directory Structure

```
app/
├── api/v1/                  # REST APIs (route → validation → service)
│   ├── authenticate/
│   ├── jobs/
│   ├── blogs/
│   ├── employee/
│   ├── employer/
│   ├── admin/
│   └── storage/
├── pages/                   # UI pages — แต่ละหน้ามี _components/, _stores/, _api/
├── components/layouts/      # LandingLayout, AdminLayout, LayoutSelector, Modals
├── stores/                  # Global stores: auth-store.ts, notification-modal-store.ts
├── contexts/                # theme-context.tsx (light/dark + Ant Design ConfigProvider)
└── lib/                     # supabase.ts (client)
lib/
└── prisma.ts                # Prisma client singleton
prisma/
└── schema.prisma            # DB schema
.claude/skills/              # Project-local Claude Skills
```

---

## Key Files (อย่า read ซ้ำถ้าไม่จำเป็น — ดูจาก Skills แทน)

| ข้อมูล | ดูจาก |
|--------|-------|
| DB Models/Enums/Relations | Skill: `prisma-pattern` |
| Auth flow / useAuthStore | Skill: `auth-pattern` |
| สี / gradient / theme tokens | Skill: `ui-theme` |
| Frontend structure / Zustand pattern | Skill: `frontend-standard` |
| API structure / response format | Skill: `backend-standard` |

---

## Environment Variables

```env
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

## Build Notes

- `ignoreBuildErrors: true` ใน next.config.ts (TypeScript errors ไม่หยุด build)
- Remote images: unsplash.com, dicebear.com
- `optimizePackageImports` สำหรับ Ant Design
