"use client";

import {
  ClockCircleOutlined,
  RightOutlined,
  SolutionOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Card, Col, Flex, Row, Tag, Typography, theme as antTheme } from "antd";
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
          <div className="p-3 rounded-2xl bg-green-50 text-green-600">
            <SolutionOutlined className="text-xl" />
          </div>
          <Title
            level={3}
            className="m-0! font-black text-2xl tracking-tight"
            style={{ color: "#0F172A" }}
          >
            ตำแหน่งที่เปิดรับสมัคร
          </Title>
        </Flex>
        <Tag
          className="border-none! px-4 py-1.5 rounded-full font-black text-sm shadow-sm"
          style={{ backgroundColor: "#DCFCE7", color: "#15803D" }}
        >
          {jobs.length} ตำแหน่งงาน
        </Tag>
      </div>

      <div className="grid gap-6">
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
              onClick={() => router.push(`/pages/job/${job.id}`)}
              className="group border-none! shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(67,127,199,0.12)] transition-all duration-500 overflow-hidden"
              style={{
                borderRadius: 32,
                backgroundColor: token.colorBgContainer,
              }}
              styles={{ body: { padding: 40 } }}
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-[#437FC7] opacity-0 group-hover:opacity-100 transition-opacity" />

              <Row justify="space-between" align="middle" gutter={[24, 24]}>
                <Col flex="auto">
                  <Flex
                    gap={10}
                    align="center"
                    style={{ marginBottom: 12 }}
                    wrap
                  >
                    {job.isNew && (
                      <Tag
                        className="border-none! px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-sm"
                        style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}
                        icon={<StarFilled />}
                      >
                        ใหม่
                      </Tag>
                    )}
                    {isDeadlineSoon && (
                      <Tag
                        className="border-none! px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider"
                        style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
                        icon={<ClockCircleOutlined />}
                      >
                        ใกล้ปิดรับ
                      </Tag>
                    )}
                    <Tag className="border-none! bg-slate-100! text-slate-500! px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">
                      {job.jobType || "งานประจำ"}
                    </Tag>
                  </Flex>

                  <Title
                    level={4}
                    className="m-0! text-2xl font-black group-hover:text-[#437FC7] transition-colors mb-4"
                  >
                    {job.title}
                  </Title>

                  <Flex gap={32} wrap className="mb-6">
                    <Flex vertical>
                      <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">
                        งบประมาณรายเดือน
                      </Text>
                      <Text className="text-[#437FC7] text-xl font-black">
                        {salaryText}
                      </Text>
                    </Flex>
                    <Flex vertical>
                      <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">
                        จำนวนที่รับ
                      </Text>
                      <Text className="text-slate-700 text-xl font-black">
                        {job.positionsAvailable} อัตรา
                      </Text>
                    </Flex>
                  </Flex>

                  <Flex gap={8} wrap>
                    {job.subjects.map((s) => (
                      <Tag
                        key={s}
                        className="border-none! bg-slate-50! text-slate-500! px-4 py-1 rounded-xl font-bold text-xs hover:bg-white! hover:text-[#437FC7]! cursor-default"
                      >
                        {s}
                      </Tag>
                    ))}
                  </Flex>
                </Col>

                <Col className="hidden sm:block">
                  <div className="w-14 h-14 rounded-2xl bg-[#EDF6FF] flex items-center justify-center text-[#437FC7] group-hover:bg-[#437FC7] group-hover:text-white transition-all duration-300">
                    <RightOutlined className="text-xl font-bold" />
                  </div>
                </Col>
              </Row>
            </Card>
          );
        })}
      </div>
    </Flex>
  );
};
