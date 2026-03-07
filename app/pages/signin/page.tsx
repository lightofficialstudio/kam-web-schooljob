"use client";

import ResultModal from "@/app/components/layouts/modal/result-modal";
import { useAuthStore } from "@/app/stores/auth-store";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Card, ConfigProvider, Form, Input, Typography } from "antd";
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
      // ✨ [ถ้ามี redirect URL จากการพยายามเข้า admin route ให้ return ไปหน้านั้น]
      const destinationUrl = redirectUrl
        ? decodeURIComponent(redirectUrl)
        : "/";
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
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                background: "#0066FF",
                width: 48,
                height: 48,
                borderRadius: 12,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <span
                style={{ color: "white", fontWeight: "bold", fontSize: 24 }}
              >
                K
              </span>
            </div>
            <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
              เข้าสู่ระบบ
            </Title>
            <Text type="secondary">
              ยินดีต้อนรับกลับมา! กรุณาลงชื่อเข้าใช้งาน
            </Text>
          </div>

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
              <Input
                prefix={<MailOutlined style={{ color: "#94A3B8" }} />}
                placeholder="อีเมล"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#94A3B8" }} />}
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
            <Text type="secondary">ยังไม่มีบัญชี? </Text>
            <Link
              href="/pages/signup"
              style={{ color: "#0066FF", fontWeight: 600 }}
            >
              สมัครสมาชิก
            </Link>
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
