"use client";

import { Card, ConfigProvider, Flex, Row } from "antd";
import { Suspense } from "react";
import { SigninBrandingPanel } from "./_components/signin-branding-panel";
import { SigninForm } from "./_components/signin-form";

// ✨ SigninForm ใช้ useSearchParams → ต้องอยู่ใน Suspense
function SigninPageContent() {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        minHeight: "100vh",
        padding: "32px 16px",
        // ✨ subtle dot pattern background
        background: `
          radial-gradient(circle at 20% 20%, rgba(17,182,245,0.07) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(17,182,245,0.05) 0%, transparent 50%)
        `,
      }}
    >
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .signin-card { animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <Card
        className="signin-card"
        style={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.06)",
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

export default function SigninPage() {
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#11b6f5", borderRadius: 10, fontFamily: "Kanit, sans-serif" },
        components: {
          Button: { controlHeightLG: 52 },
          Input: { controlHeightLG: 52 },
        },
      }}
    >
      <Suspense fallback={null}>
        <SigninPageContent />
      </Suspense>
    </ConfigProvider>
  );
}
