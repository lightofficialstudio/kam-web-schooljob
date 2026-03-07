"use client";

import { Space } from "antd";
import SignupForm from "./components/signup-form";

export default function SignupPage() {
  return (
    <Space direction="vertical" align="center" style={{ width: "100%", minHeight: "100vh", padding: "40px 0" }}>
      <SignupForm />
    </Space>
  );
}
