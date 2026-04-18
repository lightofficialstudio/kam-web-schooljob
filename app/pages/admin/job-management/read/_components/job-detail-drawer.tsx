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
import { ApplicantList } from "./applicant-list";
import { JobStatusTag } from "./job-status-tag";
import { useAdminJobStore } from "../_state/admin-job-store";

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
  const {
    drawerOpen, drawerJob, closeDrawer,
    applicants, isLoadingApplicants,
    jobAuditLogs, isLoadingJobAudit,
  } = useAdminJobStore();

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
      size="large"
      styles={{ body: { padding: 0, display: "flex", flexDirection: "column" } }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
        <Avatar
          src={drawerJob.schoolProfile.logoUrl}
          size={48}
          icon={<BankOutlined />}
          className="ring-2 ring-sky-100 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[14px] leading-snug line-clamp-1">
            {drawerJob.title}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {drawerJob.schoolProfile.schoolName}
          </div>
        </div>
        <JobStatusTag status={drawerJob.status} />
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex gap-2 px-6 py-2.5 border-b border-slate-100 bg-slate-50/50">
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
      </div>

      {/* ── Tabs ── */}
      <div className="flex-1 overflow-y-auto">
        <Tabs
          defaultActiveKey="applicants"
          size="small"
          className="px-6 [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-tab]:text-xs"
          items={[
            /* ─── Tab 1: ผู้สมัคร ─── */
            {
              key: "applicants",
              label: (
                <span className="flex items-center gap-1.5">
                  <TeamOutlined />
                  ผู้สมัคร
                  <span className={`text-[10px] px-1.5 py-px rounded-full font-semibold ${applicants.length > 0 ? "bg-sky-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                    {isLoadingApplicants ? "…" : applicants.length}
                  </span>
                </span>
              ),
              children: (
                <div className="pt-3">
                  <ApplicantList
                    applicants={applicants}
                    isLoading={isLoadingApplicants}
                    total={applicants.length}
                  />
                </div>
              ),
            },

            /* ─── Tab 2: ข้อมูล ─── */
            {
              key: "info",
              label: "ข้อมูลตำแหน่ง",
              children: (
                <Row gutter={[0, 16]} className="pt-4 pb-6">
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

            /* ─── Tab 3: ประวัติ Audit ─── */
            {
              key: "audit",
              label: (
                <span className="flex items-center gap-1.5">
                  ประวัติการแก้ไข
                  {jobAuditLogs.length > 0 && (
                    <span className="text-[10px] px-1.5 py-px rounded-full bg-blue-100 text-blue-600 font-semibold">
                      {jobAuditLogs.length}
                    </span>
                  )}
                </span>
              ),
              children: (
                <div className="pt-4 pb-6">
                  {isLoadingJobAudit ? (
                    <Flex justify="center" style={{ paddingTop: 32 }}>
                      <Spin />
                    </Flex>
                  ) : jobAuditLogs.length === 0 ? (
                    <Empty description="ยังไม่มีประวัติการดำเนินการในระบบ" style={{ marginTop: 32 }} />
                  ) : (
                    <Timeline
                      style={{ marginTop: 16 }}
                      items={jobAuditLogs.map((log) => ({
                        color: ACTION_COLOR[log.action] ?? "gray",
                        children: (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[12px] font-semibold text-gray-700">
                                {ACTION_TH[log.action] ?? log.action}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <Avatar
                                  src={log.admin.profileImageUrl}
                                  size={16}
                                  className="shrink-0"
                                >
                                  {log.admin.firstName?.[0] ?? "A"}
                                </Avatar>
                                <span className="text-[11px] text-gray-500">
                                  {[log.admin.firstName, log.admin.lastName].filter(Boolean).join(" ") || log.admin.email}
                                </span>
                              </div>
                            </div>
                            {log.note && (
                              <span className="text-[11px] text-gray-500">{log.note}</span>
                            )}
                            <span className="text-[10px] text-gray-400">
                              {dayjs(log.createdAt).format("D MMM YYYY HH:mm:ss")}
                            </span>
                          </div>
                        ),
                      }))}
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </Drawer>
  );
}
