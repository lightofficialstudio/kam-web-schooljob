# ✨ Admin Panel Documentation

## Overview

Admin Panel ที่สมบูรณ์สำหรับจัดการระบบ KAM School Job Platform

---

## 📁 File Structure

```
app/
  ├── components/layouts/admin/
  │   ├── admin-layout.tsx        ✨ Main layout wrapper (Sidebar + Navbar)
  │   ├── navbar.tsx              ✨ Top navigation bar with user menu
  │   ├── sidebar.tsx             ✨ Left sidebar with navigation menu
  │   └── index.ts                ✨ Export barrel file
  │
  ├── pages/admin/
  │   ├── page.tsx                ✨ Admin dashboard home
  │   └── user-management/
  │       └── page.tsx            ✨ User management page with table
  │
  └── api/v1/admin/
      └── users/
          └── route.ts            ✨ API endpoint for fetching users
```

---

## 🎯 Components

### AdminLayout

**Purpose:** Main wrapper για admin pages
**Props:**

- `children: ReactNode` - Page content
- `title?: string` - Page title displayed in navbar

**Usage:**

```tsx
import { AdminLayout } from "@/app/components/layouts/admin";

export default function Page() {
  return (
    <AdminLayout title="User Management">
      <div>Your content here</div>
    </AdminLayout>
  );
}
```

### AdminNavbar

**Features:**

- User profile display (avatar + name + role)
- Dropdown menu (Profile, Settings, Logout)
- Menu toggle button for sidebar
- Dark gradient styling

### AdminSidebar

**Features:**

- Collapsible navigation menu
- Links to:
  - Dashboard (`/admin`)
  - User Management (`/admin/user-management`)
  - Job Management (`/admin/jobs`)
  - Settings (`/admin/settings`)
- Active route highlighting
- Back to Home link

---

## 📊 User Management Page

**Location:** `/pages/admin/user-management`

### Features:

✅ Display all users in data table
✅ Search users by email/name/role
✅ Filter by role (TEACHER, SCHOOL, ADMIN)
✅ User statistics cards
✅ Edit/Delete user actions
✅ Bulk selection
✅ Pagination (10 per page)
✅ Sort by join date

### User Columns:

| Column    | Description              |
| --------- | ------------------------ |
| Email     | User's email address     |
| Full Name | User's full name         |
| Role      | TEACHER / SCHOOL / ADMIN |
| Joined    | Account creation date    |
| Actions   | Edit / Delete buttons    |

### Statistics:

- Total Users count
- Teachers count
- Schools count
- Admins count

---

## 🔌 API Endpoint

### GET `/api/v1/admin/users`

**Response Format:**

```json
{
  "status_code": 200,
  "message_th": "ดึงข้อมูล User สำเร็จ",
  "message_en": "Fetched users successfully",
  "data": {
    "total": 2,
    "users": [
      {
        "id": "uuid",
        "userId": "uuid",
        "email": "user@example.com",
        "fullName": "User Name",
        "role": "TEACHER",
        "createdAt": "2026-03-07T17:10:33.911Z",
        "updatedAt": "2026-03-07T17:10:33.911Z"
      }
    ]
  }
}
```

---

## 🎨 Styling

**Color Scheme:**

- Primary: Dark Slate (800-900)
- Accent: Blue (600)
- Role Tags:
  - TEACHER: Green
  - SCHOOL: Blue
  - ADMIN: Red

**Layout:**

- Responsive grid system (xs, sm, lg breakpoints)
- Tailwind CSS + Ant Design components
- Dark sidebar, light content area

---

## 🚀 Usage

### Access Admin Panel:

```
http://localhost:3000/admin
```

### View User Management:

```
http://localhost:3000/admin/user-management
```

### Search/Filter Users:

1. Type email/name in search box
2. Results filter in real-time
3. View statistics by role

---

## 🔐 Authentication

Admin pages should validate that users has `role: "ADMIN"` before showing admin UI.

**TODO:** Add authentication guard middleware:

```tsx
// Add to admin layout
if (user?.role !== "ADMIN") {
  router.push("/pages/signin");
  return null;
}
```

---

## 📋 Next Steps

1. **Implement delete user API**
   - Add `DELETE /api/v1/admin/users/:id`
   - Add confirmation modal
   - Update UI delete handler

2. **Implement edit user page**
   - Create `/pages/admin/users/:id/edit`
   - Form to update user data
   - API endpoint for update

3. **Add bulk actions**
   - Delete multiple users
   - Export to CSV
   - Role assignment

4. **Job Management Page**
   - Similar structure to user management
   - View/edit/delete jobs
   - Applications management

5. **Settings Page**
   - System configuration
   - User preferences
   - Admin settings

---

## 🧪 Testing

### Test API:

```bash
curl "http://localhost:3000/api/v1/admin/users"
```

### Test UI:

1. Open `http://localhost:3000/admin/user-management`
2. Search for users
3. Click refresh button
4. Verify statistics update

---

## 🐛 Debugging

### Console Logs:

```javascript
// User Management page
📊 [USER MANAGEMENT] Fetching users...
✅ [USER MANAGEMENT] Found 2 users

// Admin API
📊 [ADMIN] Fetching all users...
✅ [ADMIN] Found 2 users
```

---

## 📦 Dependencies Used

- **Ant Design (antd):** UI components (Table, Modal, Button, etc.)
- **Tailwind CSS:** Styling and responsive design
- **@ant-design/icons:** Icon set
- **Next.js:** Framework and routing
- **Prisma:** Database ORM

---

## 🎯 Future Enhancements

- [ ] Real-time user update notifications
- [ ] User activity logs
- [ ] Advanced filtering (date range, role filter)
- [ ] Export functionality (CSV, PDF)
- [ ] Batch operations
- [ ] User edit modal
- [ ] User deletion with soft delete
- [ ] Profile picture upload
- [ ] Email templates
- [ ] Admin activity audit log
