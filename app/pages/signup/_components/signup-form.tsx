"use client";

import { ModalComponent } from "@/app/components/modal/modal.component";
import {
  ArrowLeftOutlined,
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
  Row,
  Typography,
  theme as antTheme,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
}[] = [
  {
    value: "teacher",
    icon: <UserOutlined style={{ fontSize: 28 }} />,
    label: "ครูผู้สอน",
    description: "ค้นหางาน สมัครตำแหน่ง และสร้างโปรไฟล์ครูมืออาชีพ",
    gradient: "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 100%)",
  },
  {
    value: "school",
    icon: <BankOutlined style={{ fontSize: 28 }} />,
    label: "สถานศึกษา",
    description: "ประกาศรับสมัครครู จัดการโปรไฟล์โรงเรียน และคัดกรองผู้สมัคร",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
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
    <Col xs={24} md={15} style={{ padding: "40px 48px" }}>
      <Flex vertical gap={32}>
        {/* Header */}
        <Flex vertical gap={4}>
          <Title level={3} style={{ margin: 0 }}>
            สมัครสมาชิก
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

        {/* ✨ step indicator */}
        <Flex vertical gap={4}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: token.colorTextTertiary,
            }}
          >
            ขั้นตอนที่ 1 / 2
          </Text>
          <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
            คุณต้องการสมัครในฐานะอะไร?
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            เลือกประเภทบัญชีที่ตรงกับคุณ เพื่อประสบการณ์ที่เหมาะสมที่สุด
          </Text>
        </Flex>

        {/* ✨ role cards */}
        <Flex vertical gap={16}>
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
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
                style={{
                  padding: "20px 24px",
                  borderRadius: token.borderRadiusLG,
                  border: `1.5px solid ${token.colorBorderSecondary}`,
                  background: token.colorBgContainer,
                  transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = token.colorPrimaryBorder;
                  el.style.boxShadow = `0 6px 24px ${token.colorPrimaryBg}`;
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = token.colorBorderSecondary;
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                }}
              >
                {/* ✨ icon circle */}
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: opt.gradient,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {opt.icon}
                </Flex>

                <Flex vertical gap={2} style={{ flex: 1 }}>
                  <Text strong style={{ fontSize: 15, color: token.colorText }}>
                    {opt.label}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.5 }}>
                    {opt.description}
                  </Text>
                </Flex>

                {/* ✨ arrow */}
                <Text style={{ color: token.colorTextTertiary, fontSize: 18 }}>
                  →
                </Text>
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
  const router = useRouter();
  const { token } = antTheme.useToken();
  const { role, isLoading, modal, setLoading, setStep, showModal, hideModal } =
    useSignupStore();

  const selectedRole = ROLE_OPTIONS.find((o) => o.value === role);

  const handleModalConfirm = () => {
    if (modal.type === "success") router.push("/pages/signin");
  };

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

      showModal(
        "success",
        "ตรวจสอบอีเมลของคุณ",
        `ได้ส่งลิงก์ยืนยันไปที่ ${values.email} แล้ว — ไม่พบอีเมล? ตรวจสอบโฟลเดอร์ "สแปม" ลิงก์มีอายุ 72 ชั่วโมง`,
      );
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
        onConfirm={modal.type === "success" ? handleModalConfirm : undefined}
        confirmLabel="ตกลง"
      />

      <Col xs={24} md={15} style={{ padding: "40px 48px" }}>
        <Flex vertical gap={24}>
          {/* ✨ back + header */}
          <Flex vertical gap={4}>
            <button
              onClick={() => setStep(1)}
              style={{
                all: "unset",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: token.colorTextTertiary,
                fontSize: 13,
                marginBottom: 8,
                width: "fit-content",
              }}
            >
              <ArrowLeftOutlined />
              เปลี่ยนประเภทบัญชี
            </button>

            <Flex align="center" gap={10}>
              {/* ✨ role badge */}
              {selectedRole && (
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: selectedRole.gradient,
                    color: "#fff",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {selectedRole.icon}
                </Flex>
              )}
              <Title level={3} style={{ margin: 0 }}>
                สร้างบัญชี{selectedRole?.label ? ` — ${selectedRole.label}` : ""}
              </Title>
            </Flex>

            <Flex align="center" gap={8}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: token.colorTextTertiary,
                }}
              >
                ขั้นตอนที่ 2 / 2
              </Text>
              <Text type="secondary" style={{ fontSize: 13 }}>
                มีบัญชีอยู่แล้ว?{" "}
                <Link
                  href="/pages/signin"
                  style={{ fontWeight: 600, color: token.colorPrimary }}
                >
                  เข้าสู่ระบบ
                </Link>
              </Text>
            </Flex>
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
                    prefix={<UserOutlined style={{ color: token.colorPrimary }} />}
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
                    prefix={<UserOutlined style={{ color: token.colorPrimary }} />}
                    placeholder="นามสกุลของคุณ"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: "4px 0 20px" }}>
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
                    prefix={<LockOutlined style={{ color: token.colorPrimary }} />}
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
                    prefix={<LockOutlined style={{ color: token.colorPrimary }} />}
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
                      : Promise.reject(new Error("กรุณายอมรับข้อกำหนดและนโยบาย")),
                },
              ]}
              style={{ marginBottom: 20 }}
            >
              <Checkbox style={{ fontSize: 13 }}>
                ฉันยอมรับ{" "}
                <Link href="/terms" style={{ color: token.colorPrimary, fontWeight: 600 }}>
                  ข้อกำหนดการใช้บริการ
                </Link>{" "}
                และ{" "}
                <Link href="/privacy" style={{ color: token.colorPrimary, fontWeight: 600 }}>
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

// ✨ ฟอร์มสมัครสมาชิก — สองขั้นตอน: เลือก role → กรอกข้อมูล
export const SignupForm = () => {
  const { step } = useSignupStore();

  if (step === 1) return <RoleSelectStep />;
  return <DetailsFormStep />;
};
