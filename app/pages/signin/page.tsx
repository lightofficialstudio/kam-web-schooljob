"use client";

import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { App, Button, Card, ConfigProvider, Form, Input, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title, Text } = Typography;

export default function SigninForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { message } = App.useApp();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/authenticate/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        message.success(result.message_th);
        router.push("/");
        setTimeout(() => {
          router.refresh();
        }, 500);
      } else {
        throw new Error(result.message_th);
      }
    } catch (err: any) {
      message.error(err.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#0066FF", borderRadius: 12 },
        components: {
          Button: { controlHeightLG: 54, fontWeight: 600 },
          Input: { controlHeightLG: 54 },
        },
      }}
    >
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <Card
          style={{ maxWidth: 450, width: "100%", borderRadius: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}
          styles={{ body: { padding: 40 } }}
        >
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ background: "#0066FF", width: 48, height: 48, borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <span style={{ color: "white", fontWeight: "bold", fontSize: 24 }}>K</span>
            </div>
            <Title level={2} style={{ margin: 0, fontWeight: 700 }}>เข้าสู่ระบบ</Title>
            <Text type="secondary">ยินดีต้อนรับกลับมา! กรุณาลงชื่อเข้าใช้งาน</Text>
          </div>

          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item name="email" rules={[{ required: true, type: "email", message: "กรุณากรอกอีเมลที่ถูกต้อง" }]}>
              <Input prefix={<MailOutlined style={{ color: "#94A3B8" }} />} placeholder="อีเมล" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}>
              <Input.Password prefix={<LockOutlined style={{ color: "#94A3B8" }} />} placeholder="รหัสผ่าน" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block style={{ marginTop: 8 }}>เข้าสู่ระบบ</Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Text type="secondary">ยังไม่มีบัญชี? </Text>
            <Link href="/pages/signup" style={{ color: "#0066FF", fontWeight: 600 }}>สมัครสมาชิก</Link>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
}
