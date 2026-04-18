"use client";

import { AdminLayout } from "@/app/components/layouts/admin";
import LandingLayout from "@/app/components/layouts/landing/landing-layout";
import { useAuthStore } from "@/app/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface LayoutSelectorProps {
  children: ReactNode;
}

// ✨ [Route home ตาม Role]
const ROLE_HOME: Record<string, string> = {
  EMPLOYEE: "/pages/employee/profile",
  EMPLOYER: "/pages/employer/profile",
};

export function LayoutSelector({ children }: LayoutSelectorProps) {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // ✨ [ตรวจสอบ URL path - ถ้าเป็น admin route ให้ใช้ AdminLayout]
  const isAdminRoute = pathname.startsWith("/pages/admin");

  console.log("🏗️  [LAYOUT SELECTOR]", {
    userRole: user?.role || "not-logged-in",
    pathname,
    isAdminRoute,
    isMounted,
  });

  // ✨ [รอ storage hydration เสร็จ]
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✨ [Guard: admin route + redirect ADMIN กลับบ้าน]
  useEffect(() => {
    if (!isMounted) return;

    // ถ้าเป็น admin route
    if (isAdminRoute) {
      if (!user) {
        router.replace(`/pages/signin?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      if (user.role !== "ADMIN") {
        router.replace(ROLE_HOME[user.role] ?? "/");
      }
      return;
    }

    // ถ้า ADMIN อยู่นอก admin route (เช่น signin/signup) → พา redirect กลับ /pages/admin
    const isAuthPage = pathname.startsWith("/pages/signin") || pathname.startsWith("/pages/signup");
    if (user?.role === "ADMIN" && isAuthPage) {
      router.replace("/pages/admin");
    }
  }, [isMounted, isAdminRoute, user, pathname, router]);

  // ✨ [Admin Layout เฉพาะ admin route เท่านั้น]
  if (isAdminRoute) {
    if (!isMounted || !user || user.role !== "ADMIN") return null;
    console.log("📊 [LAYOUT SELECTOR] Rendering AdminLayout");
    return <AdminLayout>{children}</AdminLayout>;
  }

  // ✨ [Landing Layout สำหรับ public + regular user]
  console.log("🏠 [LAYOUT SELECTOR] Rendering LandingLayout");
  return <LandingLayout>{children}</LandingLayout>;
}
