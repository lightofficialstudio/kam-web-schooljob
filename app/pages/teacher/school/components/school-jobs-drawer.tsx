"use client";

import {
  BankOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Col,
  Drawer,
  Empty,
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
      title={
        selectedSchool && (
          <Space direction="vertical" size={2} style={{ width: "100%" }}>
            <Text style={{ fontSize: "18px", fontWeight: 700 }}>
              {selectedSchool.name}
            </Text>
            <Space size={12}>
              <Space size={4}>
                <EnvironmentOutlined
                  style={{ color: token.colorTextDescription }}
                />
                <Text type="secondary" style={{ fontSize: "13px" }}>
                  {selectedSchool.province}
                </Text>
              </Space>
              <Tag color="blue" bordered={false} style={{ borderRadius: 100 }}>
                {selectedSchool.type}
              </Tag>
            </Space>
          </Space>
        )
      }
      styles={{
        header: { paddingBottom: 12 },
        body: { padding: "16px 24px" },
      }}
    >
      {selectedSchool && (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong style={{ fontSize: "15px" }}>
                ตำแหน่งที่กำลังเปิดรับ
              </Text>
            </Col>
            <Col>
              <Badge
                count={selectedSchool.jobs.length}
                style={{ backgroundColor: token.colorPrimary }}
              />
            </Col>
          </Row>

          {selectedSchool.jobs.length > 0 ? (
            selectedSchool.jobs.map((job) => (
              <div
                key={job.id}
                style={{
                  padding: "16px",
                  borderRadius: token.borderRadiusLG,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  backgroundColor: token.colorBgContainer,
                  boxShadow: token.boxShadowTertiary,
                }}
              >
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <Space size={6} align="center">
                    <BankOutlined style={{ color: token.colorPrimary }} />
                    <Text strong style={{ fontSize: "15px" }}>
                      {job.title}
                    </Text>
                  </Space>
                  <Row gutter={16}>
                    <Col>
                      <Space size={4}>
                        <DollarOutlined
                          style={{ color: token.colorSuccess }}
                        />
                        <Text type="secondary" style={{ fontSize: "13px" }}>
                          {job.salary} บาท/เดือน
                        </Text>
                      </Space>
                    </Col>
                    <Col>
                      <Space size={4}>
                        <ClockCircleOutlined
                          style={{ color: token.colorTextDescription }}
                        />
                        <Tag
                          color={
                            job.type === "Full-time" ? "green" : "orange"
                          }
                          bordered={false}
                          style={{ borderRadius: 100, margin: 0 }}
                        >
                          {job.type}
                        </Tag>
                      </Space>
                    </Col>
                  </Row>
                </Space>
              </div>
            ))
          ) : (
            <Empty description="ไม่มีตำแหน่งที่เปิดรับในขณะนี้" />
          )}
        </Space>
      )}
    </Drawer>
  );
};
