# API Map — KAM-WEB-SCHOOLJOB

Last Updated: 2026-04-05 (employee-profile → employee/profile migrated)

## API Naming Convention

`/api/v1/{role}/{feature}/{action}` — แยก role prefix: `employer`, `employee`, `admin`
(Shared/Auth routes ไม่มี role prefix: `/api/v1/authenticate/`, `/api/v1/storage/`)

## ตารางสรุป API ทั้งหมด

| #   | Method | Endpoint                          | จุดประสงค์                                                                     | Auth Required | Request                                            | Response `data`                                                                             |
| --- | ------ | --------------------------------- | ------------------------------------------------------------------------------ | ------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | POST   | `/api/v1/authenticate/signup`     | สมัครสมาชิกผู้ใช้ใหม่                                                          | Public        | `{ email, password, full_name, role }`             | `{ user_id, email, full_name, role }`                                                       |
| 2   | POST   | `/api/v1/authenticate/signin`     | เข้าสู่ระบบ                                                                    | Public        | `{ email, password }`                              | `{ user_id, email, role, full_name }`                                                       |
| 3   | GET    | `/api/v1/employee/profile/read`   | ดึงโปรไฟล์ครู (employee)                                                       | User Token    | Query: `?user_id=&email=`                          | Profile object + relations (resume, license, education, work)                               |
| 4   | PATCH  | `/api/v1/employee/profile/update` | อัปเดตโปรไฟล์ครู (employee)                                                    | User Token    | Query: `?user_id=` + JSON body                     | Updated profile object                                                                      |
| 5   | GET    | `/api/v1/employer/profile/read`   | ดึงโปรไฟล์โรงเรียน (employer)                                                  | User Token    | Query: `?user_id=&email=`                          | SchoolProfile + benefits (auto-create ถ้ายังไม่มี)                                          |
| 6   | PATCH  | `/api/v1/employer/profile/update` | อัปเดตโปรไฟล์โรงเรียน (employer)                                               | User Token    | Query: `?user_id=` + JSON body (snake_case fields) | Updated SchoolProfile                                                                       |
| 7   | GET    | `/api/v1/employer/jobs/read`      | ดึงรายการประกาศงานของโรงเรียน                                                  | User Token    | Query: `?user_id=[&job_id=]`                       | Job[] หรือ Job (ถ้าระบุ job_id) พร้อม subjects/grades/benefits                              |
| 8   | POST   | `/api/v1/employer/jobs/create`    | สร้างประกาศงานใหม่                                                             | User Token    | Query: `?user_id=` + JSON body                     | Job object ที่สร้างใหม่                                                                     |
| 9   | PATCH  | `/api/v1/employer/jobs/update`    | แก้ไขประกาศงาน                                                                 | User Token    | Query: `?user_id=&job_id=` + JSON body             | Job object ที่อัปเดตแล้ว                                                                    |
| 10  | PATCH  | `/api/v1/employer/jobs/close`     | ปิดรับสมัครประกาศงาน (status → CLOSED)                                         | User Token    | Query: `?user_id=&job_id=`                         | Job object ที่ปิดแล้ว                                                                       |
| 11  | GET    | `/api/v1/employer/jobs/pipeline`  | สรุป Pipeline การรับสมัคร (pending/interview/accepted/rejected + urgent items) | User Token    | Query: `?user_id=`                                 | `{ totalApplicants, pending, interview, accepted, rejected, totalVacancies, urgentJobs[] }` |
| 11  | POST   | `/api/v1/storage/upload`          | อัปโหลดไฟล์ไปยัง Supabase Storage                                              | User Token    | FormData: `file, bucket, user_id`                  | `{ url, path, file_name, file_size, mime_type }`                                            |
| 12  | DELETE | `/api/v1/storage/delete`          | ลบไฟล์ออกจาก Supabase Storage                                                  | User Token    | JSON: `{ bucket, path }`                           | `null`                                                                                      |
| 13  | GET    | `/api/v1/admin/users`             | ดึงรายชื่อ user ทั้งหมด (Admin)                                                | Service Role  | —                                                  | `{ total, users[] }`                                                                        |
| 14  | PUT    | `/api/v1/admin/users/[id]`        | อัปเดต role ของ user (Admin)                                                   | Service Role  | JSON: `{ role }`                                   | `{ user_id, email, role }`                                                                  |

## Response Format Standard (ทุก endpoint)

```json
{
  "status_code": 200,
  "message_th": "ดึงข้อมูลสำเร็จ",
  "message_en": "Fetched successfully",
  "data": { ... }
}
```

## JobStatus Enum (Prisma)

- `OPEN` — ประกาศเปิดรับสมัคร
- `CLOSED` — ปิดรับสมัคร
- `DRAFT` — แบบร่าง (ยังไม่เผยแพร่)

## Notes

- Job API ทุกตัวต้องการ `schoolProfileId` ซึ่ง service จะค้นหาจาก `userId` อัตโนมัติ (ต้องสร้าง SchoolProfile ก่อน)
- Supabase Storage buckets: `avatars` (public), `resumes` (private), `licenses` (private)
