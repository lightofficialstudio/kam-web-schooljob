"use client";

import { AdminLayout } from "@/app/components/layouts/admin";
import LandingLayout from "@/app/components/layouts/landing/landing-layout";
import { useAuthStore } from "@/app/stores/auth-store";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface LayoutSelectorProps {
  children: ReactNode;
}

/**
 * 🏗️ Layout Selector - ตัวเลือก Layout ตามสถานะ User + Route
 *
 * Logic:
 * 1. ถ้า URL มี /admin → AdminLayout เสมอ
 * 2. ถ้า user.role === "ADMIN" → AdminLayout
 * 3. อื่น ๆ → LandingLayout
 */
export function LayoutSelector({ children }: LayoutSelectorProps) {
  const { user } = useAuthStore();
  const pathname = usePathname();

  // ✨ [ตรวจสอบ URL path - ถ้าเป็น admin route ให้ใช้ AdminLayout]
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/pages/admin");

  console.log("🏗️  [LAYOUT SELECTOR]", {
    userRole: user?.role || "not-logged-in",
    pathname,
    isAdminRoute,
  });

  // ✨ [Admin Layout สำหรับ admin route หรือ admin user]
  if (isAdminRoute || (user && user.role === "ADMIN")) {
    console.log("📊 [LAYOUT SELECTOR] Rendering AdminLayout");
    return <AdminLayout>{children}</AdminLayout>;
  }

  // ✨ [Landing Layout สำหรับ public + regular user]
  console.log("🏠 [LAYOUT SELECTOR] Rendering LandingLayout");
  return <LandingLayout>{children}</LandingLayout>;
}
