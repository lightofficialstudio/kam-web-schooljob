"use client";

import {
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Col,
  Divider,
  Drawer,
  Empty,
  Flex,
  Row,
  Space,
  Tag,
  Typography,
  theme as antTheme,
} from "antd";
import { useSchoolStore } from "../stores/school-store";

const { Title, Text } = Typography;

export const SchoolJobsDrawer = () => {
  const { token } = antTheme.useToken();
  const { selectedSchool, isDrawerOpen, setIsDrawerOpen, setSelectedSchool } =
    useSchoolStore();

  const handleClose = () => {
    setIsDrawerOpen(false);
    setSelectedSchool(null);
  };

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={handleClose}
      size="large"
      placement="right"
      title={
        selectedSchool && (
          <Row align="middle" gutter={20}>
            <Col>
              <Avatar
                size={60}
                shape="square"
                src={selectedSchool.logo}
                style={{
                  borderRadius: 12,
                  border: `1px solid ${token.colorBorder}`,
                  backgroundColor: token.colorWhite,
                }}
              />
            </Col>
            <Col flex="auto">
              <Flex vertical>
                <Title
                  level={4}
                  style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}
                >
                  {selectedSchool.name}
                </Title>
                <Space size={12} split={<Divider orientation="vertical" />}>
                  <Space size={4}>
                    <EnvironmentOutlined
                      style={{ color: token.colorPrimary, fontSize: 13 }}
                    />
                    <Text type="secondary" style={{ fontSize: "14px" }}>
                      {selectedSchool.province}
                    </Text>
                  </Space>
                  <Tag
                    color="#11b6f5"
                    variant="filled"
                    style={{ borderRadius: 6, margin: 0, border: "none" }}
                  >
                    {selectedSchool.type}
                  </Tag>
                </Space>
              </Flex>
            </Col>
          </Row>
        )
      }
      styles={{
        header: {
          padding: "24px",
          borderBottom: `1px solid ${token.colorBorder}`,
        },
        body: {
          padding: "32px 24px",
          backgroundColor: token.colorBgLayout,
        },
      }}
    >
      {selectedSchool && (
        <Flex vertical style={{ width: "100%" }}>
          <Flex
            justify="space-between"
            align="center"
            style={{ marginBottom: 24 }}
          >
            <Title
              level={5}
              style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}
            >
              ตำแหน่งงานที่เปิดรับสมัคร
            </Title>
            <Tag
              color="cyan"
              style={{ borderRadius: 100, padding: "2px 12px", border: "none" }}
            >
              {selectedSchool.jobs.length} ตำแหน่ง
            </Tag>
          </Flex>

          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            {selectedSchool.jobs.length > 0 ? (
              selectedSchool.jobs.map((job) => (
                <Card
                  key={job.id}
                  hoverable
                  style={{
                    borderRadius: token.borderRadiusLG,
                    border: `1px solid ${token.colorBorder}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                  styles={{ body: { padding: "20px 24px" } }}
                >
                  <Row justify="space-between" align="top">
                    <Col flex="auto">
                      <Flex vertical gap={12} style={{ width: "100%" }}>
                        <Title
                          level={5}
                          style={{
                            margin: 0,
                            color: token.colorPrimary,
                            fontSize: 17,
                            fontWeight: 700,
                          }}
                        >
                          {job.title}
                        </Title>

                        <Row gutter={[16, 8]}>
                          <Col span={12}>
                            <Space size={8}>
                              <DollarOutlined
                                style={{
                                  color: token.colorSuccess,
                                  fontSize: 16,
                                }}
                              />
                              <Text style={{ fontSize: 14 }}>{job.salary}</Text>
                            </Space>
                          </Col>
                          <Col span={12}>
                            <Space size={8}>
                              <ClockCircleOutlined
                                style={{ color: token.colorInfo, fontSize: 16 }}
                              />
                              <Text style={{ fontSize: 14 }}>{job.type}</Text>
                            </Space>
                          </Col>
                        </Row>
                      </Flex>
                    </Col>
                  </Row>
                </Card>
              ))
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="ยังไม่มีตำแหน่งงานที่เปิดรับสมัครในขณะนี้"
                style={{ padding: "40px 0" }}
              />
            )}
          </Space>
        </Flex>
      )}
    </Drawer>
  );
};
