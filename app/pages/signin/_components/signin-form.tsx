"use client";

import ResultModal from "@/app/components/layouts/modal/result-modal";
import { useAuthStore } from "@/app/stores/auth-store";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Space,
  Typography,
} from "antd";

// ใช้ค่าคงที่แทน PRIMARY เพื่อป้องกัน SSR/Client hydration mismatch
const PRIMARY = "#11b6f5";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { requestSignin } from "../_api/signin-api";
import { useSigninStore } from "../_state/signin-store";

const { Title, Text } = Typography;

// ฟอร์มเข้าสู่ระบบ — ใช้ Zustand สำหรับ loading/modal state
export const SigninForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { setUser } = useAuthStore();
  const { isLoading, modal, setLoading, showModal, hideModal } = useSigninStore();

  const handleModalConfirm = () => {
    if (modal.type !== "success") return;

    const { user } = useAuthStore.getState();

    // ✨ ถ้ามี redirect param → ใช้ค่านั้นก่อนเสมอ (เช่น กดฝากประวัติแล้วถูกกลับมา signin)
    if (redirectUrl) {
      const destination = decodeURIComponent(redirectUrl);
      console.log(`🔐 [SIGNIN] Redirecting to redirect param: ${destination}`);
      router.push(destination);
      setTimeout(() => router.refresh(), 500);
      return;
    }

    // ✨ Default redirect ตาม Role
    const ROLE_HOME: Record<string, string> = {
      EMPLOYEE: "/pages/employee/profile",
      EMPLOYER: "/pages/employer/profile",
      ADMIN: "/pages/admin",
    };

    const destinationUrl = ROLE_HOME[user?.role ?? ""] ?? "/";

    if (user?.role === "EMPLOYER" && user.is_first_login) {
      useAuthStore.getState().setFirstLogin(false);
    }

    console.log(`🔐 [SIGNIN] Redirecting to role home: ${destinationUrl}`);
    router.push(destinationUrl);
    setTimeout(() => router.refresh(), 500);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await requestSignin(values.email, values.password);
      const result = response.data;

      // บันทึก user info ลง Zustand store
      setUser({
        user_id: result.data.user_id,
        email: result.data.email,
        full_name: result.data.full_name,
        school_name: result.data.school_name || undefined, // ✨ ชื่อโรงเรียน — เฉพาะ EMPLOYER
        role: result.data.role,
        is_first_login: result.data.is_first_login || false,
        profile_image_url: result.data.profile_image_url || undefined,
      });

      showModal("success", "เข้าสู่ระบบสำเร็จ", result.message_th || "เข้าสู่ระบบเรียบร้อยแล้ว");
    } catch (err: any) {
      const message =
        err?.response?.data?.message_th ||
        err?.message ||
        "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
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
        width={420}
      />

      <Col xs={24} md={14} style={{ padding: "48px 48px" }}>
        <Flex vertical style={{ height: "100%" }} justify="center" gap={32}>

          {/* Header */}
          <Flex vertical gap={6}>
            <Title level={3} style={{ margin: 0 }}>เข้าสู่ระบบ</Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              กรอกข้อมูลเพื่อเข้าสู่แดชบอร์ดของคุณ
            </Text>
          </Flex>

          {/* Form */}
          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              name="email"
              label="อีเมล"
              rules={[{ required: true, type: "email", message: "กรุณากรอกอีเมลที่ถูกต้อง" }]}
            >
              <Input
                prefix={<MailOutlined style={{ color: PRIMARY }} />}
                placeholder="example@email.com"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="รหัสผ่าน"
              rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: PRIMARY }} />}
                placeholder="รหัสผ่านของคุณ"
              />
            </Form.Item>

            <Flex justify="flex-end" style={{ marginTop: -16, marginBottom: 12 }}>
              <Link
                href="/pages/forgot-password"
                style={{ fontSize: 13, color: PRIMARY, fontWeight: 500 }}
              >
                ลืมรหัสผ่าน?
              </Link>
            </Flex>

            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
                style={{
                  height: 52,
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 15,
                  boxShadow: `0 6px 20px ${PRIMARY}40`,
                }}
              >
                เข้าสู่ระบบ
              </Button>
            </Form.Item>
          </Form>

          {/* Divider + Register */}
          <Flex vertical gap={16}>
            <Divider style={{ margin: 0 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>หรือ</Text>
            </Divider>
            <Flex justify="center">
              <Space size={6}>
                <Text type="secondary" style={{ fontSize: 14 }}>ยังไม่มีบัญชี?</Text>
                <Link
                  href="/pages/signup"
                  style={{ fontWeight: 700, color: PRIMARY, fontSize: 14 }}
                >
                  สมัครสมาชิกฟรี
                </Link>
              </Space>
            </Flex>
          </Flex>

        </Flex>
      </Col>
    </>
  );
};
