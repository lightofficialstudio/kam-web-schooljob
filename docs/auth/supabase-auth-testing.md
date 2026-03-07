# 🔐 Supabase Auth Testing & Debugging Guide

## ✅ Current Status

- **Signup**: ✓ ทำงาน (Supabase Auth SDK integrated)
- **Signin**: ❌ ต้องแก้ไข (Email verification issue)
- **Database**: ✓ PostgreSQL connected via Prisma

---

## 🔍 Why Signin Failed (Likely Causes)

### 1. **Email Verification Required** (Most Likely)

Supabase มี Email Verification เป็น default enabled ต้องให้ user ยืนยันอีเมลก่อนจึงจะ signin ได้

**สัญญาณ:**

```
❌ Invalid login credentials
```

**วิธีแก้ - Option A: Disable Email Verification (For Development)**

1. ไปที่ Supabase Dashboard → `https://app.supabase.com`
2. Select Project: `kam-organization` (or your project)
3. Auth → Settings → Auth Providers → Email
4. Uncheck: **"Confirm email"**
5. Save

**วิธีแก้ - Option B: Auto-confirm Emails (For Development)**

1. Supabase Dashboard → Auth → Settings → Email Templates
2. หรือใช้ SQL command:

```sql
-- ✋ DEVELOPMENT ONLY - Auto confirm all emails
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'test123@example.com';
```

---

## 🧪 Test Endpoints

### Signup Test

```bash
curl -X POST "http://localhost:3000/api/v1/authenticate/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "full_name": "Test User",
    "role": "TEACHER"
  }'
```

**ผลที่คาดหวัง:**

```json
{
  "status_code": 201,
  "data": {
    "user_id": "uuid...",
    "email": "test@example.com"
  }
}
```

### Signin Test

```bash
curl -X POST "http://localhost:3000/api/v1/authenticate/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

**ผลที่คาดหวัง:**

```json
{
  "status_code": 200,
  "data": {
    "user_id": "uuid...",
    "email": "test@example.com",
    "role": "TEACHER",
    "full_name": "Test User"
  }
}
```

---

## 🐛 Browser Console Debugging

เปิด Browser DevTools (F12) → Console สังเกตการณ์:

### Signup Debug Logs

```
📝 [SIGNUP] Starting signup process...
   📧 Email: test@example.com
   👤 Full name: Test User
   🎯 Role: TEACHER
✅ [SIGNUP] User created in Supabase: uuid...
✅ [SIGNUP] Profile synced to Prisma: uuid...
```

### Signin Debug Logs

```
🔐 [SIGNIN] Starting signin process...
   📧 Email: test@example.com
✅ [SIGNIN] Auth successful: uuid...
   📧 User email: test@example.com
   💾 User metadata: { full_name: '...', role: '...' }
✅ [SIGNIN] Profile fetched from Prisma: uuid...
✅ [SIGNIN] Ready to return user data: {...}
```

---

## 🔧 Quick Debugging Checklist

- [ ] Supabase connection: `app/lib/supabase.ts` initialized
- [ ] API key in `.env`: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- [ ] Email verification: Disabled or emails confirmed
- [ ] Prisma sync: Not blocking signup/signin (non-critical)
- [ ] Console logs: Verify each step completes

---

## 📋 Implementation Steps

1. **Disable Email Verification** in Supabase Dashboard (for testing)
2. **Clear Test Users** - Delete `test123@example.com` from Supabase Auth
3. **Test Signup Again** - Should get `status_code: 201`
4. **Test Signin** - Should get `status_code: 200` with user data
5. **Verify Frontend** - Zustand `useAuthStore()` receives user data

---

## 💾 Next: Zustand Store Integration

Once signin works, extend `app/stores/auth-store.ts` to:

- Persist Supabase session via `localStorage`
- Sync auth state with `supabase.auth.onAuthStateChange()`
- Auto-restore session on page reload
