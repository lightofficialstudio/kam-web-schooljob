"use client";

import {
  BankOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Descriptions, Drawer, Flex, Row, Space, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useAdminJobStore } from "../_state/admin-job-store";
import { JobStatusTag } from "./job-status-tag";

const { Text, Title } = Typography;

interface JobDetailDrawerProps {
  adminUserId: string;
  onUpdateStatus: (jobId: string, status: "OPEN" | "CLOSED" | "DRAFT") => void;
}

export function JobDetailDrawer({ adminUserId, onUpdateStatus }: JobDetailDrawerProps) {
  const { drawerOpen, drawerJob, closeDrawer } = useAdminJobStore();

  if (!drawerJob) return null;

  const salary = drawerJob.salaryNegotiable
    ? "ต่อรองได้"
    : drawerJob.salaryMin || drawerJob.salaryMax
      ? [drawerJob.salaryMin, drawerJob.salaryMax].filter(Boolean).join(" – ") + " บาท"
      : "—";

  return (
    <Drawer
      open={drawerOpen}
      onClose={closeDrawer}
      title={null}
      width={520}
      styles={{ body: { padding: 0 } }}
    >
      {/* header */}
      <Flex
        gap={12}
        align="center"
        style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <Avatar src={drawerJob.schoolProfile.logoUrl} size={48} icon={<BankOutlined />} />
        <Flex vertical gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Title level={5} style={{ margin: 0 }} ellipsis>
            {drawerJob.title}
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {drawerJob.schoolProfile.schoolName}
          </Text>
        </Flex>
        <JobStatusTag status={drawerJob.status} />
      </Flex>

      {/* actions */}
      <Flex gap={8} style={{ padding: "12px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        {drawerJob.status !== "OPEN" ? (
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            size="small"
            onClick={() => onUpdateStatus(drawerJob.id, "OPEN")}
          >
            เปิดรับสมัคร
          </Button>
        ) : (
          <Button
            danger
            icon={<PauseCircleOutlined />}
            size="small"
            onClick={() => onUpdateStatus(drawerJob.id, "CLOSED")}
          >
            ปิดรับสมัคร
          </Button>
        )}
        {drawerJob.status !== "DRAFT" && (
          <Button
            size="small"
            onClick={() => onUpdateStatus(drawerJob.id, "DRAFT")}
          >
            ตั้งเป็น Draft
          </Button>
        )}
      </Flex>

      {/* info */}
      <div style={{ padding: "20px 24px" }}>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Descriptions size="small" column={1} bordered>
              <Descriptions.Item label={<><EnvironmentOutlined /> จังหวัด</>}>
                {drawerJob.province}
              </Descriptions.Item>
              <Descriptions.Item label={<><UserOutlined /> อัตราว่าง</>}>
                {drawerJob.positionsAvailable} อัตรา
              </Descriptions.Item>
              <Descriptions.Item label="เงินเดือน">
                {salary}
              </Descriptions.Item>
              <Descriptions.Item label="ประเภทงาน">
                {drawerJob.jobType ?? "—"}
              </Descriptions.Item>
              <Descriptions.Item label={<><CalendarOutlined /> Deadline</>}>
                {drawerJob.deadline ? dayjs(drawerJob.deadline).format("D MMM YYYY") : "—"}
              </Descriptions.Item>
              <Descriptions.Item label={<><TeamOutlined /> ผู้สมัคร</>}>
                <Text strong style={{ color: "#11b6f5" }}>
                  {drawerJob._count.applications} คน
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="สร้างเมื่อ">
                {dayjs(drawerJob.createdAt).format("D MMM YYYY HH:mm")}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          {drawerJob.jobSubjects.length > 0 && (
            <Col span={24}>
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>
                วิชาที่ต้องการ
              </Text>
              <Space wrap>
                {drawerJob.jobSubjects.map((s) => (
                  <Tag key={s.subject}>{s.subject}</Tag>
                ))}
              </Space>
            </Col>
          )}

          {drawerJob.jobGrades.length > 0 && (
            <Col span={24}>
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>
                ระดับชั้น
              </Text>
              <Space wrap>
                {drawerJob.jobGrades.map((g) => (
                  <Tag key={g.grade} color="blue">{g.grade}</Tag>
                ))}
              </Space>
            </Col>
          )}
        </Row>
      </div>
    </Drawer>
  );
}
