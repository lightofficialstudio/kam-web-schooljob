# ⚡ Supabase Auth SDK - Quick Setup & Migration

**Status:** ✅ Signup ทำงาน | ❌ Signin ต้องแก้ Email Verification

---

## 🚨 Current Issue: Email Verification

Supabase มี **Email Verification enabled** by default ซึ่งหมายถึง:

- User สมัครได้ ✅
- แต่ต้อง **ยืนยันอีเมล** มาจากลิงก์ก่อน
- จึงจึง signin ได้ (แต่ตอนนี้ล้มเหลว) ❌

---

## 🔧 Fix: Supabase Dashboard Settings

### ⚙️ Disable Email Confirmation (Development)

1. **เปิด Supabase Console**
   - Go: https://app.supabase.com
   - Select Project

2. **ที่ Auth Settings**
   - Auth → Settings → Email Provider

3. **Uncheck these boxes:**

   ```
   ☑️ Confirm email (UNCHECK THIS)
   ☑️ Secure email change
   ```

4. **Save Changes**

---

## 🧪 Test After Changes

### Step 1: Delete Old Test User

```bash
# Go to Supabase Dashboard → Auth → Users
# Find and delete: test123@example.com
```

### Step 2: Test Signup Again

```bash
curl -X POST "http://localhost:3000/api/v1/authenticate/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "verify@test.com",
    "password": "TestPassword123!",
    "full_name": "Test User",
    "role": "TEACHER"
  }'
```

**Expected Response:**

```json
{
  "status_code": 201,
  "message_th": "สมัครสมาชิกสำเร็จ...",
  "data": {
    "user_id": "uuid..."
  }
}
```

### Step 3: Test Signin

```bash
curl -X POST "http://localhost:3000/api/v1/authenticate/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "verify@test.com",
    "password": "TestPassword123!"
  }'
```

**Expected Response:**

```json
{
  "status_code": 200,
  "message_th": "เข้าสู่ระบบสำเร็จ",
  "data": {
    "user_id": "uuid...",
    "email": "verify@test.com",
    "role": "TEACHER",
    "full_name": "Test User"
  }
}
```

---

## 📝 Architecture: Supabase Auth Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend (Next.js)                     │
│  signup/signin form → POST /api/v1/authenticate/*      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              API Routes (Next.js)                       │
│         ✅ /api/v1/authenticate/signup                 │
│         ✅ /api/v1/authenticate/signin                 │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│      AuthenticateService (Supabase Auth SDK)            │
│  • signup() → supabase.auth.signUp()                   │
│  • signin() → supabase.auth.signInWithPassword()       │
└────────────────────────┬────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    ┌─────────┐    ┌──────────┐  ┌──────────┐
    │Supabase │    │PostgreSQL│  │Prisma    │
    │Auth     │    │(Supabase)│  │(Sync)    │
    │(JWT)    │    │Profile   │  │Optional  │
    └─────────┘    │Table     │  │          │
                   └──────────┘  └──────────┘
```

---

## 🎯 Progress Checklist

- [x] Install @supabase/supabase-js
- [x] Create Supabase client (`app/lib/supabase.ts`)
- [x] Migrate AuthenticateService to Supabase Auth SDK
- [x] Add comprehensive debug logging
- [ ] **← FIX: Disable Email Verification in Supabase**
- [ ] Test Signin endpoint
- [ ] Extend Zustand store for session management
- [ ] Test frontend signup/signin UI
- [ ] Production: Enable email verification + Email Templates

---

## 📚 Related Documentation

- [Supabase Auth Testing Guide](./supabase-auth-testing.md)
- [Architecture: State Management](..docs/architecture/state-management.md)
- [API Spec: Authentication](./api/v1/authenticate/docs/authenticate-spec.md)

---

## 🆘 Troubleshooting

### Q: Signin still fails after disabling email verification?

**A:** Clear browser localStorage and try again:

```javascript
// Browser Console
localStorage.clear();
location.reload();
```

### Q: Signup gives "User account created" but signin fails?

**A:** Double-check Supabase settings were saved correctly

### Q: Want to keep email verification in production?

**A:** Will implement email template + verification flow next phase

---

## 🎬 Next Steps (After Signin Works)

1. **Zustand Integration**: Extend `auth-store.ts` to save session
2. **Session Persistence**: Save JWT token in localStorage
3. **Auto-restore**: Load session on page reload
4. **Logout**: Clear session + Supabase signout
5. **Production Auth**: Enable email verification + templates
