"use client";

// ✨ ฟอร์มตั้งค่าบัญชี Employer — ข้อมูลส่วนตัวผู้ดูแล, เปลี่ยนอีเมล, เปลี่ยนรหัสผ่าน
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
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

export default function AccountSettingForm() {
  const { user, setUser } = useAuthStore();
  const {
    personalInfo,
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
        // ✨ ดึง firstName/lastName/phoneNumber จาก profile (ไม่ใช่ schoolName)
        const info = {
          firstName: d.contact_person_name || d.first_name || "",
          lastName: d.last_name || "",
          phoneNumber: d.contact_phone || d.phone_number || "",
        };
        setPersonalInfo(info);
        personalForm.setFieldsValue({
          first_name: info.firstName,
          last_name: info.lastName,
          phone_number: info.phoneNumber,
        });
      })
      .catch(() => {/* ไม่แสดง error ถ้าโหลดไม่สำเร็จ */});
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
    <Flex vertical gap={24}>

      {/* ─── ข้อมูลส่วนตัวผู้ดูแลระบบ ─── */}
      <Card variant="borderless" style={{ borderRadius: 16 }}>
        <Flex align="center" gap={10} style={{ marginBottom: 4 }}>
          <UserOutlined style={{ fontSize: 20 }} />
          <Title level={4} style={{ margin: 0 }}>ข้อมูลส่วนตัวผู้ดูแลระบบ</Title>
        </Flex>
        <Paragraph type="secondary" style={{ marginBottom: 20 }}>
          ชื่อ-นามสกุล และเบอร์โทรของผู้ดูแลระบบ (แยกจากชื่อโรงเรียน)
        </Paragraph>
        <Form
          form={personalForm}
          layout="vertical"
          onFinish={handleSavePersonal}
          size="large"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="first_name"
                label="ชื่อ"
                rules={[{ required: true, message: "กรุณาระบุชื่อ" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="ชื่อผู้ดูแลระบบ" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="last_name" label="นามสกุล">
                <Input prefix={<UserOutlined />} placeholder="นามสกุล" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="phone_number" label="เบอร์โทรศัพท์">
                <Input prefix={<PhoneOutlined />} placeholder="0812345678" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="อีเมล (แก้ไขได้ด้านล่าง)">
                <Input
                  prefix={<MailOutlined />}
                  value={user?.email}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
          <Flex justify="flex-end">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoadingPersonal}
              style={{ minWidth: 140 }}
            >
              บันทึกข้อมูล
            </Button>
          </Flex>
        </Form>
      </Card>

      {/* ─── เปลี่ยนรหัสผ่าน ─── */}
      <Card variant="borderless" style={{ borderRadius: 16 }}>
        <Flex align="center" gap={10} style={{ marginBottom: 4 }}>
          <LockOutlined style={{ fontSize: 20 }} />
          <Title level={4} style={{ margin: 0 }}>เปลี่ยนรหัสผ่าน</Title>
        </Flex>
        <Paragraph type="secondary" style={{ marginBottom: 16 }}>
          รหัสผ่านควรมีความยาวอย่างน้อย 8 ตัวอักษร
        </Paragraph>
        <Divider style={{ margin: "0 0 20px" }} />
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          size="large"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="new_password"
                label="รหัสผ่านใหม่"
                rules={[
                  { required: true, message: "กรุณาระบุรหัสผ่านใหม่" },
                  { min: 8, message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="รหัสผ่านใหม่" />
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
                <Input.Password prefix={<LockOutlined />} placeholder="ยืนยันรหัสผ่านใหม่" />
              </Form.Item>
            </Col>
          </Row>
          <Flex justify="flex-end">
            <Button
              type="primary"
              htmlType="submit"
              icon={<LockOutlined />}
              loading={isLoadingPassword}
              style={{ minWidth: 160 }}
            >
              เปลี่ยนรหัสผ่าน
            </Button>
          </Flex>
        </Form>
      </Card>

      {/* ─── ข้อมูลบัญชี (read-only) ─── */}
      <Card variant="borderless" style={{ borderRadius: 16 }}>
        <Flex align="center" gap={10} style={{ marginBottom: 16 }}>
          <MailOutlined style={{ fontSize: 20 }} />
          <Title level={4} style={{ margin: 0 }}>ข้อมูลบัญชี</Title>
        </Flex>
        <Flex vertical gap={8}>
          <Flex gap={8}>
            <Text type="secondary" style={{ minWidth: 100 }}>อีเมล:</Text>
            <Text copyable>{user?.email}</Text>
          </Flex>
          <Flex gap={8}>
            <Text type="secondary" style={{ minWidth: 100 }}>Role:</Text>
            <Text>{user?.role === "EMPLOYER" ? "สถานศึกษา" : user?.role}</Text>
          </Flex>
          <Flex gap={8}>
            <Text type="secondary" style={{ minWidth: 100 }}>User ID:</Text>
            <Text type="secondary" style={{ fontSize: 12 }} copyable>{user?.user_id}</Text>
          </Flex>
        </Flex>
      </Card>

    </Flex>
  );
}
