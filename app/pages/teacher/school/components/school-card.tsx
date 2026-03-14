"use client";

import { EnvironmentOutlined, RightOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Space,
  Tag,
  Typography,
  theme as antTheme,
} from "antd";
import { useSchoolStore } from "../stores/school-store";

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
  const { schools, setSelectedSchool, setIsDrawerOpen } = useSchoolStore();

  const handleClick = () => {
    const school = schools.find((s) => s.id === id) ?? null;
    setSelectedSchool(school);
    setIsDrawerOpen(true);
  };

  return (
    <Card
      hoverable
      onClick={handleClick}
      style={{
        borderRadius: token.borderRadiusLG,
        marginBottom: 16,
        borderColor: token.colorBorderSecondary,
        boxShadow: token.boxShadowTertiary,
      }}
      styles={{ body: { padding: "20px 24px" } }}
    >
      <Row align="middle" gutter={24}>
        <Col>
          <Avatar
            size={64}
            shape="square"
            src={logo}
            style={{
              borderRadius: token.borderRadius,
              border: `1px solid ${token.colorBorderSecondary}`,
              backgroundColor: token.colorBgLayout,
            }}
          />
        </Col>
        <Col flex="auto">
          <Space direction="vertical" size={2}>
            <Title level={5} style={{ margin: 0, fontSize: "18px" }}>
              {name}
            </Title>
            <Space size={16}>
              <Space size={4}>
                <EnvironmentOutlined
                  style={{ color: token.colorTextDescription }}
                />
                <Text type="secondary">{province}</Text>
              </Space>
              <Tag color="blue" bordered={false} style={{ borderRadius: 100 }}>
                {type}
              </Tag>
            </Space>
          </Space>
        </Col>
        <Col>
          <Space direction="vertical" align="end" size={4}>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              กำลังเปิดรับ{" "}
              <Text strong style={{ color: token.colorPrimary }}>
                {jobCount}
              </Text>{" "}
              ตำแหน่ง
            </Text>
            <Button
              type="text"
              icon={<RightOutlined />}
              style={{ color: token.colorTextDescription }}
            />
          </Space>
        </Col>
      </Row>
    </Card>
  );
};
