"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  StopOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Empty,
  Flex,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import Link from "next/link";
import type { ReactNode } from "react";
import { useApplicantDrawerStore } from "../_state/applicant-drawer-store";
import { useJobReadStore, type JobRecord } from "../_state/job-read-store";
import { useJobStatsModalStore } from "../_state/job-stats-modal-store";

const { Text } = Typography;

const PRIMARY = "#11b6f5";

// ตารางประกาศรับสมัครครู — ข้อมูลครบถ้วนสำหรับฝ่ายบุคลากร
export const JobsTable = () => {
  const { jobs, searchKeyword, activeTab, closeJob } = useJobReadStore();
  const { openDrawer } = useApplicantDrawerStore();
  const { openModal: openStatsModal } = useJobStatsModalStore();
  const { token } = theme.useToken();
  const { user } = useAuthStore();

  const handleCloseJob = (record: JobRecord) => {
    Modal.confirm({
      title: "ปิดรับสมัครประกาศนี้?",
      content: `"${record.title}" จะถูกเปลี่ยนเป็นสถานะปิดรับสมัคร ผู้สมัครจะไม่สามารถสมัครเพิ่มได้`,
      okText: "ยืนยัน ปิดรับสมัคร",
      cancelText: "ยกเลิก",
      okButtonProps: { danger: true },
      onOk: async () => {
        if (user?.user_id) {
          await closeJob(user.user_id, record.key);
        }
      },
    });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchKeyword ||
      job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.subjects.some((s) =>
        s.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
    const matchesTab = activeTab === "ALL" || job.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const STATUS_CONFIG: Record<
    string,
    { color: string; text: string; icon: ReactNode }
  > = {
    ACTIVE: {
      color: "green",
      text: "กำลังเปิดรับ",
      icon: <CheckCircleOutlined />,
    },
    CLOSED: { color: "default", text: "ปิดรับแล้ว", icon: <StopOutlined /> },
    DRAFT: { color: "orange", text: "ฉบับร่าง", icon: <ClockCircleOutlined /> },
  };

  const columns = [
    {
      title: "ตำแหน่ง / วิชาที่สอน",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: JobRecord) => (
        <Flex vertical gap={6}>
          <Text strong style={{ fontSize: 15, color: PRIMARY }}>
            {text}
          </Text>
          <Flex wrap="wrap" gap={4}>
            {record.subjects.map((s) => (
              <Tag key={s} color="blue" style={{ margin: 0 }}>
                {s}
              </Tag>
            ))}
          </Flex>
          <Text type="secondary" style={{ fontSize: 12 }}>
            ระดับชั้น: {record.grades.join(", ")}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            เงินเดือน:{" "}
            <Text strong style={{ color: token.colorText, fontSize: 12 }}>
              {record.salary}
            </Text>
          </Text>
        </Flex>
      ),
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: string) => {
        const cfg = STATUS_CONFIG[status];
        return (
          <Tag color={cfg.color} icon={cfg.icon} style={{ fontSize: 12 }}>
            {cfg.text}
          </Tag>
        );
      },
    },
    {
      title: "ผู้สมัคร",
      key: "applicants",
      width: 160,
      render: (_: unknown, record: JobRecord) => (
        <Flex vertical gap={8}>
          <Flex align="center" gap={8}>
            <UserOutlined
              style={{ color: token.colorTextTertiary, fontSize: 13 }}
            />
            <Text style={{ fontSize: 14 }}>ทั้งหมด</Text>
            <Text strong style={{ fontSize: 16, color: token.colorText }}>
              {record.applicants}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              คน
            </Text>
          </Flex>
          {record.newApplicants > 0 && (
            <Badge
              count={`+${record.newApplicants} ใหม่`}
              style={{
                backgroundColor: token.colorPrimaryBg,
                color: PRIMARY,
                border: `1px solid ${token.colorPrimaryBorder}`,
                fontSize: 11,
                fontWeight: 600,
                boxShadow: "none",
              }}
            />
          )}
          <Flex align="center" gap={6}>
            <EyeOutlined
              style={{ color: token.colorTextQuaternary, fontSize: 12 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.views.toLocaleString()} ครั้ง
            </Text>
          </Flex>
        </Flex>
      ),
    },
    {
      title: "วันที่ประกาศ / หมดอายุ",
      key: "dates",
      width: 160,
      render: (_: unknown, record: JobRecord) => {
        const expires = new Date(record.expiresAt);
        const today = new Date();
        const daysLeft = Math.ceil(
          (expires.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        const isExpiringSoon =
          record.status === "ACTIVE" && daysLeft <= 7 && daysLeft >= 0;
        const isExpired = daysLeft < 0;

        return (
          <Flex vertical gap={4}>
            <Text style={{ fontSize: 13 }}>{record.publishedAt}</Text>
            <Flex align="center" gap={4}>
              <Text
                type={
                  isExpiringSoon
                    ? "warning"
                    : isExpired
                      ? "danger"
                      : "secondary"
                }
                style={{ fontSize: 12 }}
              >
                หมดอายุ: {record.expiresAt}
              </Text>
            </Flex>
            {isExpiringSoon && (
              <Tag color="orange" style={{ fontSize: 10, margin: 0 }}>
                เหลือ {daysLeft} วัน
              </Tag>
            )}
            {isExpired && record.status === "ACTIVE" && (
              <Tag color="red" style={{ fontSize: 10, margin: 0 }}>
                หมดอายุแล้ว
              </Tag>
            )}
          </Flex>
        );
      },
    },
    {
      title: "จัดการ",
      key: "action",
      width: 160,
      render: (_: unknown, record: JobRecord) => (
        <Space size={6}>
          <Tooltip title="ดูผู้สมัครทั้งหมด">
            <Button
              icon={<UserAddOutlined />}
              type="primary"
              ghost
              size="small"
              onClick={() => openDrawer(record.key, record.title, user?.user_id ?? "")}
            />
          </Tooltip>
          <Tooltip title="แก้ไขประกาศ">
            <Link href={`/pages/employer/job/post/${record.key}`}>
              <Button icon={<EditOutlined />} size="small" />
            </Link>
          </Tooltip>
          <Tooltip title="ดูสถิติ">
            <Button
              icon={<BarChartOutlined />}
              size="small"
              onClick={() => openStatsModal(record.key, user?.user_id ?? "")}
            />
          </Tooltip>
          <Tooltip title="ปิดรับสมัคร">
            <Button
              danger
              icon={<StopOutlined />}
              size="small"
              disabled={record.status === "CLOSED"}
              onClick={() => handleCloseJob(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
      styles={{ body: { padding: 0 } }}
    >
      <Table
        columns={columns}
        dataSource={filteredJobs}
        rowKey="key"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `ทั้งหมด ${total} ประกาศ`,
          showSizeChanger: false,
        }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text type="secondary">
                  {searchKeyword
                    ? `ไม่พบประกาศที่ตรงกับ "${searchKeyword}"`
                    : "ยังไม่มีประกาศรับสมัครงาน"}
                </Text>
              }
            />
          ),
        }}
        style={{ borderRadius: 14 }}
      />
    </Card>
  );
};
