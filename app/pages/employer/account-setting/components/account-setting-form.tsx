"use client";

import { LockOutlined, MailOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import { useAccountSettingStore } from "../stores/account-setting-store";

const { Title, Text, Paragraph } = Typography;

export default function AccountSettingForm() {
  const [emailForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const { loading, setLoading } = useAccountSettingStore();

  const handleUpdateEmail = async (values: any) => {
    setLoading(true);
    // TODO: Connect with API to update email
    console.log("Update Email:", values);
    setLoading(false);
  };

  const handleUpdatePassword = async (values: any) => {
    setLoading(true);
    // TODO: Connect with API to update password
    console.log("Update Password:", values);
    setLoading(false);
  };

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <Card
        variant="borderless"
        style={{
          borderRadius: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Space>
            <MailOutlined style={{ fontSize: "20px" }} />
            <Title level={4} style={{ margin: 0 }}>
              เปลี่ยนอีเมล
            </Title>
          </Space>
          <Paragraph type="secondary">
            อีเมลนี้จะถูกใช้เป็น Username ในการเข้าสู่ระบบ
          </Paragraph>
          <Form
            form={emailForm}
            layout="vertical"
            onFinish={handleUpdateEmail}
            size="large"
          >
            <Row gutter={16}>
              <Col xs={24} md={16}>
                <Form.Item
                  name="email"
                  label="อีเมลใหม่"
                  rules={[
                    { required: true, message: "กรุณาระบุอีเมล" },
                    { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="example@email.com"
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                md={8}
                style={{ display: "flex", alignItems: "flex-end" }}
              >
                <Form.Item style={{ width: "100%" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={loading}
                    block
                  >
                    บันทึกอีเมล
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Space>
      </Card>

      <Card
        variant="borderless"
        style={{
          borderRadius: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Space>
            <LockOutlined style={{ fontSize: "20px" }} />
            <Title level={4} style={{ margin: 0 }}>
              เปลี่ยนรหัสผ่าน
            </Title>
          </Space>
          <Paragraph type="secondary">
            รหัสผ่านควรมีความยาวอย่างน้อย 8 ตัวอักษร
          </Paragraph>
          <Divider style={{ margin: "8px 0" }} />
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleUpdatePassword}
            size="large"
          >
            <Form.Item
              name="currentPassword"
              label="รหัสผ่านปัจจุบัน"
              rules={[{ required: true, message: "กรุณาระบุรหัสผ่านปัจจุบัน" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="รหัสผ่านปัจจุบัน"
              />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="newPassword"
                  label="รหัสผ่านใหม่"
                  rules={[
                    { required: true, message: "กรุณาระบุรหัสผ่านใหม่" },
                    { min: 8, message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="รหัสผ่านใหม่"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="confirmPassword"
                  label="ยืนยันรหัสผ่านใหม่"
                  dependencies={["newPassword"]}
                  rules={[
                    { required: true, message: "กรุณายืนยันรหัสผ่านใหม่" },
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
                    prefix={<LockOutlined />}
                    placeholder="ยืนยันรหัสผ่านใหม่"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                style={{ minWidth: "150px" }}
              >
                เปลี่ยนรหัสผ่าน
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </Space>
  );
}
