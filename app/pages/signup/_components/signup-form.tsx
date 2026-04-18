"use client";

import { ModalComponent } from "@/app/components/modal/modal.component";
import {
  BankOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Flex,
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
import { requestSignup } from "../_api/signup-api";
import { useSignupStore } from "../_state/signup-store";

const { Title, Text } = Typography;

const ROLE_MAP: Record<string, string> = {
  teacher: "EMPLOYEE",
  school: "EMPLOYER",
};

// ฟอร์มสมัครสมาชิก — ใช้ Zustand สำหรับ loading/modal state
export const SignupForm = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { token } = antTheme.useToken();
  const { isLoading, modal, setLoading, showModal, hideModal } =
    useSignupStore();

  const handleModalConfirm = () => {
    if (modal.type === "success") router.push("/pages/signin");
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        email: values.email,
        password: values.password,
        full_name: `${values.firstName} ${values.lastName}`.trim(),
        role: ROLE_MAP[values.role] || values.role.toUpperCase(),
      };

      await requestSignup(payload);

      showModal(
        "success",
        "ตรวจสอบอีเมลของคุณ",
        <Flex vertical align="center" style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 15, textAlign: "center", marginBottom: 12 }}>
            School Board ได้ส่งลิงก์ยืนยันไปที่{" "}
            <Text strong style={{ color: token.colorPrimary }}>
              {values.email}
            </Text>
          </Text>
          <Text
            type="secondary"
            style={{ fontSize: 13, textAlign: "center", lineHeight: "1.7" }}
          >
            ไม่พบอีเมล? ตรวจสอบโฟลเดอร์ "สแปม" หรือ "โปรโมชัน" <br />
            ลิงก์มีอายุ 72 ชั่วโมง
          </Text>
        </Flex>,
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.message_th ||
        err?.message ||
        "เกิดข้อผิดพลาดในการสมัครสมาชิก";
      showModal("error", "เกิดข้อผิดพลาด", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ModalComponent
        open={modal.open}
        type={modal.type as "success" | "error" | "confirm" | "delete"}
        title={modal.mainTitle}
        description={modal.description}
        onClose={hideModal}
        onConfirm={modal.type === "success" ? handleModalConfirm : undefined}
        confirmLabel="ตกลง"
      />

      <Col xs={24} md={15} style={{ padding: "40px 48px" }}>
        <Flex vertical gap={28}>
          {/* Header */}
          <Flex vertical gap={4}>
            <Title level={3} style={{ margin: 0 }}>
              สร้างบัญชีใหม่
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              มีบัญชีอยู่แล้ว?{" "}
              <Link
                href="/pages/signin"
                style={{ fontWeight: 600, color: token.colorPrimary }}
              >
                เข้าสู่ระบบ
              </Link>
            </Text>
          </Flex>

          <Form form={form} layout="vertical" onFinish={onFinish} size="large">
            {/* ชื่อ - นามสกุล */}
            <Row gutter={16}>
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
                    placeholder="ชื่อของคุณ"
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
                    placeholder="นามสกุลของคุณ"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Role Selection */}
            <Form.Item
              name="role"
              label="สมัครในฐานะ"
              initialValue="teacher"
              rules={[{ required: true, message: "กรุณาเลือกบทบาท" }]}
            >
              <Radio.Group style={{ width: "100%" }}>
                <Row gutter={12}>
                  <Col span={12}>
                    <Radio.Button
                      value="teacher"
                      style={{
                        width: "100%",
                        height: "auto",
                        padding: "16px 0",
                        textAlign: "center",
                        borderRadius: 12,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 2,
                      }}
                    >
                      <Space orientation="vertical" size={6}>
                        <UserOutlined
                          style={{ fontSize: 28, color: token.colorPrimary }}
                        />
                        <Text strong style={{ fontSize: 14 }}>
                          ครูผู้สอน
                        </Text>
                      </Space>
                    </Radio.Button>
                  </Col>
                  <Col span={12}>
                    <Radio.Button
                      value="school"
                      style={{
                        width: "100%",
                        height: "auto",
                        padding: "16px 0",
                        textAlign: "center",
                        borderRadius: 12,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 2,
                      }}
                    >
                      <Space orientation="vertical" size={6}>
                        <BankOutlined
                          style={{ fontSize: 28, color: token.colorPrimary }}
                        />
                        <Text strong style={{ fontSize: 14 }}>
                          สถานศึกษา
                        </Text>
                      </Space>
                    </Radio.Button>
                  </Col>
                </Row>
              </Radio.Group>
            </Form.Item>

            <Divider style={{ margin: "20px 0" }}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                อีเมลและรหัสผ่าน
              </Text>
            </Divider>

            {/* Email */}
            <Form.Item
              name="email"
              label="อีเมล"
              rules={[
                { required: true, message: "กรุณาระบุอีเมล" },
                { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: token.colorPrimary }} />}
                placeholder="example@email.com"
              />
            </Form.Item>

            {/* Password */}
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="password"
                  label="รหัสผ่าน"
                  rules={[
                    { required: true, message: "กรุณาระบุรหัสผ่าน" },
                    { min: 8, message: "อย่างน้อย 8 ตัวอักษร" },
                  ]}
                >
                  <Input.Password
                    prefix={
                      <LockOutlined style={{ color: token.colorPrimary }} />
                    }
                    placeholder="อย่างน้อย 8 ตัวอักษร"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="confirm"
                  label="ยืนยันรหัสผ่าน"
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
                      <LockOutlined style={{ color: token.colorPrimary }} />
                    }
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Agreement */}
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
              style={{ marginBottom: 20 }}
            >
              <Checkbox style={{ fontSize: 13 }}>
                ฉันยอมรับ{" "}
                <Link
                  href="/terms"
                  style={{ color: token.colorPrimary, fontWeight: 600 }}
                >
                  ข้อกำหนดการใช้บริการ
                </Link>{" "}
                และ{" "}
                <Link
                  href="/privacy"
                  style={{ color: token.colorPrimary, fontWeight: 600 }}
                >
                  นโยบายความเป็นส่วนตัว
                </Link>
              </Checkbox>
            </Form.Item>

            {/* Submit */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                size="large"
                style={{
                  height: 52,
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: `0 6px 20px ${token.colorPrimary}40`,
                }}
              >
                สร้างบัญชี
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Col>
    </>
  );
};
