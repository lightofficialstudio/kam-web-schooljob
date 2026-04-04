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

  // ✨ [ถ้าไม่ได้ login และพยายามเข้า admin route ให้ redirect ไปหน้า login]
  // (รอให้ storage hydrate เสร็จก่อน)
  useEffect(() => {
    if (!isMounted) return;

    if (!isAdminRoute) return;

    if (!user) {
      console.log(
        "🔐 [LAYOUT SELECTOR] Not logged in, redirecting to signin...",
      );
      router.replace(`/pages/signin?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user.role !== "ADMIN") {
      console.log(
        "🚫 [LAYOUT SELECTOR] Not ADMIN, redirecting to role home...",
      );
      router.replace(ROLE_HOME[user.role] ?? "/");
    }
  }, [isMounted, isAdminRoute, user, pathname, router]);

  // ✨ [Admin Layout เฉพาะ ADMIN เท่านั้น]
  if (isAdminRoute || (user && user.role === "ADMIN")) {
    // ถ้ายังไม่ mount หรือ user ไม่ใช่ ADMIN → render null ระหว่าง redirect
    if (!isMounted || !user || user.role !== "ADMIN") return null;
    console.log("📊 [LAYOUT SELECTOR] Rendering AdminLayout");
    return <AdminLayout>{children}</AdminLayout>;
  }

  // ✨ [Landing Layout สำหรับ public + regular user]
  console.log("🏠 [LAYOUT SELECTOR] Rendering LandingLayout");
  return <LandingLayout>{children}</LandingLayout>;
}
