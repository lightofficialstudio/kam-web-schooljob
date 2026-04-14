"use client";

// ✨ ฟอร์มตั้งค่าบัญชี Employer — ข้อมูลส่วนตัวผู้ดูแล, เปลี่ยนรหัสผ่าน, ข้อมูลบัญชี
import {
  CheckCircleOutlined,
  CopyOutlined,
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  message,
  Row,
  Tag,
  theme,
  Typography,
} from "antd";
import { useEffect } from "react";

import { useAuthStore } from "@/app/stores/auth-store";
import {
  requestChangePassword,
  requestGetPersonalInfo,
  requestUpdatePersonalInfo,
} from "../_api/account-setting-api";
import { useAccountSettingStore } from "../_state/account-setting-store";

const { Title, Text, Paragraph } = Typography;

// ✨ Section header พร้อม icon pill — ใช้ token เพื่อ dark mode support
const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}> = ({ icon, title, desc, color }) => {
  const { token } = theme.useToken();
  return (
    <Flex align="flex-start" gap={16} style={{ marginBottom: 28 }}>
      <Flex
        align="center"
        justify="center"
        style={{
          width: 48, height: 48, borderRadius: 14,
          background: token.colorFillTertiary,
          border: `1.5px solid ${token.colorBorderSecondary}`,
          color: color, fontSize: 20, flexShrink: 0,
        }}
      >
        {icon}
      </Flex>
      <Flex vertical gap={2}>
        <Title level={4} style={{ margin: 0 }}>{title}</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>{desc}</Text>
      </Flex>
    </Flex>
  );
};

// ✨ Card wrapper มี top accent bar — ใช้ Ant Design Card เพื่อ dark mode support
const SectionCard: React.FC<{ children: React.ReactNode; accentColor: string }> = ({ children, accentColor }) => (
  <Card
    variant="borderless"
    style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    styles={{
      body: { padding: 0 },
    }}
  >
    {/* Accent bar */}
    <div style={{ height: 4, background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}55 100%)` }} />
    <div style={{ padding: "28px 28px 24px" }}>
      {children}
    </div>
  </Card>
);

export default function AccountSettingForm() {
  const { user } = useAuthStore();
  const { token } = theme.useToken();
  const {
    isLoadingPersonal,
    isLoadingPassword,
    setPersonalInfo,
    setIsLoadingPersonal,
    setIsLoadingPassword,
  } = useAccountSettingStore();

  const [personalForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // ✨ โหลดข้อมูลส่วนตัวจาก DB เมื่อเปิดหน้า
  useEffect(() => {
    if (!user?.user_id) return;
    requestGetPersonalInfo(user.user_id)
      .then((res) => {
        const d = res.data?.data;
        if (!d) return;
        // ✨ d คือ Profile object จาก Prisma — ใช้ field ตรงๆ (camelCase)
        const info = {
          firstName: d.firstName || "",
          lastName: d.lastName || "",
          phoneNumber: d.phoneNumber || "",
        };
        setPersonalInfo(info);
        personalForm.setFieldsValue({
          first_name: info.firstName,
          last_name: info.lastName,
          phone_number: info.phoneNumber,
        });
      })
      .catch(() => {});
  }, [user?.user_id]);

  // ✨ บันทึกข้อมูลส่วนตัว
  const handleSavePersonal = async (values: {
    first_name: string;
    last_name?: string;
    phone_number?: string;
  }) => {
    if (!user?.user_id) return;
    setIsLoadingPersonal(true);
    try {
      await requestUpdatePersonalInfo(user.user_id, values);
      setPersonalInfo({
        firstName: values.first_name,
        lastName: values.last_name || "",
        phoneNumber: values.phone_number || "",
      });
      message.success("บันทึกข้อมูลส่วนตัวสำเร็จ");
    } catch {
      message.error("บันทึกไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setIsLoadingPersonal(false);
    }
  };

  // ✨ เปลี่ยนรหัสผ่าน
  const handleChangePassword = async (values: {
    new_password: string;
    confirm_password: string;
  }) => {
    if (!user?.user_id) return;
    setIsLoadingPassword(true);
    try {
      await requestChangePassword(user.user_id, values.new_password);
      message.success("เปลี่ยนรหัสผ่านสำเร็จ");
      passwordForm.resetFields();
    } catch (err: any) {
      const msg = err?.response?.data?.message_th || "เปลี่ยนรหัสผ่านไม่สำเร็จ";
      message.error(msg);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  return (
    <Flex vertical gap={20}>

      {/* ─── Section 1: ข้อมูลส่วนตัว ─── */}
      <div id="section-personal">
      <SectionCard accentColor="#11b6f5">
        <SectionHeader
          icon={<UserOutlined />}
          title="ข้อมูลส่วนตัวผู้ดูแลระบบ"
          desc="ชื่อ-นามสกุล และเบอร์โทรของผู้ดูแล (แยกจากชื่อโรงเรียน)"
          color="#11b6f5"
        />
        <Form form={personalForm} layout="vertical" onFinish={handleSavePersonal} size="large">
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="first_name"
                label="ชื่อ"
                rules={[{ required: true, message: "กรุณาระบุชื่อ" }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: token.colorTextTertiary }} />}
                  placeholder="ชื่อผู้ดูแลระบบ"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="last_name" label="นามสกุล">
                <Input
                  prefix={<UserOutlined style={{ color: token.colorTextTertiary }} />}
                  placeholder="นามสกุล"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="phone_number" label="เบอร์โทรศัพท์">
                <Input
                  prefix={<PhoneOutlined style={{ color: token.colorTextTertiary }} />}
                  placeholder="0812345678"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="อีเมล">
                <Input
                  prefix={<MailOutlined style={{ color: token.colorTextTertiary }} />}
                  value={user?.email}
                  disabled
                  style={{ borderRadius: 10 }}
                  suffix={
                    <Tag color="default" style={{ fontSize: 11, margin: 0 }}>
                      ไม่สามารถแก้ไขได้
                    </Tag>
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Flex justify="flex-end" style={{ marginTop: 4 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoadingPersonal}
              style={{
                minWidth: 148, height: 44, borderRadius: 10,
                background: "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 100%)",
                border: "none", fontWeight: 600,
              }}
            >
              บันทึกข้อมูล
            </Button>
          </Flex>
        </Form>
      </SectionCard>
      </div>

      {/* ─── Section 2: ความปลอดภัย ─── */}
      <div id="section-security">
      <SectionCard accentColor="#52c41a">
        <SectionHeader
          icon={<SafetyCertificateOutlined />}
          title="ความปลอดภัย"
          desc="ตั้งรหัสผ่านใหม่ — ควรมีความยาวอย่างน้อย 8 ตัวอักษร"
          color="#52c41a"
        />

        {/* Security tips */}
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            background: token.colorSuccessBg,
            border: `1px solid ${token.colorSuccessBorder}`,
            marginBottom: 24,
          }}
        >
          <Flex gap={8} wrap="wrap">
            {["8 ตัวอักษรขึ้นไป", "มีตัวเลขอย่างน้อย 1 ตัว", "หลีกเลี่ยงข้อมูลส่วนตัว"].map((tip) => (
              <Flex key={tip} align="center" gap={5}>
                <CheckCircleOutlined style={{ color: token.colorSuccess, fontSize: 12 }} />
                <Text style={{ fontSize: 12, color: token.colorSuccess }}>{tip}</Text>
              </Flex>
            ))}
          </Flex>
        </div>

        <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword} size="large">
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="new_password"
                label="รหัสผ่านใหม่"
                rules={[
                  { required: true, message: "กรุณาระบุรหัสผ่านใหม่" },
                  { min: 8, message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
                  placeholder="รหัสผ่านใหม่"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="confirm_password"
                label="ยืนยันรหัสผ่านใหม่"
                dependencies={["new_password"]}
                rules={[
                  { required: true, message: "กรุณายืนยันรหัสผ่าน" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("รหัสผ่านไม่ตรงกัน"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Flex justify="flex-end" style={{ marginTop: 4 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<LockOutlined />}
              loading={isLoadingPassword}
              style={{
                minWidth: 164, height: 44, borderRadius: 10,
                background: "linear-gradient(135deg, #389e0d 0%, #52c41a 100%)",
                border: "none", fontWeight: 600,
              }}
            >
              เปลี่ยนรหัสผ่าน
            </Button>
          </Flex>
        </Form>
      </SectionCard>
      </div>

      {/* ─── Section 3: ข้อมูลบัญชี (read-only) ─── */}
      <div id="section-account">
      <SectionCard accentColor="#fa8c16">
        <SectionHeader
          icon={<IdcardOutlined />}
          title="ข้อมูลบัญชี"
          desc="ข้อมูลที่ใช้ระบุตัวตนในระบบ — ไม่สามารถแก้ไขได้"
          color="#fa8c16"
        />
        <Flex vertical gap={0}>
          {[
            {
              icon: <MailOutlined />,
              label: "อีเมล",
              value: <Text copyable style={{ fontSize: 14 }}>{user?.email}</Text>,
            },
            {
              icon: <UserOutlined />,
              label: "Role",
              value: (
                <Tag color="blue" style={{ fontSize: 13 }}>
                  {user?.role === "EMPLOYER" ? "สถานศึกษา" : user?.role}
                </Tag>
              ),
            },
            {
              icon: <CopyOutlined />,
              label: "User ID",
              value: (
                <Text
                  copyable
                  type="secondary"
                  style={{ fontSize: 12, fontFamily: "monospace" }}
                >
                  {user?.user_id}
                </Text>
              ),
            },
          ].map((row, i, arr) => (
            <div key={row.label}>
              <Flex
                align="center"
                justify="space-between"
                style={{ padding: "14px 0" }}
              >
                <Flex align="center" gap={10}>
                  <Flex
                    align="center"
                    justify="center"
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: token.colorFillTertiary,
                      color: token.colorTextSecondary, fontSize: 14,
                    }}
                  >
                    {row.icon}
                  </Flex>
                  <Text type="secondary" style={{ fontSize: 13 }}>{row.label}</Text>
                </Flex>
                {row.value}
              </Flex>
              {i < arr.length - 1 && <Divider style={{ margin: 0 }} />}
            </div>
          ))}
        </Flex>
      </SectionCard>
      </div>

    </Flex>
  );
}
