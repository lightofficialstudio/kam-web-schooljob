"use client";

import { Card, ConfigProvider, Flex, Row } from "antd";
import { BrandingPanel } from "./_components/branding-panel";
import { SignupForm } from "./_components/signup-form";

const PRIMARY_COLOR = "#11b6f5";

// Orchestrator — ครอบ ConfigProvider เพื่อ inject primary color #11b6f5
export default function SignupPage() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: PRIMARY_COLOR,
          borderRadius: 10,
        },
      }}
    >
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
    </ConfigProvider>
  );
}
