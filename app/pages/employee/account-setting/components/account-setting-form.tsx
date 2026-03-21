"use client";

import { LockOutlined, MailOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Typography,
} from "antd";
import { useAccountSettingStore } from "../stores/account-setting-store";

const { Title, Text } = Typography;

const AccountSettingForm = () => {
  const [emailForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const { loading, setLoading } = useAccountSettingStore();

  const handleUpdateEmail = async (values: { email: string }) => {
    setLoading(true);
    try {
      // TODO: Connect with API /api/v1/user/update-email
      console.log("Updating email for employee:", values.email);
      message.success("อัปเดตอีเมลเรียบร้อยแล้ว");
    } catch (error) {
      message.error("ไม่สามารถอัปเดตอีเมลได้");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (values: any) => {
    setLoading(true);
    try {
      // TODO: Connect with API /api/v1/user/update-password
      console.log("Updating password for employee");
      message.success("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
      passwordForm.resetFields();
    } catch (error) {
      message.error("ไม่สามารถเปลี่ยนรหัสผ่านได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* ส่วนเปลี่ยนอีเมล */}
      <Card
        title={
          <Space>
            <MailOutlined />
            <Text strong>จัดการอีเมล</Text>
          </Space>
        }
      >
        <Form
          form={emailForm}
          layout="vertical"
          onFinish={handleUpdateEmail}
          initialValues={{ email: "" }} // ควรดึงจาก Auth Store
        >
          <Row gutter={16} align="bottom">
            <Col xs={24} md={18}>
              <Form.Item
                label="อีเมลปัจจุบัน / อีเมลใหม่"
                name="email"
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
            <Col xs={24} md={6}>
              <Form.Item>
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
      </Card>

      {/* ส่วนเปลี่ยนรหัสผ่าน */}
      <Card
        title={
          <Space>
            <LockOutlined />
            <Text strong>เปลี่ยนรหัสผ่าน</Text>
          </Space>
        }
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleUpdatePassword}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="รหัสผ่านใหม่"
                name="newPassword"
                rules={[
                  { required: true, message: "กรุณาระบุรหัสผ่านใหม่" },
                  { min: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
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
                label="ยืนยันรหัสผ่านใหม่"
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
                  prefix={<LockOutlined />}
                  placeholder="ยืนยันรหัสผ่านใหม่"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Col xs={24} md={6}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                block
              >
                เปลี่ยนรหัสผ่าน
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Space>
  );
};

export default AccountSettingForm;
