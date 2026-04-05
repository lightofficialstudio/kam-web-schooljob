# Employee Profile — Read API Spec

## Purpose
ดึงข้อมูล Employee Profile ครบทุก relation ใช้ในหน้า `/pages/employee/profile`

## Endpoint
`GET /api/v1/employee-profile/read?user_id={userId}`

## Query Params
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_id | string | ✅ | Supabase Auth UID |

## Response Schema
| Field | Type | Description |
|-------|------|-------------|
| status_code | number | 200, 404, 400, 500 |
| data.id | string | UUID ของ Profile |
| data.workExperiences | array | ประวัติการทำงาน (is_deleted=false) |
| data.educations | array | ประวัติการศึกษา (is_deleted=false) |
| data.licenses | array | ใบประกอบวิชาชีพ (is_deleted=false) |
| data.specializations | array | วิชาที่เชี่ยวชาญ |
| data.gradeCanTeaches | array | ระดับชั้นที่สอนได้ |
| data.preferredProvinces | array | จังหวัดที่ต้องการทำงาน |
| data.languages | array | ทักษะภาษา (is_deleted=false) |
| data.skills | array | ทักษะ IT (is_deleted=false) |
| data.resumes | array | ไฟล์เรซูเม่ (is_deleted=false) |
| data.activeResume | object\|null | เรซูเม่ที่กำลังใช้งาน |

## Logic Notes
- Filter ทุก relation ด้วย `is_deleted=false` ก่อน return
- ค้นหาด้วย `userId` (Supabase UID) ไม่ใช่ `profileId`
