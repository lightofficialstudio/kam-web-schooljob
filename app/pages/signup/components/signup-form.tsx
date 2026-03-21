"use client";

import ResultModal from "@/app/components/layouts/modal/result-modal";
import { useTheme } from "@/app/contexts/theme-context";
import {
  BankOutlined,
  CheckCircleFilled,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
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

interface ModalState {
  open: boolean;
  type: "success" | "error" | "warning" | "info";
  mainTitle: string;
  description: string;
}

export default function SignupForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    type: "info",
    mainTitle: "",
    description: "",
  });
  const router = useRouter();
  const { token } = antTheme.useToken();
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const showModal = (
    type: "success" | "error" | "warning" | "info",
    mainTitle: string,
    description: string,
  ) => {
    setModal({ open: true, type, mainTitle, description });
  };

  const handleModalConfirm = () => {
    if (modal.type === "success") {
      router.push("/pages/signin");
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const roleMapping: Record<string, string> = {
        teacher: "EMPLOYEE",
        school: "EMPLOYER",
      };

      const payload = {
        email: values.email,
        password: values.password,
        full_name: `${values.firstName} ${values.lastName}`.trim(),
        role: roleMapping[values.role] || values.role.toUpperCase(),
      };

      const response = await fetch("/api/v1/authenticate/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message_th || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }

      showModal(
        "success",
        "สมัครสมาชิกสำเร็จ",
        result.message_th || "บัญชีของคุณได้สร้างเรียบร้อย",
      );
    } catch (err: any) {
      showModal(
        "error",
        "เกิดข้อผิดพลาด",
        err.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider>
      <ResultModal
        open={modal.open}
        type={modal.type}
        mainTitle={modal.mainTitle}
        description={modal.description}
        onConfirm={handleModalConfirm}
        onCancel={() => setModal({ ...modal, open: false })}
        confirmText="ตกลง"
        centered
        width={420}
      />
      <Card
        style={{
          maxWidth: 1200,
          width: "100%",
          borderRadius: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          overflow: "hidden",
          margin: "40px auto",
          border: `2px solid ${token.colorBorderSecondary || "#f0f0f0"}`,
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Row align="stretch">
          {/* 🎨 Branding Side */}
          <Col
            xs={0}
            lg={9}
            style={{
              padding: "60px 40px",
              background: isDark ? "#1A202C" : "#f8fbff",
              borderRight: `1px solid ${token.colorBorderSecondary || "#f0f0f0"}`,
            }}
          >
            <Space
              direction="vertical"
              size={48}
              style={{ height: "100%", justifyContent: "center" }}
            >
              <Space direction="vertical" size={24}>
                <Card
                  size="small"
                  variant="borderless"
                  style={{
                    width: 54,
                    height: 54,
                    padding: "0",
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#11b6f5",
                  }}
                >
                  <Title level={2} style={{ margin: 0, color: "#fff" }}>
                    S
                  </Title>
                </Card>
                <Title level={1}>
                  ก้าวสู่ <br /> อนาคตใหม่
                </Title>
                <Paragraph
                  style={{
                    fontSize: 17,
                    marginTop: 0,
                  }}
                >
                  แพลตฟอร์มที่เชื่อมต่อครูคุณภาพ <br />{" "}
                  กับสถานศึกษาชั้นนำทั่วประเทศ
                </Paragraph>
              </Space>

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
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <Text style={{ fontSize: 16 }}>{item.text}</Text>
                  </Space>
                ))}
              </Space>
            </Space>
          </Col>

          {/* 📝 Form Side */}
          <Col xs={24} lg={15} style={{ padding: "60px 80px" }}>
            <Space direction="vertical" size={40} style={{ width: "100%" }}>
              <Space direction="vertical" size={8}>
                <Title level={2}>ลงทะเบียนผู้ใช้งาน</Title>
                <Text type="secondary" style={{ fontSize: 18 }}>
                  มีบัญชีอยู่แล้ว?{" "}
                  <Link
                    href="/pages/signin"
                    style={{ fontWeight: 600, color: token.colorPrimary }}
                  >
                    เข้าสู่ระบบ
                  </Link>
                </Text>
              </Space>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark="optional"
                size="large"
                style={{ maxWidth: "100%" }}
              >
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="firstName"
                      label="ชื่อ"
                      rules={[{ required: true, message: "กรุณาระบุชื่อ" }]}
                    >
                      <Input
                        prefix={
                          <UserOutlined style={{ color: token.colorPrimary }} />
                        }
                        placeholder="กรอกชื่อของคุณ"
                        style={{ borderRadius: 12 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="lastName"
                      label="นามสกุล"
                      rules={[{ required: true, message: "กรุณาระบุนามสกุล" }]}
                    >
                      <Input
                        prefix={
                          <UserOutlined style={{ color: token.colorPrimary }} />
                        }
                        placeholder="กรอกนามสกุลของคุณ"
                        style={{ borderRadius: 12 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="role"
                  label="คุณสมัครใช้งานในฐานะ?"
                  initialValue="teacher"
                  rules={[{ required: true, message: "กรุณาเลือกบทบาท" }]}
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
                            padding: "32px 0",
                            textAlign: "center",
                            borderRadius: 20,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth: 2,
                            transition: "none",
                          }}
                        >
                          <Space direction="vertical" size={12}>
                            <UserOutlined
                              style={{
                                fontSize: 44,
                                color: token.colorPrimary,
                              }}
                            />
                            <Text strong style={{ fontSize: 18 }}>
                              ครูผู้สอน
                            </Text>
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
                            padding: "32px 0",
                            textAlign: "center",
                            borderRadius: 20,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth: 2,
                            transition: "none",
                          }}
                        >
                          <Space direction="vertical" size={12}>
                            <BankOutlined
                              style={{
                                fontSize: 44,
                                color: token.colorPrimary,
                              }}
                            />
                            <Text strong style={{ fontSize: 18 }}>
                              สถานศึกษา
                            </Text>
                          </Space>
                        </Radio.Button>
                      </Col>
                    </Row>
                  </Radio.Group>
                </Form.Item>

                <Divider style={{ margin: "40px 0" }}>
                  <Text type="secondary">ข้อมูลการติดต่อและรหัสผ่าน</Text>
                </Divider>

                <Form.Item
                  name="email"
                  label="อีเมล (ใช้เป็น Username)"
                  rules={[
                    { required: true, message: "กรุณาระบุอีเมล" },
                    { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง" },
                  ]}
                >
                  <Input
                    prefix={
                      <MailOutlined style={{ color: token.colorPrimary }} />
                    }
                    placeholder="example@email.com"
                    style={{ borderRadius: 12 }}
                  />
                </Form.Item>

                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="password"
                      label="รหัสผ่าน"
                      rules={[
                        { required: true, message: "กรุณาระบุรหัสผ่าน" },
                        {
                          min: 8,
                          message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={
                          <LockOutlined style={{ color: token.colorPrimary }} />
                        }
                        placeholder="อย่างน้อย 8 ตัวอักษร"
                        style={{ borderRadius: 12 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="confirm"
                      label="ยืนยันรหัสผ่านอีกครั้ง"
                      dependencies={["password"]}
                      rules={[
                        { required: true, message: "กรุณายืนยันรหัสผ่าน" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value)
                              return Promise.resolve();
                            return Promise.reject(
                              new Error("รหัสผ่านที่ป้อนไม่ตรงกัน"),
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        prefix={
                          <LockOutlined style={{ color: token.colorPrimary }} />
                        }
                        placeholder="กรอกรหัสผ่านอีกครั้ง"
                        style={{ borderRadius: 12 }}
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
                          : Promise.reject(
                              new Error("กรุณายอมรับข้อกำหนดและนโยบาย"),
                            ),
                    },
                  ]}
                  style={{ marginBottom: 32 }}
                >
                  <Checkbox>
                    ฉันยอมรับ{" "}
                    <Link
                      href="/terms"
                      style={{ fontWeight: 700, color: token.colorPrimary }}
                    >
                      ข้อกำหนดการใช้บริการ
                    </Link>{" "}
                    และ{" "}
                    <Link
                      href="/privacy"
                      style={{ fontWeight: 700, color: token.colorPrimary }}
                    >
                      นโยบายความเป็นส่วนตัว
                    </Link>
                  </Checkbox>
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    size="large"
                    style={{
                      height: 60,
                      borderRadius: 16,
                      boxShadow: `0 10px 20px ${token.colorPrimary}33`,
                    }}
                  >
                    <Title level={4} style={{ margin: 0, color: "#fff" }}>
                      สมัครสมาชิก
                    </Title>
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          </Col>
        </Row>
      </Card>
    </ConfigProvider>
  );
}
