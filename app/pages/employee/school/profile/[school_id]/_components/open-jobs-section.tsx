"use client";

import {
  ClockCircleOutlined,
  RightOutlined,
  SolutionOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Card, Col, Flex, Row, Tag, Typography, theme as antTheme } from "antd";
import { JobDetailDrawer } from "../../../../../job/_components/job-detail-drawer";
import { useJobSearchStore } from "../../../../../job/_state/job-search-store";
import type { SchoolOpenJob } from "../_api/school-profile-api";

const { Title, Text } = Typography;

interface OpenJobsSectionProps {
  jobs: SchoolOpenJob[];
  schoolId: string;
}

// ✨ แสดงตำแหน่งงานที่กำลังเปิดรับสมัครของโรงเรียน — ไม่มี logic ใน UI
export const OpenJobsSection = ({ jobs }: OpenJobsSectionProps) => {
  const { token } = antTheme.useToken();
  const { fetchAndOpenJob } = useJobSearchStore();

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
          <Text type="secondary">
            ติดตามโรงเรียนนี้เพื่อรับการแจ้งเตือนเมื่อมีตำแหน่งใหม่
          </Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Flex vertical gap={24}>
      <div className="flex items-center justify-between mb-2">
        <Flex gap={12} align="center">
          <div
            className="p-3 rounded-2xl"
            style={{ backgroundColor: token.colorSuccessBg, color: token.colorSuccess }}
          >
            <SolutionOutlined className="text-xl" />
          </div>
          <Title
            level={3}
            className="m-0! font-black text-2xl tracking-tight"
            style={{ color: token.colorTextHeading }}
          >
            ตำแหน่งที่เปิดรับสมัคร
          </Title>
        </Flex>
        <Tag
          className="border-none! px-4 py-1.5 rounded-full font-black text-sm shadow-sm"
          style={{ backgroundColor: token.colorSuccessBg, color: token.colorSuccess }}
        >
          {jobs.length} ตำแหน่งงาน
        </Tag>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card
            key={job.id}
            hoverable
            onClick={() => fetchAndOpenJob(job.id)}
            className="group border-none! shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden relative"
            style={{
              borderRadius: 32,
              backgroundColor: token.colorBgContainer,
            }}
            styles={{ body: { padding: 40 } }}
          >
            {/* ✨ accent bar ซ้าย */}
            <div
              className="absolute top-0 left-0 w-2 h-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: token.colorPrimary }}
            />

            <Row justify="space-between" align="middle" gutter={[24, 24]}>
              <Col flex="auto">
                <Flex gap={10} align="center" style={{ marginBottom: 12 }} wrap>
                  {/* ✨ isNew และ isDeadlineSoon มาจาก backend แล้ว */}
                  {job.isNew && (
                    <Tag
                      className="border-none! px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-sm"
                      style={{ backgroundColor: token.colorWarningBg, color: token.colorWarning }}
                      icon={<StarFilled />}
                    >
                      ใหม่
                    </Tag>
                  )}
                  {job.isDeadlineSoon && (
                    <Tag
                      className="border-none! px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider"
                      style={{ backgroundColor: token.colorErrorBg, color: token.colorError }}
                      icon={<ClockCircleOutlined />}
                    >
                      ใกล้ปิดรับ
                    </Tag>
                  )}
                  <Tag
                    className="border-none! px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider"
                    style={{ backgroundColor: token.colorFillAlter, color: token.colorTextSecondary }}
                  >
                    {job.jobType || "งานประจำ"}
                  </Tag>
                </Flex>

                <Title
                  level={4}
                  className="m-0! text-2xl font-black mb-4 transition-colors"
                  style={{ color: token.colorText }}
                >
                  {job.title}
                </Title>

                <Flex gap={32} wrap className="mb-6">
                  <Flex vertical>
                    <Text
                      className="text-[11px] font-bold uppercase tracking-widest mb-1"
                      style={{ color: token.colorTextQuaternary }}
                    >
                      งบประมาณรายเดือน
                    </Text>
                    {/* ✨ salaryText มาจาก backend แล้ว */}
                    <Text className="text-xl font-black" style={{ color: token.colorPrimary }}>
                      {job.salaryText}
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text
                      className="text-[11px] font-bold uppercase tracking-widest mb-1"
                      style={{ color: token.colorTextQuaternary }}
                    >
                      จำนวนที่รับ
                    </Text>
                    <Text className="text-xl font-black" style={{ color: token.colorText }}>
                      {job.positionsAvailable} อัตรา
                    </Text>
                  </Flex>
                </Flex>

                <Flex gap={8} wrap>
                  {job.subjects.map((s) => (
                    <Tag
                      key={s}
                      className="border-none! px-4 py-1 rounded-xl font-bold text-xs cursor-default"
                      style={{ backgroundColor: token.colorFillAlter, color: token.colorTextSecondary }}
                    >
                      {s}
                    </Tag>
                  ))}
                </Flex>
              </Col>

              <Col className="hidden sm:block">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
                  style={{ backgroundColor: token.colorPrimaryBg, color: token.colorPrimary }}
                >
                  <RightOutlined className="text-xl font-bold" />
                </div>
              </Col>
            </Row>
          </Card>
        ))}
      </div>

      {/* ✨ Job Detail Drawer */}
      <JobDetailDrawer />
    </Flex>
  );
};
