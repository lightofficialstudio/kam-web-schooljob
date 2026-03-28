"use client";

import { Card, ConfigProvider, Flex, Row } from "antd";
import { Suspense } from "react";
import { SigninBrandingPanel } from "./_components/signin-branding-panel";
import { SigninForm } from "./_components/signin-form";

// SigninForm ใช้ useSearchParams → ต้องอยู่ใน Suspense
function SigninPageContent() {
  return (
    <Flex align="center" justify="center" style={{ minHeight: "100vh", padding: "32px 16px" }}>
      <Card
        style={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
          border: "none",
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Row align="stretch">
          <SigninBrandingPanel />
          <SigninForm />
        </Row>
      </Card>
    </Flex>
  );
}

// Orchestrator — ครอบ ConfigProvider + Suspense
export default function SigninPage() {
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#11b6f5", borderRadius: 10 },
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
