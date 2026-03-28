"use client";

import { Card, Flex, Row, theme as antTheme } from "antd";
import { BrandingPanel } from "./_components/branding-panel";
import { SignupForm } from "./_components/signup-form";

// Orchestrator — ประกอบ Layout และ Component ทั้งหมดของหน้า Signup
export default function SignupPage() {
  const { token } = antTheme.useToken();

  return (
    <Flex
      align="center"
      justify="center"
      style={{ width: "100%", minHeight: "100vh", padding: "40px 0" }}
    >
      <Card
        style={{
          maxWidth: 1400,
          width: "95%",
          borderRadius: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          overflow: "hidden",
          margin: "40px auto",
          border: `2px solid ${token.colorBorderSecondary}`,
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Row align="stretch">
          <BrandingPanel />
          <SignupForm />
        </Row>
      </Card>
    </Flex>
  );
}
