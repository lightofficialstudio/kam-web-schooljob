"use client";

// ✨ Signin Form — Minimal + Modern + subtle animation
import { ModalComponent } from "@/app/components/modal/modal.component";
import { useAuthStore } from "@/app/stores/auth-store";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Flex, Form, Input, Typography } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { requestSignin } from "../_api/signin-api";
import { useSigninStore } from "../_state/signin-store";

const PRIMARY = "#11b6f5";

const { Title, Text } = Typography;

export const SigninForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { setUser } = useAuthStore();
  const { isLoading, modal, setLoading, showModal, hideModal } =
    useSigninStore();

  const handleModalConfirm = () => {
    if (modal.type !== "success") return;
    const { user } = useAuthStore.getState();

    if (redirectUrl) {
      router.push(decodeURIComponent(redirectUrl));
      setTimeout(() => router.refresh(), 500);
      return;
    }

    const ROLE_HOME: Record<string, string> = {
      EMPLOYEE: "/pages/employee/profile",
      EMPLOYER: "/pages/employer/profile",
      ADMIN: "/pages/admin",
    };

    const dest = ROLE_HOME[user?.role ?? ""] ?? "/";
    if (user?.role === "EMPLOYER" && user.is_first_login) {
      useAuthStore.getState().setFirstLogin(false);
    }
    router.push(dest);
    setTimeout(() => router.refresh(), 500);
  };

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await requestSignin(values.email, values.password);
      const result = response.data;
      setUser({
        user_id: result.data.user_id,
        email: result.data.email,
        full_name: result.data.full_name,
        school_name: result.data.school_name || undefined,
        role: result.data.role,
        is_first_login: result.data.is_first_login || false,
        profile_image_url: result.data.profile_image_url || undefined,
      });
      showModal(
        "success",
        "เข้าสู่ระบบสำเร็จ",
        result.message_th || "เข้าสู่ระบบเรียบร้อยแล้ว",
      );
    } catch (err: unknown) {
      const message =
        (
          err as {
            response?: { data?: { message_th?: string } };
            message?: string;
          }
        )?.response?.data?.message_th ||
        (err as { message?: string })?.message ||
        "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
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

      {/* ✨ Animation styles */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .signin-form-wrap {
          animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        .signin-input-row {
          animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        .signin-input-row:nth-child(1) { animation-delay: 0.08s; }
        .signin-input-row:nth-child(2) { animation-delay: 0.14s; }
        .signin-input-row:nth-child(3) { animation-delay: 0.20s; }
        .signin-btn { animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.26s both; }
        .signin-footer { animation: fadeSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.32s both; }
      `}</style>

      <Col xs={24} md={14}>
        <Flex
          vertical
          justify="center"
          style={{ height: "100%", padding: "52px 52px" }}
          gap={0}
          className="signin-form-wrap"
        >
          {/* ✨ Header */}
          <Flex vertical gap={6} style={{ marginBottom: 36 }}>
            <Title
              level={3}
              style={{ margin: 0, fontWeight: 800, letterSpacing: "-0.5px" }}
            >
              เข้าสู่ระบบ
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              กรอกอีเมลและรหัสผ่านเพื่อดำเนินการต่อ
            </Text>
          </Flex>

          {/* ✨ Form */}
          <Form
            layout="vertical"
            onFinish={onFinish}
            size="large"
            requiredMark={false}
          >
            <div className="signin-input-row">
              <Form.Item
                name="email"
                label={
                  <Text style={{ fontSize: 13, fontWeight: 600 }}>อีเมล</Text>
                }
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "กรุณากรอกอีเมลที่ถูกต้อง",
                  },
                ]}
                style={{ marginBottom: 16 }}
              >
                <Input
                  prefix={<MailOutlined style={{ color: "#c0c0c0" }} />}
                  placeholder="example@email.com"
                  style={{ borderRadius: 10, height: 48, fontSize: 14 }}
                />
              </Form.Item>
            </div>

            <div className="signin-input-row">
              <Form.Item
                name="password"
                label={
                  <Text style={{ fontSize: 13, fontWeight: 600 }}>
                    รหัสผ่าน
                  </Text>
                }
                rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
                style={{ marginBottom: 8 }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#c0c0c0" }} />}
                  placeholder="••••••••"
                  style={{ borderRadius: 10, height: 48, fontSize: 14 }}
                />
              </Form.Item>
            </div>

            {/* ✨ Forgot password */}
            <div className="signin-input-row">
              <Flex justify="flex-end" style={{ marginBottom: 24 }}>
                <Link
                  href="/pages/forgot-password"
                  style={{ fontSize: 13, color: PRIMARY, fontWeight: 500 }}
                >
                  ลืมรหัสผ่าน?
                </Link>
              </Flex>
            </div>

            {/* ✨ Submit */}
            <div className="signin-btn">
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  block
                  size="large"
                  style={{
                    height: 50,
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 15,
                    background: PRIMARY,
                    border: "none",
                    boxShadow: `0 8px 24px ${PRIMARY}45`,
                    letterSpacing: "0.3px",
                    transition: "box-shadow 0.2s, transform 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateY(-1px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      `0 12px 28px ${PRIMARY}55`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateY(0)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      `0 8px 24px ${PRIMARY}45`;
                  }}
                >
                  {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </Button>
              </Form.Item>
            </div>
          </Form>

          {/* ✨ Footer */}
          <div className="signin-footer" style={{ marginTop: 28 }}>
            <Divider style={{ margin: "0 0 20px" }}>
              <Text type="secondary" style={{ fontSize: 12, padding: "0 8px" }}>
                หรือ
              </Text>
            </Divider>
            <Flex justify="center" align="center" gap={6}>
              <Text type="secondary" style={{ fontSize: 14 }}>
                ยังไม่มีบัญชี?
              </Text>
              <Link
                href="/pages/signup"
                style={{ fontWeight: 700, color: PRIMARY, fontSize: 14 }}
              >
                สมัครสมาชิกฟรี →
              </Link>
            </Flex>
          </div>
        </Flex>
      </Col>
    </>
  );
};
