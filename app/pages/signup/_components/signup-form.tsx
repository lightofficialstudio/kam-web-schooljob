"use client";

import ResultModal from "@/app/components/layouts/modal/result-modal";
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
  const { isLoading, modal, setLoading, showModal, hideModal } = useSignupStore();

  const handleModalConfirm = () => {
    if (modal.type === "success") {
      router.push("/pages/signin");
    }
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
        "ตรวจสอบอีเมลของคุณ เพื่อยืนยันการสมัครสมาชิก",
        <Flex vertical align="center" style={{ marginTop: 12 }}>
          <Text style={{ marginBottom: 16, fontSize: 15, textAlign: "center" }}>
            School Board ได้ส่งอีเมลเพื่อยืนยันการสมัครสมาชิกไปที่ <br />
            <Text strong style={{ color: token.colorPrimary }}>
              {values.email}
            </Text>
          </Text>
          <Text type="secondary" style={{ fontSize: 14, lineHeight: "1.6", textAlign: "center" }}>
            หากไม่พบอีเมลจาก School Board ในกล่องจดหมาย <br />
            ให้ตรวจสอบที่ "อีเมลขยะ" หรือ "โปรโมชัน"
          </Text>
          <Text strong style={{ display: "block", marginTop: 16 }}>
            (และยืนยันการสมัครภายใน 72 ชม.)
          </Text>
        </Flex>
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
      <ResultModal
        open={modal.open}
        type={modal.type}
        mainTitle={modal.mainTitle}
        description={modal.description}
        onConfirm={handleModalConfirm}
        onCancel={hideModal}
        confirmText="ตกลง"
        centered
        width={650}
      />

      <Col xs={24} lg={16} style={{ padding: "60px 100px" }}>
        <Flex vertical gap={40}>
          <Flex vertical gap={8}>
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
          </Flex>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            size="large"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="ชื่อ"
                  rules={[{ required: true, message: "กรุณาระบุชื่อ" }]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: token.colorPrimary }} />}
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
                    prefix={<UserOutlined style={{ color: token.colorPrimary }} />}
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
                        <UserOutlined style={{ fontSize: 44, color: token.colorPrimary }} />
                        <Text strong style={{ fontSize: 18 }}>ครูผู้สอน</Text>
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
                        <BankOutlined style={{ fontSize: 44, color: token.colorPrimary }} />
                        <Text strong style={{ fontSize: 18 }}>สถานศึกษา</Text>
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
                prefix={<MailOutlined style={{ color: token.colorPrimary }} />}
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
                    { min: 8, message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: token.colorPrimary }} />}
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
                        return Promise.reject(new Error("รหัสผ่านที่ป้อนไม่ตรงกัน"));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: token.colorPrimary }} />}
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
                      : Promise.reject(new Error("กรุณายอมรับข้อกำหนดและนโยบาย")),
                },
              ]}
              style={{ marginBottom: 32 }}
            >
              <Checkbox>
                ฉันยอมรับ{" "}
                <Link href="/terms" style={{ fontWeight: 700, color: token.colorPrimary }}>
                  ข้อกำหนดการใช้บริการ
                </Link>{" "}
                และ{" "}
                <Link href="/privacy" style={{ fontWeight: 700, color: token.colorPrimary }}>
                  นโยบายความเป็นส่วนตัว
                </Link>
              </Checkbox>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
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
        </Flex>
      </Col>
    </>
  );
};
