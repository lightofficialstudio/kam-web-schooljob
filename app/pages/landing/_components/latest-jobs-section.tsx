"use client";

import { useTheme } from "@/app/contexts/theme-context";
import { GlobalOutlined, RocketOutlined } from "@ant-design/icons";
import {
  theme as antTheme,
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Space,
  Tag,
  Typography,
} from "antd";
import mockJobs from "../mock-up-data.json";

const { Title, Text } = Typography;

// ส่วนแสดงประกาศงานใหม่ล่าสุดแบบ Horizontal Scroll
export default function LatestJobsSection() {
  const { mode } = useTheme();
  const { token } = antTheme.useToken();
  const isDark = mode === "dark";

  return (
    <div
      style={{
        padding: "80px 24px",
        background: isDark ? "#0D1117" : "#fdfdfd",
        borderTop: `1px solid ${token.colorBorder}`,
        borderBottom: `1px solid ${token.colorBorder}`,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section Header */}
        <Flex
          justify="space-between"
          align="flex-end"
          style={{ marginBottom: "40px" }}
        >
          <div>
            <Badge status="processing" text="อัปเดตล่าสุด" />
            <Title level={2} style={{ marginTop: "12px", marginBottom: 0 }}>
              ประกาศงานใหม่ล่าสุด
            </Title>
          </div>
          <Button type="link" size="large">
            ดูงานทั้งหมด <RocketOutlined />
          </Button>
        </Flex>

        {/* Horizontal Scroll Container */}
        <div
          className="job-scroll-container"
          style={{
            overflowX: "auto",
            padding: "20px 0", // เพิ่ม padding บน-ล่างเพื่อให้เห็น border ตอน hover
            display: "flex",
            gap: "24px",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {mockJobs.map((job, idx) => (
            <div key={idx} style={{ minWidth: "350px", flexShrink: 0 }}>
              <Card
                hoverable
                style={{ borderRadius: "20px", height: "100%" }}
                styles={{ body: { padding: "24px" } }}
              >
                <Space
                  orientation="vertical"
                  size={16}
                  style={{ width: "100%" }}
                >
                  {/* Badge + Posted Date */}
                  <Flex justify="space-between" align="flex-start">
                    {job.isNew ? (
                      <Badge count="New" color="#ef4444" />
                    ) : (
                      <div />
                    )}
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {job.postedAt}
                    </Text>
                  </Flex>

                  {/* School Info */}
                  <Flex gap={12} align="center">
                    <Avatar
                      src={job.schoolLogo}
                      size={48}
                      shape="square"
                      style={{ borderRadius: "8px", flexShrink: 0 }}
                    />
                    <div style={{ overflow: "hidden" }}>
                      <Title
                        level={4}
                        style={{
                          marginBottom: 0,
                          fontSize: "16px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {job.title}
                      </Title>
                      <Text style={{ color: "#5B5B5B", fontSize: "13px" }}>
                        {job.school}
                      </Text>
                    </div>
                  </Flex>

                  {/* Location + Salary */}
                  <Space orientation="vertical" size={4}>
                    <Text type="secondary" style={{ fontSize: "13px" }}>
                      <GlobalOutlined /> {job.location}
                    </Text>
                    <Text
                      style={{
                        color: "#2b3244",
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                    >
                      ฿ {job.salary}
                    </Text>
                  </Space>

                  {/* Tags */}
                  <Space size={[4, 4]} wrap>
                    {job.tags.map((tag) => (
                      <Tag
                        key={tag}
                        color="#11b6f5"
                        style={{ borderRadius: "4px" }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </Space>

                  <Button
                    type="primary"
                    block
                    style={{
                      borderRadius: "10px",
                      height: "40px",
                      backgroundColor: "#11b6f5",
                      borderColor: "#11b6f5",
                    }}
                  >
                    ดูรายละเอียด
                  </Button>
                </Space>
              </Card>
            </div>
          ))}
        </div>

        <style jsx global>{`
          .job-scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
}
