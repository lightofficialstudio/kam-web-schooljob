# Database Design Document

## KAM-WEB-SCHOOLJOB — Thai Education Job Marketplace

**Engine:** PostgreSQL
**ORM:** Prisma 7.6.0
**Design Pattern:** Relational Database (3NF)
**Last Updated:** 2026-04-05

---

## 1. ภาพรวมและหลักการออกแบบ

### 1.1 บทบาทผู้ใช้งาน (User Roles)

| Role       | คำอธิบาย           | หน้าที่ใช้งาน                                  |
| ---------- | ------------------ | ---------------------------------------------- |
| `EMPLOYEE` | ครู / ผู้หางาน     | profile, job search, apply, school directory   |
| `EMPLOYER` | โรงเรียน / ผู้จ้าง | job post, applicant management, school profile |
| `ADMIN`    | ผู้ดูแลระบบ        | user management, system settings               |

### 1.2 หลักการออกแบบ

1. **Single Profile Table** — ใช้ `profiles` เป็น center ของทั้ง EMPLOYEE และ EMPLOYER แทนที่จะแยก table เพราะทั้งคู่ต้องการ auth, email, phone เหมือนกัน และใช้ `role` field แยกพฤติกรรม
2. **Soft Delete** — ทุก record ที่ user สร้างได้ใช้ `is_deleted` แทนการ DELETE จริง เพื่อรักษา data integrity และ audit trail
3. **Normalized Arrays** — field ที่เป็น multi-value (เช่น วิชาที่สอน, จังหวัด) แยกออกเป็น relation table แทน JSON string เพื่อให้ query และ filter ได้
4. **Cascade Delete** — ทุก child record ที่ผูกกับ Profile จะถูกลบอัตโนมัติเมื่อ profile ถูกลบ
5. **UUID Primary Key** — ใช้ UUID แทน auto-increment integer เพื่อความปลอดภัยและ distributed-friendly
6. **Circular FK Handling** — `profiles.active_resume_id` → `resumes.id` ใช้ `@relation(name:)` เพื่อหลีกเลี่ยง circular dependency

---

## 2. Entity Relationship Diagram (ERD)

```
┌──────────────────────────────────────────────────────┐
│                      profiles                        │
│──────────────────────────────────────────────────────│
│ id (PK, UUID)                                        │
│ user_id (UNIQUE) ── Supabase Auth UID                │
│ email (UNIQUE)                                       │
│ role (ENUM: EMPLOYEE | EMPLOYER | ADMIN)             │
│ active_resume_id (FK → resumes.id, nullable)         │
│ ... (ดู section 3.1)                                 │
└──────────────────────┬───────────────────────────────┘
                       │
         ┌─────────────┼──────────────────────────────────────────────────────┐
         │             │                                                       │
         │ EMPLOYEE relations                                    EMPLOYER relation
         │             │                                                       │
    ┌────┴────┐   ┌────┴──────┐  ┌──────────────┐  ┌────────────┐  ┌────────────────┐
    │resumes  │   │work_exps  │  │ educations   │  │ licenses   │  │school_profiles │
    └────┬────┘   └───────────┘  └──────────────┘  └────────────┘  └───────┬────────┘
         │                                                                  │
    (active_resume_id                                               ┌───────┴────────┐
     ชี้กลับ profiles)                                               │ school_benefits│
                                                                    └────────────────┘
                                                                            │
                                                                    ┌───────┴────────┐
                                                                    │     jobs       │
                                                                    └───────┬────────┘
                                                                            │
                                         ┌──────────────┬──────────────────┤
                                         │              │                  │
                                  ┌──────┴────┐ ┌──────┴────┐ ┌──────────┴──────┐
                                  │job_subjects│ │job_grades │ │  job_benefits   │
                                  └───────────┘ └───────────┘ └─────────────────┘
                                         │
                                  ┌──────┴──────────┐
                                  │   applications   │◄── profiles (EMPLOYEE)
                                  └─────────────────┘

ตาราง supporting (FK → profiles.id):
┌──────────────────┐ ┌────────────────────┐ ┌──────────────────────┐
│ specializations  │ │  grade_can_teaches  │ │  preferred_provinces │
└──────────────────┘ └────────────────────┘ └──────────────────────┘
┌───────────┐ ┌──────────┐
│ languages │ │  skills  │
└───────────┘ └──────────┘

ตาราง standalone (ไม่ขึ้นกับ profiles โดยตรง หรือขึ้นแบบ optional):
┌────────────────┐ ┌──────────────────┐
│     blogs      │ │  notifications   │
└────────────────┘ └──────────────────┘

ตาราง View Tracking (analytics):
┌───────────────────────────────────────────────────────────┐
│ job_views                                                 │
│  job_id → jobs.id                                         │
│  viewer_id → profiles.id (nullable, EMPLOYEE/EMPLOYER)    │
└───────────────────────────────────────────────────────────┘
┌───────────────────────────────────────────────────────────┐
│ profile_views                                             │
│  profile_id → profiles.id  (เจ้าของ profile ที่ถูกดู)     │
│  viewer_id → profiles.id   (ผู้ดู, nullable)              │
└───────────────────────────────────────────────────────────┘
```

---

## 3. Table Definitions (พร้อมเหตุผลการออกแบบ)

---

### 3.1 `profiles` — ตาราง Core ของผู้ใช้ทุก Role

**เหตุผล:** รวม EMPLOYEE และ EMPLOYER ไว้ใน table เดียวเพราะทั้งคู่ใช้ระบบ Auth เดียวกัน (Supabase) และมี field ร่วมกัน (email, phone, name) การแยก table จะทำให้ join ซับซ้อนโดยไม่จำเป็น

**หมายเหตุ:** `active_resume_id` มี circular reference กับ `resumes` — ใน Prisma ต้องใช้ `@relation(name: "ActiveResume")` และกำหนด FK ทั้ง 2 ด้าน

```
profiles
├── id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()
├── user_id             VARCHAR UNIQUE NOT NULL        -- Supabase Auth UID
├── email               VARCHAR UNIQUE NOT NULL
├── password            VARCHAR                        -- bcrypt hash (backup auth)
├── role                ENUM(EMPLOYEE, EMPLOYER, ADMIN) NOT NULL DEFAULT 'EMPLOYEE'
├── first_name          VARCHAR
├── last_name           VARCHAR
├── phone_number        VARCHAR
├── gender              VARCHAR                        -- ชาย, หญิง, ไม่ระบุ
├── date_of_birth       TIMESTAMP
├── nationality         VARCHAR                        -- สัญชาติ
├── profile_image_url   VARCHAR
├── profile_visibility  ENUM(public, apply_only) DEFAULT 'public'
│
├── [EMPLOYEE-specific]
├── teaching_experience VARCHAR                        -- 1-3 ปี, 3-5 ปี, 5+ ปี
├── recent_school       VARCHAR                        -- โรงเรียนล่าสุด
├── special_activities  TEXT                           -- About Me / สรุปตัวเอง
├── can_relocate        BOOLEAN DEFAULT false
├── license_status      ENUM(has_license, pending, no_license, not_required)
├── active_resume_id    UUID (FK → resumes.id, nullable, SET NULL on delete)
│
├── created_at          TIMESTAMP DEFAULT now()
└── updated_at          TIMESTAMP (auto-update)

Relations (Prisma):
- workExperiences  WorkExperience[]
- educations       Education[]
- licenses         License[]
- languages        Language[]
- skills           Skill[]
- resumes          Resume[]           @relation("ProfileResumes")
- activeResume     Resume?            @relation("ActiveResume")
- specializations  Specialization[]
- gradeCanTeaches  GradeCanTeach[]
- preferredProvinces PreferredProvince[]
- schoolProfile    SchoolProfile?
- applications     Application[]
- blogs            Blog[]
- notifications    Notification[]
```

---

### 3.2 `work_experiences` — ประวัติการทำงาน (EMPLOYEE)

**เหตุผล:** แยกออกจาก profiles เพราะ 1 คนมีได้หลาย entry และต้องการ query แยก (เช่น หาคนที่มีประสบการณ์ > 5 ปี)

```
work_experiences
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id ON DELETE CASCADE
├── job_title       VARCHAR NOT NULL               -- ตำแหน่ง
├── company_name    VARCHAR NOT NULL               -- โรงเรียน/บริษัท
├── start_date      TIMESTAMP NOT NULL
├── end_date        TIMESTAMP                      -- NULL = ยังทำงานอยู่
├── in_present      BOOLEAN DEFAULT false          -- ยังทำงานอยู่ถึงปัจจุบัน
├── description     TEXT                           -- รายละเอียดงาน
├── work_year       INT                            -- จำนวนปีที่ทำงาน (คำนวณ)
├── is_deleted      BOOLEAN DEFAULT false
├── created_at      TIMESTAMP DEFAULT now()
└── updated_at      TIMESTAMP (auto-update)
```

---

### 3.3 `educations` — ประวัติการศึกษา (EMPLOYEE)

**เหตุผล:** แยกออกเพราะ 1 คนมีหลายระดับการศึกษา และ Employer ต้องการ filter ตาม education level

```
educations
├── id               UUID PRIMARY KEY
├── profile_id       UUID FK → profiles.id ON DELETE CASCADE
├── level            VARCHAR NOT NULL              -- ปริญญาตรี, โท, เอก, ปวช., ปวส.
├── institution      VARCHAR NOT NULL              -- ชื่อสถาบัน
├── major            VARCHAR NOT NULL              -- สาขาวิชา
├── graduation_year  INT                           -- ปีที่จบ (พ.ศ.)
├── gpa              DECIMAL(3,2)                  -- เกรดเฉลี่ย
├── start_date       TIMESTAMP
├── end_date         TIMESTAMP
├── is_deleted       BOOLEAN DEFAULT false
├── created_at       TIMESTAMP DEFAULT now()
└── updated_at       TIMESTAMP (auto-update)
```

---

### 3.4 `licenses` — ใบประกอบวิชาชีพ / Certifications

**เหตุผล:** แยกออกเพราะใบประกอบฯ มีวันหมดอายุ ต้องการ query ได้ว่าใบใด valid/expired และ 1 คนอาจมีหลายใบ

```
licenses
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id ON DELETE CASCADE
├── license_name    VARCHAR NOT NULL               -- ชื่อใบประกอบ
├── issuer          VARCHAR                        -- ผู้ออก (คุรุสภา ฯลฯ)
├── license_number  VARCHAR                        -- เลขที่ใบ
├── issue_date      TIMESTAMP                      -- วันที่ออก
├── expiry_date     TIMESTAMP                      -- วันหมดอายุ (NULL = ไม่หมด)
├── file_url        VARCHAR                        -- URL ไฟล์แนบ (Supabase Storage)
├── credential_url  VARCHAR                        -- URL ออนไลน์ (ถ้ามี)
├── is_deleted      BOOLEAN DEFAULT false
├── created_at      TIMESTAMP DEFAULT now()
└── updated_at      TIMESTAMP (auto-update)
```

---

### 3.5 `resumes` — เรซูเม่ (รองรับหลายไฟล์ต่อ 1 คน)

**เหตุผล:** ต้องการแนบได้หลายไฟล์และเลือก active — จำเป็นต้องเป็น table แยก ไม่ใช่แค่ field เดียว

**หมายเหตุ circular FK:** `profiles.active_resume_id` → `resumes.id` และ `resumes.profile_id` → `profiles.id` ต้องใช้ named relation ใน Prisma:

- `resumes.profile` → `@relation(name: "ProfileResumes")`
- `profiles.activeResume` → `@relation(name: "ActiveResume", fields: [active_resume_id], references: [id])`

```
resumes
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id ON DELETE CASCADE   -- @relation("ProfileResumes")
├── file_name       VARCHAR NOT NULL               -- ชื่อไฟล์ที่แสดง
├── file_size       INT                            -- ขนาดไฟล์ (bytes)
├── file_url        VARCHAR NOT NULL               -- Supabase Storage URL
├── is_active       BOOLEAN DEFAULT false          -- เรซูเม่หลักที่กำลังใช้
├── is_deleted      BOOLEAN DEFAULT false
└── uploaded_at     TIMESTAMP DEFAULT now()

Relations (Prisma):
- profile    Profile  @relation("ProfileResumes", fields: [profile_id], references: [id])
- activeFor  Profile? @relation("ActiveResume")   -- back-reference จาก profiles.active_resume_id
- applications Application[]                       -- snapshot เรซูเม่ที่ใช้สมัคร
```

---

### 3.6 `specializations` — วิชาที่เชี่ยวชาญ (EMPLOYEE)

**เหตุผล:** เปลี่ยนจาก JSON string ใน schema เดิม เพื่อให้ `WHERE subject = 'ภาษาอังกฤษ'` ได้โดยตรงในหน้า Job Search filter และ matching engine

```
specializations
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id ON DELETE CASCADE
├── subject         VARCHAR NOT NULL               -- ภาษาอังกฤษ, คณิตศาสตร์, วิทยาศาสตร์ ...
└── created_at      TIMESTAMP DEFAULT now()
```

---

### 3.7 `grade_can_teaches` — ระดับชั้นที่สอนได้ (EMPLOYEE)

**เหตุผล:** เหมือน specializations — ต้องการ filter "ต้องการครูระดับมัธยม" ในหน้าค้นหา

```
grade_can_teaches
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id ON DELETE CASCADE
├── grade           VARCHAR NOT NULL               -- อนุบาล, ประถมต้น, ประถมปลาย, มัธยมต้น, มัธยมปลาย, ปวช./ปวส.
└── created_at      TIMESTAMP DEFAULT now()
```

---

### 3.8 `preferred_provinces` — จังหวัดที่ต้องการทำงาน (EMPLOYEE)

**เหตุผล:** เปลี่ยนจาก JSON string เพื่อให้ matching กับ `jobs.province` ได้โดยตรง

```
preferred_provinces
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id ON DELETE CASCADE
├── province        VARCHAR NOT NULL               -- ชื่อจังหวัด (ภาษาไทย)
└── created_at      TIMESTAMP DEFAULT now()
```

---

### 3.9 `languages` — ทักษะภาษา (EMPLOYEE)

**เหตุผล:** แยกออกจาก profiles เพื่อรองรับหลายภาษาต่อ 1 คน และบันทึก proficiency level ได้

```
languages
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id ON DELETE CASCADE
├── language_name   VARCHAR NOT NULL               -- ภาษาไทย, อังกฤษ, จีน, ญี่ปุ่น ...
├── proficiency     VARCHAR                        -- native, fluent, intermediate, basic
├── is_deleted      BOOLEAN DEFAULT false
├── created_at      TIMESTAMP DEFAULT now()
└── updated_at      TIMESTAMP (auto-update)
```

---

### 3.10 `skills` — ทักษะ IT / ทักษะอื่นๆ (EMPLOYEE)

**เหตุผล:** แยกออกเพื่อรองรับหลาย skill tag ต่อ 1 คน

```
skills
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id ON DELETE CASCADE
├── skill_name      VARCHAR NOT NULL               -- Microsoft Office, Canva, Python ...
├── is_deleted      BOOLEAN DEFAULT false
├── created_at      TIMESTAMP DEFAULT now()
└── updated_at      TIMESTAMP (auto-update)
```

---

### 3.11 `school_profiles` — โปรไฟล์โรงเรียน (EMPLOYER)

**เหตุผล:** แยกออกจาก profiles เพราะข้อมูลโรงเรียนมี field เฉพาะมาก และทำให้ EMPLOYEE ไม่ต้องแบกข้อมูลที่ไม่เกี่ยวข้อง Relation เป็น 1:1 กับ profiles (EMPLOYER เท่านั้น)

```
school_profiles
├── id                  UUID PRIMARY KEY
├── profile_id          UUID FK → profiles.id ON DELETE CASCADE UNIQUE   -- 1:1
├── school_name         VARCHAR NOT NULL
├── school_type         VARCHAR                    -- รัฐบาล, เอกชน, นานาชาติ, สาธิต
├── affiliation         VARCHAR                    -- สังกัด: สพฐ., สช., อปท., กทม., ตชด.
├── province            VARCHAR NOT NULL
├── district            VARCHAR                    -- อำเภอ/เขต
├── address             TEXT                       -- ที่อยู่เต็ม
├── website             VARCHAR
├── phone               VARCHAR
├── description         TEXT                       -- เกี่ยวกับโรงเรียน
├── vision              TEXT                       -- วิสัยทัศน์
├── student_count       INT                        -- จำนวนนักเรียน
├── teacher_count       INT                        -- จำนวนครู
├── logo_url            VARCHAR
├── cover_image_url     VARCHAR
├── founded_year        INT                        -- ปีที่ก่อตั้ง (พ.ศ.)
├── created_at          TIMESTAMP DEFAULT now()
└── updated_at          TIMESTAMP (auto-update)

Relations:
- profile       Profile         @relation
- schoolBenefits SchoolBenefit[]
- jobs          Job[]
```

---

### 3.12 `school_benefits` — สวัสดิการของโรงเรียน (EMPLOYER)

**เหตุผล:** แยกออกเพื่อให้แก้ไขสวัสดิการแต่ละรายการได้อิสระ และ query "โรงเรียนที่มีที่พัก" ได้

```
school_benefits
├── id                  UUID PRIMARY KEY
├── school_profile_id   UUID FK → school_profiles.id ON DELETE CASCADE
└── benefit             VARCHAR NOT NULL           -- ที่พัก, ค่าอาหาร, รถรับส่ง ...
```

---

### 3.13 `jobs` — ประกาศงาน (EMPLOYER)

**เหตุผล:** เป็น core entity ของระบบ Employer ต้องการ filter ได้ทุกมิติ (จังหวัด, วิชา, ระดับ, เงินเดือน, ประเภทสัญญา)

```
jobs
├── id                  UUID PRIMARY KEY
├── school_profile_id   UUID FK → school_profiles.id ON DELETE CASCADE
├── title               VARCHAR NOT NULL           -- ชื่อตำแหน่งงาน
├── description         TEXT                       -- รายละเอียดงาน
├── job_type            VARCHAR                    -- Full-time, Part-time, Contract, Volunteer
├── province            VARCHAR NOT NULL           -- จังหวัดที่ทำงาน
├── district            VARCHAR                    -- อำเภอ/เขต
├── salary_min          INT                        -- เงินเดือนต่ำสุด (บาท/เดือน)
├── salary_max          INT                        -- เงินเดือนสูงสุด
├── salary_negotiable   BOOLEAN DEFAULT false      -- เงินเดือนสามารถต่อรองได้
├── license_required    ENUM(required, not_required, pending_ok)
├── positions_available INT DEFAULT 1              -- จำนวนที่รับสมัคร
├── status              ENUM(OPEN, CLOSED, DRAFT) DEFAULT 'DRAFT'
├── deadline            TIMESTAMP                  -- วันหมดรับสมัคร
├── created_at          TIMESTAMP DEFAULT now()
└── updated_at          TIMESTAMP (auto-update)

Relations:
- schoolProfile  SchoolProfile
- jobSubjects    JobSubject[]
- jobGrades      JobGrade[]
- jobBenefits    JobBenefit[]
- applications   Application[]
```

---

### 3.14 `job_subjects` — วิชาที่งานต้องการ

**เหตุผล:** แยกออกเพื่อ JOIN กับ `specializations` ของ EMPLOYEE ในระบบ matching และ filter หน้า Job Search

```
job_subjects
├── id          UUID PRIMARY KEY
├── job_id      UUID FK → jobs.id ON DELETE CASCADE
└── subject     VARCHAR NOT NULL                   -- ภาษาอังกฤษ, คณิตศาสตร์ ...
```

---

### 3.15 `job_grades` — ระดับชั้นที่งานต้องการสอน

**เหตุผล:** แยกออกเพื่อ JOIN กับ `grade_can_teaches` ของ EMPLOYEE ในระบบ matching

```
job_grades
├── id          UUID PRIMARY KEY
├── job_id      UUID FK → jobs.id ON DELETE CASCADE
└── grade       VARCHAR NOT NULL                   -- อนุบาล, ประถมต้น, ประถมปลาย, มัธยมต้น, มัธยมปลาย
```

---

### 3.16 `job_benefits` — สวัสดิการของตำแหน่งงาน

**เหตุผล:** สวัสดิการของแต่ละตำแหน่งอาจแตกต่างจากสวัสดิการโรงเรียน

```
job_benefits
├── id          UUID PRIMARY KEY
├── job_id      UUID FK → jobs.id ON DELETE CASCADE
└── benefit     VARCHAR NOT NULL                   -- ที่พัก, ค่าอาหาร, ประกันสังคม, โบนัส ...
```

---

### 3.17 `applications` — การสมัครงาน

**เหตุผล:** เป็น junction table ระหว่าง EMPLOYEE และ Job พร้อม state machine สำหรับ workflow การรับสมัคร Unique constraint ป้องกันการสมัครซ้ำ

```
applications
├── id                  UUID PRIMARY KEY
├── job_id              UUID FK → jobs.id ON DELETE CASCADE
├── applicant_id        UUID FK → profiles.id ON DELETE CASCADE  -- EMPLOYEE เท่านั้น
├── resume_id           UUID FK → resumes.id ON DELETE SET NULL  -- snapshot เรซูเม่ที่ใช้สมัคร
├── status              ENUM(PENDING, INTERVIEW, ACCEPTED, REJECTED) DEFAULT 'PENDING'
├── cover_letter        TEXT                       -- จดหมายสมัครงาน
├── applied_at          TIMESTAMP DEFAULT now()
└── updated_at          TIMESTAMP (auto-update)

UNIQUE CONSTRAINT: (job_id, applicant_id)          -- ป้องกันสมัครงานซ้ำ

Relations:
- job        Job
- applicant  Profile
- resume     Resume?
```

---

### 3.18 `blogs` — บทความ

**เหตุผล:** รองรับหน้า `/pages/blog` ที่มีอยู่ รองรับ ADMIN และ EMPLOYER เขียนบทความ

```
blogs
├── id              UUID PRIMARY KEY
├── author_id       UUID FK → profiles.id ON DELETE SET NULL
├── title           VARCHAR NOT NULL
├── slug            VARCHAR UNIQUE NOT NULL        -- SEO-friendly URL (auto-generate จาก title)
├── content         TEXT NOT NULL                  -- เนื้อหาบทความ (Markdown/HTML)
├── excerpt         TEXT                           -- สรุปย่อ (แสดงในหน้า listing)
├── cover_image_url VARCHAR
├── category        VARCHAR                        -- ข่าวการศึกษา, เคล็ดลับสมัครงาน, ...
├── tags            TEXT                           -- JSON array ของ tag
├── status          ENUM(DRAFT, PUBLISHED) DEFAULT 'DRAFT'
├── published_at    TIMESTAMP                      -- วันที่เผยแพร่จริง
├── created_at      TIMESTAMP DEFAULT now()
└── updated_at      TIMESTAMP (auto-update)
```

---

### 3.19 `notifications` — การแจ้งเตือน

**เหตุผล:** รองรับ notification modal store ที่มีใน codebase (`notification-modal-store.ts`) และ workflow การแจ้งเตือนเมื่อสถานะ application เปลี่ยน

```
notifications
├── id              UUID PRIMARY KEY
├── profile_id      UUID FK → profiles.id ON DELETE CASCADE    -- ผู้รับ notification
├── type            VARCHAR NOT NULL               -- application_update, new_job, system, interview
├── title           VARCHAR NOT NULL               -- หัวข้อ notification
├── message         TEXT                           -- เนื้อหา
├── is_read         BOOLEAN DEFAULT false
├── reference_id    UUID                           -- id ของ entity ที่เกี่ยวข้อง (optional)
├── reference_type  VARCHAR                        -- 'application', 'job', 'blog' (optional)
├── created_at      TIMESTAMP DEFAULT now()
└── updated_at      TIMESTAMP (auto-update)
```

---

### 3.20 `job_views` — การเข้าชมประกาศงาน

**เหตุผล:** ติดตามว่าใครเข้ามาดูประกาศงานใด เมื่อไร — ใช้แยก unique visitors จาก total views ได้
แสดงเป็น "กำลังใจ" ให้ Employer รู้ว่ามีคนสนใจงานของตน
ฝั่ง Employee ใช้ดูว่าตนเองเคย browse job นี้แล้วหรือยัง (state: viewed/saved)

**ผู้ที่ดูได้:**

- `EMPLOYEE` — ครูที่กำลัง browse หา job
- `EMPLOYER` — โรงเรียนอื่นที่ขอดูงาน (competitive research)
- `viewer_id = NULL` — ผู้เยี่ยมชมที่ไม่ได้ login (anonymous)

```
job_views
├── id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
├── job_id          UUID FK → jobs.id ON DELETE CASCADE NOT NULL
├── viewer_id       UUID FK → profiles.id ON DELETE SET NULL   -- NULL = anonymous
├── viewer_role     ENUM(EMPLOYEE, EMPLOYER, ADMIN)            -- snapshot ณ เวลาที่ดู
├── viewed_at       TIMESTAMP DEFAULT now() NOT NULL
└── session_id      VARCHAR                                    -- browser session (ป้องกัน double-count anonymous)

INDEX: (job_id)                   -- query count ต่อ job
INDEX: (viewer_id)                -- query history ของ user
UNIQUE CONSTRAINT: none           -- allow multiple views per user (track all visits)
```

**Use Cases:**

- `SELECT COUNT(*) FROM job_views WHERE job_id = $1` → ยอดเข้าชมทั้งหมด
- `SELECT COUNT(DISTINCT viewer_id) FROM job_views WHERE job_id = $1` → unique viewers
- `SELECT COUNT(*) FROM job_views WHERE job_id = $1 AND viewer_role = 'EMPLOYEE'` → ครูที่สนใจ
- `SELECT * FROM job_views WHERE viewer_id = $1 ORDER BY viewed_at DESC` → ประวัติการดู job ของ employee

---

### 3.21 `profile_views` — การเข้าชมโปรไฟล์ครู (Employee)

**เหตุผล:** ติดตามว่า Employer เข้ามาดูโปรไฟล์ครูคนไหนบ้าง
แสดงเป็น "กำลังใจ" ให้ Employee รู้ว่าตนเองมีคน "สนใจ" กี่คน
ช่วย Employer จำได้ว่าเคยดูใครไปแล้วบ้าง (state: viewed)

**ผู้ที่ดูได้:**

- `EMPLOYER` — โรงเรียนที่กำลัง browse หาครู (primary use case)
- `EMPLOYEE` — ครูที่ดูโปรไฟล์ครูคนอื่น
- `viewer_id = NULL` — anonymous

```
profile_views
├── id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
├── profile_id      UUID FK → profiles.id ON DELETE CASCADE NOT NULL  -- เจ้าของ profile ที่ถูกดู
├── viewer_id       UUID FK → profiles.id ON DELETE SET NULL          -- ผู้ที่เข้ามาดู (NULL = anonymous)
├── viewer_role     ENUM(EMPLOYEE, EMPLOYER, ADMIN)                   -- snapshot role ณ เวลาที่ดู
├── viewed_at       TIMESTAMP DEFAULT now() NOT NULL
└── session_id      VARCHAR                                           -- browser session

INDEX: (profile_id)               -- query count ต่อ profile
INDEX: (viewer_id)                -- query history ของ employer/employee
UNIQUE CONSTRAINT: none           -- allow multiple views
```

**Use Cases:**

- `SELECT COUNT(*) FROM profile_views WHERE profile_id = $1` → Employer เข้ามาดูกี่ครั้ง
- `SELECT COUNT(DISTINCT viewer_id) FROM profile_views WHERE profile_id = $1 AND viewer_role = 'EMPLOYER'` → โรงเรียนที่ไม่ซ้ำที่สนใจ
- `SELECT COUNT(*) FROM profile_views WHERE viewer_id = $1 AND profile_id = $2` → Employer คนนั้นดู profile นี้กี่ครั้ง
- ใช้ร่วมกับ `applications` เพื่อคำนวณ "Employer view แล้วแต่ไม่เรียกสัมภาษณ์" ratio

---

## 4. Enum Definitions

```prisma
// บทบาทผู้ใช้งาน
enum UserRole {
  EMPLOYEE      // ครู / ผู้หางาน
  EMPLOYER      // โรงเรียน / ผู้จ้าง
  ADMIN         // ผู้ดูแลระบบ
}

// สถานะประกาศงาน
enum JobStatus {
  OPEN          // รับสมัครอยู่
  CLOSED        // ปิดรับสมัคร
  DRAFT         // ฉบับร่าง (ยังไม่เผยแพร่)
}

// สถานะใบสมัคร
enum ApplicationStatus {
  PENDING       // รอพิจารณา
  INTERVIEW     // นัดสัมภาษณ์
  ACCEPTED      // รับเข้าทำงาน
  REJECTED      // ไม่ผ่านการคัดเลือก
}

// สถานะใบประกอบวิชาชีพครู (ฝั่ง EMPLOYEE)
enum LicenseStatus {
  has_license   // มีใบอนุญาตแล้ว
  pending       // อยู่ระหว่างขอ
  no_license    // ไม่มีใบอนุญาต
  not_required  // ตำแหน่งไม่ต้องใช้ใบ
}

// ข้อกำหนดใบประกอบฯ ในตำแหน่งงาน (ฝั่ง EMPLOYER)
enum LicenseRequired {
  required      // ต้องมีใบประกอบฯ
  not_required  // ไม่ต้องมี
  pending_ok    // อยู่ระหว่างขอได้
}

// การมองเห็น profile ของ EMPLOYEE
enum ProfileVisibility {
  public        // เปิดให้ทุกคนเห็น
  apply_only    // เห็นเฉพาะเมื่อสมัครงาน
}

// สถานะบทความ
enum BlogStatus {
  DRAFT         // ฉบับร่าง
  PUBLISHED     // เผยแพร่แล้ว
}
```

---

## 5. Relation Summary

| Table           | Relation                  | Target              | Type | Notes                                  |
| --------------- | ------------------------- | ------------------- | ---- | -------------------------------------- |
| profiles        | has many                  | work_experiences    | 1:N  | CASCADE DELETE                         |
| profiles        | has many                  | educations          | 1:N  | CASCADE DELETE                         |
| profiles        | has many                  | licenses            | 1:N  | CASCADE DELETE                         |
| profiles        | has many                  | resumes             | 1:N  | CASCADE DELETE, named "ProfileResumes" |
| profiles        | belongs to one (optional) | resumes (active)    | 1:1  | named "ActiveResume", SET NULL         |
| profiles        | has many                  | specializations     | 1:N  | CASCADE DELETE                         |
| profiles        | has many                  | grade_can_teaches   | 1:N  | CASCADE DELETE                         |
| profiles        | has many                  | preferred_provinces | 1:N  | CASCADE DELETE                         |
| profiles        | has many                  | languages           | 1:N  | CASCADE DELETE                         |
| profiles        | has many                  | skills              | 1:N  | CASCADE DELETE                         |
| profiles        | has one (optional)        | school_profiles     | 1:1  | CASCADE DELETE, EMPLOYER only          |
| profiles        | has many                  | applications        | 1:N  | CASCADE DELETE, EMPLOYEE only          |
| profiles        | has many                  | blogs               | 1:N  | SET NULL on author delete              |
| profiles        | has many                  | notifications       | 1:N  | CASCADE DELETE                         |
| school_profiles | has many                  | school_benefits     | 1:N  | CASCADE DELETE                         |
| school_profiles | has many                  | jobs                | 1:N  | CASCADE DELETE                         |
| jobs            | has many                  | job_subjects        | 1:N  | CASCADE DELETE                         |
| jobs            | has many                  | job_grades          | 1:N  | CASCADE DELETE                         |
| jobs            | has many                  | job_benefits        | 1:N  | CASCADE DELETE                         |
| jobs            | has many                  | applications        | 1:N  | CASCADE DELETE                         |
| resumes         | has many                  | applications        | 1:N  | SET NULL on resume delete              |
| applications    | belongs to                | jobs                | N:1  |                                        |
| applications    | belongs to                | profiles (employee) | N:1  |                                        |
| applications    | belongs to (optional)     | resumes             | N:1  | SET NULL                               |

---

## 6. Mapping: หน้า → Tables ที่ใช้

| หน้า                              | Tables หลัก                                                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `/pages/signup`                   | profiles                                                                                                                              |
| `/pages/signin`                   | profiles                                                                                                                              |
| `/pages/employee/profile`         | profiles, work_experiences, educations, licenses, resumes, specializations, grade_can_teaches, preferred_provinces, languages, skills |
| `/pages/employee/school`          | school_profiles, school_benefits, jobs, job_subjects, job_grades                                                                      |
| `/pages/employee/account-setting` | profiles                                                                                                                              |
| `/pages/job`                      | jobs, job_subjects, job_grades, job_benefits, school_profiles                                                                         |
| `/pages/job/[id]`                 | jobs, job_subjects, job_grades, job_benefits, school_profiles, school_benefits                                                        |
| `/pages/job/[id]/apply`           | applications, resumes, profiles                                                                                                       |
| `/pages/employer/profile`         | profiles, school_profiles, school_benefits                                                                                            |
| `/pages/employer/job/post`        | jobs, job_subjects, job_grades, job_benefits                                                                                          |
| `/pages/employer/job/read`        | jobs, applications, profiles, resumes                                                                                                 |
| `/pages/employer/account-setting` | profiles                                                                                                                              |
| `/pages/admin/user-management`    | profiles, school_profiles                                                                                                             |
| `/pages/blog`                     | blogs                                                                                                                                 |
| `/pages/landing`                  | jobs, school_profiles (aggregates)                                                                                                    |

---

## 7. Index Strategy

```sql
-- profiles: query ตาม role และ user_id บ่อย
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- jobs: filter หลัก 4 มิติ
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_province ON jobs(province);
CREATE INDEX idx_jobs_school_profile_id ON jobs(school_profile_id);
CREATE INDEX idx_jobs_deadline ON jobs(deadline);

-- applications: query ตาม job และ applicant
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_status ON applications(status);

-- matching engine: subject matching ระหว่าง employee และ job
CREATE INDEX idx_specializations_subject ON specializations(subject);
CREATE INDEX idx_job_subjects_subject ON job_subjects(subject);

-- matching engine: grade matching
CREATE INDEX idx_grade_can_teaches_grade ON grade_can_teaches(grade);
CREATE INDEX idx_job_grades_grade ON job_grades(grade);

-- preferred province matching
CREATE INDEX idx_preferred_provinces_province ON preferred_provinces(province);

-- notifications: query เฉพาะ unread
CREATE INDEX idx_notifications_profile_id_is_read ON notifications(profile_id, is_read);

-- blogs: query ตาม status และ slug
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_slug ON blogs(slug);

-- job_views: นับยอดชมต่อ job และ history ของ viewer
CREATE INDEX idx_job_views_job_id ON job_views(job_id);
CREATE INDEX idx_job_views_viewer_id ON job_views(viewer_id);
CREATE INDEX idx_job_views_viewed_at ON job_views(viewed_at);

-- profile_views: นับยอดชมต่อ profile และ history ของ employer
CREATE INDEX idx_profile_views_profile_id ON profile_views(profile_id);
CREATE INDEX idx_profile_views_viewer_id ON profile_views(viewer_id);
CREATE INDEX idx_profile_views_viewed_at ON profile_views(viewed_at);
```

---

## 8. Circular FK — การจัดการ profiles ↔ resumes

Prisma ไม่อนุญาต circular reference แบบ implicit ต้องใช้ **named relation** ดังนี้:

```prisma
model Profile {
  // ...
  activeResumeId String? @map("active_resume_id")

  resumes      Resume[] @relation("ProfileResumes")
  activeResume Resume?  @relation("ActiveResume", fields: [activeResumeId], references: [id])
}

model Resume {
  // ...
  profileId String @map("profile_id")

  profile  Profile  @relation("ProfileResumes", fields: [profileId], references: [id], onDelete: Cascade)
  activeFor Profile? @relation("ActiveResume")
}
```

> `activeResumeId` ใช้ `onDelete: SetNull` โดย default (ไม่ต้องระบุใน Prisma เมื่อเป็น optional field)

---

## 9. สิ่งที่ต้องทำต่อ (Next Steps)

- [x] ออกแบบ Database Schema ทุก table พร้อมเหตุผล
- [x] เพิ่ม `job_views` และ `profile_views` สำหรับ View Tracking (3.20–3.21)
- [ ] เพิ่ม `job_views` และ `profile_views` ใน `prisma/schema.prisma`
- [ ] รัน `bunx prisma db push` เพื่อสร้าง/อัปเดต table
- [ ] สร้าง API `POST /api/v1/employer/jobs/view` และ `POST /api/v1/employee/profile/view` สำหรับบันทึก view
- [ ] สร้าง seed data สำหรับ dev/test (`prisma/seed.ts`)
- [ ] ตั้งค่า Row Level Security (RLS) ใน Supabase สำหรับ profiles
