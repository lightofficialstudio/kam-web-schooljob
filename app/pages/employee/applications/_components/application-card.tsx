"use client";

import {
  BankOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  EnvironmentOutlined,
  EyeOutlined,
  FileTextOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Steps, Tag, theme, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/th";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import type { ApplicationEntry } from "../_stores/applications-store";

dayjs.extend(relativeTime);
dayjs.locale("th");

const { Text } = Typography;

// ✨ config สำหรับแต่ละ status
const STATUS_CONFIG = {
  submitted: {
    label: "รอการพิจารณา",
    color: "processing",
    tagColor: "blue",
  },
  interview: {
    label: "นัดสัมภาษณ์",
    color: "warning",
    tagColor: "orange",
  },
  accepted: {
    label: "ผ่านการคัดเลือก",
    color: "success",
    tagColor: "green",
  },
  rejected: {
    label: "ไม่ผ่านการคัดเลือก",
    color: "error",
    tagColor: "red",
  },
};

// ✨ สร้าง steps ตาม status ปัจจุบัน
function buildSteps(status: ApplicationEntry["status"]) {
  const base = [
    {
      title: "ส่งใบสมัคร",
      description: "ส่งสำเร็จแล้ว",
      icon: <FileTextOutlined />,
    },
    {
      title: "รอพิจารณา",
      description: "HR กำลังตรวจสอบ",
    },
    {
      title: "สัมภาษณ์",
      description: "นัดหมายสัมภาษณ์",
    },
  ];

  if (status === "rejected") {
    return {
      steps: [
        ...base,
        {
          title: "ไม่ผ่าน",
          description: "ไม่ผ่านการคัดเลือก",
          icon: <CloseCircleFilled style={{ color: "#ff4d4f" }} />,
        },
      ],
      current: 3,
      status: "error" as const,
    };
  }

  if (status === "accepted") {
    return {
      steps: [
        ...base,
        {
          title: "ผ่านแล้ว!",
          description: "ยินดีด้วย",
          icon: <SmileOutlined style={{ color: "#52c41a" }} />,
        },
      ],
      current: 3,
      status: "finish" as const,
    };
  }

  if (status === "interview") {
    return {
      steps: [
        ...base,
        {
          title: "ผลการคัดเลือก",
          description: "รอประกาศผล",
        },
      ],
      current: 2,
      status: "process" as const,
    };
  }

  // submitted
  return {
    steps: [
      ...base,
      {
        title: "ผลการคัดเลือก",
        description: "รอประกาศผล",
      },
    ],
    current: 1,
    status: "process" as const,
  };
}

// ✨ แสดงช่วงเงินเดือน
function formatSalary(
  min: number | null,
  max: number | null,
  negotiable: boolean
) {
  if (negotiable) return "ตามตกลง";
  if (min && max)
    return `${min.toLocaleString()} – ${max.toLocaleString()} บาท`;
  if (min) return `${min.toLocaleString()} บาท ขึ้นไป`;
  if (max) return `ไม่เกิน ${max.toLocaleString()} บาท`;
  return null;
}

interface ApplicationCardProps {
  app: ApplicationEntry;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ app }) => {
  const { token } = theme.useToken();
  const cfg = STATUS_CONFIG[app.status];
  const { steps, current, status: stepStatus } = buildSteps(app.status);
  const salary = formatSalary(app.salaryMin, app.salaryMax, app.salaryNegotiable);

  const isDeadlineSoon =
    app.deadline &&
    dayjs(app.deadline).diff(dayjs(), "day") <= 3 &&
    dayjs(app.deadline).isAfter(dayjs());

  const isDeadlinePassed = app.deadline && dayjs(app.deadline).isBefore(dayjs());

  return (
    <div
      style={{
        borderRadius: 16,
        border: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* ─── Status accent bar ─── */}
      <div
        style={{
          height: 4,
          background:
            app.status === "accepted"
              ? "linear-gradient(90deg, #52c41a 0%, #95de64 100%)"
              : app.status === "rejected"
                ? "linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%)"
                : app.status === "interview"
                  ? "linear-gradient(90deg, #fa8c16 0%, #ffc53d 100%)"
                  : `linear-gradient(90deg, ${token.colorPrimary} 0%, #5dd5fb 100%)`,
        }}
      />

      <div style={{ padding: "20px 24px" }}>
        {/* ─── Header row ─── */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Logo */}
            <Avatar
              size={52}
              src={app.schoolLogoUrl || undefined}
              icon={!app.schoolLogoUrl ? <BankOutlined /> : undefined}
              style={{
                background: `linear-gradient(135deg, ${token.colorPrimary}22 0%, ${token.colorPrimary}44 100%)`,
                color: token.colorPrimary,
                border: `1px solid ${token.colorBorderSecondary}`,
                flexShrink: 0,
              }}
            />

            {/* Job info */}
            <div className="flex-1 min-w-0">
              <Text
                strong
                style={{
                  fontSize: 16,
                  display: "block",
                  marginBottom: 4,
                  color: token.colorText,
                }}
                ellipsis
              >
                {app.jobTitle}
              </Text>
              <Text
                type="secondary"
                style={{ fontSize: 13, display: "block" }}
                ellipsis
              >
                {app.schoolName}
                {app.schoolType && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {" "}
                    · {app.schoolType}
                  </Text>
                )}
              </Text>
            </div>
          </div>

          {/* Status badge */}
          <Tag
            color={cfg.tagColor}
            style={{ flexShrink: 0, fontSize: 12, margin: 0, borderRadius: 6 }}
          >
            {app.status === "accepted" && (
              <CheckCircleFilled style={{ marginRight: 4 }} />
            )}
            {cfg.label}
          </Tag>
        </div>

        {/* ─── Meta row ─── */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-5">
          <Text type="secondary" style={{ fontSize: 12 }}>
            <EnvironmentOutlined style={{ marginRight: 4 }} />
            {app.province}
          </Text>
          {app.jobType && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {app.jobType}
            </Text>
          )}
          {salary && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {salary}
            </Text>
          )}
          <Tooltip title="วันที่ส่งใบสมัคร">
            <Text type="secondary" style={{ fontSize: 12 }}>
              <CalendarOutlined style={{ marginRight: 4 }} />
              ส่งเมื่อ {dayjs(app.appliedAt).fromNow()}
            </Text>
          </Tooltip>
          {app.deadline && (
            <Tooltip
              title={`วันหมดรับสมัคร: ${dayjs(app.deadline).format("D MMM YYYY")}`}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: isDeadlinePassed
                    ? token.colorTextDisabled
                    : isDeadlineSoon
                      ? "#fa541c"
                      : token.colorTextSecondary,
                }}
              >
                {isDeadlinePassed
                  ? `หมดรับสมัครแล้ว`
                  : `หมดรับสมัคร ${dayjs(app.deadline).fromNow()}`}
              </Text>
            </Tooltip>
          )}
        </div>

        {/* ─── Stepper ─── */}
        <div
          style={{
            background: token.colorFillQuaternary,
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: app.coverLetter ? 16 : 0,
          }}
        >
          <Steps
            size="small"
            current={current}
            status={stepStatus}
            items={steps.map((s) => ({
              title: <span style={{ fontSize: 12 }}>{s.title}</span>,
              description: (
                <span style={{ fontSize: 11 }}>{s.description}</span>
              ),
              icon: s.icon,
            }))}
          />
        </div>

        {/* ─── Cover letter preview ─── */}
        {app.coverLetter && (
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 10,
              background: token.colorFillTertiary,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 4 }}>
              จดหมายสมัครงาน
            </Text>
            <Text
              style={{ fontSize: 13, color: token.colorText }}
              ellipsis={{ tooltip: app.coverLetter, rows: 2 }}
            >
              {app.coverLetter}
            </Text>
          </div>
        )}

        {/* ─── Footer row ─── */}
        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }}>
          <Text type="secondary" style={{ fontSize: 11 }}>
            อัปเดตล่าสุด {dayjs(app.updatedAt).fromNow()}
          </Text>
          <Link href={`/pages/job?job_id=${app.jobId}`} target="_blank">
            <Button
              size="small"
              icon={<EyeOutlined />}
              style={{ fontSize: 12 }}
            >
              ดูประกาศงาน
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
