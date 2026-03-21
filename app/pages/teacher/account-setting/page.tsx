"use client";

import { HomeOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Col, Divider, Layout, Row, Space, Typography } from "antd";
import AccountSettingForm from "./components/account-setting-form";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const TeacherAccountSettingPage = () => {
  return (
    <Content style={{ padding: "16px", minHeight: "100vh" }}>
      <Row justify="center">
        <Col xs={24} sm={22} md={18} lg={16} xl={14}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Breadcrumb Section */}
            <Breadcrumb
              items={[
                {
                  href: "/pages/landing",
                  title: (
                    <Space>
                      <HomeOutlined />
                      <span>หน้าแรก</span>
                    </Space>
                  ),
                },
                {
                  title: (
                    <Space>
                      <UserOutlined />
                      <span>โปรไฟล์ครู</span>
                    </Space>
                  ),
                },
                {
                  title: (
                    <Space>
                      <SettingOutlined />
                      <span>ตั้งค่าบัญชี</span>
                    </Space>
                  ),
                },
              ]}
            />

            {/* Title Section */}
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Title level={2} style={{ margin: 0 }}>
                ตั้งค่าบัญชี (ครู)
              </Title>
              <Paragraph type="secondary">
                จัดการอีเมลและรหัสผ่านสำหรับลงชื่อเข้าใช้งานระบบ
              </Paragraph>
            </Space>

            <Divider style={{ margin: "12px 0" }} />

            {/* Form Section */}
            <AccountSettingForm />
          </Space>
        </Col>
      </Row>
    </Content>
  );
};

export default TeacherAccountSettingPage;
