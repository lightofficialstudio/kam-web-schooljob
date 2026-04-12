"use client";

/**
 * หน้า: การเข้าถึงของผู้รับมอบสิทธิ์ (Delegated Access)
 *
 * แสดงรายการโรงเรียน/องค์กรที่ User คนนี้ได้รับมอบสิทธิ์ให้เข้าถึง
 * พร้อมรายละเอียด Role, Permission, วันหมดอายุ
 * และปุ่ม "เข้าถึงในฐานะ" เพื่อ Switch context
 */

import { useAuthStore } from "@/app/stores/auth-store";
import {
  ApartmentOutlined,
  ArrowRightOutlined,
  BankOutlined,
  BarChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CrownOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  KeyOutlined,
  LockOutlined,
  LoginOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SettingOutlined,
  SwapOutlined,
  TeamOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Empty,
  Flex,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Timeline,
  Tooltip,
  Typography,
  theme,
  message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;
const PRIMARY = "#11b6f5";

// ─── Types ────────────────────────────────────────────────────────────────────

type DelegateRole = "ADMIN" | "HR_MANAGER" | "STAFF" | "RECRUITER";
type DelegateStatus = "ACTIVE" | "EXPIRED" | "REVOKED" | "PENDING";

interface DelegatedPermission {
  resource: string;
  actions: string[];
}

interface DelegatedAccess {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolType: string;
  schoolProvince: string;
  schoolLogoInitial: string; // อักษรย่อสำหรับ Avatar (รอ DB มี logoUrl)
  schoolColor: string;
  role: DelegateRole;
  roleName: string;
  status: DelegateStatus;
  grantedBy: string;    // ชื่อคนที่ให้สิทธิ์
  grantedAt: string;
  expiresAt: string | null; // null = ไม่มีวันหมดอายุ
  permissions: DelegatedPermission[];
  lastAccessAt: string | null;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DELEGATED: DelegatedAccess[] = [
  {
    id: "del-1",
    schoolId: "school-abc",
    schoolName: "โรงเรียนอนุบาลกรุงเทพ",
    schoolType: "รัฐบาล",
    schoolProvince: "กรุงเทพมหานคร",
    schoolLogoInitial: "อก",
    schoolColor: "#3B82F6",
    role: "ADMIN",
    roleName: "Admin",
    status: "ACTIVE",
    grantedBy: "สมชาย รักการศึกษา",
    grantedAt: "2026-03-01",
    expiresAt: null,
    lastAccessAt: "2026-04-11",
    permissions: [
      { resource: "ประกาศงาน",      actions: ["ดู", "สร้าง", "แก้ไข", "ลบ"] },
      { resource: "ผู้สมัคร",        actions: ["ดู", "แก้ไข", "ส่งออก"] },
      { resource: "สถิติ & รายงาน", actions: ["ดู"] },
      { resource: "โปรไฟล์โรงเรียน", actions: ["ดู", "แก้ไข"] },
    ],
  },
  {
    id: "del-2",
    schoolId: "school-xyz",
    schoolName: "โรงเรียนมัธยมเชียงใหม่วิทยา",
    schoolType: "เอกชน",
    schoolProvince: "เชียงใหม่",
    schoolLogoInitial: "มว",
    schoolColor: "#10B981",
    role: "HR_MANAGER",
    roleName: "HR Manager",
    status: "ACTIVE",
    grantedBy: "วิมล ศรีสะอาด",
    grantedAt: "2026-02-15",
    expiresAt: "2026-07-31",
    lastAccessAt: "2026-04-09",
    permissions: [
      { resource: "ประกาศงาน",      actions: ["ดู"] },
      { resource: "ผู้สมัคร",        actions: ["ดู", "แก้ไข", "ส่งออก"] },
      { resource: "สถิติ & รายงาน", actions: ["ดู", "ส่งออก"] },
    ],
  },
  {
    id: "del-3",
    schoolId: "school-def",
    schoolName: "โรงเรียนสาธิตมหาวิทยาลัยขอนแก่น",
    schoolType: "รัฐบาล",
    schoolProvince: "ขอนแก่น",
    schoolLogoInitial: "สม",
    schoolColor: "#8B5CF6",
    role: "STAFF",
    roleName: "Staff",
    status: "PENDING",
    grantedBy: "นิรันดร์ พงษ์พันธ์",
    grantedAt: "2026-04-10",
    expiresAt: "2026-04-17",
    lastAccessAt: null,
    permissions: [
      { resource: "ประกาศงาน", actions: ["ดู"] },
      { resource: "ผู้สมัคร",   actions: ["ดู"] },
    ],
  },
  {
    id: "del-4",
    schoolId: "school-old",
    schoolName: "โรงเรียนนานาชาติภาคใต้",
    schoolType: "นานาชาติ",
    schoolProvince: "สุราษฎร์ธานี",
    schoolLogoInitial: "นภ",
    schoolColor: "#F59E0B",
    role: "RECRUITER",
    roleName: "Recruiter",
    status: "EXPIRED",
    grantedBy: "พรรณิภา หาญกล้า",
    grantedAt: "2025-09-01",
    expiresAt: "2026-03-01",
    lastAccessAt: "2026-02-28",
    permissions: [
      { resource: "ประกาศงาน", actions: ["ดู", "สร้าง", "แก้ไข"] },
      { resource: "ผู้สมัคร",   actions: ["ดู", "แก้ไข"] },
    ],
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const ROLE_ICON: Record<DelegateRole, React.ReactNode> = {
  ADMIN:      <SafetyCertificateOutlined />,
  HR_MANAGER: <TeamOutlined />,
  STAFF:      <UserOutlined />,
  RECRUITER:  <SearchOutlined />,
};

const STATUS_CONFIG: Record<DelegateStatus, { label: string; color: string; icon: React.ReactNode; badgeStatus: "success" | "warning" | "error" | "processing" }> = {
  ACTIVE:  { label: "ใช้งานได้",    color: "success", icon: <CheckCircleOutlined />,    badgeStatus: "success" },
  PENDING: { label: "รอยืนยัน",     color: "warning", icon: <ClockCircleOutlined />,    badgeStatus: "processing" },
  EXPIRED: { label: "หมดอายุแล้ว",  color: "default", icon: <CloseCircleOutlined />,    badgeStatus: "error" },
  REVOKED: { label: "ถูกยกเลิก",    color: "error",   icon: <ExclamationCircleOutlined />, badgeStatus: "error" },
};

const RESOURCE_ICON: Record<string, React.ReactNode> = {
  "ประกาศงาน":       <FileTextOutlined />,
  "ผู้สมัคร":         <TeamOutlined />,
  "โปรไฟล์โรงเรียน": <BankOutlined />,
  "จัดการสมาชิก":     <ApartmentOutlined />,
  "สถิติ & รายงาน":  <BarChartOutlined />,
  "ตั้งค่าระบบ":      <SettingOutlined />,
};

// ─── Detail Drawer ────────────────────────────────────────────────────────────

const AccessDetailDrawer = ({
  access,
  open,
  onClose,
  onEnter,
}: {
  access: DelegatedAccess | null;
  open: boolean;
  onClose: () => void;
  onEnter: (access: DelegatedAccess) => void;
}) => {
  const { token } = theme.useToken();
  if (!access) return null;

  const status = STATUS_CONFIG[access.status];
  const canEnter = access.status === "ACTIVE";

  const daysUntilExpiry = access.expiresAt
    ? Math.ceil((new Date(access.expiresAt).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={480}
      title={
        <Flex align="center" gap={12}>
          <Avatar
            size={40}
            style={{ backgroundColor: access.schoolColor, fontSize: 14, fontWeight: 700, flexShrink: 0 }}
          >
            {access.schoolLogoInitial}
          </Avatar>
          <Flex vertical gap={2}>
            <Text strong style={{ fontSize: 15 }}>{access.schoolName}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{access.schoolProvince}</Text>
          </Flex>
        </Flex>
      }
      footer={
        <Flex justify="space-between" align="center">
          <Button onClick={onClose}>ปิด</Button>
          <Button
            type="primary"
            icon={<LoginOutlined />}
            disabled={!canEnter}
            onClick={() => { onEnter(access); onClose(); }}
            size="large"
            style={{ minWidth: 160 }}
          >
            เข้าถึงในฐานะ {access.roleName}
          </Button>
        </Flex>
      }
    >
      <Flex vertical gap={20}>
        {/* Status alert */}
        {access.status === "PENDING" && (
          <Alert
            message="รอการยืนยัน"
            description="คุณจะสามารถเข้าถึงโรงเรียนนี้ได้หลังจากยืนยันอีเมลคำเชิญ"
            type="warning"
            showIcon
            icon={<ClockCircleOutlined />}
          />
        )}
        {access.status === "EXPIRED" && (
          <Alert
            message="สิทธิ์หมดอายุแล้ว"
            description="ติดต่อเจ้าของโรงเรียนเพื่อต่ออายุสิทธิ์การเข้าถึง"
            type="error"
            showIcon
          />
        )}
        {daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
          <Alert
            message={`สิทธิ์จะหมดอายุใน ${daysUntilExpiry} วัน`}
            description="แจ้งให้เจ้าของโรงเรียนทราบหากต้องการต่ออายุ"
            type="warning"
            showIcon
            icon={<WarningOutlined />}
          />
        )}

        {/* Overview */}
        <Card variant="borderless" style={{ borderRadius: 12, backgroundColor: token.colorFillQuaternary }}>
          <Descriptions column={1} size="small" styles={{ label: { width: 130 } }}>
            <Descriptions.Item label="บทบาท">
              <Flex align="center" gap={6}>
                <span style={{ color: PRIMARY }}>{ROLE_ICON[access.role]}</span>
                <Text strong>{access.roleName}</Text>
              </Flex>
            </Descriptions.Item>
            <Descriptions.Item label="สถานะ">
              <Badge status={status.badgeStatus} text={status.label} />
            </Descriptions.Item>
            <Descriptions.Item label="ให้สิทธิ์โดย">
              <Flex align="center" gap={6}>
                <Avatar size={18} style={{ backgroundColor: PRIMARY, fontSize: 9 }}>
                  {access.grantedBy.charAt(0)}
                </Avatar>
                <Text>{access.grantedBy}</Text>
              </Flex>
            </Descriptions.Item>
            <Descriptions.Item label="ให้สิทธิ์เมื่อ">
              {access.grantedAt}
            </Descriptions.Item>
            <Descriptions.Item label="หมดอายุ">
              {access.expiresAt ? (
                <Text type={daysUntilExpiry !== null && daysUntilExpiry <= 7 ? "warning" : undefined}>
                  {access.expiresAt}
                  {daysUntilExpiry !== null && daysUntilExpiry > 0 && (
                    <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>
                      (อีก {daysUntilExpiry} วัน)
                    </Text>
                  )}
                </Text>
              ) : (
                <Text type="secondary">ไม่มีวันหมดอายุ</Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="เข้าถึงล่าสุด">
              {access.lastAccessAt ?? <Text type="secondary">ยังไม่เคยเข้าถึง</Text>}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Permissions */}
        <Flex vertical gap={12}>
          <Flex align="center" gap={6}>
            <KeyOutlined style={{ color: PRIMARY }} />
            <Text strong style={{ fontSize: 14 }}>สิทธิ์ที่ได้รับ</Text>
          </Flex>
          {access.permissions.map((perm) => (
            <Flex key={perm.resource} vertical gap={6}>
              <Flex align="center" gap={6}>
                <span style={{ color: token.colorTextSecondary, fontSize: 13 }}>
                  {RESOURCE_ICON[perm.resource] ?? <LockOutlined />}
                </span>
                <Text style={{ fontSize: 13, fontWeight: 500 }}>{perm.resource}</Text>
              </Flex>
              <Flex wrap="wrap" gap={4} style={{ paddingLeft: 20 }}>
                {perm.actions.map((action) => (
                  <Tag key={action} style={{ fontSize: 11, margin: 0 }}>{action}</Tag>
                ))}
              </Flex>
            </Flex>
          ))}
        </Flex>

        <Divider />

        {/* Activity timeline */}
        <Flex vertical gap={10}>
          <Flex align="center" gap={6}>
            <CalendarOutlined style={{ color: PRIMARY }} />
            <Text strong style={{ fontSize: 14 }}>ประวัติการมอบสิทธิ์</Text>
          </Flex>
          <Timeline
            items={[
              {
                dot: <CheckCircleOutlined style={{ color: "#10B981" }} />,
                children: (
                  <Flex vertical gap={2}>
                    <Text style={{ fontSize: 13 }}>ได้รับสิทธิ์ Role: {access.roleName}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>โดย {access.grantedBy} · {access.grantedAt}</Text>
                  </Flex>
                ),
              },
              ...(access.lastAccessAt
                ? [{
                    dot: <LoginOutlined style={{ color: PRIMARY }} />,
                    children: (
                      <Flex vertical gap={2}>
                        <Text style={{ fontSize: 13 }}>เข้าถึงล่าสุด</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{access.lastAccessAt}</Text>
                      </Flex>
                    ),
                  }]
                : []),
              ...(access.status === "EXPIRED"
                ? [{
                    dot: <CloseCircleOutlined style={{ color: "#EF4444" }} />,
                    children: (
                      <Flex vertical gap={2}>
                        <Text style={{ fontSize: 13 }}>สิทธิ์หมดอายุ</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{access.expiresAt}</Text>
                      </Flex>
                    ),
                  }]
                : []),
            ]}
          />
        </Flex>
      </Flex>
    </Drawer>
  );
};

// ─── Access Card ──────────────────────────────────────────────────────────────

const AccessCard = ({
  access,
  onViewDetail,
  onEnter,
}: {
  access: DelegatedAccess;
  onViewDetail: (access: DelegatedAccess) => void;
  onEnter: (access: DelegatedAccess) => void;
}) => {
  const { token } = theme.useToken();
  const status = STATUS_CONFIG[access.status];
  const canEnter = access.status === "ACTIVE";

  const daysUntilExpiry = access.expiresAt
    ? Math.ceil((new Date(access.expiresAt).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: 14,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        opacity: access.status === "EXPIRED" || access.status === "REVOKED" ? 0.65 : 1,
        transition: "box-shadow 0.2s, transform 0.2s",
        border: access.status === "ACTIVE"
          ? `1px solid ${token.colorBorderSecondary}`
          : `1px solid ${token.colorBorderSecondary}`,
      }}
      styles={{ body: { padding: 0 } }}
    >
      {/* Top accent bar */}
      <div
        style={{
          height: 4,
          borderRadius: "14px 14px 0 0",
          background: canEnter
            ? `linear-gradient(90deg, ${access.schoolColor} 0%, ${access.schoolColor}88 100%)`
            : token.colorFillSecondary,
        }}
      />

      <Flex vertical gap={0} style={{ padding: "16px 20px 20px" }}>
        {/* Header row */}
        <Flex align="flex-start" justify="space-between" gap={12}>
          <Flex align="center" gap={12}>
            <Avatar
              size={48}
              style={{
                backgroundColor: access.schoolColor,
                fontSize: 14,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {access.schoolLogoInitial}
            </Avatar>
            <Flex vertical gap={3}>
              <Text strong style={{ fontSize: 15 }}>{access.schoolName}</Text>
              <Flex align="center" gap={6}>
                <Tag style={{ fontSize: 11, margin: 0 }}>{access.schoolType}</Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>{access.schoolProvince}</Text>
              </Flex>
            </Flex>
          </Flex>
          <Badge status={status.badgeStatus} text={status.label} />
        </Flex>

        <Divider style={{ margin: "14px 0" }} />

        {/* Role + permissions summary */}
        <Flex vertical gap={10}>
          <Flex align="center" justify="space-between">
            <Flex align="center" gap={6}>
              <span style={{ color: PRIMARY, fontSize: 14 }}>{ROLE_ICON[access.role]}</span>
              <Text strong style={{ fontSize: 13 }}>{access.roleName}</Text>
            </Flex>
            <Flex align="center" gap={4}>
              <KeyOutlined style={{ fontSize: 11, color: token.colorTextQuaternary }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {access.permissions.reduce((sum, p) => sum + p.actions.length, 0)} permissions
              </Text>
            </Flex>
          </Flex>

          {/* Permission chips */}
          <Flex wrap="wrap" gap={4}>
            {access.permissions.map((perm) => (
              <Tag
                key={perm.resource}
                icon={<span style={{ marginRight: 3, fontSize: 11 }}>{RESOURCE_ICON[perm.resource]}</span>}
                style={{ fontSize: 11, margin: 0, color: token.colorTextSecondary }}
              >
                {perm.resource}
              </Tag>
            ))}
          </Flex>

          {/* Expiry warning */}
          {daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
            <Flex align="center" gap={4}
              style={{
                padding: "6px 10px",
                backgroundColor: token.colorWarningBg,
                borderRadius: 6,
              }}
            >
              <WarningOutlined style={{ color: token.colorWarning, fontSize: 12 }} />
              <Text style={{ fontSize: 12, color: token.colorWarningText }}>
                สิทธิ์จะหมดอายุใน {daysUntilExpiry} วัน
              </Text>
            </Flex>
          )}

          {/* Granted by */}
          <Flex align="center" gap={4}>
            <UserOutlined style={{ fontSize: 11, color: token.colorTextQuaternary }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              ให้สิทธิ์โดย {access.grantedBy}
            </Text>
            {access.lastAccessAt && (
              <>
                <Text type="secondary" style={{ fontSize: 12 }}>·</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  เข้าถึงล่าสุด {access.lastAccessAt}
                </Text>
              </>
            )}
          </Flex>
        </Flex>

        <Divider style={{ margin: "14px 0" }} />

        {/* Actions */}
        <Flex justify="space-between" align="center">
          <Button
            type="text"
            size="small"
            icon={<InfoCircleOutlined />}
            onClick={() => onViewDetail(access)}
            style={{ color: token.colorTextSecondary, fontSize: 12 }}
          >
            รายละเอียด
          </Button>
          <Button
            type={canEnter ? "primary" : "default"}
            size="small"
            icon={<LoginOutlined />}
            disabled={!canEnter}
            onClick={() => canEnter && onEnter(access)}
            style={{ minWidth: 140 }}
          >
            {canEnter ? "เข้าถึงในฐานะ " + access.roleName : status.label}
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DelegatedAccessPage() {
  const { token } = theme.useToken();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const [isMounted, setIsMounted] = useState(false);
  const [accesses] = useState<DelegatedAccess[]>(MOCK_DELEGATED);
  const [filterStatus, setFilterStatus] = useState<"ALL" | DelegateStatus>("ALL");
  const [search, setSearch] = useState("");
  const [detailAccess, setDetailAccess] = useState<DelegatedAccess | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMounted) return;
    if (!isAuthenticated || !user) {
      router.replace("/pages/signin?redirect=%2Fpages%2Femployer%2Fdelegated-access");
    }
  }, [isMounted, isAuthenticated]);

  if (!isMounted) return null;

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleEnter = (access: DelegatedAccess) => {
    Modal.confirm({
      title: "เข้าถึงในฐานะ " + access.roleName,
      icon: <SwapOutlined style={{ color: PRIMARY }} />,
      content: (
        <Flex vertical gap={12} style={{ marginTop: 8 }}>
          <Text>คุณกำลังจะเข้าถึง</Text>
          <Flex
            align="center"
            gap={12}
            style={{
              padding: "12px 16px",
              backgroundColor: token.colorFillQuaternary,
              borderRadius: 10,
            }}
          >
            <Avatar size={36} style={{ backgroundColor: access.schoolColor, fontWeight: 700 }}>
              {access.schoolLogoInitial}
            </Avatar>
            <Flex vertical gap={2}>
              <Text strong>{access.schoolName}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                บทบาท: {access.roleName} · {access.permissions.reduce((s, p) => s + p.actions.length, 0)} permissions
              </Text>
            </Flex>
          </Flex>
          <Text type="secondary" style={{ fontSize: 13 }}>
            การกระทำทั้งหมดจะถูกบันทึกใน Audit Log ของโรงเรียน
          </Text>
        </Flex>
      ),
      okText: "เข้าถึงเลย",
      cancelText: "ยกเลิก",
      okButtonProps: { type: "primary" },
      onOk: () => {
        messageApi.loading(`กำลังเข้าถึง ${access.schoolName}...`, 1.2, () => {
          messageApi.success(`เข้าถึง ${access.schoolName} ในฐานะ ${access.roleName} แล้ว`);
          // TODO: set delegated context → router.push("/pages/employer/job/read")
        });
      },
    });
  };

  // ─── Filter ────────────────────────────────────────────────────────────────

  const filtered = accesses.filter((a) => {
    const matchStatus = filterStatus === "ALL" || a.status === filterStatus;
    const matchSearch = !search || a.schoolName.toLowerCase().includes(search.toLowerCase()) ||
      a.roleName.toLowerCase().includes(search.toLowerCase()) ||
      a.schoolProvince.includes(search);
    return matchStatus && matchSearch;
  });

  const activeCount  = accesses.filter((a) => a.status === "ACTIVE").length;
  const pendingCount = accesses.filter((a) => a.status === "PENDING").length;
  const expiredCount = accesses.filter((a) => a.status === "EXPIRED" || a.status === "REVOKED").length;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", backgroundColor: token.colorBgLayout, paddingBottom: 80 }}>
      {contextHolder}

      {/* ─── Hero Header ──────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f2044 0%, #1a3a6b 50%, #0878a8 100%)",
          padding: "32px 0 48px",
          marginBottom: -24,
        }}
      >
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>
          <Breadcrumb
            style={{ marginBottom: 20 }}
            items={[
              { title: <Link href="/" style={{ color: "rgba(255,255,255,0.6)" }}>หน้าแรก</Link> },
              { title: <Text style={{ color: "rgba(255,255,255,0.9)" }}>การเข้าถึงของผู้รับมอบสิทธิ์</Text> },
            ]}
          />

          <Flex align="center" justify="space-between" wrap="wrap" gap={16}>
            <Flex align="center" gap={16}>
              <Flex
                align="center" justify="center"
                style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <KeyOutlined style={{ fontSize: 26, color: "#fff" }} />
              </Flex>
              <Flex vertical gap={4}>
                <Title level={3} style={{ color: "#fff", margin: 0 }}>
                  การเข้าถึงของผู้รับมอบสิทธิ์
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                  รายการโรงเรียนที่คุณได้รับสิทธิ์เข้าถึงในฐานะตัวแทน (Delegated Access)
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </div>
      </div>

      {/* ─── Stats ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {[
            {
              label: "เข้าถึงได้ทั้งหมด",
              value: activeCount,
              icon: <CheckCircleOutlined style={{ fontSize: 20, color: "#10B981" }} />,
              bg: token.colorSuccessBg,
            },
            {
              label: "รอยืนยัน",
              value: pendingCount,
              icon: <ClockCircleOutlined style={{ fontSize: 20, color: token.colorWarning }} />,
              bg: token.colorWarningBg,
            },
            {
              label: "หมดอายุ / ถูกยกเลิก",
              value: expiredCount,
              icon: <CloseCircleOutlined style={{ fontSize: 20, color: token.colorError }} />,
              bg: token.colorErrorBg,
            },
            {
              label: "โรงเรียนทั้งหมด",
              value: accesses.length,
              icon: <BankOutlined style={{ fontSize: 20, color: PRIMARY }} />,
              bg: token.colorPrimaryBg,
            },
          ].map((card) => (
            <Col xs={12} md={6} key={card.label}>
              <Card
                variant="borderless"
                style={{ borderRadius: 12, backgroundColor: card.bg, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                styles={{ body: { padding: "16px 20px" } }}
              >
                <Flex align="center" gap={12}>
                  <Flex
                    align="center" justify="center"
                    style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.7)" }}
                  >
                    {card.icon}
                  </Flex>
                  <Flex vertical gap={2}>
                    <Text type="secondary" style={{ fontSize: 12 }}>{card.label}</Text>
                    <Text strong style={{ fontSize: 22, lineHeight: 1 }}>{card.value}</Text>
                  </Flex>
                </Flex>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ─── Filter Bar ──────────────────────────────────────────── */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={12} style={{ marginBottom: 20 }}>
          <Input
            prefix={<SearchOutlined style={{ color: token.colorTextQuaternary }} />}
            placeholder="ค้นหาโรงเรียน, บทบาท, จังหวัด..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 320, borderRadius: 8 }}
            allowClear
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 180 }}
            options={[
              { value: "ALL",    label: "ทุกสถานะ" },
              { value: "ACTIVE", label: "ใช้งานได้" },
              { value: "PENDING", label: "รอยืนยัน" },
              { value: "EXPIRED", label: "หมดอายุ" },
              { value: "REVOKED", label: "ถูกยกเลิก" },
            ]}
          />
        </Flex>

        {/* ─── Cards Grid ──────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <Flex justify="center" align="center" style={{ padding: "80px 0" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Flex vertical align="center" gap={8}>
                  <Text type="secondary" style={{ fontSize: 15 }}>ไม่พบการเข้าถึงที่ตรงกัน</Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {accesses.length === 0
                      ? "คุณยังไม่ได้รับมอบสิทธิ์จากโรงเรียนใดเลย"
                      : "ลองเปลี่ยนตัวกรองหรือคำค้นหา"}
                  </Text>
                </Flex>
              }
            />
          </Flex>
        ) : (
          <Row gutter={[20, 20]}>
            {filtered.map((access) => (
              <Col xs={24} md={12} xl={8} key={access.id}>
                <AccessCard
                  access={access}
                  onViewDetail={(a) => { setDetailAccess(a); setDrawerOpen(true); }}
                  onEnter={handleEnter}
                />
              </Col>
            ))}
          </Row>
        )}

        {/* ─── Info box ────────────────────────────────────────────── */}
        <Card
          variant="borderless"
          style={{
            borderRadius: 14,
            marginTop: 32,
            backgroundColor: token.colorInfoBg,
            border: `1px solid ${token.colorInfoBorder}`,
          }}
          styles={{ body: { padding: "16px 20px" } }}
        >
          <Flex align="flex-start" gap={12}>
            <InfoCircleOutlined style={{ color: token.colorInfo, fontSize: 16, marginTop: 2 }} />
            <Flex vertical gap={4}>
              <Text strong style={{ color: token.colorInfoText }}>Delegated Access คืออะไร?</Text>
              <Text style={{ fontSize: 13, color: token.colorInfoText, lineHeight: 1.6 }}>
                เจ้าของโรงเรียนสามารถมอบสิทธิ์ให้คุณเข้าถึงระบบในฐานะตัวแทนได้
                โดยจำกัดเฉพาะสิทธิ์ที่ได้รับเท่านั้น การกระทำทั้งหมดจะถูกบันทึกใน Audit Log
                และเจ้าของสามารถยกเลิกสิทธิ์ได้ทุกเมื่อ
              </Text>
            </Flex>
          </Flex>
        </Card>
      </div>

      {/* ─── Detail Drawer ───────────────────────────────────────────── */}
      <AccessDetailDrawer
        access={detailAccess}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEnter={handleEnter}
      />
    </div>
  );
}
