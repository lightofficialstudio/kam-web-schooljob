# API Map — KAM-WEB-SCHOOLJOB
Last Updated: 2026-04-05

## ตารางสรุป API ทั้งหมด

| # | Method | Endpoint | จุดประสงค์ | Auth Required | Request | Response `data` |
|---|--------|----------|-----------|--------------|---------|----------------|
| 1 | POST | `/api/v1/authenticate/signup` | สมัครสมาชิกผู้ใช้ใหม่ | Public | `{ email, password, full_name, role }` | `{ user_id, email, full_name, role }` |
| 2 | POST | `/api/v1/authenticate/signin` | เข้าสู่ระบบ | Public | `{ email, password }` | `{ user_id, email, role, full_name }` |
| 3 | GET | `/api/v1/employee-profile/read` | ดึงข้อมูลโปรไฟล์ครู | User Token | Query: `?user_id=&email=` | Profile object + relations |
| 4 | PATCH | `/api/v1/employee-profile/update` | อัปเดตข้อมูลโปรไฟล์ครู | User Token | Query: `?user_id=` + JSON body | Updated profile object |
| 5 | POST | `/api/v1/storage/upload` | อัปโหลดไฟล์ไปยัง Supabase Storage | User Token | FormData: `file, bucket, user_id` | `{ url, path, file_name, file_size, mime_type }` |
| 6 | DELETE | `/api/v1/storage/delete` | ลบไฟล์ออกจาก Supabase Storage | User Token | JSON: `{ bucket, path }` | `null` |
| 7 | GET | `/api/v1/admin/users` | ดึงรายชื่อ user ทั้งหมด (Admin) | Service Role | — | `{ total, users[] }` |
| 8 | PUT | `/api/v1/admin/users/[id]` | อัปเดต role ของ user (Admin) | Service Role | JSON: `{ role }` | `{ user_id, email, role }` |
