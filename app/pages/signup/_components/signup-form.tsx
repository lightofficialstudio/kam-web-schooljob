"use client";

import { ModalComponent } from "@/app/components/modal/modal.component";
import {
  ArrowLeftOutlined,
  BankOutlined,
  CheckCircleOutlined,
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
  Row,
  Typography,
  theme as antTheme,
} from "antd";
import Link from "next/link";
import { type SignupPayload, requestSignup } from "../_api/signup-api";
import type { SignupRole } from "../_state/signup-store";
import { useSignupStore } from "../_state/signup-store";

const { Title, Text } = Typography;

// ✨ ข้อมูล role card — เพิ่ม role ใหม่ได้ที่นี่
const ROLE_OPTIONS: {
  value: SignupRole;
  icon: React.ReactNode;
  label: string;
  description: string;
  gradient: string;
  hoverBorder: string;
  hoverShadow: string;
}[] = [
  {
    value: "teacher",
    icon: <UserOutlined style={{ fontSize: 26 }} />,
    label: "ครูผู้สอน",
    description: "ค้นหางาน สมัครตำแหน่ง และสร้างโปรไฟล์ครูมืออาชีพ",
    gradient: "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 100%)",
    hoverBorder: "#11b6f5",
    hoverShadow: "0 8px 32px rgba(17,182,245,0.22)",
  },
  {
    value: "school",
    icon: <BankOutlined style={{ fontSize: 26 }} />,
    label: "สถานศึกษา",
    description: "ประกาศรับสมัครครู จัดการโปรไฟล์โรงเรียน และคัดกรองผู้สมัคร",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    hoverBorder: "#a855f7",
    hoverShadow: "0 8px 32px rgba(168,85,247,0.22)",
  },
];

// ✨ field ที่ต้องการตาม role — เพิ่ม/แก้ field เฉพาะ role ได้ที่นี่
interface CommonFields {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
  agreement: boolean;
}

// ✨ placeholder สำหรับ role-specific fields ในอนาคต
type TeacherFields = CommonFields & { _role: "teacher" };
type SchoolFields = CommonFields & { _role: "school" };
type SignupFormValues = TeacherFields | SchoolFields;

// ✨ Step 1 — เลือก role ก่อนสมัคร
const RoleSelectStep = () => {
  const { token } = antTheme.useToken();
  const { setRole, setStep } = useSignupStore();

  const handleSelect = (role: SignupRole) => {
    setRole(role);
    setStep(2);
  };

  return (
    <Col
      xs={24}
      md={15}
      className="signup-step-1"
      style={{ padding: "40px 48px" }}
    >
      <Flex vertical gap={28}>
        {/* ✨ Header */}
        <Flex vertical gap={4}>
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
            คุณต้องการสมัครในฐานะอะไร?
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            เลือกประเภทบัญชีที่ตรงกับคุณ เพื่อประสบการณ์ที่เหมาะสมที่สุด
          </Text>
        </Flex>

        <Text type="secondary" style={{ fontSize: 13 }}>
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            href="/pages/signin"
            className="transition-opacity hover:opacity-70"
            style={{ fontWeight: 600, color: token.colorPrimary }}
          >
            เข้าสู่ระบบ
          </Link>
        </Text>

        {/* ✨ role cards */}
        <Flex vertical gap={14}>
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="signup-role-card"
              style={{
                all: "unset",
                cursor: "pointer",
                display: "block",
                width: "100%",
              }}
            >
              <Flex
                align="center"
                gap={20}
                className="signup-role-card-inner"
                style={{
                  padding: "18px 22px",
                  borderRadius: token.borderRadiusLG + 4,
                  border: `1.5px solid ${token.colorBorderSecondary}`,
                  background: token.colorBgContainer,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = opt.hoverBorder;
                  el.style.boxShadow = opt.hoverShadow;
                  el.style.background = token.colorBgLayout;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = token.colorBorderSecondary;
                  el.style.boxShadow = "none";
                  el.style.background = token.colorBgContainer;
                }}
              >
                {/* ✨ icon */}
                <Flex
                  align="center"
                  justify="center"
                  className="signup-role-icon"
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 14,
                    background: opt.gradient,
                    color: "#fff",
                    flexShrink: 0,
                    boxShadow: `0 4px 14px rgba(0,0,0,0.14)`,
                  }}
                >
                  {opt.icon}
                </Flex>

                <Flex vertical gap={2} style={{ flex: 1 }}>
                  <Text strong style={{ fontSize: 15, color: token.colorText }}>
                    {opt.label}
                  </Text>
                  <Text
                    type="secondary"
                    style={{ fontSize: 13, lineHeight: 1.55 }}
                  >
                    {opt.description}
                  </Text>
                </Flex>

                {/* ✨ arrow */}
                <span
                  className="signup-role-arrow"
                  style={{
                    color: token.colorTextTertiary,
                    fontSize: 18,
                    lineHeight: 1,
                  }}
                >
                  →
                </span>
              </Flex>
            </button>
          ))}
        </Flex>
      </Flex>
    </Col>
  );
};

// ✨ Step 2 — กรอกข้อมูล (แยกตาม role ในอนาคตได้ที่นี่)
const DetailsFormStep = () => {
  const [form] = Form.useForm<SignupFormValues>();
  const { token } = antTheme.useToken();
  const {
    role,
    isLoading,
    modal,
    setLoading,
    setStep,
    setRegisteredEmail,
    showModal,
    hideModal,
  } = useSignupStore();

  const selectedRole = ROLE_OPTIONS.find((o) => o.value === role);

  const onFinish = async (values: SignupFormValues) => {
    setLoading(true);
    try {
      const payload: SignupPayload = {
        email: values.email,
        password: values.password,
        first_name: values.firstName,
        last_name: values.lastName,
        role: role!,
      };
      await requestSignup(payload);
      setRegisteredEmail(values.email);
      setStep(3);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message_th?: string } };
        message?: string;
      };
      const message =
        axiosErr?.response?.data?.message_th ||
        axiosErr?.message ||
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
        onConfirm={undefined}
        confirmLabel="ตกลง"
      />

      <Col
        xs={24}
        md={15}
        className="signup-step-2"
        style={{ padding: "40px 48px" }}
      >
        <Flex vertical gap={20}>
          {/* ✨ back button */}
          <button
            onClick={() => setStep(1)}
            className="signup-back-btn"
            style={{
              all: "unset",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: token.colorTextTertiary,
              fontSize: 13,
              width: "fit-content",
            }}
          >
            <ArrowLeftOutlined />
            เปลี่ยนประเภทบัญชี
          </button>

          {/* ✨ header */}
          <Flex vertical gap={6}>
            <Flex align="center" gap={12}>
              {selectedRole && (
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: selectedRole.gradient,
                    color: "#fff",
                    fontSize: 18,
                    flexShrink: 0,
                    boxShadow: `0 4px 14px rgba(0,0,0,0.14)`,
                  }}
                >
                  {selectedRole.icon}
                </Flex>
              )}
              <Flex vertical gap={1}>
                <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                  สร้างบัญชี
                  {selectedRole?.label ? (
                    <span style={{ color: token.colorPrimary }}>
                      {" "}
                      — {selectedRole.label}
                    </span>
                  ) : null}
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  มีบัญชีอยู่แล้ว?{" "}
                  <Link
                    href="/pages/signin"
                    className="transition-opacity hover:opacity-70"
                    style={{ fontWeight: 600, color: token.colorPrimary }}
                  >
                    เข้าสู่ระบบ
                  </Link>
                </Text>
              </Flex>
            </Flex>
          </Flex>

          {/* ✨ form */}
          <Form form={form} layout="vertical" onFinish={onFinish} size="large">
            <div className="signup-field">
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
            </div>

            <div className="signup-field">
              <Divider style={{ margin: "4px 0 20px" }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  อีเมลและรหัสผ่าน
                </Text>
              </Divider>
            </div>

            <div className="signup-field">
              <Form.Item
                name="email"
                label="อีเมล"
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
                />
              </Form.Item>
            </div>

            <div className="signup-field">
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
            </div>

            <div className="signup-field">
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
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                size="large"
                className="signup-submit-btn"
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

// ✨ Step 3 — สำเร็จ! ย้ำเตือนให้เช็กอีเมล
const SuccessStep = () => {
  const { token } = antTheme.useToken();
  const { registeredEmail, role } = useSignupStore();
  const selectedRole = ROLE_OPTIONS.find((o) => o.value === role);

  return (
    <Col
      xs={24}
      md={15}
      className="signup-step-2"
      style={{ padding: "40px 48px" }}
    >
      <Flex
        vertical
        align="center"
        justify="center"
        gap={0}
        style={{ minHeight: 400, textAlign: "center" }}
      >
        {/* ✨ success icon */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px rgba(17,182,245,0.35)",
            marginBottom: 28,
            animation: "signupCardPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          <CheckCircleOutlined style={{ fontSize: 40, color: "#fff" }} />
        </div>

        {/* ✨ title */}
        <Flex vertical gap={8} align="center" style={{ marginBottom: 28 }}>
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
            สมัครสำเร็จ 🎉
          </Title>
          {selectedRole && (
            <span
              style={{
                display: "inline-block",
                padding: "3px 14px",
                borderRadius: 99,
                background: selectedRole.gradient,
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {selectedRole.label}
            </span>
          )}
          <Text
            type="secondary"
            style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 360 }}
          >
            บัญชีของคุณถูกสร้างเรียบร้อยแล้ว
          </Text>
        </Flex>

        {/* ✨ email reminder card */}
        <div
          style={{
            width: "100%",
            maxWidth: 380,
            padding: "20px 24px",
            borderRadius: token.borderRadiusLG + 4,
            border: `1.5px solid ${token.colorPrimaryBorder}`,
            background: token.colorPrimaryBg,
            marginBottom: 32,
            textAlign: "left",
          }}
        >
          <Flex gap={12} align="flex-start">
            <MailOutlined
              style={{
                fontSize: 20,
                color: token.colorPrimary,
                flexShrink: 0,
                marginTop: 2,
              }}
            />
            <Flex vertical gap={4}>
              <Text strong style={{ fontSize: 14, color: token.colorText }}>
                ตรวจสอบอีเมลของคุณ
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: token.colorPrimary,
                  fontWeight: 600,
                }}
              >
                {registeredEmail}
              </Text>
              <Text
                type="secondary"
                style={{ fontSize: 12, lineHeight: 1.6, marginTop: 2 }}
              >
                เราได้ส่งลิงก์ยืนยันไปแล้ว —
                กรุณาคลิกลิงก์ในอีเมลเพื่อยืนยันตัวตน{" "}
                <Text strong style={{ fontSize: 12, color: token.colorText }}>
                  ไม่พบอีเมล?
                </Text>{" "}
                ตรวจโฟลเดอร์ “สแปม” ลิงก์มีอายุ 72 ชั่วโมง
              </Text>
            </Flex>
          </Flex>
        </div>

        {/* ✨ login button */}
        <div style={{ width: "100%", maxWidth: 380 }}>
          <Link href="/pages/signin" style={{ display: "block" }}>
            <Button
              type="primary"
              block
              size="large"
              className="signup-submit-btn"
              style={{
                height: 52,
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 16,
                boxShadow: `0 6px 20px ${token.colorPrimary}40`,
              }}
            >
              เข้าสู่ระบบ
            </Button>
          </Link>
        </div>
      </Flex>
    </Col>
  );
};

// ✨ ฟอร์มสมัครสมาชิก — สองขั้นตอน: เลือก role → กรอกข้อมูล
export const SignupForm = () => {
  const { step } = useSignupStore();

  if (step === 1) return <RoleSelectStep />;
  if (step === 3) return <SuccessStep />;
  return <DetailsFormStep />;
};
