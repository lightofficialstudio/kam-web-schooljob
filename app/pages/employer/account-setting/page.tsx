"use client";

// ✨ หน้าตั้งค่าบัญชี Employer — ข้อมูลผู้ดูแล, เปลี่ยนรหัสผ่าน
import { SettingOutlined } from "@ant-design/icons";
import { Breadcrumb, Col, Row, Typography } from "antd";
import Link from "next/link";

import AccountSettingForm from "./components/account-setting-form";

const { Title, Text } = Typography;

export default function EmployerAccountSettingPage() {
  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      {/* ─── Header ─── */}
      <div
        style={{
          padding: "24px 0",
          borderBottom: "1px solid var(--ant-color-border-secondary)",
          marginBottom: 40,
        }}
      >
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>
          <Breadcrumb
            items={[
              { title: <Link href="/pages/employer/profile">หน้าแรก</Link> },
              { title: "ตั้งค่าบัญชี" },
            ]}
          />
          <div style={{ marginTop: 16 }}>
            <Title level={2} style={{ margin: 0 }}>
              <SettingOutlined style={{ marginRight: 12 }} />
              ตั้งค่าบัญชี
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              จัดการข้อมูลส่วนตัวผู้ดูแลระบบและความปลอดภัยของบัญชี
            </Text>
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>
        <Row justify="center">
          <Col xs={24} lg={16}>
            <AccountSettingForm />
          </Col>
        </Row>
      </div>
    </div>
  );
}
