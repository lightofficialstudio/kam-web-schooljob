"use client";

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar, Button, Dropdown, Popconfirm,
  Progress, Table, Typography, theme,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { AdminJob } from "../_api/admin-job-api";
import { JobStatusTag } from "./job-status-tag";

const { Text } = Typography;

interface JobTableProps {
  jobs: AdminJob[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  adminUserId: string;
  onPageChange: (p: number) => void;
  onViewDetail: (job: AdminJob) => void;
  onUpdateStatus: (jobId: string, status: "OPEN" | "CLOSED" | "DRAFT") => void;
  onDelete: (jobId: string) => void;
}

const fillPercent = (apps: number, positions: number) =>
  positions > 0 ? Math.min(Math.round((apps / positions) * 100), 100) : 0;

const fillColor = (pct: number) => {
  if (pct >= 100) return "#ef4444";
  if (pct >= 70)  return "#f59e0b";
  return "#11b6f5";
};

export function JobTable({
  jobs, total, page, pageSize, isLoading,
  adminUserId, onPageChange, onViewDetail, onUpdateStatus, onDelete,
}: JobTableProps) {
  const router = useRouter();
  const { token } = theme.useToken();

  const columns: ColumnsType<AdminJob> = [
    {
      title: "โรงเรียน / ตำแหน่ง",
      key: "main",
      render: (_, r) => (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "4px 0" }}>
          <Avatar
            src={r.schoolProfile.logoUrl}
            size={40}
            style={{
              flexShrink: 0,
              border: `2px solid ${token.colorBorderSecondary}`,
            }}
          >
            {r.schoolProfile.schoolName[0]}
          </Avatar>

          <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            <Text strong style={{ fontSize: 13, lineHeight: 1.3 }} ellipsis>
              {r.title}
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }} ellipsis>
              {r.schoolProfile.schoolName}
            </Text>
            {/* subject pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 2 }}>
              {r.jobSubjects.slice(0, 2).map((s) => (
                <span
                  key={s.subject}
                  style={{
                    padding: "1px 7px",
                    fontSize: 10,
                    borderRadius: 999,
                    background: token.colorPrimaryBg,
                    color: token.colorPrimary,
                    border: `1px solid ${token.colorPrimaryBorder}`,
                    lineHeight: 1.6,
                  }}
                >
                  {s.subject}
                </span>
              ))}
              {r.jobSubjects.length > 2 && (
                <span
                  style={{
                    padding: "1px 7px",
                    fontSize: 10,
                    borderRadius: 999,
                    background: token.colorFillAlter,
                    color: token.colorTextSecondary,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    lineHeight: 1.6,
                  }}
                >
                  +{r.jobSubjects.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "จังหวัด",
      key: "province",
      width: 100,
      render: (_, r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: token.colorPrimary, flexShrink: 0,
            }}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>{r.province}</Text>
        </div>
      ),
    },
    {
      title: "สถานะ",
      key: "status",
      width: 130,
      render: (_, r) => <JobStatusTag status={r.status} />,
      filters: [
        { text: "เปิดรับสมัคร", value: "OPEN" },
        { text: "ปิดรับสมัคร", value: "CLOSED" },
        { text: "ฉบับร่าง",    value: "DRAFT" },
      ],
      onFilter: (v, r) => r.status === v,
    },
    {
      title: "ผู้สมัคร / อัตรา",
      key: "apps",
      width: 155,
      sorter: (a, b) => a._count.applications - b._count.applications,
      render: (_, r) => {
        const pct   = fillPercent(r._count.applications, r.positionsAvailable);
        const color = fillColor(pct);
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span style={{ fontWeight: 600, color }}>{r._count.applications} คน</span>
              <Text type="secondary" style={{ fontSize: 11 }}>/ {r.positionsAvailable} อัตรา</Text>
            </div>
            <Progress
              percent={pct}
              showInfo={false}
              size={["100%", 4]}
              strokeColor={color}
              railColor={token.colorFillSecondary}
            />
          </div>
        );
      },
    },
    {
      title: "Deadline",
      key: "deadline",
      width: 110,
      sorter: (a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""),
      render: (_, r) => {
        if (!r.deadline) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
        const daysLeft  = dayjs(r.deadline).diff(dayjs(), "day");
        const isExpired = daysLeft < 0;
        const isUrgent  = daysLeft >= 0 && daysLeft <= 7;
        const dateColor = isExpired
          ? token.colorError
          : isUrgent
            ? token.colorWarning
            : token.colorTextSecondary;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: dateColor }}>
              {dayjs(r.deadline).format("D MMM YY")}
            </span>
            {!isExpired && (
              <span style={{ fontSize: 10, color: isUrgent ? token.colorWarning : token.colorTextQuaternary }}>
                {isUrgent ? `⚠ เหลือ ${daysLeft} วัน` : `${daysLeft} วัน`}
              </span>
            )}
            {isExpired && (
              <span style={{ fontSize: 10, color: token.colorError }}>หมดอายุแล้ว</span>
            )}
          </div>
        );
      },
    },
    {
      title: "สร้างเมื่อ",
      key: "createdAt",
      width: 100,
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      render: (_, r) => (
        <Text type="secondary" style={{ fontSize: 11 }}>
          {dayjs(r.createdAt).format("D MMM YY")}
        </Text>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 52,
      fixed: "right",
      render: (_, r) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "view",
                icon: <EyeOutlined />,
                label: "ดูรายละเอียด + ผู้สมัคร",
                onClick: () => onViewDetail(r),
              },
              {
                key: "edit",
                icon: <EditOutlined />,
                label: "แก้ไขประกาศ",
                onClick: () => router.push(`/pages/employer/job/post/${r.id}`),
              },
              { type: "divider" },
              r.status !== "OPEN"
                ? { key: "open",  icon: <PlayCircleOutlined />,  label: "เปิดรับสมัคร", onClick: () => onUpdateStatus(r.id, "OPEN") }
                : { key: "close", icon: <PauseCircleOutlined />, label: "ปิดรับสมัคร", onClick: () => onUpdateStatus(r.id, "CLOSED") },
              {
                key: "draft",
                label: "ตั้งเป็น Draft",
                onClick: () => onUpdateStatus(r.id, "DRAFT"),
                disabled: r.status === "DRAFT",
              },
              { type: "divider" },
              {
                key: "delete",
                icon: <DeleteOutlined />,
                danger: true,
                label: (
                  <Popconfirm
                    title="ลบประกาศงาน?"
                    description="การกระทำนี้ไม่สามารถย้อนกลับได้"
                    onConfirm={(e) => { e?.stopPropagation(); onDelete(r.id); }}
                    okText="ลบ"
                    cancelText="ยกเลิก"
                    okButtonProps={{ danger: true }}
                  >
                    <span onClick={(e) => e.stopPropagation()}>ลบประกาศ</span>
                  </Popconfirm>
                ),
              },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div
      style={{
        borderRadius: token.borderRadiusLG,
        overflow: "hidden",
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: token.boxShadowTertiary,
      }}
    >
      <Table<AdminJob>
        rowKey="id"
        columns={columns}
        dataSource={jobs}
        loading={isLoading}
        scroll={{ x: 820 }}
        onRow={(r) => ({ onClick: () => onViewDetail(r), style: { cursor: "pointer" } })}
        pagination={{
          current: page,
          pageSize,
          total,
          showTotal: (t) => (
            <Text type="secondary" style={{ fontSize: 12 }}>
              ทั้งหมด <strong>{t}</strong> รายการ
            </Text>
          ),
          onChange: onPageChange,
          showSizeChanger: false,
        }}
      />
    </div>
  );
}
