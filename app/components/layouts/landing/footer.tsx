"use client";

import {
  FacebookOutlined,
  LineOutlined,
  MailOutlined,
  PhoneOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Col, Divider, Row, Space, Typography } from "antd";

const { Text, Title, Paragraph } = Typography;

export default function Footer() {
  return (
    <footer
      style={{
        background: "#FFFFFF",
        padding: "80px 60px 40px 60px",
        borderTop: "1px solid #F1F5F9",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Row gutter={[48, 32]}>
          <Col xs={24} lg={8}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  background: "#0066FF",
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  K
                </span>
              </div>
              <Text strong style={{ fontSize: "18px", color: "#1E293B" }}>
                KAM <span style={{ color: "#0066FF" }}>SCHOOLJOB</span>
              </Text>
            </div>
            <Paragraph style={{ color: "#64748B", lineHeight: "1.8" }}>
              แพลตฟอร์มหางานสายการศึกษาอันดับ 1 ของไทย ครบทุกตำแหน่งงานครู
              ติวเตอร์ ธุรการ และบุคลากรทางการศึกษา
              เชื่อมโยงสถานศึกษาและผู้หางานด้วยเทคโนโลยีที่ทันสมัย
            </Paragraph>
            <Space size={16} style={{ marginTop: "16px" }}>
              <FacebookOutlined
                style={{ fontSize: "20px", color: "#64748B" }}
              />
              <YoutubeOutlined style={{ fontSize: "20px", color: "#64748B" }} />
              <LineOutlined style={{ fontSize: "20px", color: "#64748B" }} />
            </Space>
          </Col>

          <Col xs={12} lg={4}>
            <Title level={5} style={{ marginBottom: "24px" }}>
              สำหรับคนหางาน
            </Title>
            <Space orientation="vertical" size={12}>
              <Text type="secondary" style={{ cursor: "pointer" }}>
                ค้นหาตำแหน่งงาน
              </Text>
              <Text type="secondary" style={{ cursor: "pointer" }}>
                ฝากประวัติ (Resume)
              </Text>
              <Text type="secondary" style={{ cursor: "pointer" }}>
                งานครูตามวิชาเอก
              </Text>
              <Text type="secondary" style={{ cursor: "pointer" }}>
                บทความเตรียมสอบ
              </Text>
            </Space>
          </Col>

          <Col xs={12} lg={4}>
            <Title level={5} style={{ marginBottom: "24px" }}>
              สำหรับสถานศึกษา
            </Title>
            <Space orientation="vertical" size={12}>
              <Text type="secondary" style={{ cursor: "pointer" }}>
                ประกาศรับสมัครงาน
              </Text>
              <Text type="secondary" style={{ cursor: "pointer" }}>
                ค้นหาประวัติครู
              </Text>
              <Text type="secondary" style={{ cursor: "pointer" }}>
                แพ็กเกจสมาชิก
              </Text>
              <Text type="secondary" style={{ cursor: "pointer" }}>
                คู่มือการใช้งาน
              </Text>
            </Space>
          </Col>

          <Col xs={24} lg={8}>
            <Title level={5} style={{ marginBottom: "24px" }}>
              ติดต่อเรา
            </Title>
            <Space orientation="vertical" size={16}>
              <Space>
                <PhoneOutlined style={{ color: "#0066FF" }} />
                <Text type="secondary">02-XXX-XXXX (ฝ่ายบริการลูกค้า)</Text>
              </Space>
              <Space>
                <MailOutlined style={{ color: "#0066FF" }} />
                <Text type="secondary">support@kamschooljob.com</Text>
              </Space>
              <div
                style={{
                  background: "#F8FAFC",
                  padding: "16px",
                  borderRadius: "12px",
                  marginTop: "8px",
                }}
              >
                <Text strong style={{ display: "block", marginBottom: "4px" }}>
                  เวลาทำการ
                </Text>
                <Text type="secondary" style={{ fontSize: "13px" }}>
                  จันทร์ - ศุกร์ : 09:00 - 18:00 น.
                </Text>
              </div>
            </Space>
          </Col>
        </Row>

        <Divider style={{ margin: "40px 0" }} />

        <Row justify="space-between" align="middle">
          <Col>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              © 2026 KAM SCHOOLJOB. All rights reserved.
            </Text>
          </Col>
          <Col>
            <Space size={24}>
              <Text
                type="secondary"
                style={{ fontSize: "13px", cursor: "pointer" }}
              >
                นโยบายความเป็นส่วนตัว
              </Text>
              <Text
                type="secondary"
                style={{ fontSize: "13px", cursor: "pointer" }}
              >
                ข้อตกลงการใช้งาน
              </Text>
            </Space>
          </Col>
        </Row>
      </div>
    </footer>
  );
}
