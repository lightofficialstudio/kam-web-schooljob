"use client";

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Empty, Flex, Spin, Tooltip, Typography, theme } from "antd";
import dayjs from "dayjs";
import { Applicant } from "../_api/admin-job-api";

const { Text } = Typography;

const LICENSE_MAP: Record<string, string> = {
  has_license:  "มีใบประกอบวิชาชีพ",
  pending:      "กำลังขอใบ",
  no_license:   "ไม่มีใบ",
  not_required: "ไม่จำเป็น",
};

interface ApplicantListProps {
  applicants: Applicant[];
  isLoading: boolean;
  total: number;
}

export function ApplicantList({ applicants, isLoading, total }: ApplicantListProps) {
  const { token } = theme.useToken();

  // ✨ สีสถานะ — ใช้ token ทั้งหมด
  const STATUS_MAP = {
    PENDING:   { label: "รอพิจารณา",      dot: token.colorWarning,    bg: token.colorWarningBg,   border: token.colorWarningBorder,   text: token.colorWarning   },
    INTERVIEW: { label: "นัดสัมภาษณ์",    dot: token.colorInfo,       bg: token.colorInfoBg,      border: token.colorInfoBorder,      text: token.colorInfo      },
    ACCEPTED:  { label: "ผ่านการคัดเลือก", dot: token.colorSuccess,    bg: token.colorSuccessBg,   border: token.colorSuccessBorder,   text: token.colorSuccess   },
    REJECTED:  { label: "ไม่ผ่าน",        dot: token.colorError,      bg: token.colorErrorBg,     border: token.colorErrorBorder,     text: token.colorError     },
  } as const;

  const pill = (label: string, bg: string, border: string, color: string) => (
    <span
      style={{
        fontSize: 10, padding: "1px 8px", borderRadius: 999, fontWeight: 600, lineHeight: 1.7,
        background: bg, border: `1px solid ${border}`, color,
      }}
    >
      {label}
    </span>
  );

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ height: 120 }}>
        <Spin />
      </Flex>
    );
  }

  if (applicants.length === 0) {
    return <Empty description="ยังไม่มีผู้สมัคร" style={{ marginTop: 32 }} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 24 }}>
      {/* ── Summary bar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>ผู้สมัครทั้งหมด</Text>
        <Text strong style={{ fontSize: 13, color: token.colorPrimary }}>{total} คน</Text>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(["PENDING", "INTERVIEW", "ACCEPTED", "REJECTED"] as const).map((s) => {
            const cnt = applicants.filter((a) => a.status === s).length;
            if (!cnt) return null;
            const st = STATUS_MAP[s];
            return pill(`${st.label} ${cnt}`, st.bg, st.border, st.text);
          })}
        </div>
      </div>

      {/* ── รายการผู้สมัคร ── */}
      {applicants.map((app, idx) => {
        const p   = app.applicant;
        const st  = STATUS_MAP[app.status];
        const edu = p.educations[0];
        const exp = p.workExperiences[0];
        const name = [p.firstName, p.lastName].filter(Boolean).join(" ") || p.email;

        return (
          <div
            key={app.id}
            style={{
              position: "relative",
              background: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
              padding: "12px 14px 12px 14px",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = token.colorPrimaryBorder;
              (e.currentTarget as HTMLDivElement).style.boxShadow   = token.boxShadow;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = token.colorBorderSecondary;
              (e.currentTarget as HTMLDivElement).style.boxShadow   = "none";
            }}
          >
            {/* row badge */}
            <span style={{ position: "absolute", top: 10, left: 10, fontSize: 10, color: token.colorTextQuaternary, fontFamily: "monospace" }}>
              #{idx + 1}
            </span>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, paddingLeft: 20 }}>
              {/* Avatar + status dot */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <Avatar
                  src={p.profileImageUrl}
                  size={44}
                  icon={<UserOutlined />}
                  style={{ border: `2px solid ${token.colorBorderSecondary}` }}
                />
                <span
                  style={{
                    position: "absolute", bottom: -2, right: -2,
                    width: 12, height: 12, borderRadius: "50%",
                    background: st.dot,
                    border: `2px solid ${token.colorBgContainer}`,
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
                {/* ชื่อ + badges */}
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                  <Text strong style={{ fontSize: 13 }}>{name}</Text>
                  {pill(st.label, st.bg, st.border, st.text)}
                  {p.licenseStatus && p.licenseStatus !== "no_license" && (
                    pill(
                      LICENSE_MAP[p.licenseStatus] ?? p.licenseStatus,
                      token.colorSuccessBg, token.colorSuccessBorder, token.colorSuccess,
                    )
                  )}
                  {p.canRelocate && pill("ย้ายที่ได้", token.colorInfoBg, token.colorInfoBorder, token.colorInfo)}
                </div>

                {/* contact */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>{p.email}</Text>
                  {p.phoneNumber && (
                    <>
                      <span style={{ color: token.colorBorderSecondary }}>·</span>
                      <Text type="secondary" style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}>
                        <PhoneOutlined style={{ fontSize: 10 }} />
                        {p.phoneNumber}
                      </Text>
                    </>
                  )}
                </div>

                {/* experience + edu */}
                <div style={{ display: "flex", flexWrap: "wrap", columnGap: 16, rowGap: 2 }}>
                  {p.teachingExperience && (
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      ประสบการณ์ <Text strong style={{ fontSize: 11 }}>{p.teachingExperience}</Text>
                    </Text>
                  )}
                  {edu && (
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {edu.level} — {edu.institution}{edu.major ? ` (${edu.major})` : ""}
                    </Text>
                  )}
                  {exp && (
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {exp.jobTitle} @ {exp.companyName}
                      {exp.inPresent ? " (ปัจจุบัน)" : exp.endDate ? ` ถึง ${dayjs(exp.endDate).format("MMM YY")}` : ""}
                    </Text>
                  )}
                </div>

                {/* subject + grade pills */}
                {(p.specializations.length > 0 || p.gradeCanTeaches.length > 0) && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 2 }}>
                    {p.specializations.slice(0, 3).map((s) =>
                      pill(s.subject, token.colorPrimaryBg, token.colorPrimaryBorder, token.colorPrimary)
                    )}
                    {p.gradeCanTeaches.slice(0, 2).map((g) =>
                      pill(g.grade, token.colorInfoBg, token.colorInfoBorder, token.colorInfo)
                    )}
                  </div>
                )}

                {/* footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                  <Text type="secondary" style={{ fontSize: 10 }}>
                    สมัครเมื่อ {dayjs(app.appliedAt).format("D MMM YYYY HH:mm")}
                  </Text>
                  {app.resume ? (
                    <Tooltip title={app.resume.fileName}>
                      <a
                        href={app.resume.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: 10, color: token.colorPrimary, display: "flex", alignItems: "center", gap: 3 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileTextOutlined />
                        Resume
                      </a>
                    </Tooltip>
                  ) : (
                    <Text type="secondary" style={{ fontSize: 10 }}>ไม่มี Resume</Text>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
