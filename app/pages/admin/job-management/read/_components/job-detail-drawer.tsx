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
import {
  Avatar, Button, Col, Descriptions, Drawer, Empty, Flex,
  Row, Space, Spin, Tabs, Tag, Timeline, Typography,
} from "antd";
import dayjs from "dayjs";
import { useAdminJobStore } from "../_state/admin-job-store";
import { JobStatusTag } from "./job-status-tag";

const { Text, Title } = Typography;

const ACTION_COLOR: Record<string, string> = {
  CREATE_JOB:        "green",
  UPDATE_JOB_STATUS: "blue",
  DELETE_JOB:        "red",
};

const ACTION_TH: Record<string, string> = {
  CREATE_JOB:        "สร้างประกาศงาน",
  UPDATE_JOB_STATUS: "เปลี่ยนสถานะ",
  DELETE_JOB:        "ลบประกาศงาน",
};

interface JobDetailDrawerProps {
  onUpdateStatus: (jobId: string, status: "OPEN" | "CLOSED" | "DRAFT") => void;
}

export function JobDetailDrawer({ onUpdateStatus }: JobDetailDrawerProps) {
  const { drawerOpen, drawerJob, closeDrawer, jobAuditLogs, isLoadingJobAudit } = useAdminJobStore();

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
      width={540}
      styles={{ body: { padding: 0 } }}
    >
      {/* ── Header ── */}
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

      {/* ── Quick Actions ── */}
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
          <Button size="small" onClick={() => onUpdateStatus(drawerJob.id, "DRAFT")}>
            ตั้งเป็น Draft
          </Button>
        )}
      </Flex>

      {/* ── Tabs ── */}
      <Tabs
        defaultActiveKey="info"
        size="small"
        style={{ padding: "0 24px" }}
        items={[
          {
            key: "info",
            label: "ข้อมูล",
            children: (
              <Row gutter={[0, 16]} style={{ paddingBottom: 24 }}>
                <Col span={24}>
                  <Descriptions size="small" column={1} bordered>
                    <Descriptions.Item label={<><EnvironmentOutlined /> จังหวัด</>}>
                      {drawerJob.province}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><UserOutlined /> อัตราว่าง</>}>
                      {drawerJob.positionsAvailable} อัตรา
                    </Descriptions.Item>
                    <Descriptions.Item label="เงินเดือน">{salary}</Descriptions.Item>
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
            ),
          },
          {
            key: "audit",
            label: (
              <span>
                ประวัติการแก้ไข
                {jobAuditLogs.length > 0 && (
                  <Tag color="blue" style={{ marginLeft: 6, fontSize: 10 }}>
                    {jobAuditLogs.length}
                  </Tag>
                )}
              </span>
            ),
            children: (
              <div style={{ paddingBottom: 24 }}>
                {isLoadingJobAudit ? (
                  <Flex justify="center" style={{ paddingTop: 32 }}>
                    <Spin />
                  </Flex>
                ) : jobAuditLogs.length === 0 ? (
                  <Empty
                    description="ยังไม่มีประวัติการดำเนินการในระบบ"
                    style={{ marginTop: 32 }}
                  />
                ) : (
                  <Timeline
                    style={{ marginTop: 16 }}
                    items={jobAuditLogs.map((log) => ({
                      color: ACTION_COLOR[log.action] ?? "gray",
                      children: (
                        <Flex vertical gap={2}>
                          <Flex gap={8} align="center" wrap="wrap">
                            <Text strong style={{ fontSize: 12 }}>
                              {ACTION_TH[log.action] ?? log.action}
                            </Text>
                            <Flex gap={6} align="center">
                              <Avatar
                                src={log.admin.profileImageUrl}
                                size={18}
                                style={{ flexShrink: 0 }}
                              >
                                {log.admin.firstName?.[0] ?? "A"}
                              </Avatar>
                              <Text style={{ fontSize: 11 }} type="secondary">
                                {[log.admin.firstName, log.admin.lastName].filter(Boolean).join(" ") || log.admin.email}
                              </Text>
                            </Flex>
                          </Flex>
                          {log.note && (
                            <Text style={{ fontSize: 11 }} type="secondary">
                              {log.note}
                            </Text>
                          )}
                          <Text style={{ fontSize: 10 }} type="secondary">
                            {dayjs(log.createdAt).format("D MMM YYYY HH:mm:ss")}
                          </Text>
                        </Flex>
                      ),
                    }))}
                  />
                )}
              </div>
            ),
          },
        ]}
      />
    </Drawer>
  );
}
