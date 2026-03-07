# Layout Selector System - Complete Documentation

## 🎯 Overview

Dynamic layout system that automatically switches between different UI layouts based on user authentication state and role.

**Three layout types:**

1. ✅ **Landing Layout** - For non-authenticated users and regular users (TEACHER/SCHOOL)
2. 📊 **Admin Layout** - Exclusive for users with ADMIN role
3. 🔄 **Automatic Switching** - Based on Zustand auth store

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              app/layout.tsx (Root)              │
│  Wrapped with AntdRegistry & LayoutSelector     │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   LayoutSelector       │
        │ (layout-selector.tsx)  │
        └────────────┬───────────┘
                     │
         ┌───────────┴──────────┐
         │                      │
         ▼                      ▼
    ┌──────────┐         ┌──────────────┐
    │ Checking │         │              │
    │ user.role│         │              │
    └────┬─────┘         │              │
         │               │              │
    ┌────────────────┐   │              │
    │Is role=ADMIN?  │   │              │
    └────┬───────────┘   │              │
         │               │              │
    ┌────┴─────┐         │              │
    Yes        No        │              │
    │          │         │              │
    ▼          ▼         │              │
  ┌──────────┐ ┌──────────────────────┐
  │ ADMIN    │ │  LANDING LAYOUT      │
  │ LAYOUT   │ │  - Navbar            │
  │          │ │  - Content           │
  │ - Sidebar│ │  - Footer            │
  │ - Navbar │ │  (Ant Design themed) │
  │ - Content│ │                      │
  └──────────┘ └──────────────────────┘
```

---

## 📁 File Structure

```
app/
├── layout.tsx                          ✨ Root layout (updated)
├── components/layouts/
│   ├── layout-selector.tsx             ✨ NEW - Dynamic layout switcher
│   ├── landing/
│   │   ├── landing-layout.tsx          ✨ Landing layout (Navbar + Content + Footer)
│   │   ├── navbar.tsx                  ✨ Landing navbar
│   │   └── footer.tsx                  ✨ Footer
│   └── admin/
│       ├── admin-layout.tsx            ✨ Admin layout (Sidebar + Navbar + Content)
│       ├── navbar.tsx                  ✨ Admin navbar
│       └── sidebar.tsx                 ✨ Admin sidebar
```

---

## 🔄 How It Works

### Step 1: Root Layout Initialization

```tsx
// app/layout.tsx
<AntdRegistry>
  <LayoutSelector>{children}</LayoutSelector>
</AntdRegistry>
```

### Step 2: Layout Selector Logic

```tsx
// app/components/layouts/layout-selector.tsx
const { user } = useAuthStore();

if (user && user.role === "ADMIN") {
  return <AdminLayout>{children}</AdminLayout>;
}

return <LandingLayout>{children}</LandingLayout>;
```

### Step 3: Conditional Rendering

- **User not logged in** → LandingLayout
- **User logged in (TEACHER)** → LandingLayout
- **User logged in (SCHOOL)** → LandingLayout
- **User logged in (ADMIN)** → AdminLayout

---

## 🎨 Layout Components Comparison

### LandingLayout

**Used by:** Non-authenticated users + TEACHER + SCHOOL roles

**Features:**

- ✅ Navbar with login/signup buttons or user menu
- ✅ Main content area (full width)
- ✅ Footer with links
- ✅ Ant Design ConfigProvider (theme, locale, etc.)
- ✅ Dark/Light theme support
- ✅ Responsive design

**Structure:**

```
┌── Navbar ──────────────────────────┐
│ Logo | Menu | [SignIn] [SignUp]    │
├────────────────────────────────────┤
│                                    │
│         Main Content               │
│         (Page Children)            │
│                                    │
├────────────────────────────────────┤
│ Footer | Links | Copyright         │
└────────────────────────────────────┘
```

### AdminLayout

**Used by:** Users with ADMIN role only

**Features:**

- ✅ Sidebar with collapsible navigation menu
- ✅ Top navbar with user profile dropdown
- ✅ Admin-specific menu items
- ✅ Dark sidebar (Slate-800)
- ✅ Light content area
- ✅ Responsive sidebar toggle
- ✅ Quick access to admin pages

**Structure:**

```
┌── Admin Navbar ────────────────────┐
│ Menu Toggle | Title | User Profile │
├─────────┬────────────────────────┤
│ Sidebar │                        │
│         │  Main Content          │
│ - Menu  │  (Page Children)       │
│ Items   │                        │
│         │                        │
│ - Back  │                        │
│   Home  │                        │
└─────────┴────────────────────────┘
```

---

## 🔐 User Roles & Layout Mapping

| User Role         | Layout  | Pages Available                  |
| ----------------- | ------- | -------------------------------- |
| **Not Logged In** | Landing | Landing, Signin, Signup          |
| **TEACHER**       | Landing | Landing, Dashboard, Search       |
| **SCHOOL**        | Landing | Landing, Dashboard, Search       |
| **ADMIN**         | Admin   | Dashboard, Users, Jobs, Settings |

---

## 🧪 Testing

### Test Case 1: Non-Authenticated User

```bash
# Console Output:
🏗️  [LAYOUT SELECTOR] User role: not-logged-in
🏠 [LAYOUT SELECTOR] Rendering LandingLayout
```

**Expected:**

- Landing navbar with "Sign In" and "Sign Up" buttons
- Full navigation with logo and menu
- Footer visible

### Test Case 2: Authenticated User (TEACHER/SCHOOL)

```bash
# Console Output:
🏗️  [LAYOUT SELECTOR] User role: TEACHER
🏠 [LAYOUT SELECTOR] Rendering LandingLayout
```

**Expected:**

- Landing navbar with user profile and dropdown
- Can access teacher/school dashboard
- Footer visible

### Test Case 3: Admin User

```bash
# Console Output:
🏗️  [LAYOUT SELECTOR] User role: ADMIN
📊 [LAYOUT SELECTOR] Rendering AdminLayout
```

**Expected:**

- Admin sidebar visible on left
- Admin navbar at top
- Admin-specific menu (Users, Jobs, Settings)
- Sidebar can be collapsed
- No regular landing footer

---

## 🔗 Navigation Flow

### Non-Authenticated User

```
Landing Page (/)
    ↓
Sign In (/pages/signin)
    ↓
Authenticated ✓
    ↓
User Dashboard (Landing Layout)
```

### Admin User Login Flow

```
Landing Page (/)
    ↓
Sign In (/pages/signin)
    ↓
Admin Authenticated ✓
    ↓
Admin Dashboard (/admin)
    ↓
Admin Panel (Admin Layout)
    ↓
User Management (/admin/user-management)
```

---

## 🛠️ Implementation Details

### LayoutSelector Component

**Location:** `app/components/layouts/layout-selector.tsx`
**Type:** Client Component (`"use client"`)
**Props:**

- `children: ReactNode` - Page content

**Key Features:**

```typescript
// Hooks
- useAuthStore(): Gets user and role from Zustand store

// Logic
- Checks if user exists and role === "ADMIN"
- Renders AdminLayout if admin
- Renders LandingLayout otherwise

// Console Logs
- 🏗️  [LAYOUT SELECTOR] User role: ...
- 📊 [LAYOUT SELECTOR] Rendering AdminLayout
- 🏠 [LAYOUT SELECTOR] Rendering LandingLayout
```

### Root Layout Changes

**Location:** `app/layout.tsx`

**Before:**

```tsx
<AntdRegistry>
  <LandingLayout>{children}</LandingLayout>
</AntdRegistry>
```

**After:**

```tsx
<AntdRegistry>
  <LayoutSelector>{children}</LayoutSelector>
</AntdRegistry>
```

---

## 📊 State Flow Diagram

```
User Authentication
        │
        ▼
useAuthStore().user
        │
    ┌───┴───┐
    │       │
   null    User Object
    │      │
    │      ├─ user_id
    │      ├─ email
    │      ├─ full_name
    │      └─ role ◄─── [KEY DECISION POINT]
    │          │
    ├──────────┼────────────────┐
    │          │                │
  "TEACHER"   "SCHOOL"        "ADMIN"
    │          │                │
    ▼          ▼                ▼
  Landing    Landing          Admin
  Layout     Layout           Layout
```

---

## 💾 Integration with Zustand Store

### useAuthStore Hook

```typescript
// From: app/stores/auth-store.ts
interface User {
  user_id: string;
  email: string;
  full_name: string;
  role: "TEACHER" | "SCHOOL" | "ADMIN"; // ◄─ Used by Layout Selector
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

// Used in Layout Selector:
const { user } = useAuthStore();
// user.role determines which layout to render
```

---

## 🎯 Benefits

✅ **Clean Separation of Concerns**

- Different layouts for different user types
- No layout logic mixed in pages
- Centralized layout decision-making

✅ **Easy to Extend**

- Add more roles later
- Add more layouts easily
- Scalable architecture

✅ **Type-Safe**

- Full TypeScript support
- User role is strongly typed
- No runtime errors

✅ **Automatic Switching**

- No manual layout imports in pages
- Layout switches instantly on role change
- Works across all pages

✅ **Debug-Friendly**

- Console logs show which layout is rendering
- Easy to track user role changes
- Clear separation in browser dev tools

---

## 🔮 Future Enhancements

### 1. Layout Transitions

```tsx
// Add fade transition between layouts
const [isChanging, setIsChanging] = useState(false);

useEffect(() => {
  setIsChanging(true);
  setTimeout(() => setIsChanging(false), 300);
}, [user?.role]);
```

### 2. More Layout Types

```tsx
// Add new roles:
-MODERATOR_LAYOUT - TEACHER_ADMIN_LAYOUT - SCHOOL_ADMIN_LAYOUT;
```

### 3. Persistent Layout Theme

```tsx
// Remember user's theme preference
// Save in localStorage/Supabase
const [theme, setTheme] = useLayoutTheme();
```

### 4. Role-Based Route Protection

```tsx
// Add middleware to protect routes
- /admin/* → require ADMIN role
- /teachers/* → require TEACHER role
```

---

## 📋 Current Status

✅ LayoutSelector component created
✅ Root layout.tsx updated
✅ Dynamic layout switching implemented
✅ Console logging for debugging
✅ TypeScript fully typed
✅ No build errors
✅ Dev server running correctly

---

## 🚀 How to Use

### For Page Developers

You don't need to worry about layouts anymore!

**Before:** (Manual import)

```tsx
import LandingLayout from "@/app/components/layouts/landing/landing-layout";

export default function MyPage() {
  return <LandingLayout>{/* Content */}</LandingLayout>;
}
```

**After:** (Automatic with LayoutSelector)

```tsx
export default function MyPage() {
  return <>{/* Content */}</>;
}
// LayoutSelector automatically chooses the right layout!
```

---

## 🐛 Troubleshooting

### Layout not switching after login?

- Check browser console for layout selector logs
- Verify useAuthStore has the user set correctly
- Clear browser cache and reload

### Admin layout not showing?

- Verify user.role === "ADMIN" in Zustand store
- Check console: should show "Rendering AdminLayout"
- User must be authenticated with ADMIN role

### Wrong layout showing?

- Check user role in browser console: `useAuthStore.getState().user`
- Verify role matches exactly: "ADMIN", "TEACHER", or "SCHOOL"
- Check LayoutSelector component logic

---

## 📚 Related Files

- [Admin Panel Documentation](../admin-panel/README.md)
- [Auth Store Documentation](../../stores/auth-store.ts)
- [Landing Layout](./landing/landing-layout.tsx)
- [Admin Layout](./admin/admin-layout.tsx)
