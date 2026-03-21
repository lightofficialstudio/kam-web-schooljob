"use client";

import { UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Col, Row, Typography } from "antd";
import Link from "next/link";
import AccountSettingForm from "./components/account-setting-form";

const { Title, Text } = Typography;

export default function EmployerAccountSettingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        paddingBottom: "80px",
      }}
    >
      <div
        style={{
          padding: "24px 0",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          marginBottom: "40px",
        }}
      >
        <div
          style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 24px" }}
        >
          <Breadcrumb
            items={[
              { title: <Link href="/pages/employer/profile">หน้าแรก</Link> },
              { title: "ตั้งค่าบัญชี" },
            ]}
          />
          <div style={{ marginTop: "16px" }}>
            <Title level={2} style={{ margin: 0 }}>
              <UserOutlined style={{ marginRight: "12px" }} />
              ตั้งค่าบัญชี (นายจ้าง)
            </Title>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              จัดการข้อมูลส่วนตัว ความปลอดภัย และการเข้าสู่ระบบของคุณ
            </Text>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 24px" }}>
        <Row gutter={40} justify="center">
          <Col xs={24} lg={16}>
            <AccountSettingForm />
          </Col>
        </Row>
      </div>
    </div>
  );
}
