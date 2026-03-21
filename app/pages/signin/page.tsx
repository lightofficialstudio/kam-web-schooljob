"use client";

import ResultModal from "@/app/components/layouts/modal/result-modal";
import { useAuthStore } from "@/app/stores/auth-store";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  ConfigProvider,
  Form,
  Input,
  Space,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const { Title, Text } = Typography;

interface ModalState {
  open: boolean;
  type: "success" | "error" | "warning" | "info";
  mainTitle: string;
  description: string;
}

// 🏗️ [Sign in form component - wrapped in Suspense to handle useSearchParams]
function SigninFormContent() {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    type: "info",
    mainTitle: "",
    description: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { setUser } = useAuthStore();

  const showModal = (
    type: "success" | "error" | "warning" | "info",
    mainTitle: string,
    description: string,
  ) => {
    setModal({ open: true, type, mainTitle, description });
  };

  const handleModalConfirm = () => {
    if (modal.type === "success") {
      const { user } = useAuthStore.getState();
      let destinationUrl = redirectUrl ? decodeURIComponent(redirectUrl) : "/";

      // 🏢 [ถ้า role เป็น EMPLOYER และเป็นการเข้าสู่ระบบครั้งแรก ให้ไปที่หน้า Profile]
      // ✨ ใช้ is_first_login จาก backend response (ถ้าไม่มีให้ check role อย่างเดียว)
      if (user && user.role === "EMPLOYER") {
        if (user.is_first_login) {
          destinationUrl = "/pages/employer/profile";
          // หลังนำไปหน้าแรกแล้ว ให้เคลียร์สถานะ first login
          useAuthStore.getState().setFirstLogin(false);
        } else if (!redirectUrl) {
          destinationUrl = "/pages/employer/job/read";
        }
      }

      console.log(
        `🔐 [SIGNIN] Redirecting to: ${destinationUrl || "home page"}`,
      );
      router.push(destinationUrl);
      setTimeout(() => {
        router.refresh();
      }, 500);
    }
  };

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
        // 🔐 บันทึก user info ลง Zustand store
        const userInfo = {
          user_id: result.data.user_id,
          email: result.data.email,
          full_name: result.data.full_name,
          role: result.data.role,
          is_first_login: result.data.is_first_login || false,
        };
        setUser(userInfo);

        showModal(
          "success",
          "เข้าสู่ระบบสำเร็จ",
          result.message_th || "เข้าสู่ระบบเรียบร้อยแล้ว",
        );
      } else {
        throw new Error(result.message_th);
      }
    } catch (err: any) {
      showModal(
        "error",
        "เกิดข้อผิดพลาด",
        err.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
      );
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
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <Card
          style={{
            maxWidth: 450,
            width: "100%",
            borderRadius: 24,
            boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
          }}
          styles={{ body: { padding: 40 } }}
        >
          <Space
            direction="vertical"
            align="center"
            style={{ width: "100%", marginBottom: 32 }}
            size={16}
          >
            <Card
              size="small"
              variant="borderless"
              style={{
                width: 48,
                height: 48,
                padding: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: 24 }}>K</span>
            </Card>
            <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
              เข้าสู่ระบบ
            </Title>
            <Text type="secondary">
              ยินดีต้อนรับกลับมา! กรุณาลงชื่อเข้าใช้งาน
            </Text>
          </Space>

          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "กรุณากรอกอีเมลที่ถูกต้อง",
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="อีเมล" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="รหัสผ่าน"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ marginTop: 8 }}
              >
                เข้าสู่ระบบ
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Space wrap>
              <Text type="secondary">ยังไม่มีบัญชี?</Text>
              <Link href="/pages/signup" style={{ fontWeight: 600 }}>
                สมัครสมาชิก
              </Link>
            </Space>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
}

// 🔐 [Default page export with Suspense boundary for useSearchParams]
export default function SigninPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SigninFormContent />
    </Suspense>
  );
}
