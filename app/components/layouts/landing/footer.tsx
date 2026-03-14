"use client";

import {
  FacebookOutlined,
  LineOutlined,
  MailOutlined,
  PhoneOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Card, Col, Divider, Row, Space, Typography } from "antd";

const { Text, Title, Paragraph } = Typography;

export default function Footer() {
  return (
    <footer
      style={{
        padding: "80px 60px 40px 60px",
        borderTop: "1px solid #F1F5F9",
      }}
    >
      <Row gutter={[48, 32]} style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            <Space size="small">
              <Card
                size="small"
                variant="borderless"
                style={{
                  width: "32px",
                  height: "32px",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  backgroundColor: "#1890ff",
                }}
              >
                <Text strong style={{ fontSize: "16px", color: "#fff" }}>
                  S
                </Text>
              </Card>
              <Text strong style={{ fontSize: "18px" }}>
                SCHOOL <span>BOARD</span>
              </Text>
            </Space>
            <Paragraph style={{ lineHeight: "1.8" }}>
              แพลตฟอร์มหางานสายการศึกษาอันดับ 1 ของไทย ครบทุกตำแหน่งงานครู
              ติวเตอร์ ธุรการ และบุคลากรทางการศึกษา
              เชื่อมโยงสถานศึกษาและผู้หางานด้วยเทคโนโลยีที่ทันสมัย
            </Paragraph>
            <Space size={16}>
              <FacebookOutlined style={{ fontSize: "20px" }} />
              <YoutubeOutlined style={{ fontSize: "20px" }} />
              <LineOutlined style={{ fontSize: "20px" }} />
            </Space>
          </Space>
        </Col>

        <Col xs={12} lg={4}>
          <Space orientation="vertical" size={24} style={{ width: "100%" }}>
            <Title level={5} style={{ margin: 0 }}>
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
          </Space>
        </Col>

        <Col xs={12} lg={4}>
          <Space orientation="vertical" size={24} style={{ width: "100%" }}>
            <Title level={5} style={{ margin: 0 }}>
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
          </Space>
        </Col>

        <Col xs={24} lg={8}>
          <Space orientation="vertical" size={24} style={{ width: "100%" }}>
            <Title level={5} style={{ margin: 0 }}>
              ติดต่อเรา
            </Title>
            <Space orientation="vertical" size={16} style={{ width: "100%" }}>
              <Space>
                <PhoneOutlined />
                <Text type="secondary">02-XXX-XXXX (ฝ่ายบริการลูกค้า)</Text>
              </Space>
              <Space>
                <MailOutlined />
                <Text type="secondary">support@schoolboard.com</Text>
              </Space>
              <Card
                size="small"
                variant="borderless"
                style={{ borderRadius: "12px" }}
              >
                <Space orientation="vertical" size={4}>
                  <Text strong>เวลาทำการ</Text>
                  <Text type="secondary" style={{ fontSize: "13px" }}>
                    จันทร์ - ศุกร์ : 09:00 - 18:00 น.
                  </Text>
                </Space>
              </Card>
            </Space>
          </Space>
        </Col>
      </Row>

      <Divider style={{ margin: "40px 0" }} />

      <Row
        justify="space-between"
        align="middle"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <Col>
          <Text type="secondary" style={{ fontSize: "13px" }}>
            © 2026 SCHOOL BOARD. All rights reserved.
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
    </footer>
  );
}
