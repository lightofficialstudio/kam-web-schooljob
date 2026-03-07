"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import { AlertOutlined } from "@ant-design/icons";
import { Alert, Button, Space } from "antd";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface AdminGuardProps {
  children: ReactNode;
}

/**
 * 🔐 Admin Guard - ตรวจสอบว่า user เป็น admin หรือไม่
 * ถ้า user ไม่ใช่ admin จะแสดง warning
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const { user } = useAuthStore();
  const router = useRouter();

  // ✨ [ถ้า user ไม่ใช่ admin ให้แสดง warning]
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="space-y-4">
        <Alert
          message="⚠️ Access Restricted"
          description={`You need to be an ADMIN to access this page. Current role: ${
            user?.role || "Not logged in"
          }`}
          type="warning"
          icon={<AlertOutlined />}
          showIcon
          closable
        />

        <div className="space-y-2">
          <p className="text-slate-700">
            Please login with an admin account to continue.
          </p>
          <Space>
            <Button type="primary" onClick={() => router.push("/pages/signin")}>
              Sign In as Admin
            </Button>
            <Button onClick={() => router.push("/")}>Back to Home</Button>
          </Space>
        </div>

        {/* ✨ [ยัง render children เพื่อให้เห็น page structure] */}
        <div className="opacity-50 pointer-events-none">{children}</div>
      </div>
    );
  }

  // ✨ [ถ้าเป็น admin ให้ render children]
  return <>{children}</>;
}
