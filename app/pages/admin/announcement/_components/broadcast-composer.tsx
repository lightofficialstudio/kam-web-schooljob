"use client";

// ✨ Broadcast Composer — ฟอร์มสร้าง Announcement + Preview + Confirm before send
import {
  BellOutlined,
  EyeOutlined,
  LoadingOutlined,
  SendOutlined,
  TeamOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Flex,
  Input,
  Modal,
  Radio,
  Tag,
  Typography,
  theme,
} from "antd";
import { useAnnouncementStore } from "../_state/announcement-store";
import { TargetRole } from "../_api/announcement-api";
import { useEffect, useState } from "react";

const { Text } = Typography;
const { TextArea } = Input;

// ✨ config ของแต่ละ target role
const TARGET_CONFIG: Record<TargetRole, { label: string; color: string; icon: React.ReactNode; desc: string }> = {
  ALL: {
    label: "ทุกคน",
    color: "#11b6f5",
    icon: <TeamOutlined />,
    desc: "ส่งถึง ครู + โรงเรียน ทั้งหมด",
  },
  EMPLOYEE: {
    label: "ครู / ผู้หางาน",
    color: "#22c55e",
    icon: <UserOutlined />,
    desc: "ส่งถึงเฉพาะ EMPLOYEE",
  },
  EMPLOYER: {
    label: "โรงเรียน",
    color: "#f59e0b",
    icon: <BellOutlined />,
    desc: "ส่งถึงเฉพาะ EMPLOYER",
  },
};

interface Props {
  onSend: () => void;
  isSending: boolean;
}

export function BroadcastComposer({ onSend, isSending }: Props) {
  const { token } = theme.useToken();
  const {
    title,
    message,
    targetRole,
    setTitle,
    setMessage,
    setTargetRole,
    recipientCount,
    isCountingRecipients,
    fetchRecipientCount,
  } = useAnnouncementStore();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const cfg = TARGET_CONFIG[targetRole];
  const isValid = title.trim().length > 0 && message.trim().length > 0;

  // ✨ โหลด count ครั้งแรกเมื่อ mount — ใช้ targetRole ปัจจุบันจาก store
  useEffect(() => {
    fetchRecipientCount(targetRole);
  }, [fetchRecipientCount, targetRole]);

  // ✨ กดปุ่ม Send — count พร้อมแล้ว (update แบบ real-time) เปิด Modal ได้ทันที
  const handleOpenConfirm = () => {
    setConfirmOpen(true);
  };

  // ✨ ยืนยันส่งจริง
  const handleConfirm = () => {
    setConfirmOpen(false);
    onSend();
  };

  return (
    <>
      <Flex gap={20} align="flex-start" wrap="wrap">
        {/* ── Left: Form ── */}
        <Card
          style={{
            flex: 2,
            minWidth: 320,
            borderRadius: 16,
            border: `1px solid ${token.colorBorderSecondary}`,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
          styles={{ body: { padding: 24 } }}
          title={
            <Flex align="center" gap={8}>
              <SendOutlined style={{ color: "#11b6f5", fontSize: 15 }} />
              <Text strong>สร้าง Announcement</Text>
            </Flex>
          }
        >
          {/* ── Target Role Selector ── */}
          <div style={{ marginBottom: 20 }}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 10 }}>
              ส่งถึงกลุ่มผู้ใช้
            </Text>
            <Radio.Group
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as TargetRole)}
              style={{ width: "100%" }}
            >
              <Flex gap={8} wrap="wrap">
                {(Object.entries(TARGET_CONFIG) as [TargetRole, typeof TARGET_CONFIG[TargetRole]][]).map(([key, c]) => (
                  <Radio.Button
                    key={key}
                    value={key}
                    style={{
                      borderRadius: 8,
                      borderColor: targetRole === key ? c.color : token.colorBorder,
                      color: targetRole === key ? c.color : token.colorTextSecondary,
                      background: targetRole === key ? `${c.color}12` : token.colorBgContainer,
                      fontWeight: targetRole === key ? 700 : 400,
                      height: "auto",
                      padding: "8px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      transition: "all 0.2s",
                    }}
                  >
                    <Flex align="center" gap={6}>
                      <span style={{ color: targetRole === key ? c.color : token.colorTextSecondary }}>
                        {c.icon}
                      </span>
                      {c.label}
                    </Flex>
                  </Radio.Button>
                ))}
              </Flex>
            </Radio.Group>
            <Text type="secondary" style={{ fontSize: 11, marginTop: 6, display: "block" }}>
              {cfg.desc}
            </Text>
          </div>

          {/* ── Title ── */}
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>
              หัวข้อ (สูงสุด 120 ตัวอักษร)
            </Text>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="เช่น: แจ้งอัปเดตฟีเจอร์ใหม่ / ประกาศช่วงหยุดระบบ"
              showCount
              size="large"
              style={{ borderRadius: 8 }}
            />
          </div>

          {/* ── Message ── */}
          <div style={{ marginBottom: 20 }}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>
              เนื้อหา (สูงสุด 1,000 ตัวอักษร)
            </Text>
            <TextArea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              showCount
              autoSize={{ minRows: 5, maxRows: 10 }}
              placeholder="รายละเอียดของ Announcement..."
              style={{ borderRadius: 8, resize: "none" }}
            />
          </div>

          {/* ── Send Button → เปิด Confirm Modal ── */}
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            disabled={!isValid || isSending}
            onClick={handleOpenConfirm}
            style={{
              width: "100%",
              borderRadius: 10,
              fontWeight: 700,
              background: isValid ? "#11b6f5" : undefined,
              borderColor: isValid ? "#11b6f5" : undefined,
              height: 46,
            }}
          >
            {`ส่ง Broadcast ถึง${cfg.label}`}
          </Button>
        </Card>

        {/* ── Right: Preview ── */}
        <Card
          style={{
            flex: 1,
            minWidth: 280,
            borderRadius: 16,
            border: `1px solid ${token.colorBorderSecondary}`,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            position: "sticky",
            top: 80,
          }}
          styles={{ body: { padding: 20 } }}
          title={
            <Flex align="center" gap={8}>
              <EyeOutlined style={{ color: token.colorTextTertiary, fontSize: 14 }} />
              <Text strong style={{ fontSize: 13 }}>Preview</Text>
              <Tag
                style={{
                  fontSize: 10,
                  borderRadius: 20,
                  border: `1px solid ${cfg.color}`,
                  color: cfg.color,
                  background: `${cfg.color}12`,
                }}
              >
                {cfg.label}
              </Tag>
            </Flex>
          }
        >
          {/* ✨ Mock notification card */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              background: token.colorBgLayout,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderLeft: `4px solid #11b6f5`,
            }}
          >
            <Flex gap={10} align="flex-start">
              <Avatar
                icon={<BellOutlined />}
                size={36}
                style={{ background: "rgba(17,182,245,0.15)", color: "#11b6f5", flexShrink: 0 }}
              />
              <Flex vertical gap={3} style={{ flex: 1, minWidth: 0 }}>
                <Text strong style={{ fontSize: 13, lineHeight: 1.4 }}>
                  {title || <span style={{ color: token.colorTextQuaternary }}>หัวข้อ Announcement</span>}
                </Text>
                <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {message || <span style={{ color: token.colorTextQuaternary }}>เนื้อหาจะแสดงที่นี่...</span>}
                </Text>
                <Text type="secondary" style={{ fontSize: 10, marginTop: 4 }}>เพิ่งส่งมา · Admin</Text>
              </Flex>
            </Flex>
          </div>

          {/* ✨ Recipient Count Preview — แสดงแบบ real-time ตามที่เลือก role */}
          <div
            style={{
              marginTop: 14,
              padding: "14px 16px",
              borderRadius: 12,
              background: `${cfg.color}0d`,
              border: `1px solid ${cfg.color}30`,
            }}
          >
            <Flex justify="space-between" align="center">
              <Flex vertical gap={2}>
                <Flex align="center" gap={6}>
                  <span style={{ color: cfg.color, fontSize: 13 }}>{cfg.icon}</span>
                  <Text style={{ fontSize: 12, color: cfg.color, fontWeight: 700 }}>{cfg.label}</Text>
                </Flex>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {cfg.desc}
                </Text>
                <Text type="secondary" style={{ fontSize: 10, marginTop: 2 }}>
                  Notification ปรากฏใน In-app bell icon
                </Text>
              </Flex>

              {/* ✨ ตัวเลขผู้รับ */}
              <div
                style={{
                  padding: "8px 16px",
                  borderRadius: 12,
                  background: cfg.color,
                  textAlign: "center",
                  minWidth: 72,
                  boxShadow: `0 4px 14px ${cfg.color}40`,
                  transition: "all 0.3s ease",
                }}
              >
                {isCountingRecipients ? (
                  <LoadingOutlined style={{ color: "#fff", fontSize: 16 }} />
                ) : (
                  <>
                    <Text
                      strong
                      style={{
                        fontSize: recipientCount !== null && recipientCount >= 1000 ? 16 : 22,
                        color: "#fff",
                        display: "block",
                        lineHeight: 1.2,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {recipientCount?.toLocaleString() ?? "—"}
                    </Text>
                    <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.85)" }}>ผู้รับ</Text>
                  </>
                )}
              </div>
            </Flex>
          </div>

          {/* ✨ Character counter summary */}
          <Flex justify="space-between" style={{ marginTop: 12 }}>
            <Text type="secondary" style={{ fontSize: 10 }}>Title: {title.length}/120</Text>
            <Text type="secondary" style={{ fontSize: 10 }}>Message: {message.length}/1000</Text>
          </Flex>
        </Card>
      </Flex>

      {/* ── Confirm Modal ── */}
      <Modal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onOk={handleConfirm}
        confirmLoading={isSending}
        okText="ยืนยัน ส่งเลย"
        cancelText="ยกเลิก"
        okButtonProps={{
          style: { background: cfg.color, borderColor: cfg.color, fontWeight: 700 },
          icon: <SendOutlined />,
        }}
        title={
          <Flex align="center" gap={8}>
            <WarningOutlined style={{ color: "#f59e0b", fontSize: 16 }} />
            <Text strong style={{ fontSize: 15 }}>ยืนยันการส่ง Announcement</Text>
          </Flex>
        }
        width={480}
      >
        {/* ✨ สรุป Announcement ที่จะส่ง */}
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 10,
            background: token.colorFillQuaternary,
            border: `1px solid ${token.colorBorderSecondary}`,
            marginBottom: 16,
            marginTop: 4,
          }}
        >
          <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            สรุปข้อความที่จะส่ง
          </Text>
          <Text strong style={{ fontSize: 13, display: "block", marginBottom: 4 }}>{title}</Text>
          <Text
            type="secondary"
            style={{
              fontSize: 12,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              whiteSpace: "pre-wrap",
            }}
          >
            {message}
          </Text>
        </div>

        {/* ✨ Target + Recipient Count */}
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 10,
            background: `${cfg.color}0d`,
            border: `1px solid ${cfg.color}30`,
          }}
        >
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={8}>
              <span style={{ color: cfg.color, fontSize: 15 }}>{cfg.icon}</span>
              <Flex vertical gap={1}>
                <Text strong style={{ fontSize: 13, color: cfg.color }}>{cfg.label}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>{cfg.desc}</Text>
              </Flex>
            </Flex>

            {/* ✨ จำนวนผู้รับ */}
            <div
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                background: cfg.color,
                textAlign: "center",
                minWidth: 80,
              }}
            >
              {isCountingRecipients ? (
                <LoadingOutlined style={{ color: "#fff", fontSize: 14 }} />
              ) : (
                <>
                  <Text strong style={{ fontSize: 18, color: "#fff", display: "block", lineHeight: 1.2 }}>
                    {recipientCount?.toLocaleString() ?? "—"}
                  </Text>
                  <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.85)" }}>ผู้รับ</Text>
                </>
              )}
            </div>
          </Flex>
        </div>

        <Text type="secondary" style={{ fontSize: 11, marginTop: 12, display: "block" }}>
          เมื่อยืนยัน Notification จะถูกส่งทันทีและไม่สามารถยกเลิกได้
        </Text>
      </Modal>
    </>
  );
}
