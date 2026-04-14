---
name: prisma-pattern
description: Prisma ORM reference สำหรับโปรเจกต์ KAM-WEB-SCHOOLJOB — Model/Enum ทั้งหมด, relation patterns, transaction pattern, query patterns ที่ใช้บ่อย ใช้เพื่อลด Token โดยไม่ต้องอ่าน schema.prisma ซ้ำทุก session
---

# Prisma Pattern — KAM-WEB-SCHOOLJOB

## Client Import
```typescript
import { prisma } from "@/lib/prisma";
import { UserRole, JobStatus, ApplicationStatus, LicenseRequired, LicenseStatus, BlogStatus, OrgMemberStatus, InviteStatus, ProfileVisibility } from "@prisma/client";
import { Prisma } from "@prisma/client"; // สำหรับ type เช่น Prisma.JobWhereInput
```

---

## Enums

| Enum | Values |
|------|--------|
| `UserRole` | `EMPLOYEE` `EMPLOYER` `ADMIN` |
| `JobStatus` | `OPEN` `CLOSED` `DRAFT` |
| `ApplicationStatus` | `PENDING` `INTERVIEW` `ACCEPTED` `REJECTED` |
| `LicenseStatus` | `has_license` `pending` `no_license` `not_required` |
| `LicenseRequired` | `required` `not_required` `pending_ok` |
| `ProfileVisibility` | `public` `apply_only` |
| `BlogStatus` | `DRAFT` `PUBLISHED` |
| `OrgMemberStatus` | `ACTIVE` `PENDING` `INACTIVE` |
| `InviteStatus` | `PENDING` `ACCEPTED` `EXPIRED` `REVOKED` |

---

## Models & Primary Keys

| Model | Table | PK | หมายเหตุ |
|-------|-------|----|----------|
| `Profile` | `profiles` | `id` uuid | Core ของทุก role |
| `WorkExperience` | `work_experiences` | `id` | ประวัติงาน EMPLOYEE |
| `Education` | `educations` | `id` | ประวัติการศึกษา |
| `License` | `licenses` | `id` | ใบประกอบวิชาชีพ |
| `Resume` | `resumes` | `id` | เรซูเม่ (หลายไฟล์/คน) |
| `Specialization` | `specializations` | `id` | วิชาที่เชี่ยวชาญ |
| `GradeCanTeach` | `grade_can_teaches` | `id` | ระดับชั้นที่สอนได้ |
| `PreferredProvince` | `preferred_provinces` | `id` | จังหวัดที่ต้องการ |
| `Language` | `languages` | `id` | ทักษะภาษา |
| `Skill` | `skills` | `id` | ทักษะ IT/อื่นๆ |
| `SchoolProfile` | `school_profiles` | `id` | โปรไฟล์โรงเรียน 1:1 EMPLOYER |
| `SchoolBenefit` | `school_benefits` | `id` | สวัสดิการโรงเรียน |
| `Job` | `jobs` | `id` | ประกาศงาน |
| `JobSubject` | `job_subjects` | `id` | วิชาที่งานต้องการ |
| `JobGrade` | `job_grades` | `id` | ระดับชั้นที่งานต้องการ |
| `JobBenefit` | `job_benefits` | `id` | สวัสดิการตำแหน่งงาน |
| `Application` | `applications` | `id` | ใบสมัครงาน |
| `Blog` | `blogs` | `id` | บทความ |
| `Notification` | `notifications` | `id` | การแจ้งเตือน |
| `JobView` | `job_views` | `id` | tracking การดูงาน |
| `ProfileView` | `profile_views` | `id` | tracking การดู profile |
| `OrgRole` | `org_roles` | `id` | RBAC role ของ org |
| `OrgRolePermission` | `org_role_permissions` | `id` | `permissionKey` เช่น `"jobs:create"` |
| `OrgMember` | `org_members` | `id` | สมาชิกขององค์กร |
| `OrgInvite` | `org_invites` | `id` | คำเชิญเข้า org |

---

## Key Fields ที่ใช้บ่อย

### Profile
```
id, userId (Supabase UID), email, role (UserRole), firstName, lastName
phoneNumber, profileImageUrl, teachingExperience, licenseStatus
activeResumeId (FK → Resume)
```

### SchoolProfile
```
id, profileId (FK→Profile 1:1), schoolName, schoolType, affiliation
province, district, logoUrl, coverImageUrl, studentCount, teacherCount
```

### Job
```
id, schoolProfileId (FK→SchoolProfile), title, description, jobType
province, salaryMin, salaryMax, salaryNegotiable, licenseRequired
positionsAvailable, status (JobStatus), deadline
```

### Application
```
id, jobId, applicantId (FK→Profile EMPLOYEE), resumeId
status (ApplicationStatus), coverLetter, appliedAt
UNIQUE: (jobId, applicantId) — ป้องกันสมัครซ้ำ
```

### Blog
```
id, authorId (FK→Profile nullable), title, slug (UNIQUE)
content, excerpt, coverImageUrl, category, tags (JSON string)
status (BlogStatus), publishedAt
```

---

## Relation Map (สำคัญ)

```
Profile (1) ──── (N) WorkExperience
Profile (1) ──── (N) Education
Profile (1) ──── (N) License
Profile (1) ──── (N) Resume          [named: "ProfileResumes"]
Profile (1) ──── (1) Resume?         [named: "ActiveResume" ← activeResumeId]
Profile (1) ──── (N) Specialization
Profile (1) ──── (N) GradeCanTeach
Profile (1) ──── (N) PreferredProvince
Profile (1) ──── (N) Language
Profile (1) ──── (N) Skill
Profile (1) ──── (N) Application     [EMPLOYEE สมัครงาน]
Profile (1) ──── (1) SchoolProfile?  [EMPLOYER เท่านั้น]
Profile (1) ──── (N) Blog            [author]
Profile (1) ──── (N) Notification

SchoolProfile (1) ──── (N) Job
SchoolProfile (1) ──── (N) SchoolBenefit
SchoolProfile (1) ──── (N) OrgRole
SchoolProfile (1) ──── (N) OrgMember
SchoolProfile (1) ──── (N) OrgInvite

Job (1) ──── (N) JobSubject
Job (1) ──── (N) JobGrade
Job (1) ──── (N) JobBenefit
Job (1) ──── (N) Application
Job (1) ──── (N) JobView

OrgRole (1) ──── (N) OrgRolePermission
OrgRole (1) ──── (N) OrgMember
```

---

## Query Patterns ที่ใช้บ่อย

### ดึง Profile พร้อม SchoolProfile (EMPLOYER)
```typescript
const profile = await prisma.profile.findUnique({
  where: { userId },
  include: { schoolProfile: true },
});
```

### ดึง Job พร้อม subjects/grades/benefits
```typescript
const job = await prisma.job.findUnique({
  where: { id: jobId },
  include: {
    schoolProfile: { select: { schoolName: true, province: true, logoUrl: true } },
    jobSubjects: { select: { subject: true } },
    jobGrades: { select: { grade: true } },
    jobBenefits: { select: { benefit: true } },
    _count: { select: { applications: true } },
  },
});
```

### ค้นหา Job (Cursor-based Lazy Loading)
```typescript
const jobs = await prisma.job.findMany({
  where: { status: JobStatus.OPEN, ...whereClause },
  orderBy: { createdAt: "desc" },
  ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  take: pageSize + 1, // ดึงเกิน 1 → ตรวจ hasMore โดยไม่ต้อง COUNT(*)
});
const hasMore = jobs.length > pageSize;
const nextCursor = hasMore ? jobs[pageSize - 1].id : null;
```

### ตรวจสอบ Application ซ้ำ
```typescript
const existing = await prisma.application.findUnique({
  where: { unique_application: { jobId, applicantId } },
});
// ถ้า existing → 409 Conflict
```

### ดึง Blog (search + category)
```typescript
const blogs = await prisma.blog.findMany({
  where: {
    status: BlogStatus.PUBLISHED,
    ...(category && category !== "all" && { category }),
    ...(keyword && {
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { excerpt: { contains: keyword, mode: "insensitive" } },
      ],
    }),
  },
  orderBy: { publishedAt: "desc" },
});
```

### ดึงโรงเรียนที่มีงาน OPEN
```typescript
const schools = await prisma.schoolProfile.findMany({
  where: {
    jobs: { some: { status: JobStatus.OPEN } },
    ...(keyword && { schoolName: { contains: keyword, mode: "insensitive" } }),
  },
  include: { jobs: { where: { status: JobStatus.OPEN } } },
});
```

---

## Transaction Pattern (multi-table write)

```typescript
// ✨ ใช้ prisma.$transaction เมื่อเขียนหลาย table พร้อมกัน
const result = await prisma.$transaction(async (tx) => {
  const job = await tx.job.create({ data: { ...jobData } });

  // สร้าง subjects/grades/benefits พร้อมกัน
  await tx.jobSubject.createMany({
    data: subjects.map((subject) => ({ jobId: job.id, subject })),
  });
  await tx.jobGrade.createMany({
    data: grades.map((grade) => ({ jobId: job.id, grade })),
  });
  await tx.jobBenefit.createMany({
    data: benefits.map((benefit) => ({ jobId: job.id, benefit })),
  });

  return job;
});
```

### Transaction: สร้าง Profile + SchoolProfile (EMPLOYER signup)
```typescript
const result = await prisma.$transaction(async (tx) => {
  const profile = await tx.profile.create({
    data: { userId, email, role: UserRole.EMPLOYER, ...profileData },
  });
  const school = await tx.schoolProfile.create({
    data: { profileId: profile.id, schoolName, province },
  });
  return { profile, school };
});
```

### Transaction: อัปเดต children (delete + recreate pattern)
```typescript
// ✨ ลบของเก่า แล้วสร้างใหม่ใน transaction เดียว (ง่ายกว่า diff)
await prisma.$transaction(async (tx) => {
  await tx.jobSubject.deleteMany({ where: { jobId } });
  await tx.jobSubject.createMany({
    data: newSubjects.map((subject) => ({ jobId, subject })),
  });
});
```

---

## Filter Patterns ที่ใช้บ่อย

### Soft delete (isDeleted)
```typescript
// WorkExperience, Education, License, Resume, Language, Skill ใช้ isDeleted
where: { profileId, isDeleted: false }
```

### Named Relations (Resume — ระวัง circular FK)
```typescript
// ใช้ชื่อ relation เมื่อ include
resumes: { include: { profile: { select: { ... } } } }  // "ProfileResumes"
activeResume: true                                        // "ActiveResume"
```

### OrgRole Permission check
```typescript
const hasPermission = await prisma.orgRolePermission.findFirst({
  where: {
    roleId,
    permissionKey: "jobs:create", // pattern: "resource:action"
  },
});
```

---

## Indexes ที่มี (Query Performance)

| Table | Index |
|-------|-------|
| `profiles` | `role`, `userId` |
| `jobs` | `status`, `province`, `schoolProfileId`, `deadline` |
| `applications` | `jobId`, `applicantId`, `status` |
| `blogs` | `status`, `slug` |
| `job_subjects` | `subject` |
| `job_grades` | `grade` |
| `specializations` | `subject` |
| `notifications` | `(profileId, isRead)` |
| `org_roles` | `orgId` |
| `org_members` | `orgId`, `profileId` |
| `org_invites` | `orgId`, `email`, `token` |
