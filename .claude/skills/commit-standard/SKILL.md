---
name: commit-standard
description: Commit message standard สำหรับโปรเจกต์ KAM-WEB-SCHOOLJOB — format, emoji, ขั้นตอน git commit ที่ถูกต้อง ใช้ทุกครั้งที่จะ commit
---

# Commit Standard — KAM-WEB-SCHOOLJOB

## Format

```
{emoji} ระบบ {ชื่อระบบ} : {สิ่งที่ทำ} (หน้าที่แก้ไข {paths})
```

## Emoji Map

| Emoji | ใช้เมื่อ |
|-------|---------|
| ✨ | เพิ่ม feature ใหม่, สร้าง API ใหม่, เชื่อม DB |
| 🎨 | ปรับ UI/style/layout โดยไม่เปลี่ยน logic |
| ♻️ | refactor โครงสร้าง ไม่เพิ่ม feature |
| 🐛 | แก้ bug |
| 📝 | แก้ docs, CLAUDE.md, README |
| 🔧 | แก้ config, settings, package.json |
| 🗑️ | ลบไฟล์หรือ code ที่ไม่ใช้แล้ว |

## ตัวอย่างจาก git log จริง

```
✨ ระบบ Job : ปรับปรุงฟีเจอร์ค้นหางานด้วย Cursor-based Lazy Loading (หน้าที่แก้ไข app/api/v1/jobs/route.ts, app/pages/job/_state/job-search-store.ts)
🎨 ระบบ Job : ปรับปรุงดีไซน์และเพิ่มฟีเจอร์แสดงผลรายละเอียดงาน (หน้าที่แก้ไข app/pages/job/_components/job-detail-drawer.tsx)
♻️ ระบบ Profile : ปรับปรุงโครงสร้างโมเดล Profile และ Resume (หน้าที่แก้ไข /prisma/schema.prisma)
```

## ขั้นตอน Commit

```bash
# 1. ตรวจไฟล์ที่เปลี่ยน
git status

# 2. Stage เฉพาะไฟล์ที่เกี่ยวข้อง (ห้าม git add -A)
git add app/pages/xxx/yyy.tsx app/api/v1/xxx/route.ts

# 3. Commit ด้วย HEREDOC
git commit -m "$(cat <<'EOF'
✨ ระบบ X : ทำอะไร (หน้าที่แก้ไข path/to/file.tsx, path/to/other.ts)
EOF
)"
```

## กฎ

- ชื่อระบบ → ภาษาไทย เช่น `Job`, `Blog`, `Auth`, `Profile`, `RBAC`, `School`
- paths → relative จาก root, คั่นด้วย `, ` ถ้าหลายไฟล์
- ห้าม `git add -A` หรือ `git add .` — stage เฉพาะไฟล์ที่แก้จริง
- ห้าม `--no-verify`
- ห้าม amend commit ที่ push ไปแล้ว
- ไม่ต้อง Co-Authored-By ในโปรเจกต์นี้ (ไม่มีใน git log)
