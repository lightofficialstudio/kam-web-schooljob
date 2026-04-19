"use client";

// ✨ School Detail Drawer — ข้อมูลเชิงลึกของโรงเรียน 1 แห่ง (Feature 1)
import {
  BankOutlined,
  CalendarOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  SwapOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Descriptions,
  Divider,
  Drawer,
  Flex,
  Progress,
  Skeleton,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import dayjs from "dayjs";
import { PackagePlanItem, usePackageStore } from "../_state/package-store";

const { Text, Title } = Typography;

const STATUS_COLOR: Record<string, string> = {
  OPEN: "#22c55e",
  CLOSED: "#ef4444",
  DRAFT: "#94a3b8",
};
const STATUS_TH: Record<string, string> = {
  OPEN: "เปิดรับ",
  CLOSED: "ปิดแล้ว",
  DRAFT: "ฉบับร่าง",
};

interface Props {
  plans: PackagePlanItem[];
  onChangePlan: (schoolId: string, targetPlan: PackagePlanItem) => void;
}

export function SchoolDetailDrawer({ plans, onChangePlan }: Props) {
  const { token } = theme.useToken();
  const { drawerSchoolId, drawerDetail, isLoadingDetail, closeDrawer } = usePackageStore();
  const open = !!drawerSchoolId;

  const planDef = plans.find((p) => p.plan === drawerDetail?.accountPlan);
  const quotaPct = drawerDetail?.stats.quotaUsagePercent ?? 0;
  const quotaColor = quotaPct >= 90 ? token.colorError : quotaPct >= 70 ? token.colorWarning : token.colorSuccess;

  return (
    <Drawer
      open={open}
      onClose={closeDrawer}
      title={null}
      size="default"
      styles={{
        body: { padding: 0, display: "flex", flexDirection: "column" },
        wrapper: { boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" },
      }}
    >
      {/* ── Gradient Hero ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0d47a1 0%, #0a4a8a 50%, #11b6f5 100%)",
          padding: "24px 24px 20px",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        {isLoadingDetail ? (
          <Flex gap={14} align="center">
            <Skeleton.Avatar active size={56} />
            <Flex vertical gap={6}>
              <Skeleton.Input active size="small" style={{ width: 180 }} />
              <Skeleton.Input active size="small" style={{ width: 120 }} />
            </Flex>
          </Flex>
        ) : drawerDetail ? (
          <Flex gap={14} align="flex-start">
            <Avatar
              src={drawerDetail.logoUrl ?? undefined}
              size={56}
              style={{ border: "2px solid rgba(255,255,255,0.4)", flexShrink: 0, background: "rgba(255,255,255,0.2)", fontSize: 22, fontWeight: 700 }}
            >
              {drawerDetail.schoolName[0]}
            </Avatar>
            <Flex vertical gap={4} style={{ flex: 1, minWidth: 0 }}>
              <Title level={5} style={{ margin: 0, color: "#fff", lineHeight: 1.3 }} ellipsis>
                {drawerDetail.schoolName}
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
                {drawerDetail.province}{drawerDetail.district ? ` · ${drawerDetail.district}` : ""}
                {drawerDetail.schoolType ? ` · ${drawerDetail.schoolType}` : ""}
              </Text>
              {planDef && (
                <span style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 20, background: `${planDef.color}30`, border: `1px solid ${planDef.color}80`, color: "#fff", fontSize: 11, fontWeight: 700, width: "fit-content" }}>
                  {planDef.label}
                </span>
              )}
            </Flex>
          </Flex>
        ) : null}
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {isLoadingDetail ? (
          <Flex vertical gap={12}>
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} active paragraph={{ rows: 2 }} />)}
          </Flex>
        ) : drawerDetail ? (
          <Flex vertical gap={0}>

            {/* ── KPI Row ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "งานทั้งหมด", value: drawerDetail.stats.totalJobs, color: token.colorPrimary },
                { label: "กำลังเปิด", value: drawerDetail.stats.openJobs, color: token.colorSuccess },
                { label: "ใบสมัคร", value: drawerDetail.stats.totalApplications, color: token.colorWarning },
              ].map((kpi) => (
                <div key={kpi.label} style={{ textAlign: "center", padding: "12px 8px", borderRadius: 10, background: token.colorBgLayout, border: `1px solid ${token.colorBorderSecondary}` }}>
                  <Text strong style={{ fontSize: 22, color: kpi.color, display: "block", lineHeight: 1.2 }}>{kpi.value}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>{kpi.label}</Text>
                </div>
              ))}
            </div>

            {/* ── Quota Bar ── */}
            <div style={{ padding: "14px 16px", borderRadius: 10, background: token.colorBgLayout, border: `1px solid ${token.colorBorderSecondary}`, marginBottom: 20 }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                <Text strong style={{ fontSize: 13 }}>Job Quota Usage</Text>
                <Text strong style={{ fontSize: 13, color: quotaColor }}>{quotaPct}%</Text>
              </Flex>
              <Progress
                percent={quotaPct}
                showInfo={false}
                strokeColor={quotaColor}
                railColor={token.colorFillSecondary}
                size={["100%", 8]}
                style={{ marginBottom: 6 }}
              />
              <Flex justify="space-between">
                <Text type="secondary" style={{ fontSize: 11 }}>{drawerDetail.stats.activeJobCount} งานที่เปิดอยู่</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Max: {drawerDetail.jobQuotaMax >= 999 ? "∞" : drawerDetail.jobQuotaMax}
                </Text>
              </Flex>
            </div>

            {/* ── เปลี่ยน Plan ── */}
            <div style={{ marginBottom: 20 }}>
              <Flex align="center" gap={6} style={{ marginBottom: 10 }}>
                <SwapOutlined style={{ color: token.colorTextTertiary, fontSize: 12 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>เปลี่ยน Package</Text>
              </Flex>
              <Flex gap={6} wrap="wrap">
                {plans.filter((p) => p.isActive).map((p) => {
                  const isCurrent = p.plan === drawerDetail.accountPlan;
                  return (
                    <Tooltip key={p.plan} title={isCurrent ? "Package ปัจจุบัน" : `เปลี่ยนเป็น ${p.label}`}>
                      <button
                        disabled={isCurrent}
                        onClick={() => onChangePlan(drawerDetail.id, p)}
                        style={{
                          cursor: isCurrent ? "default" : "pointer",
                          padding: "4px 14px",
                          borderRadius: 20,
                          border: `1.5px solid ${p.color}`,
                          background: isCurrent ? p.color : "transparent",
                          color: isCurrent ? "#fff" : p.color,
                          fontWeight: 700,
                          fontSize: 12,
                          transition: "all 0.15s",
                          opacity: isCurrent ? 1 : 0.85,
                        }}
                      >
                        {p.label}
                      </button>
                    </Tooltip>
                  );
                })}
              </Flex>
            </div>

            <Divider style={{ margin: "0 0 16px" }} />

            {/* ── Owner Info ── */}
            <div style={{ marginBottom: 20 }}>
              <Flex align="center" gap={6} style={{ marginBottom: 10 }}>
                <UserOutlined style={{ color: token.colorTextTertiary, fontSize: 12 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>ผู้ดูแลระบบโรงเรียน</Text>
              </Flex>
              <Flex gap={10} align="center">
                <Avatar src={drawerDetail.owner.profileImageUrl ?? undefined} size={36} style={{ flexShrink: 0, border: `1px solid ${token.colorBorderSecondary}` }}>
                  {drawerDetail.owner.name[0] ?? "?"}
                </Avatar>
                <Flex vertical gap={2}>
                  <Text strong style={{ fontSize: 13 }}>{drawerDetail.owner.name}</Text>
                  <Flex align="center" gap={4}>
                    <MailOutlined style={{ fontSize: 10, color: token.colorTextTertiary }} />
                    <Text type="secondary" style={{ fontSize: 11 }}>{drawerDetail.owner.email}</Text>
                  </Flex>
                  {drawerDetail.owner.phoneNumber && (
                    <Flex align="center" gap={4}>
                      <PhoneOutlined style={{ fontSize: 10, color: token.colorTextTertiary }} />
                      <Text type="secondary" style={{ fontSize: 11 }}>{drawerDetail.owner.phoneNumber}</Text>
                    </Flex>
                  )}
                </Flex>
              </Flex>
            </div>

            {/* ── School Info ── */}
            <Descriptions column={2} size="small" style={{ marginBottom: 20 }}>
              {drawerDetail.studentCount && (
                <Descriptions.Item label={<><TeamOutlined /> นักเรียน</>}>
                  {drawerDetail.studentCount.toLocaleString()} คน
                </Descriptions.Item>
              )}
              {drawerDetail.teacherCount && (
                <Descriptions.Item label={<><TeamOutlined /> ครู</>}>
                  {drawerDetail.teacherCount.toLocaleString()} คน
                </Descriptions.Item>
              )}
              {drawerDetail.phone && (
                <Descriptions.Item label="โทร" span={2}>
                  {drawerDetail.phone}
                </Descriptions.Item>
              )}
              {drawerDetail.website && (
                <Descriptions.Item label={<><GlobalOutlined /> เว็บ</>} span={2}>
                  <a href={drawerDetail.website} target="_blank" rel="noreferrer" style={{ color: token.colorPrimary, fontSize: 12 }}>{drawerDetail.website}</a>
                </Descriptions.Item>
              )}
              <Descriptions.Item label={<><CalendarOutlined /> เข้าร่วม</>} span={2}>
                {dayjs(drawerDetail.owner.joinedAt).format("D MMM YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="อัปเดตล่าสุด" span={2}>
                {dayjs(drawerDetail.updatedAt).format("D MMM YYYY HH:mm")}
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: "0 0 16px" }} />

            {/* ── Recent Jobs ── */}
            <div>
              <Flex align="center" gap={6} style={{ marginBottom: 10 }}>
                <BankOutlined style={{ color: token.colorTextTertiary, fontSize: 12 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>ประกาศงานล่าสุด</Text>
              </Flex>
              {drawerDetail.recentJobs.length === 0 ? (
                <Text type="secondary" style={{ fontSize: 12 }}>ยังไม่มีประกาศงาน</Text>
              ) : (
                <Flex vertical gap={6}>
                  {drawerDetail.recentJobs.map((job) => (
                    <div key={job.id} style={{ padding: "10px 12px", borderRadius: 8, background: token.colorBgLayout, border: `1px solid ${token.colorBorderSecondary}` }}>
                      <Flex justify="space-between" align="flex-start" gap={8}>
                        <Text style={{ fontSize: 12, flex: 1 }} ellipsis={{ tooltip: job.title }}>{job.title}</Text>
                        <Badge
                          dot
                          color={STATUS_COLOR[job.status] ?? token.colorTextQuaternary}
                          text={<Text style={{ fontSize: 10, color: STATUS_COLOR[job.status] ?? token.colorTextSecondary }}>{STATUS_TH[job.status] ?? job.status}</Text>}
                        />
                      </Flex>
                      <Flex justify="space-between" style={{ marginTop: 4 }}>
                        <Text type="secondary" style={{ fontSize: 10 }}>{job.applicationCount} คนสมัคร</Text>
                        <Text type="secondary" style={{ fontSize: 10 }}>
                          {job.deadline ? `หมด ${dayjs(job.deadline).format("D MMM YY")}` : dayjs(job.createdAt).format("D MMM YY")}
                        </Text>
                      </Flex>
                    </div>
                  ))}
                </Flex>
              )}
            </div>

          </Flex>
        ) : null}
      </div>
    </Drawer>
  );
}
