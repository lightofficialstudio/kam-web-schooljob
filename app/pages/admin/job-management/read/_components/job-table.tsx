"use client";

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Flex, Popconfirm, Table, Tag, Typography } from "antd";
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

export function JobTable({
  jobs, total, page, pageSize, isLoading,
  onPageChange, onViewDetail, onUpdateStatus, onDelete,
}: JobTableProps) {
  const router = useRouter();

  const columns: ColumnsType<AdminJob> = [
    {
      title: "โรงเรียน",
      key: "school",
      width: 200,
      render: (_, r) => (
        <Flex gap={8} align="center">
          <Avatar src={r.schoolProfile.logoUrl} size={32}>
            {r.schoolProfile.schoolName[0]}
          </Avatar>
          <Text style={{ fontSize: 12 }} ellipsis={{ tooltip: r.schoolProfile.schoolName }}>
            {r.schoolProfile.schoolName}
          </Text>
        </Flex>
      ),
    },
    {
      title: "ตำแหน่ง",
      key: "title",
      render: (_, r) => (
        <Flex vertical gap={2}>
          <Text strong style={{ fontSize: 13 }}>{r.title}</Text>
          <Flex gap={4} wrap="wrap">
            {r.jobSubjects.slice(0, 2).map((s) => (
              <Tag key={s.subject} style={{ fontSize: 10, margin: 0 }}>{s.subject}</Tag>
            ))}
            {r.jobSubjects.length > 2 && (
              <Tag style={{ fontSize: 10, margin: 0 }}>+{r.jobSubjects.length - 2}</Tag>
            )}
          </Flex>
        </Flex>
      ),
    },
    {
      title: "จังหวัด",
      dataIndex: "province",
      key: "province",
      width: 110,
    },
    {
      title: "สถานะ",
      key: "status",
      width: 120,
      render: (_, r) => <JobStatusTag status={r.status} />,
      filters: [
        { text: "เปิดรับสมัคร", value: "OPEN" },
        { text: "ปิดรับสมัคร", value: "CLOSED" },
        { text: "ฉบับร่าง",    value: "DRAFT" },
      ],
      onFilter: (v, r) => r.status === v,
    },
    {
      title: "ผู้สมัคร",
      key: "apps",
      width: 80,
      align: "center",
      render: (_, r) => (
        <Text strong style={{ color: r._count.applications > 0 ? "#11b6f5" : undefined }}>
          {r._count.applications}
        </Text>
      ),
      sorter: (a, b) => a._count.applications - b._count.applications,
    },
    {
      title: "Deadline",
      key: "deadline",
      width: 110,
      render: (_, r) => {
        if (!r.deadline) return <Text type="secondary">—</Text>;
        const isExpired = dayjs(r.deadline).isBefore(dayjs());
        return (
          <Text type={isExpired ? "danger" : "secondary"} style={{ fontSize: 12 }}>
            {dayjs(r.deadline).format("D MMM BB")}
          </Text>
        );
      },
      sorter: (a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""),
    },
    {
      title: "สร้างเมื่อ",
      key: "createdAt",
      width: 110,
      render: (_, r) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {dayjs(r.createdAt).format("D MMM BB")}
        </Text>
      ),
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: "",
      key: "actions",
      width: 48,
      align: "center",
      render: (_, r) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "view",
                icon: <EyeOutlined />,
                label: "ดูรายละเอียด",
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
                ? {
                    key: "open",
                    icon: <PlayCircleOutlined />,
                    label: "เปิดรับสมัคร",
                    onClick: () => onUpdateStatus(r.id, "OPEN"),
                  }
                : {
                    key: "close",
                    icon: <PauseCircleOutlined />,
                    label: "ปิดรับสมัคร",
                    onClick: () => onUpdateStatus(r.id, "CLOSED"),
                  },
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
                label: (
                  <Popconfirm
                    title="ลบประกาศงาน?"
                    description="การกระทำนี้ไม่สามารถย้อนกลับได้"
                    onConfirm={() => onDelete(r.id)}
                    okText="ลบ"
                    cancelText="ยกเลิก"
                    okButtonProps={{ danger: true }}
                  >
                    <span style={{ color: "red" }}>ลบประกาศ</span>
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
    <Table<AdminJob>
      rowKey="id"
      columns={columns}
      dataSource={jobs}
      loading={isLoading}
      scroll={{ x: 860 }}
      pagination={{
        current: page,
        pageSize,
        total,
        showTotal: (t) => `ทั้งหมด ${t} รายการ`,
        onChange: onPageChange,
        showSizeChanger: false,
      }}
    />
  );
}
