# Employee Profile — Update API Spec

## Purpose
อัปเดต Employee Profile และ relations ทั้งหมดแบบ partial update ใช้ใน Drawer ของหน้า profile

## Endpoint
`PATCH /api/v1/employee-profile/update?user_id={userId}`

## Request Body (all fields optional)
| Field | Type | Description |
|-------|------|-------------|
| first_name | string | ชื่อ |
| last_name | string | นามสกุล |
| phone_number | string\|null | เบอร์โทร |
| gender | string\|null | เพศ |
| date_of_birth | string\|null | วันเกิด (ISO date) |
| nationality | string\|null | สัญชาติ |
| profile_image_url | string\|null | URL รูปภาพ |
| profile_visibility | "public"\|"apply_only" | การมองเห็น |
| teaching_experience | string\|null | ประสบการณ์การสอน |
| special_activities | string\|null | About Me |
| can_relocate | boolean | ย้ายที่ทำงานได้ |
| license_status | enum\|null | สถานะใบประกอบฯ |
| active_resume_id | string\|null | UUID ของ Resume |
| specializations | string[] | วิชาที่เชี่ยวชาญ (replace all) |
| grade_can_teaches | string[] | ระดับชั้น (replace all) |
| preferred_provinces | string[] | จังหวัด (replace all) |
| work_experiences | array | ประวัติการทำงาน (upsert by id) |
| educations | array | ประวัติการศึกษา (upsert by id) |
| licenses | array | ใบประกอบฯ (upsert by id) |
| languages | array | ทักษะภาษา (upsert by id) |
| skills | array | ทักษะ IT (upsert by id) |

## Response Schema
| Field | Type | Description |
|-------|------|-------------|
| status_code | number | 200, 400, 404, 500 |
| data | object | Profile ที่อัปเดตแล้ว |

## Logic Notes
- `specializations`, `grade_can_teaches`, `preferred_provinces` ใช้ **replace strategy** — ลบทั้งหมดแล้วสร้างใหม่
- `work_experiences`, `educations`, `licenses`, `languages`, `skills` ใช้ **upsert by id** — ถ้ามี id → update, ถ้าไม่มี → create
- Soft delete ทำผ่าน `is_deleted: true` ในแต่ละ record
- ทุก operation อยู่ใน `prisma.$transaction()` เดียวกัน
