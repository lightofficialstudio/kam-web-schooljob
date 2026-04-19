"use client";

import { Card, Flex, Row, theme as antTheme } from "antd";
import { Suspense } from "react";
import { SigninBrandingPanel } from "./_components/signin-branding-panel";
import { SigninForm } from "./_components/signin-form";

// ✨ SigninForm ใช้ useSearchParams → ต้องอยู่ใน Suspense
function SigninPageContent() {
  // ✨ ดึง token จาก global theme (รองรับ dark/light mode อัตโนมัติ)
  const { token } = antTheme.useToken();

  return (
    <Flex
      align="center"
      justify="center"
      style={{
        minHeight: "100vh",
        padding: "32px 16px",
        backgroundColor: token.colorBgLayout,
        // ✨ subtle radial glow ใช้ primary color จาก token
        backgroundImage: `
          radial-gradient(circle at 20% 20%, ${token.colorPrimaryBg} 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, ${token.colorFillQuaternary} 0%, transparent 50%)
        `,
        transition: "background-color 0.3s ease",
      }}
    >
      <Card
        className="signin-card"
        style={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 20,
          overflow: "hidden",
          // ✨ shadow ปรับตาม theme
          boxShadow: token.boxShadowSecondary,
          border: `1px solid ${token.colorBorderSecondary}`,
          backgroundColor: token.colorBgContainer,
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Row align="stretch" style={{ minHeight: 540 }}>
          <SigninBrandingPanel />
          <SigninForm />
        </Row>
      </Card>
    </Flex>
  );
}

// ✨ ลบ ConfigProvider ออก — global theme-context.tsx จัดการ colorPrimary, fontFamily, dark/light mode ครบแล้ว
export default function SigninPage() {
  return (
    <Suspense fallback={null}>
      <SigninPageContent />
    </Suspense>
  );
}
