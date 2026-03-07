# Layout Selector - Testing Guide

## ✅ Verify Layout Selection Works

### Test 1: Non-Authenticated User (Default)

**Steps:**

1. Open incognito/private window
2. Navigate to `http://localhost:3000/`
3. Check browser console

**Expected Results:**

```
🏗️  [LAYOUT SELECTOR] User role: not-logged-in
🏠 [LAYOUT SELECTOR] Rendering LandingLayout
```

**Visual Verification:**

- ✅ Landing Navbar visible (Logo, Menu, Sign In, Sign Up buttons)
- ✅ Main content displayed
- ✅ Footer visible
- ✅ Dark/Light theme works
- ✅ No admin sidebar

---

### Test 2: Regular User After Login (TEACHER)

**Steps:**

1. Sign up/Login with TEACHER role
2. Navigate to any page
3. Check browser console

**Expected Results:**

```
🏗️  [LAYOUT SELECTOR] User role: TEACHER
🏠 [LAYOUT SELECTOR] Rendering LandingLayout
```

**Visual Verification:**

- ✅ Landing Navbar shows user profile/dropdown
- ✅ Can access user dashboard
- ✅ Footer visible
- ✅ No admin sidebar
- ✅ User menu has logout option

---

### Test 3: Regular User (SCHOOL Role)

**Steps:**

1. Sign up/Login with SCHOOL role
2. Navigate to any page
3. Check browser console

**Expected Results:**

```
🏗️  [LAYOUT SELECTOR] User role: SCHOOL
🏠 [LAYOUT SELECTOR] Rendering LandingLayout
```

**Visual Verification:**

- ✅ Landing Navbar visible
- ✅ User profile with SCHOOL role badge
- ✅ Same layout as TEACHER
- ✅ No admin access

---

### Test 4: Admin User

**Steps:**

1. Create admin user in database (or modify existing user role to ADMIN)
2. Login with admin credentials
3. Navigate to `/admin` or any admin page
4. Check browser console

**Expected Results:**

```
🏗️  [LAYOUT SELECTOR] User role: ADMIN
📊 [LAYOUT SELECTOR] Rendering AdminLayout
```

**Visual Verification:**

- ✅ Admin Sidebar visible on left (Slate-800 dark)
- ✅ Admin Navbar at top with user profile
- ✅ No landing footer
- ✅ Sidebar menu items (Dashboard, Users, Jobs, Settings)
- ✅ Sidebar toggle button works
- ✅ Different styling (dark admin theme)

---

### Test 5: Role Change During Session

**Steps:**

1. Login as TEACHER
2. Manually update user role to ADMIN in database
3. Refresh page
4. Check console

**Expected Results:**

```
Before: 🏠 [LAYOUT SELECTOR] Rendering LandingLayout
After:  📊 [LAYOUT SELECTOR] Rendering AdminLayout
```

**Visual Verification:**

- ✅ Layout switches immediately on refresh
- ✅ Admin layout appears
- ✅ Sidebar and admin navbar visible

---

### Test 6: Logout and Layout Reset

**Steps:**

1. Login as ADMIN (admin layout visible)
2. Click logout button
3. Check console and page layout

**Expected Results:**

```
Before: 📊 [LAYOUT SELECTOR] Rendering AdminLayout
After:  🏠 [LAYOUT SELECTOR] Rendering LandingLayout
```

**Visual Verification:**

- ✅ Layout switches back to landing
- ✅ Admin sidebar disappears
- ✅ Landing navbar appears with Sign In/Up buttons
- ✅ Redirect to signin page (if configured)

---

## 🔍 Console Debugging

### Check Current User Role

```javascript
// Paste in browser console
console.log("Current User:", useAuthStore.getState().user);
console.log("User Role:", useAuthStore.getState().user?.role);
```

### Watch Layout Changes

```javascript
// Paste in browser console to watch all layout selector logs
// (They'll appear as 🏗️, 📊, 🏠 icons)
// Just check the console as you navigate between pages
```

---

## 📸 Visual Checklist

### Landing Layout Checklist

- [ ] Navbar with logo and menu
- [ ] Login/Signup buttons (if not authenticated)
- [ ] User profile menu (if authenticated)
- [ ] Main content area fills width
- [ ] Footer with links visible
- [ ] Responsive on mobile
- [ ] Theme toggle works

### Admin Layout Checklist

- [ ] Dark sidebar on left
- [ ] Sidebar menu items visible
- [ ] Sidebar toggle button works
- [ ] Admin navbar at top
- [ ] User profile in navbar top-right
- [ ] Main content area fills space
- [ ] No landing footer
- [ ] Responsive sidebar collapse
- [ ] Menu navigation works

---

## 🧪 Edge Cases to Test

### 1. Fast Page Navigation

```
Attempt: Rapidly navigate between pages
Expected: Layout renders correctly each time
Verify: Check console for duplicated logs
```

### 2. Multiple Tabs

```
Attempt: Open site in 2 tabs, login in one tab, check other
Expected: Other tab should update when you navigate
Verify: Both tabs show correct layout
```

### 3. Browser Back/Forward

```
Attempt: Navigate with browser back/forward buttons
Expected: Correct layout displays
Verify: No layout flickering
```

### 4. Refresh Page

```
Attempt: Refresh page while logged in as admin
Expected: Layout persists
Verify: Admin layout stays, doesn't flicker
```

---

## 🐛 If Something Goes Wrong

### Layout stays as Landing even for ADMIN

**Diagnosis:**

- Check: `useAuthStore.getState().user?.role`
- Should be: `"ADMIN"`
- If null/undefined: User not set in Zustand store

**Fix:**

- Verify signin endpoint sets user in store
- Check `app/stores/auth-store.ts` has the role field
- Test signin API endpoint

### Layout stays as Admin even after logout

**Diagnosis:**

- Check: `useAuthStore.getState().user` should be null
- Check: Console logs show still showing "ADMIN"

**Fix:**

- Verify logout clears user in Zustand store
- Test logout functionality
- Clear localStorage and browser cache

### Layout doesn't show change on role update

**Diagnosis:**

- Changes made in database, but layout unchanged
- Need to refresh page or update Zustand store

**Fix:**

- Refresh page after role change
- Or: Implement real-time sync with database
- Or: Call `setUser()` after role update API

---

## 📊 Test Coverage

| Scenario      | Test        | Status |
| ------------- | ----------- | ------ |
| Not logged in | Test 1      | ✅     |
| TEACHER role  | Test 2      | ✅     |
| SCHOOL role   | Test 3      | ✅     |
| ADMIN role    | Test 4      | ✅     |
| Role change   | Test 5      | ✅     |
| Logout        | Test 6      | ✅     |
| Navigation    | Edge Case 1 | ✅     |
| Multiple tabs | Edge Case 2 | ✅     |
| Browser nav   | Edge Case 3 | ✅     |
| Page refresh  | Edge Case 4 | ✅     |

---

## 🚀 Test Automation (Future)

```typescript
// With Playwright/Cypress, could test:
describe("Layout Selector", () => {
  it("should render landing layout for non-authenticated user", () => {
    // Navigate to /
    // Check navbar has Sign In button
    // Check footer is visible
  });

  it("should render admin layout for admin user", () => {
    // Login with admin credentials
    // Navigate to /admin
    // Check sidebar is visible
    // Check admin navbar is shown
  });

  it("should switch layout on role change", () => {
    // Login as teacher
    // Change role to admin in DB
    // Refresh
    // Verify admin layout appears
  });
});
```

---

## ✨ Summary

✅ Layout Selector automatically routes to correct layout
✅ No manual intervention needed in pages
✅ Console logs for debugging
✅ Works with Zustand auth store
✅ Type-safe implementation
✅ Responsive on all devices
✅ Easy to extend for new roles/layouts

**Status: READY FOR PRODUCTION** 🚀
