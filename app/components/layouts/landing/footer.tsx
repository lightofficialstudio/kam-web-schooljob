"use client";

import { useTheme } from "@/app/contexts/theme-context";
import {
  FacebookOutlined,
  LineOutlined,
  MailOutlined,
  PhoneOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Card, Col, Divider, Flex, Row, Space, theme, Typography } from "antd";

const { Text, Title, Paragraph } = Typography;

export default function Footer() {
  const { token } = theme.useToken();
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <footer
      style={{
        padding: "80px 24px 40px 24px",
        backgroundColor: token.colorBgContainer,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        transition: "all 0.3s ease",
      }}
    >
      <Row gutter={[48, 32]} style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Col xs={24} lg={8}>
          <Flex vertical gap={24} style={{ width: "100%" }}>
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
                  backgroundColor: token.colorPrimary,
                }}
              >
                <Text strong style={{ fontSize: "16px", color: "#fff" }}>
                  S
                </Text>
              </Card>
              <Text strong style={{ fontSize: "18px", color: token.colorText }}>
                SCHOOL <span style={{ color: token.colorPrimary }}>BOARD</span>
              </Text>
            </Space>
            <Paragraph
              style={{ lineHeight: "1.8", color: token.colorTextSecondary }}
            >
              แพลตฟอร์มหางานสายการศึกษาอันดับ 1 ของไทย ครบทุกตำแหน่งงานครู
              ติวเตอร์ ธุรการ และบุคลากรทางการศึกษา
              เชื่อมโยงสถานศึกษาและผู้หางานด้วยเทคโนโลยีที่ทันสมัย
            </Paragraph>
            <Space size={16}>
              <FacebookOutlined
                style={{ fontSize: "20px", color: token.colorTextDescription }}
              />
              <YoutubeOutlined
                style={{ fontSize: "20px", color: token.colorTextDescription }}
              />
              <LineOutlined
                style={{ fontSize: "20px", color: token.colorTextDescription }}
              />
            </Space>
          </Flex>
        </Col>

        <Col xs={12} lg={4}>
          <Flex vertical gap={24} style={{ width: "100%" }}>
            <Title level={5} style={{ margin: 0, color: token.colorText }}>
              สำหรับคนหางาน
            </Title>
            <Flex vertical gap={12}>
              <Text
                style={{ cursor: "pointer", color: token.colorTextSecondary }}
              >
                ค้นหาตำแหน่งงาน
              </Text>
              <Text
                style={{ cursor: "pointer", color: token.colorTextSecondary }}
              >
                ฝากประวัติ (Resume)
              </Text>
              <Text
                style={{ cursor: "pointer", color: token.colorTextSecondary }}
              >
                งานครูตามวิชาเอก
              </Text>
              <Text
                style={{ cursor: "pointer", color: token.colorTextSecondary }}
              >
                บทความเตรียมสอบ
              </Text>
            </Flex>
          </Flex>
        </Col>

        <Col xs={12} lg={4}>
          <Flex vertical gap={24} style={{ width: "100%" }}>
            <Title level={5} style={{ margin: 0, color: token.colorText }}>
              สำหรับสถานศึกษา
            </Title>
            <Flex vertical gap={12}>
              <Text
                style={{ cursor: "pointer", color: token.colorTextSecondary }}
              >
                ประกาศรับสมัครงาน
              </Text>
              <Text
                style={{ cursor: "pointer", color: token.colorTextSecondary }}
              >
                ค้นหาประวัติครู
              </Text>
              <Text
                style={{ cursor: "pointer", color: token.colorTextSecondary }}
              >
                แพ็กเกจสมาชิก
              </Text>
              <Text
                style={{ cursor: "pointer", color: token.colorTextSecondary }}
              >
                คู่มือการใช้งาน
              </Text>
            </Flex>
          </Flex>
        </Col>

        <Col xs={24} lg={8}>
          <Flex vertical gap={24} style={{ width: "100%" }}>
            <Title level={5} style={{ margin: 0, color: token.colorText }}>
              ติดต่อเรา
            </Title>
            <Flex vertical gap={16} style={{ width: "100%" }}>
              <Space style={{ color: token.colorTextSecondary }}>
                <PhoneOutlined />
                <Text style={{ color: token.colorTextSecondary }}>
                  02-XXX-XXXX (ฝ่ายบริการลูกค้า)
                </Text>
              </Space>
              <Space style={{ color: token.colorTextSecondary }}>
                <MailOutlined />
                <Text style={{ color: token.colorTextSecondary }}>
                  support@schoolboard.com
                </Text>
              </Space>
              <Card
                size="small"
                variant="borderless"
                style={{
                  borderRadius: "12px",
                  backgroundColor: isDark
                    ? token.colorBgElevated
                    : token.colorFillAlter,
                }}
              >
                <Flex vertical gap={4}>
                  <Text strong style={{ color: token.colorText }}>
                    เวลาทำการ
                  </Text>
                  <Text
                    style={{
                      fontSize: "13px",
                      color: token.colorTextDescription,
                    }}
                  >
                    จันทร์ - ศุกร์ : 09:00 - 18:00 น.
                  </Text>
                </Flex>
              </Card>
            </Flex>
          </Flex>
        </Col>
      </Row>

      <Divider style={{ margin: "40px 0" }} />

      <Row
        justify="space-between"
        align="middle"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <Col>
          <Text style={{ fontSize: "13px", color: token.colorTextDescription }}>
            © {new Date().getFullYear()} SCHOOL BOARD. All rights reserved.
          </Text>
        </Col>
        <Col>
          <Space size={24}>
            <Text
              style={{
                fontSize: "13px",
                cursor: "pointer",
                color: token.colorTextDescription,
              }}
            >
              นโยบายความเป็นส่วนตัว
            </Text>
            <Text
              style={{
                fontSize: "13px",
                cursor: "pointer",
                color: token.colorTextDescription,
              }}
            >
              ข้อตกลงการใช้งาน
            </Text>
          </Space>
        </Col>
      </Row>
    </footer>
  );
}
