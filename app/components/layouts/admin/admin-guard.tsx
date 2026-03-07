"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import { AlertOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Row, Space } from "antd";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

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
  const [isMounted, setIsMounted] = useState(false);

  // ✨ [รอให้ store hydrate จาก localStorage เสร็จ - ใช้ useEffect โดยไม่ suppress warning]
  useEffect(() => {
    // ✨ debounce mount check เพื่อให้ store hydrate ก่อน
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // ✨ [ถ้ากำลังรอ hydrate ให้ render children ปกติ]
  if (!isMounted) {
    return <>{children}</>;
  }

  // ✨ [ถ้า user ไม่ใช่ admin ให้แสดง warning]
  if (!user || user.role !== "ADMIN") {
    return (
      <Row gutter={[16, 16]} style={{ padding: "24px" }}>
        <Col xs={24}>
          <Alert
            message="⚠️ ห้ามเข้า"
            description={
              <>
                จำเป็นต้องเป็นผู้ดูแลระบบ (ADMIN) เพื่อเข้าถึงหน้านี้
                <br />
                บทบาทของคุณ: {user?.role || "ยังไม่ได้เข้าสู่ระบบ"}
              </>
            }
            type="warning"
            icon={<AlertOutlined />}
            showIcon
          />
        </Col>
        <Col xs={24}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <p style={{ margin: 0, color: "rgba(0,0,0,0.65)" }}>
              กรุณาเข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบเพื่อดำเนินการต่อ
            </p>
            <Space wrap>
              <Button
                type="primary"
                onClick={() => router.push("/pages/signin")}
              >
                เข้าสู่ระบบเป็นผู้ดูแล
              </Button>
              <Button onClick={() => router.push("/")}>กลับหน้าหลัก</Button>
            </Space>
          </Space>
        </Col>
        <Col xs={24} style={{ opacity: 0.5, pointerEvents: "none" }}>
          {children}
        </Col>
      </Row>
    );
  }

  // ✨ [ถ้าเป็น admin ให้ render children]
  return <>{children}</>;
}
