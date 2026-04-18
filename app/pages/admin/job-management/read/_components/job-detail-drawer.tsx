"use client";

import {
  BankOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  MoneyCollectOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Drawer,
  Empty,
  Flex,
  Row,
  Space,
  Spin,
  Tabs,
  Tag,
  Timeline,
  Typography,
  theme,
} from "antd";
import dayjs from "dayjs";
import { useAdminJobStore } from "../_state/admin-job-store";
import { ApplicantList } from "./applicant-list";
import { JobStatusTag } from "./job-status-tag";

const { Text } = Typography;

// ✨ สีและ label สำหรับ audit action
const ACTION_COLOR: Record<string, string> = {
  CREATE_JOB: "#22c55e",
  UPDATE_JOB_STATUS: "#11b6f5",
  DELETE_JOB: "#ef4444",
};

const ACTION_TH: Record<string, string> = {
  CREATE_JOB: "สร้างประกาศงาน",
  UPDATE_JOB_STATUS: "เปลี่ยนสถานะ",
  DELETE_JOB: "ลบประกาศงาน",
};

interface JobDetailDrawerProps {
  onUpdateStatus: (jobId: string, status: "OPEN" | "CLOSED" | "DRAFT") => void;
}

export function JobDetailDrawer({ onUpdateStatus }: JobDetailDrawerProps) {
  const { token } = theme.useToken();
  const {
    drawerOpen,
    drawerJob,
    closeDrawer,
    applicants,
    isLoadingApplicants,
    jobAuditLogs,
    isLoadingJobAudit,
  } = useAdminJobStore();

  if (!drawerJob) return null;

  const salary = drawerJob.salaryNegotiable
    ? "ต่อรองได้"
    : drawerJob.salaryMin || drawerJob.salaryMax
      ? [drawerJob.salaryMin, drawerJob.salaryMax].filter(Boolean).join(" – ") +
        " บาท"
      : "—";

  // ✨ meta pills สำหรับแสดงในส่วน header
  const metaPills = [
    { icon: <EnvironmentOutlined />, label: drawerJob.province },
    { icon: <MoneyCollectOutlined />, label: salary },
    { icon: <UserOutlined />, label: `${drawerJob.positionsAvailable} อัตรา` },
    drawerJob.deadline && {
      icon: <CalendarOutlined />,
      label: `หมดเขต ${dayjs(drawerJob.deadline).format("D MMM YYYY")}`,
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[];

  return (
    <Drawer
      open={drawerOpen}
      onClose={closeDrawer}
      title={null}
      size="large"
      styles={{
        body: {
          padding: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
        wrapper: { boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" },
      }}
    >
      {/* ✨ Hero Header — gradient banner */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 55%, #5dd5fb 100%)",
          padding: "24px 24px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ✨ Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: "40%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />

        {/* ✨ Logo + Title row */}
        <Flex
          gap={14}
          align="center"
          style={{ position: "relative", zIndex: 1 }}
        >
          <Avatar
            src={drawerJob.schoolProfile.logoUrl}
            size={52}
            icon={<BankOutlined />}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "2px solid rgba(255,255,255,0.5)",
              flexShrink: 0,
              fontSize: 22,
              color: "#fff",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#fff",
                lineHeight: 1.3,
                marginBottom: 4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {drawerJob.title}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
              {drawerJob.schoolProfile.schoolName}
            </div>
          </div>
          <JobStatusTag status={drawerJob.status} />
        </Flex>

        {/* ✨ Meta pills row */}
        <Flex
          gap={6}
          wrap="wrap"
          style={{ marginTop: 14, position: "relative", zIndex: 1 }}
        >
          {metaPills.map((p, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.28)",
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: 11,
                color: "#fff",
                backdropFilter: "blur(4px)",
              }}
            >
              {p.icon}
              {p.label}
            </span>
          ))}
        </Flex>
      </div>

      {/* ✨ Action bar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: "10px 24px",
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        {drawerJob.status !== "OPEN" ? (
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            size="small"
            style={{ borderRadius: 20 }}
            onClick={() => onUpdateStatus(drawerJob.id, "OPEN")}
          >
            เปิดรับสมัคร
          </Button>
        ) : (
          <Button
            danger
            icon={<PauseCircleOutlined />}
            size="small"
            style={{ borderRadius: 20 }}
            onClick={() => onUpdateStatus(drawerJob.id, "CLOSED")}
          >
            ปิดรับสมัคร
          </Button>
        )}
        {drawerJob.status !== "DRAFT" && (
          <Button
            size="small"
            style={{ borderRadius: 20 }}
            onClick={() => onUpdateStatus(drawerJob.id, "DRAFT")}
          >
            ตั้งเป็น Draft
          </Button>
        )}
        <Text type="secondary" style={{ fontSize: 11, marginLeft: "auto" }}>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {dayjs(drawerJob.createdAt).format("D MMM YYYY HH:mm")}
        </Text>
      </div>

      {/* ✨ Tabs */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Tabs
          defaultActiveKey="applicants"
          size="small"
          style={{ padding: "0 24px" }}
          items={[
            /* ─── Tab 1: ผู้สมัคร ─── */
            {
              key: "applicants",
              label: (
                <Flex align="center" gap={6}>
                  <TeamOutlined />
                  <span>ผู้สมัคร</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "1px 7px",
                      borderRadius: 20,
                      background:
                        applicants.length > 0
                          ? "#11b6f5"
                          : token.colorFillSecondary,
                      color:
                        applicants.length > 0
                          ? "#fff"
                          : token.colorTextTertiary,
                      lineHeight: 1.8,
                    }}
                  >
                    {isLoadingApplicants ? "…" : applicants.length}
                  </span>
                </Flex>
              ),
              children: (
                <div style={{ paddingTop: 12 }}>
                  <ApplicantList
                    applicants={applicants}
                    isLoading={isLoadingApplicants}
                    total={applicants.length}
                  />
                </div>
              ),
            },

            /* ─── Tab 2: ข้อมูลตำแหน่ง ─── */
            {
              key: "info",
              label: "ข้อมูลตำแหน่ง",
              children: (
                <Flex
                  vertical
                  gap={16}
                  style={{ paddingTop: 16, paddingBottom: 24 }}
                >
                  {/* ✨ Info grid cards */}
                  <Row gutter={[12, 12]}>
                    {[
                      {
                        icon: <EnvironmentOutlined />,
                        label: "จังหวัด",
                        value: drawerJob.province,
                      },
                      {
                        icon: <UserOutlined />,
                        label: "อัตราว่าง",
                        value: `${drawerJob.positionsAvailable} อัตรา`,
                      },
                      {
                        icon: <MoneyCollectOutlined />,
                        label: "เงินเดือน",
                        value: salary,
                      },
                      {
                        icon: <CalendarOutlined />,
                        label: "ประเภทงาน",
                        value: drawerJob.jobType ?? "—",
                      },
                      drawerJob.deadline && {
                        icon: <CalendarOutlined />,
                        label: "หมดเขตรับสมัคร",
                        value: dayjs(drawerJob.deadline).format("D MMM YYYY"),
                      },
                    ]
                      .filter(Boolean)
                      .map((item, i) => {
                        const it = item as {
                          icon: React.ReactNode;
                          label: string;
                          value: string;
                        };
                        return (
                          <Col key={i} xs={12}>
                            <div
                              style={{
                                padding: "12px 14px",
                                borderRadius: 12,
                                background: token.colorFillAlter,
                                border: `1px solid ${token.colorBorderSecondary}`,
                              }}
                            >
                              <Flex align="center" gap={8}>
                                <span
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "rgba(17,182,245,0.1)",
                                    color: "#11b6f5",
                                    fontSize: 14,
                                  }}
                                >
                                  {it.icon}
                                </span>
                                <div>
                                  <div
                                    style={{
                                      fontSize: 10,
                                      color: token.colorTextTertiary,
                                      marginBottom: 2,
                                    }}
                                  >
                                    {it.label}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 13,
                                      fontWeight: 600,
                                      color: token.colorText,
                                    }}
                                  >
                                    {it.value}
                                  </div>
                                </div>
                              </Flex>
                            </div>
                          </Col>
                        );
                      })}
                  </Row>

                  {/* ✨ วิชาที่ต้องการ */}
                  {drawerJob.jobSubjects.length > 0 && (
                    <div
                      style={{
                        padding: "14px 16px",
                        borderRadius: 12,
                        background: token.colorFillAlter,
                        border: `1px solid ${token.colorBorderSecondary}`,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          color: token.colorTextSecondary,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          display: "block",
                          marginBottom: 10,
                        }}
                      >
                        วิชาที่ต้องการ
                      </Text>
                      <Space wrap>
                        {drawerJob.jobSubjects.map((s) => (
                          <Tag key={s.subject} style={{ borderRadius: 20 }}>
                            {s.subject}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  )}

                  {/* ✨ ระดับชั้น */}
                  {drawerJob.jobGrades.length > 0 && (
                    <div
                      style={{
                        padding: "14px 16px",
                        borderRadius: 12,
                        background: token.colorFillAlter,
                        border: `1px solid ${token.colorBorderSecondary}`,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          color: token.colorTextSecondary,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          display: "block",
                          marginBottom: 10,
                        }}
                      >
                        ระดับชั้นที่เปิดสอน
                      </Text>
                      <Space wrap>
                        {drawerJob.jobGrades.map((g) => (
                          <Tag
                            key={g.grade}
                            color="blue"
                            style={{ borderRadius: 20 }}
                          >
                            {g.grade}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  )}
                </Flex>
              ),
            },

            /* ─── Tab 3: ประวัติ Audit ─── */
            {
              key: "audit",
              label: (
                <Flex align="center" gap={6}>
                  <span>ประวัติการแก้ไข</span>
                  {jobAuditLogs.length > 0 && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "1px 7px",
                        borderRadius: 20,
                        lineHeight: 1.8,
                        background: "rgba(17,182,245,0.12)",
                        color: "#11b6f5",
                      }}
                    >
                      {jobAuditLogs.length}
                    </span>
                  )}
                </Flex>
              ),
              children: (
                <div style={{ paddingTop: 16, paddingBottom: 24 }}>
                  {isLoadingJobAudit ? (
                    <Flex justify="center" style={{ paddingTop: 40 }}>
                      <Spin />
                    </Flex>
                  ) : jobAuditLogs.length === 0 ? (
                    <Empty
                      description="ยังไม่มีประวัติการดำเนินการในระบบ"
                      style={{ marginTop: 40 }}
                    />
                  ) : (
                    <Timeline
                      style={{ marginTop: 8 }}
                      items={jobAuditLogs.map((log) => ({
                        color:
                          ACTION_COLOR[log.action] ?? token.colorTextTertiary,
                        children: (
                          <div
                            style={{
                              padding: "10px 14px",
                              borderRadius: 10,
                              background: token.colorFillAlter,
                              border: `1px solid ${token.colorBorderSecondary}`,
                            }}
                          >
                            <Flex
                              justify="space-between"
                              align="flex-start"
                              gap={8}
                            >
                              <Flex
                                vertical
                                gap={4}
                                style={{ flex: 1, minWidth: 0 }}
                              >
                                <Flex align="center" gap={8} wrap="wrap">
                                  <span
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 700,
                                      color: token.colorText,
                                    }}
                                  >
                                    {ACTION_TH[log.action] ?? log.action}
                                  </span>
                                  <Flex align="center" gap={5}>
                                    <Avatar
                                      src={log.admin.profileImageUrl}
                                      size={16}
                                    >
                                      {log.admin.firstName?.[0] ?? "A"}
                                    </Avatar>
                                    <span
                                      style={{
                                        fontSize: 11,
                                        color: token.colorTextSecondary,
                                      }}
                                    >
                                      {[log.admin.firstName, log.admin.lastName]
                                        .filter(Boolean)
                                        .join(" ") || log.admin.email}
                                    </span>
                                  </Flex>
                                </Flex>
                                {log.note && (
                                  <Text
                                    style={{ fontSize: 11 }}
                                    type="secondary"
                                  >
                                    {log.note}
                                  </Text>
                                )}
                              </Flex>
                              <Text
                                style={{ fontSize: 10, whiteSpace: "nowrap" }}
                                type="secondary"
                              >
                                {dayjs(log.createdAt).format("D MMM YY HH:mm")}
                              </Text>
                            </Flex>
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
