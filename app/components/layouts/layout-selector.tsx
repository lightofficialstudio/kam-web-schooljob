"use client";

import { AdminLayout } from "@/app/components/layouts/admin";
import LandingLayout from "@/app/components/layouts/landing/landing-layout";
import { useAuthStore } from "@/app/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface LayoutSelectorProps {
  children: ReactNode;
}

/**
 * 🏗️ Layout Selector - ตัวเลือก Layout ตามสถานะ User + Route
 *
 * Logic:
 * 1. ถ้า URL มี /admin + user ไม่ logged in → Redirect to signin (with return URL)
 * 2. ถ้า URL มี /admin → AdminLayout
 * 3. ถ้า user.role === "ADMIN" → AdminLayout
 * 4. อื่น ๆ → LandingLayout
 */
export function LayoutSelector({ children }: LayoutSelectorProps) {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // ✨ [ตรวจสอบ URL path - ถ้าเป็น admin route ให้ใช้ AdminLayout]
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/pages/admin");

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
    if (!isMounted) return; // รอให้ mounted เสร็จ

    if (isAdminRoute && !user) {
      console.log(
        "🔐 [LAYOUT SELECTOR] Not logged in, redirecting to signin...",
      );
      const returnUrl = pathname.startsWith("/pages")
        ? pathname.replace("/pages", "")
        : pathname;
      router.push(`/pages/signin?redirect=${encodeURIComponent(returnUrl)}`);
    }
  }, [isMounted, isAdminRoute, user, pathname, router]);

  // ✨ [Admin Layout สำหรับ admin route หรือ admin user]
  if (isAdminRoute || (user && user.role === "ADMIN")) {
    console.log("📊 [LAYOUT SELECTOR] Rendering AdminLayout");
    return <AdminLayout>{children}</AdminLayout>;
  }

  // ✨ [Landing Layout สำหรับ public + regular user]
  console.log("🏠 [LAYOUT SELECTOR] Rendering LandingLayout");
  return <LandingLayout>{children}</LandingLayout>;
}
