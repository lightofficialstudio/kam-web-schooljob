"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

// ✨ [Route ที่ถูกต้องตาม Role]
const ROLE_REDIRECT: Record<string, string> = {
  EMPLOYEE: "/pages/employee/profile",
  EMPLOYER: "/pages/employer/profile",
};

interface AdminGuardProps {
  children: ReactNode;
}

// 🔐 [Admin Guard — ตรวจสอบว่า user เป็น ADMIN ถ้าไม่ใช่ redirect ทันที]
export function AdminGuard({ children }: AdminGuardProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // ✨ [รอให้ store hydrate จาก localStorage ก่อน]
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!user) {
      // ยังไม่ได้ login → ไป signin
      router.replace("/pages/signin");
      return;
    }

    if (user.role !== "ADMIN") {
      // login แล้วแต่ไม่ใช่ ADMIN → ไปหน้าของ role ตัวเอง
      const target = ROLE_REDIRECT[user.role] ?? "/";
      router.replace(target);
    }
  }, [isMounted, user, router]);

  // ✨ [ยังไม่พร้อม หรือกำลัง redirect → render null เพื่อไม่ flash content]
  if (!isMounted || !user || user.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
