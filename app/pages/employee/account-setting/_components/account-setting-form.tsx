"use client";

import {
  CheckCircleOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  KeyOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";
import { useState } from "react";
import { requestChangePassword } from "../_api/account-setting-api";
import { useAccountSettingStore } from "../_stores/account-setting-store";
import { useAuthStore } from "@/app/stores/auth-store";
import { ModalComponent } from "@/app/components/modal/modal.component";

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

// ✨ ModalState pattern มาตรฐาน
interface ModalState {
  open: boolean;
  type: "success" | "error" | "confirm" | "delete";
  title: string;
  description: string;
  errorDetails?: unknown;
}
const MODAL_CLOSED: ModalState = { open: false, type: "success", title: "", description: "" };

// ✨ วัดความแข็งแรงรหัสผ่าน — แสดง progress bar 4 ช่อง
function PasswordStrengthBar({ password }: { password: string }) {
  const { token } = useToken();
  const strength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();
  const labels = ["", "อ่อนแอ", "พอใช้ได้", "ดี", "แข็งแรงมาก"];
  const colors = ["", "#ff4d4f", "#faad14", "#52c41a", "#11b6f5"];
  if (!password) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <Row gutter={4} style={{ marginBottom: 6 }}>
        {[1, 2, 3, 4].map((i) => (
          <Col span={6} key={i}>
            <div
              className="transition-all duration-500"
              style={{
                height: 4,
                borderRadius: 8,
                backgroundColor: i <= strength ? colors[strength] : token.colorBorderSecondary,
              }}
            />
          </Col>
        ))}
      </Row>
      <Text style={{ fontSize: 12, color: colors[strength] }}>
        ความแข็งแรง: {labels[strength]}
      </Text>
    </div>
  );
}

// ✨ ส่วนหัว card พร้อม icon badge
function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const { token } = useToken();
  return (
    <Space size={16} align="start" style={{ width: "100%" }}>
      <Avatar
        size={48}
        icon={icon}
        style={{
          backgroundColor: token.colorPrimaryBg,
          color: token.colorPrimary,
          borderRadius: 14,
          flexShrink: 0,
        }}
      />
      <div>
        <Title level={5} style={{ margin: 0 }}>{title}</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>{description}</Text>
      </div>
    </Space>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export function AccountSettingForm() {
  const { token } = useToken();
  const [passwordForm] = Form.useForm<{ newPassword: string; confirmPassword: string }>();
  const { isPasswordLoading, setPasswordLoading } = useAccountSettingStore();
  const { user } = useAuthStore();
  const [modal, setModal] = useState<ModalState>(MODAL_CLOSED);
  const [newPasswordValue, setNewPasswordValue] = useState("");

  const closeModal = () => setModal(MODAL_CLOSED);

  // ✨ เปลี่ยนรหัสผ่านผ่าน API จริง — ไม่ใช้ console.log หรือ TODO
  const handleChangePassword = async (values: { newPassword: string; confirmPassword: string }) => {
    if (!user?.user_id) {
      setModal({
        open: true,
        type: "error",
        title: "ไม่พบข้อมูลผู้ใช้",
        description: "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
      });
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await requestChangePassword(user.user_id, values.newPassword);
      if (res.data.status_code === 200) {
        setModal({
          open: true,
          type: "success",
          title: "เปลี่ยนรหัสผ่านสำเร็จ",
          description: "รหัสผ่านของคุณได้รับการอัปเดตเรียบร้อยแล้ว กรุณาใช้รหัสผ่านใหม่ในครั้งถัดไป",
        });
        passwordForm.resetFields();
        setNewPasswordValue("");
      } else {
        setModal({
          open: true,
          type: "error",
          title: "เปลี่ยนรหัสผ่านไม่สำเร็จ",
          description: res.data.message_th,
        });
      }
    } catch (err) {
      setModal({
        open: true,
        type: "error",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเปลี่ยนรหัสผ่านได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
        errorDetails: err,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <Space direction="vertical" size={24} style={{ width: "100%" }}>

        {/* ── บัญชีของคุณ (read-only) ─── */}
        <Card
          style={{
            borderRadius: 16,
            border: `1px solid ${token.colorBorderSecondary}`,
            boxShadow: token.boxShadowTertiary,
          }}
          styles={{ body: { padding: 28 } }}
        >
          <Space direction="vertical" size={20} style={{ width: "100%" }}>
            <SectionHeader
              icon={<UserOutlined />}
              title="ข้อมูลบัญชีของคุณ"
              description="ข้อมูลที่ใช้ระบุตัวตนในระบบ"
            />
            <Divider style={{ margin: "4px 0 8px 0", borderColor: token.colorBorderSecondary }} />

            {/* ✨ ดึงอีเมลจาก authStore — ไม่ hardcode */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: 12,
                    background: token.colorFillQuaternary,
                    border: `1px solid ${token.colorBorderSecondary}`,
                  }}
                >
                  <Space size={10}>
                    <MailOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                        อีเมล
                      </Text>
                      <Text strong style={{ fontSize: 14 }}>
                        {user?.email ?? "—"}
                      </Text>
                    </div>
                  </Space>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: 12,
                    background: token.colorFillQuaternary,
                    border: `1px solid ${token.colorBorderSecondary}`,
                  }}
                >
                  <Space size={10}>
                    <SafetyCertificateOutlined style={{ color: token.colorSuccess, fontSize: 16 }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                        ประเภทบัญชี
                      </Text>
                      <Tag color="processing" style={{ borderRadius: 6, margin: 0, fontWeight: 600 }}>
                        ผู้สมัครงาน (ครู)
                      </Tag>
                    </div>
                  </Space>
                </div>
              </Col>
            </Row>

            {/* ✨ แจ้งเตือนการเปลี่ยนอีเมล */}
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                background: `rgba(17,182,245,0.06)`,
                border: `1px solid rgba(17,182,245,0.2)`,
              }}
            >
              <Space size={8}>
                <MailOutlined style={{ color: token.colorPrimary }} />
                <Text style={{ fontSize: 13, color: token.colorPrimary }}>
                  หากต้องการเปลี่ยนอีเมล กรุณาติดต่อผู้ดูแลระบบ
                </Text>
              </Space>
            </div>
          </Space>
        </Card>

        {/* ── เปลี่ยนรหัสผ่าน ─── */}
        <Card
          style={{
            borderRadius: 16,
            border: `1px solid ${token.colorBorderSecondary}`,
            boxShadow: token.boxShadowTertiary,
          }}
          styles={{ body: { padding: 28 } }}
        >
          <Space direction="vertical" size={20} style={{ width: "100%" }}>
            <SectionHeader
              icon={<KeyOutlined />}
              title="เปลี่ยนรหัสผ่าน"
              description="เลือกรหัสผ่านที่แข็งแรง ผสมตัวอักษร ตัวเลข และสัญลักษณ์"
            />
            <Divider style={{ margin: "4px 0 8px 0", borderColor: token.colorBorderSecondary }} />

            {/* ✨ Password tips — Guide user */}
            <Row gutter={[12, 8]}>
              {[
                "อย่างน้อย 8 ตัวอักษร",
                "มีตัวพิมพ์ใหญ่ (A–Z)",
                "มีตัวเลข (0–9)",
                "มีอักขระพิเศษ (!@#$)",
              ].map((tip) => (
                <Col key={tip} xs={24} sm={12}>
                  <Space size={6}>
                    <CheckCircleOutlined style={{ color: token.colorSuccess, fontSize: 13 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>{tip}</Text>
                  </Space>
                </Col>
              ))}
            </Row>

            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
              requiredMark={false}
            >
              <Row gutter={[16, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text strong>รหัสผ่านใหม่</Text>}
                    name="newPassword"
                    rules={[
                      { required: true, message: "กรุณาระบุรหัสผ่านใหม่" },
                      { min: 8, message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: token.colorTextQuaternary }} />}
                      placeholder="กรอกรหัสผ่านใหม่ที่ต้องการ"
                      size="large"
                      iconRender={(visible) =>
                        visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                      }
                      onChange={(e) => setNewPasswordValue(e.target.value)}
                    />
                  </Form.Item>
                  {/* ✨ Strength bar แบบ realtime */}
                  <PasswordStrengthBar password={newPasswordValue} />
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text strong>ยืนยันรหัสผ่านใหม่</Text>}
                    name="confirmPassword"
                    dependencies={["newPassword"]}
                    rules={[
                      { required: true, message: "กรุณายืนยันรหัสผ่าน" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("newPassword") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("รหัสผ่านไม่ตรงกัน"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: token.colorTextQuaternary }} />}
                      placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
                      size="large"
                      iconRender={(visible) =>
                        visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row justify="end" style={{ marginTop: 8 }}>
                <Col xs={24} sm={12} md={8}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<KeyOutlined />}
                    loading={isPasswordLoading}
                    size="large"
                    block
                    style={{ fontWeight: 600, height: 48 }}
                  >
                    บันทึกรหัสผ่านใหม่
                  </Button>
                </Col>
              </Row>
            </Form>
          </Space>
        </Card>

        {/* ── เคล็ดลับความปลอดภัย ─── */}
        <Card
          style={{
            borderRadius: 16,
            border: `1px solid ${token.colorBorderSecondary}`,
            background: token.colorFillQuaternary,
          }}
          styles={{ body: { padding: 28 } }}
        >
          <Space size={14} align="start">
            <SafetyCertificateOutlined
              style={{ fontSize: 24, color: token.colorWarning, flexShrink: 0 }}
            />
            <div>
              <Title level={5} style={{ margin: "0 0 8px 0" }}>
                เคล็ดลับความปลอดภัย
              </Title>
              <Space direction="vertical" size={6}>
                {[
                  "อย่าแชร์รหัสผ่านกับผู้อื่นแม้แต่ทีมงาน",
                  "เปลี่ยนรหัสผ่านทุก 3–6 เดือนเพื่อความปลอดภัย",
                  "ใช้รหัสผ่านที่แตกต่างกันในแต่ละเว็บไซต์",
                  "หากสงสัยว่าบัญชีถูกเข้าถึงโดยไม่ได้รับอนุญาต ให้เปลี่ยนรหัสผ่านทันที",
                ].map((tip) => (
                  <Paragraph key={tip} type="secondary" style={{ margin: 0, fontSize: 13 }}>
                    • {tip}
                  </Paragraph>
                ))}
              </Space>
            </div>
          </Space>
        </Card>
      </Space>

      {/* ── Modal ─── */}
      <ModalComponent
        open={modal.open}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        errorDetails={modal.errorDetails}
        onClose={closeModal}
        onConfirm={closeModal}
      />
    </>
  );
}
