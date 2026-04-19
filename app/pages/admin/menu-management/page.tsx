"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import { App, Button, Card, Col, Flex, Input, Row, Switch, Tag, theme as antTheme, Typography } from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Eye, Globe, Power, Settings, WrenchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminHeader } from "@/app/components/admin/header/header.component";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// ✨ หน้าจัดการ Maintenance Mode และ Site Settings
export default function MenuManagementPage() {
  const { token } = antTheme.useToken();
  const { message } = App.useApp();
  const { user } = useAuthStore();

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceTitle, setMaintenanceTitle] = useState("ระบบกำลังปรับปรุง");
  const [maintenanceMessage, setMaintenanceMessage] = useState("กรุณากลับมาใหม่ในภายหลัง เราจะกลับมาเร็ว ๆ นี้");
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ✨ ดึง site settings เมื่อโหลดหน้า
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get("/api/v1/admin/site-settings");
        if (data?.data) {
          const s = data.data;
          setIsMaintenanceMode(s.maintenance_mode === "true");
          if (s.maintenance_title) setMaintenanceTitle(s.maintenance_title);
          if (s.maintenance_message) setMaintenanceMessage(s.maintenance_message);
        }
      } catch {
        message.error("ไม่สามารถดึงข้อมูลการตั้งค่าได้");
      } finally {
        setIsFetching(false);
      }
    };
    fetchSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✨ บันทึกการตั้งค่า
  const handleSave = async () => {
    if (!user?.user_id) return;
    setIsSaving(true);
    try {
      await axios.patch("/api/v1/admin/site-settings", {
        admin_user_id: user.user_id,
        settings: {
          maintenance_mode: String(isMaintenanceMode),
          maintenance_title: maintenanceTitle,
          maintenance_message: maintenanceMessage,
        },
      });
      message.success("บันทึกการตั้งค่าสำเร็จ");
      setHasChanges(false);
    } catch {
      message.error("บันทึกไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMaintenanceToggle = (val: boolean) => {
    setIsMaintenanceMode(val);
    setHasChanges(true);
  };

  return (
    <div style={{ padding: "24px 24px 48px" }}>
      {/* 🔷 Header */}
      <AdminHeader
        title="จัดการเมนูและระบบ"
        description="ควบคุมการเข้าถึงและสถานะของระบบ"
        icon={<Settings size={22} color="#fff" />}
        style={{ marginBottom: 8 }}
      />

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* 🔧 Maintenance Mode Card */}
        <Col xs={24} lg={14}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <Card
              styles={{ body: { padding: 24 } }}
              style={{ border: isMaintenanceMode ? `1.5px solid ${token.colorError}40` : `1px solid ${token.colorBorder}`, borderRadius: 16 }}
            >
              {/* ✨ Status Banner */}
              {isMaintenanceMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    background: `${token.colorError}12`,
                    border: `1px solid ${token.colorError}30`,
                    borderRadius: 10,
                    padding: "10px 14px",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <AlertTriangle size={16} color={token.colorError} />
                  <Text style={{ color: token.colorError, fontWeight: 600, fontSize: 13 }}>
                    ขณะนี้ระบบอยู่ในโหมดปิดปรับปรุง — ผู้ใช้ทั้งหมดจะถูก redirect ไปหน้า Maintenance
                  </Text>
                </motion.div>
              )}

              <Flex align="center" justify="space-between" style={{ marginBottom: 24 }}>
                <Flex align="center" gap={12}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: isMaintenanceMode ? `${token.colorError}18` : `${token.colorPrimary}12`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Power size={20} color={isMaintenanceMode ? token.colorError : token.colorPrimary} />
                  </div>
                  <div>
                    <Text strong style={{ color: token.colorText, fontSize: 15 }}>
                      Maintenance Mode
                    </Text>
                    <br />
                    <Text style={{ color: token.colorTextSecondary, fontSize: 12 }}>
                      force redirect ผู้ใช้ทั้งหมดไปหน้าปิดปรับปรุง
                    </Text>
                  </div>
                </Flex>
                <Flex align="center" gap={10}>
                  <Tag
                    color={isMaintenanceMode ? "error" : "success"}
                    style={{ borderRadius: 100, fontWeight: 600, fontSize: 12 }}
                  >
                    {isMaintenanceMode ? "เปิดอยู่" : "ปิดอยู่"}
                  </Tag>
                  <Switch
                    checked={isMaintenanceMode}
                    onChange={handleMaintenanceToggle}
                    loading={isFetching}
                    style={isMaintenanceMode ? { backgroundColor: token.colorError } : {}}
                  />
                </Flex>
              </Flex>

              {/* ✨ ฟิลด์แก้ข้อความ */}
              <Flex vertical gap={16}>
                <div>
                  <Text strong style={{ color: token.colorText, fontSize: 13, display: "block", marginBottom: 6 }}>
                    หัวข้อหน้าปิดปรับปรุง
                  </Text>
                  <Input
                    value={maintenanceTitle}
                    onChange={(e) => { setMaintenanceTitle(e.target.value); setHasChanges(true); }}
                    placeholder="ระบบกำลังปรับปรุง"
                    style={{ borderRadius: 8 }}
                    prefix={<WrenchIcon size={14} color={token.colorTextQuaternary} />}
                  />
                </div>
                <div>
                  <Text strong style={{ color: token.colorText, fontSize: 13, display: "block", marginBottom: 6 }}>
                    ข้อความแจ้งผู้ใช้
                  </Text>
                  <TextArea
                    value={maintenanceMessage}
                    onChange={(e) => { setMaintenanceMessage(e.target.value); setHasChanges(true); }}
                    placeholder="กรุณากลับมาใหม่ในภายหลัง..."
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    style={{ borderRadius: 8 }}
                  />
                </div>
              </Flex>

              {/* ✨ Action Buttons */}
              <Flex align="center" justify="space-between" style={{ marginTop: 24 }}>
                <Button
                  icon={<Eye size={14} />}
                  onClick={() => setShowPreview(!showPreview)}
                  style={{ borderRadius: 8, color: token.colorPrimary, borderColor: `${token.colorPrimary}50` }}
                >
                  {showPreview ? "ซ่อน Preview" : "ดู Preview"}
                </Button>
                <Flex gap={10} align="center">
                  {hasChanges && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Text style={{ color: token.colorWarning, fontSize: 12 }}>มีการเปลี่ยนแปลงที่ยังไม่บันทึก</Text>
                    </motion.div>
                  )}
                  <Button
                    type="primary"
                    loading={isSaving}
                    onClick={handleSave}
                    icon={<CheckCircle size={14} />}
                    style={{
                      borderRadius: 8,
                      background: `linear-gradient(135deg, ${token.colorPrimary} 0%, #0d8fd4 100%)`,
                      border: "none",
                    }}
                  >
                    บันทึกการตั้งค่า
                  </Button>
                </Flex>
              </Flex>
            </Card>
          </motion.div>
        </Col>

        {/* 📊 Status Summary Card */}
        <Col xs={24} lg={10}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <Card styles={{ body: { padding: 24 } }} style={{ borderRadius: 16, border: `1px solid ${token.colorBorder}` }}>
              <Flex align="center" gap={10} style={{ marginBottom: 20 }}>
                <Globe size={18} color={token.colorPrimary} />
                <Text strong style={{ color: token.colorText, fontSize: 14 }}>
                  สถานะระบบปัจจุบัน
                </Text>
              </Flex>
              <Flex vertical gap={14}>
                <StatusRow
                  label="สถานะระบบ"
                  value={isMaintenanceMode ? "ปิดปรับปรุง" : "เปิดใช้งาน"}
                  color={isMaintenanceMode ? token.colorError : token.colorSuccess}
                  token={token}
                />
                <StatusRow label="Bypass Paths" value="Admin / Signin" color={token.colorPrimary} token={token} />
                <StatusRow label="Cache Revalidate" value="10 วินาที" color={token.colorWarning} token={token} />
                <StatusRow label="ผู้ดูแลระบบ" value="ไม่ถูก redirect" color={token.colorSuccess} token={token} />
              </Flex>

              <div
                style={{
                  marginTop: 20,
                  padding: "12px 14px",
                  background: `${token.colorPrimary}08`,
                  border: `1px solid ${token.colorPrimary}20`,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: token.colorTextSecondary, fontSize: 12, lineHeight: 1.7 }}>
                  💡 <strong>หมายเหตุ:</strong> เมื่อเปิด Maintenance Mode ผู้ใช้ทุกคนยกเว้น Admin
                  จะถูก redirect ไปหน้า <code>/maintenance</code> อัตโนมัติ
                </Text>
              </div>
            </Card>
          </motion.div>
        </Col>

        {/* 🖼️ Preview Card */}
        {showPreview && (
          <Col xs={24}>
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                title={
                  <Flex align="center" gap={8}>
                    <Eye size={16} color={token.colorPrimary} />
                    <span style={{ color: token.colorText }}>Preview หน้า Maintenance</span>
                  </Flex>
                }
                styles={{ body: { padding: 0 } }}
                style={{ borderRadius: 16, border: `1.5px solid ${token.colorPrimary}30`, overflow: "hidden" }}
              >
                {/* ✨ Mini Preview */}
                <div
                  style={{
                    minHeight: 320,
                    background: token.colorBgLayout,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 40,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `linear-gradient(${token.colorPrimary} 1px, transparent 1px), linear-gradient(90deg, ${token.colorPrimary} 1px, transparent 1px)`,
                      backgroundSize: "48px 48px",
                      opacity: 0.03,
                    }}
                  />
                  <Flex vertical align="center" gap={16} style={{ zIndex: 1, textAlign: "center", maxWidth: 480 }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 16,
                        background: `${token.colorPrimary}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <WrenchIcon size={30} color={token.colorPrimary} />
                    </motion.div>
                    <div>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 14px",
                          borderRadius: 100,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: token.colorPrimary,
                          border: `1px solid ${token.colorPrimary}40`,
                          background: `${token.colorPrimary}10`,
                          marginBottom: 10,
                        }}
                      >
                        System Maintenance
                      </span>
                      <Title
                        level={2}
                        style={{
                          margin: 0,
                          background: `linear-gradient(135deg, ${token.colorPrimary} 0%, #0d8fd4 50%, #5dd5fb 100%)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {maintenanceTitle}
                      </Title>
                    </div>
                    <Paragraph style={{ color: token.colorTextSecondary, fontSize: 15, margin: 0 }}>
                      {maintenanceMessage}
                    </Paragraph>
                    <Flex gap={6}>
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                          style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: token.colorPrimary }}
                        />
                      ))}
                    </Flex>
                  </Flex>
                </div>
              </Card>
            </motion.div>
          </Col>
        )}
      </Row>
    </div>
  );
}

// ✨ Component แสดงแถว status
function StatusRow({
  label,
  value,
  color,
  token,
}: {
  label: string;
  value: string;
  color: string;
  token: ReturnType<typeof antTheme.useToken>["token"];
}) {
  return (
    <Flex align="center" justify="space-between">
      <Text style={{ color: token.colorTextSecondary, fontSize: 13 }}>{label}</Text>
      <span
        style={{
          padding: "2px 10px",
          borderRadius: 100,
          fontSize: 12,
          fontWeight: 600,
          color,
          background: `${color}15`,
          border: `1px solid ${color}30`,
        }}
      >
        {value}
      </span>
    </Flex>
  );
}
