"use client";

import {
  ClockCircleOutlined,
  FileProtectOutlined,
  RightOutlined,
  StarFilled,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Flex,
  Row,
  Space,
  Tag,
  Typography,
  theme as antTheme,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import type { SchoolOpenJob } from "../_api/school-profile-api";

const { Title, Text } = Typography;

interface OpenJobsSectionProps {
  jobs: SchoolOpenJob[];
  schoolId: string;
}

// ✨ แสดงตำแหน่งงานที่กำลังเปิดรับสมัครของโรงเรียน
export const OpenJobsSection = ({ jobs, schoolId }: OpenJobsSectionProps) => {
  const { token } = antTheme.useToken();
  const router = useRouter();

  if (!jobs.length) {
    return (
      <Card
        style={{
          borderRadius: token.borderRadiusLG,
          border: `1px solid ${token.colorBorderSecondary}`,
          textAlign: "center",
          padding: "40px 0",
        }}
      >
        <Flex vertical align="center" gap={12}>
          <Text style={{ fontSize: 40 }}>📋</Text>
          <Title level={5} style={{ margin: 0 }}>
            ยังไม่มีตำแหน่งงานเปิดรับสมัครในขณะนี้
          </Title>
          <Text type="secondary">ติดตามโรงเรียนนี้เพื่อรับการแจ้งเตือนเมื่อมีตำแหน่งใหม่</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center">
        <Flex gap={8} align="center">
          <Title level={4} style={{ margin: 0 }}>ตำแหน่งที่เปิดรับสมัคร</Title>
          <Tag color="green" style={{ borderRadius: 99, margin: 0, fontWeight: 700 }}>
            {jobs.length} ตำแหน่ง
          </Tag>
        </Flex>
      </Flex>

      {jobs.map((job) => {
        const salaryText = job.salaryNegotiable
          ? "ตามประสบการณ์"
          : job.salaryMin && job.salaryMax
            ? `฿${job.salaryMin.toLocaleString()} – ฿${job.salaryMax.toLocaleString()}`
            : job.salaryMin
              ? `฿${job.salaryMin.toLocaleString()}+`
              : "ไม่ระบุ";

        const isDeadlineSoon =
          job.deadline &&
          dayjs(job.deadline).diff(dayjs(), "day") <= 7 &&
          dayjs(job.deadline).isAfter(dayjs());

        return (
          <Card
            key={job.id}
            hoverable
            onClick={() =>
              router.push(`/pages/job?job_id=${job.id}`)
            }
            style={{
              borderRadius: token.borderRadiusLG,
              border: `1px solid ${token.colorBorderSecondary}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            styles={{ body: { padding: "20px 24px" } }}
          >
            <Row justify="space-between" align="top" wrap>
              <Col flex="auto" style={{ minWidth: 0, paddingRight: 16 }}>
                <Flex gap={8} align="center" style={{ marginBottom: 8 }} wrap>
                  {job.isNew && (
                    <Tag
                      color="gold"
                      icon={<StarFilled />}
                      style={{ borderRadius: 99, margin: 0, fontSize: 11 }}
                    >
                      ใหม่
                    </Tag>
                  )}
                  {job.jobType && (
                    <Tag style={{ borderRadius: 99, margin: 0, fontSize: 11 }}>
                      {job.jobType}
                    </Tag>
                  )}
                  {isDeadlineSoon && (
                    <Tag
                      color="red"
                      icon={<ClockCircleOutlined />}
                      style={{ borderRadius: 99, margin: 0, fontSize: 11 }}
                    >
                      ใกล้ปิดรับ
                    </Tag>
                  )}
                </Flex>

                <Title level={5} style={{ margin: "0 0 8px", fontSize: 17 }}>
                  {job.title}
                </Title>

                <Space size={12} wrap style={{ marginBottom: 10 }}>
                  <Text strong style={{ color: token.colorPrimary, fontSize: 15 }}>
                    {salaryText}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    <TeamOutlined style={{ marginRight: 4 }} />
                    รับ {job.positionsAvailable} อัตรา
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    <FileProtectOutlined style={{ marginRight: 4 }} />
                    {job.licenseRequired}
                  </Text>
                </Space>

                {/* ── วิชา/ระดับชั้น ── */}
                <Flex gap={6} wrap>
                  {job.subjects.slice(0, 4).map((s) => (
                    <Tag key={s} color="blue" style={{ borderRadius: 99, fontSize: 12 }}>
                      {s}
                    </Tag>
                  ))}
                  {job.grades.slice(0, 3).map((g) => (
                    <Tag key={g} style={{ borderRadius: 99, fontSize: 12 }}>
                      {g}
                    </Tag>
                  ))}
                </Flex>
              </Col>

              <Col style={{ flexShrink: 0, textAlign: "right" }}>
                <Flex vertical align="flex-end" gap={10}>
                  {job.applicantCount > 0 && (
                    <Badge
                      count={`${job.applicantCount} คนสมัคร`}
                      style={{
                        backgroundColor: token.colorBgLayout,
                        color: token.colorTextSecondary,
                        fontSize: 12,
                        fontWeight: 500,
                        boxShadow: "none",
                        border: `1px solid ${token.colorBorderSecondary}`,
                      }}
                    />
                  )}
                  {job.deadline && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      ปิด {dayjs(job.deadline).format("D MMM")}
                    </Text>
                  )}
                  <Button
                    type="primary"
                    icon={<RightOutlined />}
                    size="middle"
                    style={{ borderRadius: token.borderRadius }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/pages/job/${job.id}/apply`);
                    }}
                  >
                    สมัครงาน
                  </Button>
                </Flex>
              </Col>
            </Row>
          </Card>
        );
      })}
    </Flex>
  );
};
