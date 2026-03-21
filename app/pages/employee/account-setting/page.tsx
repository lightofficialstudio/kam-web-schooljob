"use client";

import { HomeOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Col, Layout, Row, Space, Typography } from "antd";
import AccountSettingForm from "./components/account-setting-form";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const EmployeeAccountSettingPage = () => {
  return (
    <Content style={{ padding: "40px 24px", minHeight: "100vh" }}>
      <Row justify="center">
        <Col xs={24} sm={22} md={18} lg={14} xl={12}>
          <Space direction="vertical" size={32} style={{ width: "100%" }}>
            {/* Header Section */}
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <Breadcrumb
                items={[
                  {
                    href: "/pages/landing",
                    title: (
                      <Space size={4}>
                        <HomeOutlined style={{ fontSize: "14px" }} />
                        <span>หน้าแรก</span>
                      </Space>
                    ),
                  },
                  {
                    title: (
                      <Space size={4}>
                        <UserOutlined style={{ fontSize: "14px" }} />
                        <span>โปรไฟล์ผู้สมัคร</span>
                      </Space>
                    ),
                  },
                  {
                    title: (
                      <Space size={4}>
                        <SettingOutlined style={{ fontSize: "14px" }} />
                        <span style={{ fontWeight: 500 }}>ตั้งค่าบัญชี</span>
                      </Space>
                    ),
                  },
                ]}
              />

              <Row align="middle" justify="space-between">
                <Col>
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    ตั้งค่าบัญชี
                  </Title>
                  <Paragraph
                    type="secondary"
                    style={{ margin: "4px 0 0 0", fontSize: "15px" }}
                  >
                    จัดการข้อมูลส่วนตัว ความปลอดภัย และการเข้าถึงระบบของคุณ
                  </Paragraph>
                </Col>
                <Col>
                  <SettingOutlined
                    style={{ fontSize: "48px", color: "rgba(0,0,0,0.06)" }}
                  />
                </Col>
              </Row>
            </Space>

            {/* Main Content Area */}
            <AccountSettingForm />
          </Space>
        </Col>
      </Row>
    </Content>
  );
};

export default EmployeeAccountSettingPage;
