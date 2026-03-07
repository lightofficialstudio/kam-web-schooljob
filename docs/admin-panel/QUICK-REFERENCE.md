# Admin Panel - Quick Reference

## 🎯 What Was Created

### Layout Components

| Component    | File               | Purpose                                   |
| ------------ | ------------------ | ----------------------------------------- |
| AdminLayout  | `admin-layout.tsx` | Main wrapper (Sidebar + Navbar + Content) |
| AdminNavbar  | `navbar.tsx`       | Top bar with user menu & title            |
| AdminSidebar | `sidebar.tsx`      | Left navigation with menu items           |

### Pages

| Page            | Path                     | Purpose                 |
| --------------- | ------------------------ | ----------------------- |
| Admin Dashboard | `/admin`                 | Home page with stats    |
| User Management | `/admin/user-management` | View all users in table |

### API Routes

| Endpoint              | Method | Purpose         |
| --------------------- | ------ | --------------- |
| `/api/v1/admin/users` | GET    | Fetch all users |

---

## 📸 User Interface

### Admin Dashboard (`/admin`)

```
┌─── Admin Navbar ─────────────────────────────┐
│ Menu  Dashboard  | User: Admin               │
├────────┬─────────────────────────────────────┤
│        │                                     │
│Sidebar │  Welcome back, Admin! 👋            │
│        │                                     │
│ • Dashboard           Total Users: 182      │
│ • User Management     Teachers: 150         │
│ • Job Management      Schools: 30           │
│ • Settings            Admins: 2             │
│                                             │
│                   [Recent Activity Cards]   │
└────────┴─────────────────────────────────────┘
```

### User Management (`/admin/user-management`)

```
┌─── Admin Navbar ─────────────────────────────┐
│ Menu  User Management | User: Admin          │
├────────┬─────────────────────────────────────┤
│        │                                     │
│Sidebar │ User Management                    │
│        │ Manage all registered users        │
│        │                                     │
│        │ [Search Box] [Refresh] [+ Add]     │
│        │                                     │
│        │ ┌──────────────────────────────┐   │
│        │ │ Total: 2 │Teachers: 2│...    │   │
│        │ └──────────────────────────────┘   │
│        │                                     │
│        │ ┌────────────────────────────────┐ │
│        │ │ Email │ Name │ Role │ Date │ A │ │
│        │ ├──────────────────────────────┤ │
│        │ │ thanat.light@... │ ธนัท │ 👤 │  │ │
│        │ │ test123@... │ Test User │ 👤 │ │
│        │ └──────────────────────────────┘ │
│        │ [Previous] [1] [Next]             │
└────────┴─────────────────────────────────────┘
```

---

## 🔗 Navigation

### Sidebar Menu

```
[KAM]
Admin Panel

📊 Dashboard        → /admin
👥 User Management  → /admin/user-management
📄 Job Management   → /admin/jobs
⚙️  Settings        → /admin/settings

[Back to Home]
```

### User Dropdown Menu

```
👤 User Profile
  ├ Profile
  ├ Settings
  ├────── (divider)
  └ Logout
```

---

## 📊 Data Flow

```
User Management Page
        ↓
   [fetchUsers()]
        ↓
GET /api/v1/admin/users
        ↓
Prisma Query (Profile.findMany)
        ↓
PostgreSQL Database
        ↓
Return JSON Response
        ↓
Display in Ant Table
        ↓
Filter/Search in Real-time
```

---

## 💾 Database Integration

### Fetch All Users

```typescript
// app/api/v1/admin/users/route.ts
const profiles = await prisma.profile.findMany({
  select: { id, userId, email, fullName, role, createdAt, updatedAt },
  orderBy: { createdAt: "desc" },
});
```

### User Record Structure

```typescript
interface UserRecord {
  id: string; // Primary key
  userId: string; // Supabase Auth ID
  email: string; // User email
  fullName: string | null; // User's name
  role: "TEACHER" | "SCHOOL" | "ADMIN";
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
```

---

## 🎨 Color Codes

| Element        | Color           | Usage           |
| -------------- | --------------- | --------------- |
| Sidebar        | Slate-800       | Main navigation |
| Navbar         | Slate-900       | Top bar         |
| TEACHER Tag    | Green (#10B981) | User role       |
| SCHOOL Tag     | Blue (#3B82F6)  | School role     |
| ADMIN Tag      | Red (#EF4444)   | Admin role      |
| Primary Button | Blue (#3B82F6)  | Actions         |
| Danger Action  | Red (#EF4444)   | Delete          |

---

## 🧪 Live Test

### API Response (2 Users)

```json
{
  "status_code": 200,
  "data": {
    "total": 2,
    "users": [
      {
        "email": "thanat.light@schoolbright.co",
        "fullName": "นายธนัท พรหมพิริยา",
        "role": "TEACHER",
        "createdAt": "2026-03-07T17:10:33.911Z"
      },
      {
        "email": "test123@example.com",
        "fullName": "Test User",
        "role": "TEACHER",
        "createdAt": "2026-03-07T17:10:25.319Z"
      }
    ]
  }
}
```

---

## 🚀 Environment Variables

None additional needed - uses existing:

- `DATABASE_MAIN_URL` - PostgreSQL connection
- `NEXT_PUBLIC_SUPABASE_URL` - Auth
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` - Auth

---

## 🔐 Security Notes

**TODO:** Add authentication checks in admin components:

```typescript
if (user?.role !== "ADMIN") {
  return <Unauthorized />;
}
```

---

## 📱 Responsive Design

- ✅ Mobile: Sidebar collapse, single column
- ✅ Tablet: 2 column grid
- ✅ Desktop: Full 4 column grid
- ✅ Table scrollable on small screens

---

## 🎯 Current Status

✅ Admin Layout created with Sidebar + Navbar
✅ User Management page with data table
✅ API endpoint fetching users from database
✅ Search & filter functionality
✅ Statistics cards displaying user counts
✅ Responsive design
✅ Type-safe TypeScript components

---

## 📝 File Summary

| File                        | Lines    | Purpose                  |
| --------------------------- | -------- | ------------------------ |
| admin-layout.tsx            | 25       | Main layout wrapper      |
| navbar.tsx                  | 90       | Top navigation           |
| sidebar.tsx                 | 85       | Left navigation          |
| user-management/page.tsx    | 220      | User table page          |
| api/v1/admin/users/route.ts | 50       | API endpoint             |
| **Total**                   | **~470** | **Complete admin panel** |

---

## 📚 Documentation

- `docs/admin-panel/README.md` - Full documentation
- This file - Quick reference
- Component source code - Inline comments

---

## ✨ Features Implemented

✅ User listing table
✅ Search/filter functionality
✅ User role badges
✅ Statistics dashboard
✅ Responsive layout
✅ Dark/light theme support
✅ Edit/Delete action buttons
✅ Pagination
✅ Bulk selection
✅ Real-time filtering

---

## 🔄 Next Phase

1. Delete user API + handler
2. Edit user page
3. Job management page
4. Settings page
5. Admin authentication guard
6. Audit logging
