# Database Design Document
## KAM-WEB-SCHOOLJOB — Thai Education Job Marketplace

**Engine:** PostgreSQL  
**ORM:** Prisma 7.6.0  
**Design Pattern:** Relational Database (3NF)  
**Last Updated:** 2026-04-04

---

## 1. ภาพรวมและหลักการออกแบบ

### 1.1 บทบาทผู้ใช้งาน (User Roles)

| Role | คำอธิบาย | หน้าที่ใช้งาน |
|------|----------|--------------|
| `EMPLOYEE` | ครู / ผู้หางาน | profile, job search, apply, school directory |
| `EMPLOYER` | โรงเรียน / ผู้จ้าง | job post, applicant management, school profile |
| `ADMIN` | ผู้ดูแลระบบ | user management, system settings |

### 1.2 หลักการออกแบบ

1. **Single Profile Table** — ใช้ `profiles` เป็น center ของทั้ง EMPLOYEE และ EMPLOYER แทนที่จะแยก table เพราะทั้งคู่ต้องการ auth, email, phone เหมือนกัน และใช้ `role` field แยกพฤติกรรม
2. **Soft Delete** — ทุก record ที่ user สร้างได้ใช้ `is_deleted` แทนการ DELETE จริง เพื่อรักษา data integrity และ audit trail
3. **Normalized Arrays** — field ที่เป็น multi-value (เช่น วิชาที่สอน, จังหวัด) แยกออกเป็น relation table แทน JSON string เพื่อให้ query และ filter ได้
4. **Cascade Delete** — ทุก child record ที่ผูกกับ Profile จะถูกลบอัตโนมัติเมื่อ profile ถูกลบ
5. **UUID Primary Key** — ใช้ UUID แทน auto-increment integer เพื่อความปลอดภัยและ distributed-friendly

---

## 2. Entity Relationship Diagram (ERD)

```
┌──────────────────┐
│     profiles     │ ◄─────────────────────────────────────────┐
│──────────────────│                                            │
│ id (PK)          │                                            │
│ user_id (UNIQUE) │ ── Supabase Auth UID                       │
│ email (UNIQUE)   │                                            │
│ role (ENUM)      │                                            │
│ ...              │                                            │
└──────────────────┘                                            │
        │                                                       │
        │ 1:N (EMPLOYEE)           1:N (EMPLOYER)               │
        ├──────────────────┐       ├──────────────────┐         │
        ▼                  ▼       ▼                  ▼         │
┌──────────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐
│work_experience│  │educations│  │school_profiles│  │     resumes      │
└──────────────┘  └──────────┘  └──────────────┘  └──────────────────┘
        │                                │
        │                                │ 1:N
        │                         ┌──────▼──────┐
        │                         │    jobs     │
        │                         │─────────────│
        │                         │ id (PK)     │
        │                         │ school_id   │◄── school_profiles.id
        │                         │ status      │
        │                         │ ...         │
        │                         └──────┬──────┘
        │                                │ 1:N
        │                         ┌──────▼──────────┐
        └────────────────────────►│   applications   │
           (profile.id = employee) │──────────────────│
                                  │ job_id (FK)      │
                                  │ applicant_id (FK)│
                                  │ status (ENUM)    │
                                  └──────────────────┘

ตาราง supporting (ทั้งหมด FK → profiles.id):
┌───────────┐ ┌──────────┐ ┌──────────────────┐ ┌──────────────────┐
│ licenses  │ │languages │ │  skills          │ │ specializations  │
└───────────┘ └──────────┘ └──────────────────┘ └──────────────────┘

┌────────────────────┐ ┌────────────────────┐
│  grade_can_teaches │ │ preferred_provinces│
└────────────────────┘ └────────────────────┘

ตาราง supporting (FK → jobs.id):
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  job_subjects    │ │  job_grades      │ │   job_benefits   │
└──────────────────┘ └──────────────────┘ └──────────────────┘

ตาราง standalone:
┌────────────────┐ ┌──────────────────┐
│     blogs      │ │  notifications   │
└────────────────┘ └──────────────────┘
```

---

## 3. Table Definitions (พร้อมเหตุผลการออกแบบ)

---

### 3.1 `profiles` — ตาราง Core ของผู้ใช้ทุก Role

**เหตุผล:** รวม EMPLOYEE และ EMPLOYER ไว้ใน table เดียวเพราะทั้งคู่ใช้ระบบ Auth เดียวกัน (Supabase) และมี field ร่วมกัน (email, phone, name) การแยก table จะทำให้ join ซับซ้อนโดยไม่จำเป็น

```sql
profiles
├── id                  UUID PRIMARY KEY
├── user_id             VARCHAR UNIQUE         -- Supabase Auth UID (sync)
├── email               VARCHAR UNIQUE NOT NULL
├── password            VARCHAR                -- bcrypt hash (backup auth)
├── role                ENUM(EMPLOYEE, EMPLOYER, ADMIN)
├── first_name          VARCHAR
├── last_name           VARCHAR
├── phone_number        VARCHAR
├── gender              VARCHAR                -- ชาย, หญิง, ไม่ระบุ
├── date_of_birth       TIMESTAMP
├── nationality         VARCHAR                -- สัญชาติ
├── profile_image_url   VARCHAR
├── profile_visibility  ENUM(public, apply_only) DEFAULT 'public'
├── -- EMPLOYEE-specific fields --
├── teaching_experience VARCHAR                -- 1-3 ปี, 3-5 ปี ...
├── recent_school       VARCHAR
├── special_activities  TEXT                   -- สรุปตัวเอง / About Me
├── can_relocate        BOOLEAN DEFAULT false
├── license_status      ENUM(has_license, pending, no_license, not_required)
├── -- EMPLOYER-specific fields (SchoolProfile) --
│   → แยกออกเป็น school_profiles table (ดูข้อ 3.9)
├── active_resume_id    UUID                   -- FK → resumes.id
├── created_at          TIMESTAMP DEFAULT now()
└── updated_at          TIMESTAMP
```

---

### 3.2 `work_experiences` — ประวัติการทำงาน (EMPLOYEE)

**เหตุผล:** แยกออกจาก profiles เพราะ 1 คนมีได้หลาย entry และต้องการ query แยก (เช่น หาคนที่มีประสบการณ์ > 5 ปี)

```sql
work_experiences
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id CASCADE DELETE
├── job_title       VARCHAR NOT NULL           -- ตำแหน่ง
├── company_name    VARCHAR NOT NULL           -- โรงเรียน/บริษัท
├── start_date      TIMESTAMP NOT NULL
├── end_date        TIMESTAMP                  -- NULL = ยังทำงานอยู่
├── in_present      BOOLEAN DEFAULT false
├── description     TEXT
├── work_year       INT                        -- คำนวณ auto (years)
├── is_deleted      BOOLEAN DEFAULT false
├── created_at      TIMESTAMP
└── updated_at      TIMESTAMP
```

---

### 3.3 `educations` — ประวัติการศึกษา (EMPLOYEE)

**เหตุผล:** แยกออกเพราะ 1 คนมีหลายระดับการศึกษา และ Employer ต้องการ filter ตาม education level

```sql
educations
├── id               UUID PRIMARY KEY
├── profile_id       UUID FK → profiles.id CASCADE DELETE
├── level            VARCHAR NOT NULL           -- ปริญญาตรี, โท, เอก ...
├── institution      VARCHAR NOT NULL
├── major            VARCHAR NOT NULL
├── graduation_year  INT                        -- พ.ศ.
├── gpa              DECIMAL(3,2)
├── start_date       TIMESTAMP
├── end_date         TIMESTAMP
├── is_deleted       BOOLEAN DEFAULT false
├── created_at       TIMESTAMP
└── updated_at       TIMESTAMP
```

---

### 3.4 `licenses` — ใบประกอบวิชาชีพ / Certifications

**เหตุผล:** แยกออกเพราะใบประกอบฯ มีวันหมดอายุ ต้องการ query ได้ว่าใบใด valid/expired และ 1 คนอาจมีหลายใบ

```sql
licenses
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id CASCADE DELETE
├── license_name    VARCHAR NOT NULL           -- ชื่อใบประกอบ
├── issuer          VARCHAR                    -- ผู้ออก (คุรุสภา ฯลฯ)
├── license_number  VARCHAR                    -- เลขที่ใบ
├── issue_date      TIMESTAMP
├── expiry_date     TIMESTAMP
├── file_url        VARCHAR                    -- URL ไฟล์แนบ (Storage)
├── credential_url  VARCHAR                    -- URL ออนไลน์
├── is_deleted      BOOLEAN DEFAULT false
├── created_at      TIMESTAMP
└── updated_at      TIMESTAMP
```

---

### 3.5 `resumes` — เรซูเม่ (รองรับหลายไฟล์)

**เหตุผล:** Requirement 1.2 ต้องการแนบได้หลายไฟล์และเลือก active — จำเป็นต้องเป็น table แยก ไม่ใช่แค่ field เดียว

```sql
resumes
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id CASCADE DELETE
├── file_name       VARCHAR NOT NULL
├── file_size       INT                        -- bytes
├── file_url        VARCHAR NOT NULL           -- Supabase Storage URL
├── is_active       BOOLEAN DEFAULT false      -- เรซูเม่ที่กำลังใช้งาน
├── uploaded_at     TIMESTAMP DEFAULT now()
└── is_deleted      BOOLEAN DEFAULT false
```

> `profiles.active_resume_id` → FK ชี้กลับมาที่ resumes.id เพื่อ query เร็วโดยไม่ต้อง WHERE is_active

---

### 3.6 `specializations` — วิชาที่เชี่ยวชาญ (EMPLOYEE)

**เหตุผล:** เปลี่ยนจาก JSON string ใน schema เดิม เพราะต้องการ `WHERE specialization = 'ภาษาอังกฤษ'` ได้โดยตรงสำหรับหน้า Job Search filter

```sql
specializations
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id CASCADE DELETE
├── subject         VARCHAR NOT NULL           -- ภาษาอังกฤษ, คณิตศาสตร์ ...
└── created_at      TIMESTAMP
```

---

### 3.7 `grade_can_teaches` — ระดับชั้นที่สอนได้

**เหตุผล:** เหมือน specializations — ต้องการ filter ในหน้าค้นหา "ต้องการครูระดับมัธยม"

```sql
grade_can_teaches
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id CASCADE DELETE
├── grade           VARCHAR NOT NULL           -- อนุบาล, ประถม, มัธยมต้น ...
└── created_at      TIMESTAMP
```

---

### 3.8 `preferred_provinces` — จังหวัดที่ต้องการทำงาน

```sql
preferred_provinces
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id CASCADE DELETE
├── province        VARCHAR NOT NULL
└── created_at      TIMESTAMP
```

---

### 3.9 `school_profiles` — โปรไฟล์โรงเรียน (EMPLOYER)

**เหตุผล:** แยกออกจาก profiles เพราะข้อมูลโรงเรียนมี field เฉพาะมาก (ประเภทโรงเรียน, จำนวนนักเรียน, สังกัด) และทำให้ EMPLOYEE ไม่ต้องแบกข้อมูลที่ไม่เกี่ยวข้อง

```sql
school_profiles
├── id                  UUID PRIMARY KEY
├── profile_id          UUID FK → profiles.id CASCADE DELETE UNIQUE
├── school_name         VARCHAR NOT NULL
├── school_type         VARCHAR                -- รัฐบาล, เอกชน, นานาชาติ, สาธิต
├── affiliation         VARCHAR                -- สังกัด (สพฐ., สช., อปท. ...)
├── province            VARCHAR NOT NULL
├── district            VARCHAR
├── address             TEXT
├── website             VARCHAR
├── phone               VARCHAR
├── description         TEXT                   -- เกี่ยวกับโรงเรียน
├── vision              TEXT                   -- วิสัยทัศน์
├── student_count       INT                    -- จำนวนนักเรียน
├── teacher_count       INT                    -- จำนวนครู
├── logo_url            VARCHAR
├── cover_image_url     VARCHAR
├── founded_year        INT
├── created_at          TIMESTAMP
└── updated_at          TIMESTAMP
```

---

### 3.10 `school_benefits` — สวัสดิการโรงเรียน

```sql
school_benefits
├── id                  UUID PRIMARY KEY
├── school_profile_id   UUID FK → school_profiles.id CASCADE DELETE
└── benefit             VARCHAR NOT NULL       -- ที่พัก, ค่าอาหาร ...
```

---

### 3.11 `jobs` — ประกาศงาน (EMPLOYER)

**เหตุผล:** เป็น core entity ของระบบ Employer ต้องการ filter ได้ทุกมิติ (จังหวัด, วิชา, ระดับ, เงินเดือน, ประเภทสัญญา)

```sql
jobs
├── id                  UUID PRIMARY KEY
├── school_profile_id   UUID FK → school_profiles.id CASCADE DELETE
├── title               VARCHAR NOT NULL
├── description         TEXT
├── job_type            VARCHAR                -- Full-time, Part-time, Contract
├── province            VARCHAR NOT NULL
├── district            VARCHAR
├── salary_min          INT                    -- บาท/เดือน
├── salary_max          INT
├── salary_negotiable   BOOLEAN DEFAULT false
├── license_required    ENUM(required, not_required, pending_ok)
├── positions_available INT DEFAULT 1          -- จำนวนที่รับ
├── status              ENUM(OPEN, CLOSED, DRAFT) DEFAULT 'DRAFT'
├── deadline            TIMESTAMP              -- วันหมดรับสมัคร
├── created_at          TIMESTAMP
└── updated_at          TIMESTAMP
```

---

### 3.12 `job_subjects` — วิชาที่งานต้องการ

**เหตุผล:** แยกออกเพื่อ JOIN กับ specializations ของ EMPLOYEE ในระบบ matching

```sql
job_subjects
├── id          UUID PRIMARY KEY
├── job_id      UUID FK → jobs.id CASCADE DELETE
└── subject     VARCHAR NOT NULL
```

---

### 3.13 `job_grades` — ระดับชั้นที่งานต้องการสอน

```sql
job_grades
├── id          UUID PRIMARY KEY
├── job_id      UUID FK → jobs.id CASCADE DELETE
└── grade       VARCHAR NOT NULL
```

---

### 3.14 `job_benefits` — สวัสดิการของงาน

```sql
job_benefits
├── id          UUID PRIMARY KEY
├── job_id      UUID FK → jobs.id CASCADE DELETE
└── benefit     VARCHAR NOT NULL               -- ที่พัก, ค่าอาหาร, ประกันสังคม ...
```

---

### 3.15 `applications` — การสมัครงาน

**เหตุผล:** เป็น junction table ระหว่าง EMPLOYEE และ Job พร้อม state machine สำหรับ workflow การรับสมัคร

```sql
applications
├── id                  UUID PRIMARY KEY
├── job_id              UUID FK → jobs.id CASCADE DELETE
├── applicant_id        UUID FK → profiles.id CASCADE DELETE  -- EMPLOYEE
├── status              ENUM(PENDING, INTERVIEW, ACCEPTED, REJECTED) DEFAULT 'PENDING'
├── resume_id           UUID FK → resumes.id                  -- snapshot เรซูเม่ที่ใช้สมัคร
├── cover_letter        TEXT
├── applied_at          TIMESTAMP DEFAULT now()
├── updated_at          TIMESTAMP
└── UNIQUE(job_id, applicant_id)                              -- ป้องกันสมัครซ้ำ
```

---

### 3.16 `blogs` — บทความ

**เหตุผล:** รองรับหน้า `/pages/blog` ที่มีอยู่

```sql
blogs
├── id              UUID PRIMARY KEY
├── author_id       UUID FK → profiles.id
├── title           VARCHAR NOT NULL
├── slug            VARCHAR UNIQUE NOT NULL    -- SEO-friendly URL
├── content         TEXT NOT NULL
├── excerpt         TEXT                       -- สรุปย่อ
├── cover_image_url VARCHAR
├── category        VARCHAR
├── tags            TEXT                       -- JSON array
├── status          ENUM(DRAFT, PUBLISHED) DEFAULT 'DRAFT'
├── published_at    TIMESTAMP
├── created_at      TIMESTAMP
└── updated_at      TIMESTAMP
```

---

### 3.17 `notifications` — การแจ้งเตือน

**เหตุผล:** รองรับ notification modal store ที่มีใน codebase

```sql
notifications
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id CASCADE DELETE
├── type            VARCHAR NOT NULL           -- application_update, new_job, system
├── title           VARCHAR NOT NULL
├── message         TEXT
├── is_read         BOOLEAN DEFAULT false
├── reference_id    UUID                       -- id ของ entity ที่เกี่ยวข้อง
├── reference_type  VARCHAR                    -- 'application', 'job', 'blog'
├── created_at      TIMESTAMP
└── updated_at      TIMESTAMP
```

---

## 4. Enum Definitions

```prisma
enum UserRole {
  EMPLOYEE      // ครู / ผู้หางาน
  EMPLOYER      // โรงเรียน / ผู้จ้าง
  ADMIN         // ผู้ดูแลระบบ
}

enum JobStatus {
  OPEN          // รับสมัครอยู่
  CLOSED        // ปิดรับสมัคร
  DRAFT         // ฉบับร่าง (ยังไม่เผยแพร่)
}

enum ApplicationStatus {
  PENDING       // รอพิจารณา
  INTERVIEW     // นัดสัมภาษณ์
  ACCEPTED      // รับเข้าทำงาน
  REJECTED      // ไม่ผ่านการคัดเลือก
}

enum LicenseStatus {
  has_license    // มีใบอนุญาต
  pending        // อยู่ระหว่างขอ
  no_license     // ไม่มีใบอนุญาต
  not_required   // ตำแหน่งไม่ต้องใช้
}

enum LicenseRequired {
  required       // ต้องมีใบประกอบฯ
  not_required   // ไม่ต้อง
  pending_ok     // อยู่ระหว่างขอได้
}

enum ProfileVisibility {
  public         // เปิดสาธารณะ
  apply_only     // เห็นเฉพาะเมื่อสมัครงาน
}

enum BlogStatus {
  DRAFT
  PUBLISHED
}
```

---

## 5. Relation Summary

| Table | Relation | Target | Type |
|-------|----------|--------|------|
| profiles | has many | work_experiences | 1:N |
| profiles | has many | educations | 1:N |
| profiles | has many | licenses | 1:N |
| profiles | has many | resumes | 1:N |
| profiles | belongs to one | resumes (active) | 1:1 |
| profiles | has many | specializations | 1:N |
| profiles | has many | grade_can_teaches | 1:N |
| profiles | has many | preferred_provinces | 1:N |
| profiles | has one | school_profiles | 1:1 (EMPLOYER only) |
| profiles | has many | applications | 1:N (EMPLOYEE only) |
| profiles | has many | blogs | 1:N (ADMIN/EMPLOYER) |
| profiles | has many | notifications | 1:N |
| school_profiles | has many | jobs | 1:N |
| school_profiles | has many | school_benefits | 1:N |
| jobs | has many | applications | 1:N |
| jobs | has many | job_subjects | 1:N |
| jobs | has many | job_grades | 1:N |
| jobs | has many | job_benefits | 1:N |
| applications | belongs to | jobs | N:1 |
| applications | belongs to | profiles (employee) | N:1 |

---

## 6. Mapping: หน้า → Tables ที่ใช้

| หน้า | Tables หลัก |
|------|------------|
| `/pages/signup` | profiles |
| `/pages/signin` | profiles |
| `/pages/employee/profile` | profiles, work_experiences, educations, licenses, resumes, specializations, grade_can_teaches, preferred_provinces |
| `/pages/employee/school` | school_profiles, school_benefits, jobs |
| `/pages/job` | jobs, job_subjects, job_grades, school_profiles |
| `/pages/job/[id]/apply` | applications, resumes, profiles |
| `/pages/employer/profile` | profiles, school_profiles, school_benefits |
| `/pages/employer/job/post` | jobs, job_subjects, job_grades, job_benefits |
| `/pages/employer/job/read` | jobs, applications, profiles |
| `/pages/employer/account-setting` | profiles |
| `/pages/employee/account-setting` | profiles |
| `/pages/admin/user-management` | profiles, school_profiles |
| `/pages/blog` | blogs |
| `/pages/landing` | jobs, school_profiles (aggregates) |

---

## 7. Index Strategy

```sql
-- profiles
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- jobs
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_province ON jobs(province);
CREATE INDEX idx_jobs_school_profile_id ON jobs(school_profile_id);
CREATE INDEX idx_jobs_deadline ON jobs(deadline);

-- applications
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_status ON applications(status);

-- specializations (สำหรับ matching)
CREATE INDEX idx_specializations_subject ON specializations(subject);

-- job_subjects (สำหรับ matching)
CREATE INDEX idx_job_subjects_subject ON job_subjects(subject);
```

---

## 8. สิ่งที่ต้องทำต่อ (Next Steps)

- [ ] เขียน Prisma Schema ใหม่ตาม design นี้ (`schema.prisma`)
- [ ] รัน `prisma db push` หรือ `prisma migrate dev` เพื่อสร้าง table
- [ ] สร้าง seed data สำหรับ dev/test
- [ ] เชื่อม API routes กับ Prisma service
- [ ] ตั้งค่า Row Level Security (RLS) ใน Supabase สำหรับ profiles
