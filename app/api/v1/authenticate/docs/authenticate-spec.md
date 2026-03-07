# ✨ [Authentication API Specification]

## Purpose

API สำหรับจัดการระบบยืนยันตัวตน (Signin / Signup) โดยเชื่อมต่อกับ Supabase Auth และบันทึกข้อมูลโปรไฟล์ลงใน PostgreSQL ผ่าน Prisma

---

## 🚀 Sign-up Service

**Endpoint:** `POST /api/v1/authenticate/signup`

### Request Schema (snake_case)

| Field       | Type     | Description                                   |
| ----------- | -------- | --------------------------------------------- |
| `email`     | `string` | อีเมลของผู้ใช้งาน (ต้องไม่ซ้ำ)                |
| `password`  | `string` | รหัสผ่าน (ขั้นต่ำ 6 ตัวอักษร)                 |
| `full_name` | `string` | ชื่อ-นามสกุลจริง                              |
| `role`      | `string` | บทบาทผู้ใช้งาน (`TEACHER`, `SCHOOL`, `ADMIN`) |

### Response Schema

```json
{
  "status_code": 201,
  "message_th": "สมัครสมาชิกสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน",
  "message_en": "Registration successful...",
  "data": {
    "user_id": "uuid",
    "email": "string",
    "full_name": "string",
    "role": "string"
  }
}
```

---

## 🔑 Sign-in Service

**Endpoint:** `POST /api/v1/authenticate/signin`

### Request Schema (snake_case)

| Field      | Type     | Description          |
| ---------- | -------- | -------------------- |
| `email`    | `string` | อีเมลที่ลงทะเบียนไว้ |
| `password` | `string` | รหัสผ่าน             |

### Response Schema

```json
{
  "status_code": 200,
  "message_th": "เข้าสู่ระบบสำเร็จ",
  "data": {
    "user_id": "uuid",
    "email": "string",
    "role": "string",
    "full_name": "string"
  }
}
```

---

## 💡 Logic Note

1. ✨ การเพิ่มข้อมูลลง `profiles` table จะใช้คำสั่ง `upsert` เพื่อป้องกันข้อมูลซ้ำซ้อน
2. ✨ รหัสผ่านถูกจัดการโดย Supabase Auth โดยตรง (Security by Design)
3. ✨ การตรวจสอบข้อมูลใช้ `Zod` เพื่อความแม่นยำก่อนส่งข้อมูลเข้า Database
