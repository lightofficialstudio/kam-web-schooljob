"use client";

import { EnvironmentOutlined, RightOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Row,
  Space,
  Tag,
  Typography,
  theme as antTheme,
} from "antd";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

interface SchoolCardProps {
  id: string;
  name: string;
  logo: string;
  province: string;
  type: string;
  jobCount: number;
}

export const SchoolCard = ({
  id,
  name,
  logo,
  province,
  type,
  jobCount,
}: SchoolCardProps) => {
  const { token } = antTheme.useToken();
  const router = useRouter();

  // ✨ navigate ไปหน้า School Profile
  const handleClick = () => {
    router.push(`/pages/employee/school/profile/${id}`);
  };

  return (
    <Card
      hoverable
      onClick={handleClick}
      style={{
        borderRadius: token.borderRadiusLG,
        marginBottom: 16,
        border: `1px solid ${token.colorBorder}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
        overflow: "hidden",
      }}
      styles={{ body: { padding: 0 } }}
    >
      <Row align="stretch">
        <Col
          xs={24}
          sm={4}
          style={{
            background: token.colorBgLayout,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            borderRight: `1px solid ${token.colorBorder}`,
          }}
        >
          <Avatar
            size={80}
            shape="square"
            src={logo}
            style={{
              borderRadius: 12,
              border: `2px solid ${token.colorWhite}`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              backgroundColor: token.colorWhite,
            }}
          />
        </Col>
        <Col xs={24} sm={20} style={{ padding: "24px 32px" }}>
          <Row justify="space-between" align="middle">
            <Col flex="auto">
              <Space orientation="vertical" size={8}>
                <Title
                  level={4}
                  style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}
                >
                  {name}
                </Title>
                <Space size={16} wrap>
                  <Space size={6}>
                    <EnvironmentOutlined
                      style={{ color: token.colorPrimary, fontSize: 16 }}
                    />
                    <Text type="secondary" style={{ fontSize: 15 }}>
                      {province}
                    </Text>
                  </Space>
                  <Divider orientation="vertical" />
                  <Tag
                    color="#11b6f5"
                    variant="filled"
                    style={{
                      borderRadius: 6,
                      padding: "2px 10px",
                      fontSize: 13,
                      fontWeight: 500,
                      border: "none",
                    }}
                  >
                    {type}
                  </Tag>
                  <Tag
                    color="green"
                    variant="filled"
                    style={{
                      borderRadius: 6,
                      padding: "2px 10px",
                      fontSize: 13,
                      fontWeight: 500,
                      border: "none",
                    }}
                  >
                    เปิดรับสมัคร
                  </Tag>
                </Space>
              </Space>
            </Col>
            <Col>
              <Flex vertical align="flex-end">
                <Flex vertical style={{ marginBottom: 12, textAlign: "right" }}>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    กำลังเปิดรับ
                  </Text>
                  <Flex align="baseline" gap={4} justify="flex-end">
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: token.colorPrimary,
                        lineHeight: 1,
                      }}
                    >
                      {jobCount}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: token.colorTextSecondary,
                      }}
                    >
                      ตำแหน่ง
                    </Text>
                  </Flex>
                </Flex>
                <Button
                  type="primary"
                  ghost
                  icon={<RightOutlined />}
                  style={{
                    borderRadius: 8,
                    fontWeight: 600,
                    height: 40,
                  }}
                >
                  ดูโปรไฟล์โรงเรียน
                </Button>
              </Flex>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};
