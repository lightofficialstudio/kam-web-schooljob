"use client";

// ✨ Admin Announcement — Broadcast ข้อความถึง Users + ดูประวัติ
import { ModalComponent } from "@/app/components/modal/modal.component";
import { useAuthStore } from "@/app/stores/auth-store";
import {
  BellOutlined,
  HistoryOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Col,
  Row,
  Tabs,
  Typography,
  theme,
} from "antd";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BroadcastComposer } from "./_components/broadcast-composer";
import { AnnouncementHistory } from "./_components/announcement-history";
import { useAnnouncementStore } from "./_state/announcement-store";
import { AdminHeader } from "@/app/components/admin/header/header.component";

const { Title, Text } = Typography;

export default function AnnouncementPage() {
  const { token } = theme.useToken();
  const { user } = useAuthStore();
  const adminUserId = user?.user_id ?? "";

  const {
    isSending,
    broadcast,
    resetForm,
    fetchHistory,
  } = useAnnouncementStore();

  const [activeTab, setActiveTab] = useState("compose");
  const [modal, setModal] = useState<{
    open: boolean;
    type: "success" | "error";
    title: string;
    description?: string;
  }>({ open: false, type: "success", title: "" });

  // ✨ โหลดประวัติเมื่อสลับ tab
  useEffect(() => {
    if (activeTab === "history" && adminUserId) {
      fetchHistory(adminUserId, 1);
    }
  }, [activeTab, adminUserId, fetchHistory]);

  const handleSend = useCallback(async () => {
    const result = await broadcast(adminUserId);
    if (result.ok) {
      setModal({
        open: true,
        type: "success",
        title: "ส่ง Announcement สำเร็จ",
        description: `ส่ง Notification ถึง ${result.sentCount.toLocaleString()} ผู้ใช้งานเรียบร้อยแล้ว`,
      });
      resetForm();
    } else {
      setModal({
        open: true,
        type: "error",
        title: "ส่ง Announcement ไม่สำเร็จ",
        description: result.error,
      });
    }
  }, [broadcast, adminUserId, resetForm]);

  return (
    <>
      <Row gutter={[0, 24]}>
        {/* ── Breadcrumb ── */}
        <Col xs={24}>
          <Breadcrumb
            items={[
              { title: <Link href="/pages/admin/dashboard">แดชบอร์ด</Link> },
              { title: "Announcement" },
            ]}
          />
        </Col>

        {/* ── Header ── */}
        <Col xs={24}>
          <AdminHeader
            title="Announcement & Broadcast"
            description="ส่ง In-app Notification ถึงผู้ใช้งาน — เลือก Target เป็น ครู / โรงเรียน / ทุกคน"
            icon={<BellOutlined style={{ fontSize: 22, color: "#fff" }} />}
            gradient="linear-gradient(135deg, #0d47a1 0%, #0a4a8a 50%, #11b6f5 100%)"
          />
        </Col>

        {/* ── Tabs: Compose | History ── */}
        <Col xs={24}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            items={[
              {
                key: "compose",
                label: (
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <SendOutlined />
                    สร้าง Announcement
                  </span>
                ),
                children: (
                  <BroadcastComposer onSend={handleSend} isSending={isSending} />
                ),
              },
              {
                key: "history",
                label: (
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <HistoryOutlined />
                    ประวัติที่ส่ง
                  </span>
                ),
                children: (
                  <AnnouncementHistory adminUserId={adminUserId} />
                ),
              },
            ]}
          />
        </Col>
      </Row>

      {/* ── Result Modal ── */}
      <ModalComponent
        open={modal.open}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        onConfirm={() => setModal((m) => ({ ...m, open: false }))}
      />
    </>
  );
}
