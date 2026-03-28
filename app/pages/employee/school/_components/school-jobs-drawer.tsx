"use client";

import {
  DollarOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
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
import { useRouter } from "next/navigation";
import { useSchoolStore } from "../_stores/school-store";

const { Title, Text } = Typography;

export const SchoolJobsDrawer = () => {
  const { token } = antTheme.useToken();
  const router = useRouter();
  const { selectedSchool, isDrawerOpen, setIsDrawerOpen, setSelectedSchool } =
    useSchoolStore();

  const handleClose = () => {
    setIsDrawerOpen(false);
    setSelectedSchool(null);
  };

  // นำทางไปหน้าสมัครงานของตำแหน่งนั้น พร้อมปิด Drawer
  const handleApply = (jobId: string) => {
    handleClose();
    router.push(`/pages/job/${jobId}/apply`);
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
                  style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}
                >
                  {selectedSchool.name}
                </Title>
                <Space size={12} separator={<Divider orientation="vertical" />}>
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
          {/* Section Header */}
          <Flex
            justify="space-between"
            align="center"
            style={{ marginBottom: 24 }}
          >
            <Title
              level={5}
              style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}
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

          {/* Job List */}
          <Space orientation="vertical" size={16} style={{ width: "100%" }}>
            {selectedSchool.jobs.length > 0 ? (
              selectedSchool.jobs.map((job) => (
                <Card
                  key={job.id}
                  style={{
                    borderRadius: token.borderRadiusLG,
                    border: `1px solid ${token.colorBorder}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                  styles={{ body: { padding: "20px 24px" } }}
                >
                  <Flex vertical gap={16}>
                    {/* Job Title + Tags */}
                    <Flex justify="space-between" align="flex-start" gap={12}>
                      <Title
                        level={5}
                        style={{
                          margin: 0,
                          color: token.colorPrimary,
                          fontSize: 16,
                          fontWeight: 600,
                          flex: 1,
                        }}
                      >
                        {job.title}
                      </Title>
                      <Tag
                        color={job.type === "Full-time" ? "blue" : "orange"}
                        style={{ borderRadius: 6, flexShrink: 0 }}
                      >
                        {job.type}
                      </Tag>
                    </Flex>

                    {/* Salary */}
                    <Space size={8}>
                      <DollarOutlined
                        style={{ color: token.colorSuccess, fontSize: 15 }}
                      />
                      <Text style={{ fontSize: 14, fontWeight: 500 }}>
                        ฿ {job.salary}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        / เดือน
                      </Text>
                    </Space>

                    <Divider style={{ margin: "4px 0" }} />

                    {/* [ข้อ 1] ปุ่มสมัครงาน */}
                    <Flex justify="flex-end">
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={() => handleApply(job.id)}
                        style={{
                          borderRadius: token.borderRadius,
                          fontWeight: 600,
                          height: 40,
                          paddingInline: 24,
                        }}
                      >
                        สมัครงานตำแหน่งนี้
                      </Button>
                    </Flex>
                  </Flex>
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
