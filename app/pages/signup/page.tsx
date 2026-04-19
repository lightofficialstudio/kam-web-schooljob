"use client";

import { Card, Flex, Row } from "antd";
import { BrandingPanel } from "./_components/branding-panel";
import { SignupForm } from "./_components/signup-form";

// ✨ Orchestrator — layout เท่านั้น ใช้ global theme โดยตรง
export default function SignupPage() {
  return (
    <Flex
      align="center"
      justify="center"
      style={{ width: "100%", minHeight: "100vh", padding: "32px 16px" }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 960,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          border: "none",
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
