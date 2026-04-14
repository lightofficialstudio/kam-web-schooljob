"use client";

import {
  AlertOutlined,
  BankOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  DollarOutlined,
  EyeInvisibleOutlined,
  IdcardOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  WarningFilled,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Divider,
  Empty,
  Flex,
  Tag,
  Tooltip,
  Typography,
  theme as antTheme,
} from "antd";
import { useState } from "react";
import { useJobSearchStore } from "../_state/job-search-store";
import { useSavedJobsStore } from "../_state/saved-jobs-store";

const { Title, Text } = Typography;

// ✨ รายการเคล็ดลับความปลอดภัยสำหรับผู้สมัครงาน
const SAFETY_TIPS = [
  {
    icon: <DollarOutlined />,
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.1)",
    title: "อย่าโอนเงิน",
    detail: "งานที่ถูกต้องตามกฎหมายจะไม่เรียกเก็บค่าสมัคร ค่ามัดจำ หรือค่าอุปกรณ์ใดๆ ล่วงหน้า หากถูกขอเงิน ให้ระวังทันที",
  },
  {
    icon: <IdcardOutlined />,
    color: "#ef4444",
    bgColor: "rgba(239,68,68,0.1)",
    title: "ระวังข้อมูลส่วนตัว",
    detail: "ห้ามส่งสำเนาบัตรประชาชน หนังสือเดินทาง หรือข้อมูลบัญชีธนาคารก่อนผ่านการสัมภาษณ์จริง",
  },
  {
    icon: <EyeInvisibleOutlined />,
    color: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.1)",
    title: "ตรวจสอบตัวตนนายจ้าง",
    detail: "ค้นหาชื่อโรงเรียนใน Google แผนที่ หรือ เว็บกระทรวงศึกษา ก่อนสมัคร อย่าเชื่อเพียงรูปโลโก้เท่านั้น",
  },
  {
    icon: <PhoneOutlined />,
    color: "#11b6f5",
    bgColor: "rgba(17,182,245,0.1)",
    title: "ระวังการติดต่อนอกระบบ",
    detail: "หากถูกขอให้ติดต่อทาง LINE, WhatsApp ส่วนตัว หรือแอปอื่นนอกแพลตฟอร์มก่อนนัดสัมภาษณ์ ให้ระวังเป็นพิเศษ",
  },
  {
    icon: <BankOutlined />,
    color: "#10b981",
    bgColor: "rgba(16,185,129,0.1)",
    title: "สัมภาษณ์ในที่สาธารณะ",
    detail: "การสัมภาษณ์ครั้งแรกควรทำในสถานที่โรงเรียนจริง หรือผ่านวิดีโอคอล ไม่ใช่สถานที่ลับหรือที่พักส่วนตัว",
  },
  {
    icon: <AlertOutlined />,
    color: "#f43f5e",
    bgColor: "rgba(244,63,94,0.1)",
    title: "รายงานพฤติกรรมน่าสงสัย",
    detail: "หากพบประกาศงานที่ดูผิดปกติหรือน่าสงสัย สามารถแจ้งทีมงานได้ผ่านปุ่ม 'รายงาน' บนการ์ดงานนั้นๆ",
  },
];

// Sidebar ขวามือ: งานที่บันทึก + เคล็ดลับความปลอดภัย
export const SidebarSection = () => {
  const { token } = antTheme.useToken();
  const { savedJobIds, toggleSavedJob } = useSavedJobsStore();
  const { jobs, openJobDrawer } = useJobSearchStore();

  // ✨ state ควบคุมว่า tip ไหนกำลัง expand
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  // ✨ ดึงข้อมูล Job เต็มจาก store โดยใช้ savedJobIds เป็น key
  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  return (
    <Flex vertical gap={24}>
      {/* ─── Saved Jobs ─── */}
      <Card variant="borderless" style={{ borderRadius: token.borderRadiusLG }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
          <Title level={5} style={{ margin: 0 }}>
            งานที่บันทึกไว้
          </Title>
          <Badge
            count={savedJobs.length}
            showZero
            style={{
              backgroundColor: savedJobs.length > 0 ? "#11b6f5" : token.colorTextQuaternary,
            }}
          />
        </Flex>

        {savedJobs.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary" style={{ fontSize: 13 }}>
                กดไอคอนหัวใจบนการ์ดงานเพื่อบันทึกไว้ดูภายหลัง
              </Text>
            }
          />
        ) : (
          <Flex vertical>
            {savedJobs.map((job, index) => (
              <div key={job.id}>
                <Flex justify="space-between" align="center" style={{ padding: "8px 0" }}>
                  <Flex vertical style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                    <Text
                      strong
                      style={{ fontSize: 13, cursor: "pointer" }}
                      onClick={() => openJobDrawer(job)}
                      ellipsis
                    >
                      {job.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                      {job.schoolName}
                    </Text>
                  </Flex>
                  <Tooltip title="ลบออกจากรายการบันทึก">
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => toggleSavedJob(job.id)}
                    />
                  </Tooltip>
                </Flex>
                {index < savedJobs.length - 1 && <Divider style={{ margin: 0 }} />}
              </div>
            ))}
          </Flex>
        )}
      </Card>

      {/* ─── Safety Tips Card ─── */}
      <Card
        variant="borderless"
        style={{ borderRadius: token.borderRadiusLG, overflow: "hidden" }}
        styles={{ body: { padding: 0 } }}
      >
        {/* Header แบบ gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 60%, #5dd5fb 100%)",
            padding: "20px 20px 16px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* dot pattern overlay */}
          <div
            style={{
              position: "absolute", inset: 0,
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
              opacity: 0.08,
              pointerEvents: "none",
            }}
          />
          <Flex align="center" gap={10} style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(8px)",
              }}
            >
              <SafetyCertificateOutlined style={{ fontSize: 20, color: "#fff" }} />
            </div>
            <div>
              <Text strong style={{ color: "#fff", fontSize: 15, display: "block" }}>
                ปลอดภัยไว้ก่อน!
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                6 ข้อควรระวังสำหรับผู้สมัครงาน
              </Text>
            </div>
          </Flex>

          {/* verified badge */}
          <Tag
            icon={<CheckCircleFilled />}
            style={{
              position: "absolute", top: 14, right: 14,
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.35)",
              color: "#fff", fontSize: 11,
              backdropFilter: "blur(4px)",
              borderRadius: 20,
            }}
          >
            ยืนยันโดยทีมงาน
          </Tag>
        </div>

        {/* Tips List */}
        <div style={{ padding: "8px 0" }}>
          {SAFETY_TIPS.map((tip, index) => (
            <div key={index}>
              <div
                onClick={() => setExpandedTip(expandedTip === index ? null : index)}
                style={{
                  padding: "12px 20px",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  background: expandedTip === index
                    ? `${tip.bgColor}`
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (expandedTip !== index)
                    (e.currentTarget as HTMLDivElement).style.background = token.colorBgLayout;
                }}
                onMouseLeave={(e) => {
                  if (expandedTip !== index)
                    (e.currentTarget as HTMLDivElement).style.background = "transparent";
                }}
              >
                <Flex align="flex-start" gap={12}>
                  {/* icon bubble */}
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: tip.bgColor,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15, color: tip.color,
                    }}
                  >
                    {tip.icon}
                  </div>
                  <Flex vertical style={{ flex: 1, minWidth: 0 }}>
                    <Flex justify="space-between" align="center">
                      <Text strong style={{ fontSize: 13 }}>{tip.title}</Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: 18, lineHeight: 1, transition: "transform 0.2s", display: "inline-block",
                          transform: expandedTip === index ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        ›
                      </Text>
                    </Flex>
                    {expandedTip === index && (
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, lineHeight: 1.7, marginTop: 6, display: "block" }}
                      >
                        {tip.detail}
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </div>
              {index < SAFETY_TIPS.length - 1 && (
                <Divider style={{ margin: "0 20px", minWidth: "auto", width: "auto" }} />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px 16px",
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            background: token.colorBgLayout,
          }}
        >
          <Flex align="center" gap={8}>
            <WarningFilled style={{ color: "#f59e0b", fontSize: 14 }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              พบพฤติกรรมน่าสงสัย?{" "}
              <Text
                style={{ color: "#11b6f5", cursor: "pointer", fontSize: 12 }}
                onClick={() => {
                  const subject = encodeURIComponent("แจ้งประกาศงานน่าสงสัย");
                  const body = encodeURIComponent("กรุณาระบุ URL ของประกาศงานและรายละเอียดที่น่าสงสัย:");
                  window.open(`mailto:support@kamjob.com?subject=${subject}&body=${body}`, "_blank");
                }}
              >
                แจ้งทีมงาน
              </Text>
            </Text>
          </Flex>
        </div>
      </Card>

    </Flex>
  );
};
