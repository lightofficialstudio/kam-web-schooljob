# Layout System - Complete Routing Guide

## 🗺️ URL Routing by User Role

```
┌────────────────────────────────────────────────────────────┐
│                     User Authentication                     │
└────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼──────────────┐
                │             │              │
              null        TEACHER/SCHOOL    ADMIN
                │             │              │
                ▼             ▼              ▼
         ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
         │   LANDING    │ │   LANDING    │ │    ADMIN     │
         │   LAYOUT     │ │   LAYOUT     │ │    LAYOUT    │
         └──────────────┘ └──────────────┘ └──────────────┘
```

---

## 📍 Routes by Layout

### LANDING LAYOUT Routes

Used for: Not logged in, TEACHER, SCHOOL users

```
/                           → Home page
/pages/landing              → Landing page
/pages/signin               → Sign in page
/pages/signup               → Sign up page
/pages/[dynamicRoutes]      → Any other public pages
```

### ADMIN LAYOUT Routes

Used for: ADMIN users only

```
/admin                      → Admin Dashboard
/admin/user-management      → User Management (table view)
/admin/users/:id/edit       → Edit user (future)
/admin/jobs                 → Job Management (future)
/admin/settings             → Admin Settings (future)
/admin/[dynamicRoutes]      → Any other admin pages
```

---

## 🎯 Detailed Route Structure

### PUBLIC ROUTES (Landing Layout)

These routes work for all users + non-authenticated users

```
GET /                                       [Home]
├── Components: Hero, Features, CTA
├── Layout: Landing Navbar + Content + Footer
└── Auth: Optional (Sign In / User Menu)

GET /pages/landing                          [Landing Page]
├── Components: Full landing page
├── Layout: Landing
└── Auth: Optional

GET /pages/signin                           [Sign In]
├── Components: Login form, validation
├── Layout: Landing
├── Auth: Required to use form
└── Redirect: /admin OR / based on role

GET /pages/signup                           [Sign Up]
├── Components: Registration form, role selector
├── Layout: Landing
├── Auth: Not required
└── Redirect: /pages/signin on success

GET /pages/search                           [Search/Discover]
├── Components: Job/Course search
├── Layout: Landing
├── Auth: Optional
└── Data: Filtered by user role
```

### ADMIN ROUTES (Admin Layout)

These routes are EXCLUSIVE to ADMIN users

```
GET /admin                                  [Admin Dashboard]
├── Components: Statistics, quick links
├── Layout: Admin (Sidebar + Navbar)
├── Auth: REQUIRED - role === "ADMIN"
├── Sidebar: Visible
└── Navbar: Admin navbar with user menu

GET /admin/user-management                  [User Management]
├── Components: User table, search, filter
├── Layout: Admin (Sidebar + Navbar)
├── Auth: REQUIRED - role === "ADMIN"
├── Features: View, search, edit, delete users
├── API: GET /api/v1/admin/users
└── Permissions: Admin only

GET /admin/users/:id/edit                   [Edit User] (Future)
├── Components: User form, profile editor
├── Layout: Admin
├── Auth: REQUIRED - role === "ADMIN"
└── API: PUT /api/v1/admin/users/:id

GET /admin/jobs                             [Job Management] (Future)
├── Components: Job table, create job
├── Layout: Admin
├── Auth: REQUIRED - role === "ADMIN"
└── Features: CRUD operations on jobs

GET /admin/settings                         [Admin Settings] (Future)
├── Components: Configuration panel
├── Layout: Admin
├── Auth: REQUIRED - role === "ADMIN"
└── Features: System configuration
```

---

## 🔐 Route Protection Rules

### Automatic Protection via LayoutSelector

```typescript
// Any route that should be admin-only:
// 1. Place in /app/pages/admin/* folder
// 2. LayoutSelector checks: user.role === "ADMIN"
// 3. If not admin: LandingLayout is rendered instead
// 4. (TODO: Add middleware for actual route blocking)

// Currently:
// - Admin layout renders if admin
// - Landing layout renders if not admin
// - Page content still loads (needs middleware for full protection)
```

### Current Status (v1)

```
✅ Layout rendering based on role (LayoutSelector)
❌ Route-level protection (TODO: add middleware)
❌ API protection (TODO: add role checks)
```

### Future: Add Route Middleware

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const userRole = request.headers.get("x-user-role");

  if (isAdminRoute && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/pages/signin", request.url));
  }
}
```

---

## 🔄 Navigation Flow Diagrams

### Use Case 1: New Visitor

```
Visitor (not logged in)
    │
    ├─ Visit: /
    │  └─ Layout: Landing
    │
    ├─ Click: "Sign Up"
    │  └─ Navigate: /pages/signup
    │     └─ Layout: Landing
    │
    ├─ Fill form, submit
    │  └─ API: POST /api/v1/authenticate/signup
    │
    ├─ Redirect: /pages/signin
    │  └─ Layout: Landing
    │
    └─ Login
       └─ setUser() in Zustand
          └─ Redirect: / (Landing Layout)
```

### Use Case 2: Teacher Login

```
Teacher
    │
    ├─ Visit: /pages/signin
    │  └─ Layout: Landing
    │
    ├─ Login with credentials
    │  └─ API: POST /api/v1/authenticate/signin
    │
    ├─ Response: { role: "TEACHER", ... }
    │
    ├─ setUser() in Zustand
    │  └─ LayoutSelector detects: role !== "ADMIN"
    │
    ├─ Render: LandingLayout
    │
    └─ Access any page
       └─ Always shows: Landing Layout
          (with user profile menu)
```

### Use Case 3: Admin Login

```
Admin
    │
    ├─ Visit: /pages/signin
    │  └─ Layout: Landing
    │
    ├─ Login with credentials
    │  └─ API: POST /api/v1/authenticate/signin
    │
    ├─ Response: { role: "ADMIN", ... }
    │
    ├─ setUser() in Zustand
    │  └─ LayoutSelector detects: role === "ADMIN"
    │
    ├─ Redirect: /admin
    │  └─ Render: AdminLayout
    │
    ├─ Navigate: /admin/user-management
    │  └─ Layout: AdminLayout
    │     ├─ Sidebar: Visible
    │     ├─ Navbar: Admin navbar
    │     └─ Content: User management table
    │
    └─ Any /admin/* route
       └─ ShowAdminLayout with correct page
```

### Use Case 4: Admin tries to logout

```
Admin logged in
    │
    ├─ Click: "Logout"
    │  └─ API: POST /api/v1/authenticate/logout
    │
    ├─ Response: { success: true }
    │
    ├─ logout() in Zustand
    │  └─ user = null
    │
    ├─ LayoutSelector detects: user === null
    │
    ├─ Render: LandingLayout
    │
    └─ Redirect: /pages/signin
       └─ Show: Sign in page with Landing Layout
```

---

## 📊 Route Security Matrix

| Route            | Public | Teacher | School | Admin | Layout  | Status |
| ---------------- | ------ | ------- | ------ | ----- | ------- | ------ |
| /                | ✅     | ✅      | ✅     | ✅    | Landing | ✅     |
| /pages/signin    | ✅     | ✅\*    | ✅\*   | ✅\*  | Landing | ✅     |
| /pages/signup    | ✅     | ✅\*    | ✅\*   | ✅\*  | Landing | ✅     |
| /pages/[other]   | ✅     | ✅      | ✅     | ✅    | Landing | ✅     |
| /admin           | ❌     | ❌      | ❌     | ✅    | Admin   | ✅     |
| /admin/user-mgmt | ❌     | ❌      | ❌     | ✅    | Admin   | ✅     |
| /admin/jobs      | ❌     | ❌      | ❌     | ✅    | Admin   | ✅     |
| /admin/settings  | ❌     | ❌      | ❌     | ✅    | Admin   | ✅     |

\*Currently allowed but should see user menu, not sign in button

---

## 🎨 Layout Component Nesting

### Landing Layout Structure

```
<html>
  <body>
    <AntdRegistry>
      <LayoutSelector>
        <LandingLayout>
          <Navbar />
          <Content>
            {children} ← Page content injected here
          </Content>
          <Footer />
        </LandingLayout>
      </LayoutSelector>
    </AntdRegistry>
  </body>
</html>
```

### Admin Layout Structure

```
<html>
  <body>
    <AntdRegistry>
      <LayoutSelector>
        <AdminLayout>
          <NavBar />
          <div className="flex">
            <Sidebar />
            <Content>
              {children} ← Page content injected here
            </Content>
          </div>
        </AdminLayout>
      </LayoutSelector>
    </AntdRegistry>
  </body>
</html>
```

---

## 🧭 Navigation Implementation

### Next.js Routes Used

```typescript
// File-based routing in Next.js 14+ app directory

app/
├── page.tsx                         → /
├── layout.tsx                       → App-wide layout
├── pages/
│   ├── landing/page.tsx             → /pages/landing
│   ├── signin/page.tsx              → /pages/signin
│   ├── signup/page.tsx              → /pages/signup
│   └── admin/
│       ├── page.tsx                 → /admin
│       └── user-management/
│           └── page.tsx             → /admin/user-management
```

### Programmatic Navigation

```typescript
import { useRouter } from "next/navigation";

// In components:
const router = useRouter();

// Navigate examples:
router.push("/"); // Home
router.push("/pages/signin"); // Sign in
router.push("/admin"); // Admin dashboard
router.push("/admin/user-management"); // User management
```

---

## 🔗 Linking Between Routes

### Using Next.js Link Component

```tsx
import Link from "next/link";

// Public routes
<Link href="/">Home</Link>
<Link href="/pages/signin">Sign In</Link>
<Link href="/pages/signup">Sign Up</Link>

// Admin routes (shown only to admins)
{user?.role === "ADMIN" && (
  <>
    <Link href="/admin">Dashboard</Link>
    <Link href="/admin/user-management">Users</Link>
    <Link href="/admin/jobs">Jobs</Link>
  </>
)}
```

### Navbar Navigation Examples

```tsx
// Landing Navbar:
<Link href="/">Home</Link>
<Link href="/pages/signin">Sign In</Link>   {/* if not logged in */}
<UserMenu />                                  {/* if logged in */}

// Admin Navbar:
<MenuToggle onClick={() => toggleSidebar()} />
<Title>Page Title</Title>
<UserMenu />

// Admin Sidebar:
<Link href="/admin">Dashboard</Link>
<Link href="/admin/user-management">Users</Link>
<Link href="/admin/jobs">Jobs</Link>
<Link href="/admin/settings">Settings</Link>
<Link href="/">Back to Home</Link>
```

---

## 📱 Responsive Route Behavior

### Mobile (< 640px)

```
Landing:
├─ Navbar collapses to hamburger
├─ Content takes full width
└─ Footer stacked

Admin:
├─ Sidebar collapses (toggle button visible)
├─ Content takes full width when expanded
└─ Navbar adapts to mobile
```

### Tablet (640px - 1024px)

```
Both layouts render normally with adjusted padding
```

### Desktop (> 1024px)

```
Full layouts with all features visible
```

---

## ✨ Current Implementation Status

### ✅ Implemented

- [x] LayoutSelector component
- [x] Zustand auth store integration
- [x] Automatic layout switching based on role
- [x] Landing layout for public + regular users
- [x] Admin layout for admin users
- [x] Console debug logging
- [x] TypeScript typing

### ⏳ TODO

- [ ] Route middleware for /admin/\* protection
- [ ] API endpoint role validation
- [ ] Redirect logic for unauthorized access
- [ ] 404 page for invalid admin access
- [ ] Session persistence across tabs
- [ ] Real-time role update sync

### 🚀 Future

- [ ] Multi-role users (user can be both TEACHER and ADMIN)
- [ ] Custom role permissions system
- [ ] Dynamic layout configuration
- [ ] Layout theme switching per role

---

## 📚 Related Documentation

- [Layout Selector Documentation](./LAYOUT-SELECTOR.md)
- [Testing Guide](./TESTING-GUIDE.md)
- [Admin Panel Documentation](../admin-panel/README.md)
- [Auth Store Documentation](../../stores/auth-store.ts)
