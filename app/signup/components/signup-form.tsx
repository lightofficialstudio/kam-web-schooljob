"use client";

import { supabase } from "@/app/lib/supabase";
import {
  BankOutlined,
  CheckCircleFilled,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Checkbox,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Space,
  Typography,
  theme as antTheme,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title, Text, Paragraph } = Typography;

export default function SignupForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { message } = App.useApp();
  const { token } = antTheme.useToken();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { email, password, role } = values;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            full_name: values.fullName || "",
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      message.success("สมัครสมาชิกสำเร็จ! กรุณาเช็คอีเมลเพื่อยืนยันตัวตน");
      router.push("/signup/success");
    } catch (err: any) {
      message.error(err.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Radio: {
            buttonBg: "#F8FAFC",
            buttonCheckedBg: "#0066FF",
            colorText: "#64748B",
          },
        },
      }}
    >
      <Card
        variant="borderless"
        style={{
          maxWidth: 1100,
          width: "100%",
          borderRadius: token.borderRadiusLG * 2,
          boxShadow: "0 40px 80px -20px rgba(0,0,0,0.08)",
          overflow: "hidden",
          margin: "80px auto",
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Row align="stretch">
          {/* 🎨 Branding Side */}
          <Col
            xs={0}
            lg={10}
            style={{ background: token.colorPrimary, padding: 60 }}
          >
            <Space
              direction="vertical"
              size={48}
              style={{ height: "100%", justifyContent: "center" }}
            >
              <div>
                <div
                  style={{
                    background: "white",
                    width: 54,
                    height: 54,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  <Title
                    level={2}
                    style={{ color: token.colorPrimary, margin: 0 }}
                  >
                    K
                  </Title>
                </div>
                <Title
                  level={1}
                  style={{
                    color: "white",
                    margin: 0,
                    fontSize: 38,
                    fontWeight: 800,
                  }}
                >
                  ก้าวสู่ <br /> อนาคตใหม่
                </Title>
                <Paragraph
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 17,
                    marginTop: 16,
                  }}
                >
                  แพลตฟอร์มที่เชื่อมต่อครูคุณภาพ <br />{" "}
                  กับสถานศึกษาชั้นนำทั่วประเทศ
                </Paragraph>
              </div>

              <Space direction="vertical" size={24}>
                {[
                  {
                    icon: <CheckCircleFilled />,
                    text: "ระบบจับคู่ตามวิชาเอกที่แม่นยำ",
                  },
                  {
                    icon: <CheckCircleFilled />,
                    text: "สมัครงานง่ายในคลิกเดียว",
                  },
                  {
                    icon: <CheckCircleFilled />,
                    text: "ลงประกาศงานฟรีสำหรับโรงเรียน",
                  },
                ].map((item, i) => (
                  <Space key={i} align="start">
                    <span style={{ color: "#10B981", fontSize: 20 }}>
                      {item.icon}
                    </span>
                    <Text style={{ color: "white", fontSize: 16 }}>
                      {item.text}
                    </Text>
                  </Space>
                ))}
              </Space>
            </Space>
          </Col>

          {/* 📝 Form Side */}
          <Col
            xs={24}
            lg={14}
            style={{ padding: "60px 80px", background: "white" }}
          >
            <div style={{ marginBottom: 40 }}>
              <Title level={2} style={{ marginBottom: 8, fontWeight: 700 }}>
                ลงทะเบียนผู้ใช้งาน
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                มีบัญชีอยู่แล้ว?{" "}
                <Link
                  href="/login"
                  style={{ color: token.colorPrimary, fontWeight: 600 }}
                >
                  เข้าสู่ระบบ
                </Link>
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              size="large"
            >
              <Form.Item
                name="role"
                initialValue="teacher"
                rules={[{ required: true }]}
              >
                <Radio.Group style={{ width: "100%" }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Radio.Button
                        value="teacher"
                        className="role-selection-button"
                        style={{
                          width: "100%",
                          height: "auto",
                          padding: "24px 0",
                          textAlign: "center",
                          borderRadius: token.borderRadiusLG,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: 1.5,
                        }}
                      >
                        <Space direction="vertical" size={4}>
                          <UserOutlined style={{ fontSize: 24 }} />
                          <div style={{ fontWeight: 600 }}>ครูผู้สอน</div>
                        </Space>
                      </Radio.Button>
                    </Col>
                    <Col span={12}>
                      <Radio.Button
                        value="school"
                        className="role-selection-button"
                        style={{
                          width: "100%",
                          height: "auto",
                          padding: "24px 0",
                          textAlign: "center",
                          borderRadius: token.borderRadiusLG,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: 1.5,
                        }}
                      >
                        <Space direction="vertical" size={4}>
                          <BankOutlined style={{ fontSize: 24 }} />
                          <div style={{ fontWeight: 600 }}>สถานศึกษา</div>
                        </Space>
                      </Radio.Button>
                    </Col>
                  </Row>
                </Radio.Group>
              </Form.Item>

              <Divider style={{ margin: "32px 0" }}>ข้อมูลบัญชี</Divider>

              <Form.Item
                name="email"
                label={<Text strong>อีเมลสมัครใช้งาน</Text>}
                rules={[
                  { required: true, message: "กรุณาระบุอีเมล" },
                  { type: "email", message: "อีเมลไม่ถูกต้อง" },
                ]}
              >
                <Input
                  prefix={
                    <MailOutlined
                      style={{ color: token.colorTextDescription }}
                    />
                  }
                  placeholder="name@domain.com"
                  variant="filled"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="password"
                    label={<Text strong>รหัสผ่าน</Text>}
                    rules={[
                      { required: true, message: "กรุณาระบุรหัสผ่าน" },
                      { min: 8, message: "ต้องมีอย่างน้อย 8 ตัวอักษร" },
                    ]}
                  >
                    <Input.Password
                      prefix={
                        <LockOutlined
                          style={{ color: token.colorTextDescription }}
                        />
                      }
                      placeholder="••••••••"
                      variant="filled"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="confirm"
                    label={<Text strong>ยืนยันรหัสผ่าน</Text>}
                    dependencies={["password"]}
                    rules={[
                      { required: true, message: "กรุณายืนยันรหัสผ่าน" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value)
                            return Promise.resolve();
                          return Promise.reject(new Error("รหัสผ่านไม่ตรงกัน"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={
                        <LockOutlined
                          style={{ color: token.colorTextDescription }}
                        />
                      }
                      placeholder="••••••••"
                      variant="filled"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error("กรุณายอมรับเงื่อนไข")),
                  },
                ]}
              >
                <Checkbox>ยอมรับเงื่อนไขการใช้บริการ</Checkbox>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{
                  height: 56,
                  borderRadius: token.borderRadiusLG,
                  fontWeight: 700,
                }}
              >
                สร้างบัญชีผู้ใช้งาน
              </Button>
            </Form>
          </Col>
        </Row>
      </Card>

      <style jsx global>{`
        .role-selection-button.ant-radio-button-wrapper-checked {
          border-color: ${token.colorPrimary} !important;
          background: ${token.colorPrimary}08 !important;
        }
        .role-selection-button::before {
          display: none !important;
        }
      `}</style>
    </ConfigProvider>
  );
}
