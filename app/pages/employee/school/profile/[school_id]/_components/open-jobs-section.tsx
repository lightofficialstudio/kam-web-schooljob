"use client";

import {
  ClockCircleOutlined,
  RightOutlined,
  SolutionOutlined,
  StarFilled,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Flex,
  Row,
  Skeleton,
  Tag,
  Typography,
  theme as antTheme,
} from "antd";
import { JobDetailDrawer } from "../../../../../job/_components/job-detail-drawer";
import { useJobSearchStore } from "../../../../../job/_state/job-search-store";
import type { SchoolOpenJob } from "../_api/school-profile-api";

const { Title, Text } = Typography;

interface OpenJobsSectionProps {
  jobs: SchoolOpenJob[];
  schoolId: string;
  isLoading?: boolean;
}

// ✨ Skeleton card สำหรับ loading state
const JobCardSkeleton = () => {
  const { token } = antTheme.useToken();
  return (
    <Card
      style={{
        borderRadius: 24,
        backgroundColor: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
      styles={{ body: { padding: 32 } }}
    >
      <Flex vertical gap={16}>
        <Flex gap={8}>
          <Skeleton.Button active size="small" style={{ borderRadius: 100, width: 60 }} />
          <Skeleton.Button active size="small" style={{ borderRadius: 100, width: 80 }} />
        </Flex>
        <Skeleton active title={{ width: "55%" }} paragraph={{ rows: 1, width: "35%" }} />
        <Flex gap={8}>
          <Skeleton.Button active size="small" style={{ borderRadius: 8, width: 70 }} />
          <Skeleton.Button active size="small" style={{ borderRadius: 8, width: 90 }} />
          <Skeleton.Button active size="small" style={{ borderRadius: 8, width: 60 }} />
        </Flex>
      </Flex>
    </Card>
  );
};

// ✨ แสดงตำแหน่งงานที่กำลังเปิดรับสมัครของโรงเรียน — ไม่มี logic ใน UI
export const OpenJobsSection = ({ jobs, isLoading }: OpenJobsSectionProps) => {
  const { token } = antTheme.useToken();
  const { fetchAndOpenJob } = useJobSearchStore();

  // ── Skeleton Loading ──
  if (isLoading) {
    return (
      <Flex vertical gap={24}>
        {/* Header skeleton */}
        <Flex align="center" justify="space-between">
          <Flex gap={12} align="center">
            <Skeleton.Avatar active size={48} shape="square" style={{ borderRadius: 16 }} />
            <Skeleton.Input active style={{ width: 200, height: 28 }} />
          </Flex>
          <Skeleton.Button active style={{ borderRadius: 100, width: 100 }} />
        </Flex>
        {/* Card skeletons */}
        {Array.from({ length: 3 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </Flex>
    );
  }

  // ── Empty State ──
  if (!jobs.length) {
    return (
      <Card
        style={{
          borderRadius: 24,
          border: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
        }}
        styles={{ body: { padding: "56px 32px" } }}
      >
        <Flex vertical align="center" gap={16}>
          {/* ✨ Icon circle */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: `rgba(17,182,245,0.08)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SolutionOutlined style={{ fontSize: 32, color: token.colorPrimary }} />
          </div>
          <Flex vertical align="center" gap={6}>
            <Title level={5} style={{ margin: 0, color: token.colorTextHeading }}>
              ยังไม่มีตำแหน่งงานเปิดรับสมัคร
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              ติดตามโรงเรียนนี้เพื่อรับแจ้งเตือนเมื่อมีตำแหน่งใหม่
            </Text>
          </Flex>
        </Flex>
      </Card>
    );
  }

  return (
    <Flex vertical gap={20}>
      {/* ── Section Header ── */}
      <Flex align="center" justify="space-between">
        <Flex gap={12} align="center">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: `linear-gradient(135deg, rgba(17,182,245,0.15) 0%, rgba(17,182,245,0.05) 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid rgba(17,182,245,0.2)`,
            }}
          >
            <SolutionOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
          </div>
          <Flex vertical gap={2}>
            <Title level={4} style={{ margin: 0, color: token.colorTextHeading, fontSize: 20 }}>
              ตำแหน่งที่เปิดรับสมัคร
            </Title>
            <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
              อัปเดตล่าสุด — คลิกที่การ์ดเพื่อดูรายละเอียด
            </Text>
          </Flex>
        </Flex>
        <Tag
          style={{
            background: `linear-gradient(135deg, #11b6f5 0%, #0d8fd4 100%)`,
            color: "#fff",
            border: "none",
            borderRadius: 100,
            padding: "4px 16px",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {jobs.length} ตำแหน่ง
        </Tag>
      </Flex>

      {/* ── Job Cards ── */}
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => fetchAndOpenJob(job.id)}
            className="group cursor-pointer"
            style={{
              borderRadius: 20,
              border: `1px solid ${token.colorBorderSecondary}`,
              backgroundColor: token.colorBgContainer,
              overflow: "hidden",
              transition: "all 0.25s ease",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#11b6f5";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 8px 32px rgba(17,182,245,0.12)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = token.colorBorderSecondary;
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
          >
            {/* ✨ Accent bar top */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, #11b6f5 0%, #5dd5fb 100%)`,
                opacity: 0,
                transition: "opacity 0.25s ease",
              }}
              className="group-hover:opacity-100"
            />

            <div style={{ padding: "24px 28px" }}>
              <Row justify="space-between" align="middle" gutter={[16, 16]}>
                <Col flex="auto">
                  {/* ── Badges row ── */}
                  <Flex gap={6} align="center" style={{ marginBottom: 12 }} wrap>
                    {job.isNew && (
                      <Tag
                        icon={<StarFilled style={{ fontSize: 9 }} />}
                        style={{
                          background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 100,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 10px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        ใหม่
                      </Tag>
                    )}
                    {job.isDeadlineSoon && (
                      <Tag
                        icon={<ClockCircleOutlined style={{ fontSize: 10 }} />}
                        style={{
                          backgroundColor: token.colorErrorBg,
                          color: token.colorError,
                          border: "none",
                          borderRadius: 100,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 10px",
                        }}
                      >
                        ใกล้ปิดรับ
                      </Tag>
                    )}
                    <Tag
                      style={{
                        backgroundColor: token.colorFillAlter,
                        color: token.colorTextSecondary,
                        border: "none",
                        borderRadius: 100,
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "2px 10px",
                      }}
                    >
                      {job.jobType || "งานประจำ"}
                    </Tag>
                  </Flex>

                  {/* ── Title ── */}
                  <Title
                    level={5}
                    style={{
                      margin: "0 0 16px",
                      fontSize: 17,
                      fontWeight: 800,
                      color: token.colorTextHeading,
                      lineHeight: 1.4,
                      transition: "color 0.2s",
                    }}
                    className="group-hover:text-[#11b6f5]!"
                  >
                    {job.title}
                  </Title>

                  {/* ── Stats row ── */}
                  <Flex gap={24} wrap style={{ marginBottom: 16 }}>
                    <Flex vertical gap={2}>
                      <Text style={{ fontSize: 10, color: token.colorTextQuaternary, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        เงินเดือน
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: job.salaryText !== "ไม่ระบุ" ? token.colorPrimary : token.colorTextQuaternary,
                        }}
                      >
                        {job.salaryText || "ไม่ระบุ"}
                      </Text>
                    </Flex>
                    <Flex vertical gap={2}>
                      <Text style={{ fontSize: 10, color: token.colorTextQuaternary, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        รับจำนวน
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: 800, color: token.colorText }}>
                        {job.positionsAvailable} อัตรา
                      </Text>
                    </Flex>
                  </Flex>

                  {/* ── Subject tags ── */}
                  {job.subjects.length > 0 && (
                    <Flex gap={6} wrap>
                      {job.subjects.map((s) => (
                        <span
                          key={s}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "3px 12px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            backgroundColor: `rgba(17,182,245,0.07)`,
                            color: token.colorPrimary,
                            border: `1px solid rgba(17,182,245,0.18)`,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </Flex>
                  )}
                </Col>

                {/* ── Arrow CTA ── */}
                <Col className="hidden sm:block">
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: `rgba(17,182,245,0.08)`,
                      border: `1px solid rgba(17,182,245,0.2)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: token.colorPrimary,
                      transition: "all 0.25s ease",
                      flexShrink: 0,
                    }}
                    className="group-hover:bg-[#11b6f5]! group-hover:text-white! group-hover:border-[#11b6f5]!"
                  >
                    <RightOutlined style={{ fontSize: 14, fontWeight: 700 }} />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        ))}
      </div>

      {/* ✨ Job Detail Drawer */}
      <JobDetailDrawer />
    </Flex>
  );
};
