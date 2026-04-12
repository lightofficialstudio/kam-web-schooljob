"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import { RbacTab } from "./_components/rbac-tab";
import {
  BankOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  CopyOutlined,
  CrownOutlined,
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  MailOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Dropdown,
  Empty,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  theme,
  message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { MenuProps } from "antd";

const { Title, Text } = Typography;
const PRIMARY = "#11b6f5";

// ─── Types ───────────────────────────────────────────────────────────────────
type MemberRole = "OWNER" | "ADMIN" | "STAFF";
type MemberStatus = "ACTIVE" | "PENDING" | "INACTIVE";

interface SchoolMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  joinedAt: string;
  avatarUrl?: string;
  lastActiveAt?: string;
  permissions: string[];
}

// ─── Mock Data (Front-end only — รอ DB) ──────────────────────────────────────
const MOCK_MEMBERS: SchoolMember[] = [
  {
    id: "1",
    name: "สมชาย รักการศึกษา",
    email: "somchai@school.ac.th",
    role: "OWNER",
    status: "ACTIVE",
    joinedAt: "2024-01-15",
    lastActiveAt: "2026-04-12",
    permissions: ["manage_jobs", "manage_members", "manage_profile", "view_applicants"],
  },
  {
    id: "2",
    name: "สมหญิง ใจดี",
    email: "somying@school.ac.th",
    role: "ADMIN",
    status: "ACTIVE",
    joinedAt: "2024-03-20",
    lastActiveAt: "2026-04-10",
    permissions: ["manage_jobs", "view_applicants"],
  },
  {
    id: "3",
    name: "วิชัย มุ่งมั่น",
    email: "wichai@school.ac.th",
    role: "STAFF",
    status: "ACTIVE",
    joinedAt: "2024-06-01",
    lastActiveAt: "2026-04-08",
    permissions: ["view_applicants"],
  },
  {
    id: "4",
    name: "นิดา รอการตอบรับ",
    email: "nida@gmail.com",
    role: "STAFF",
    status: "PENDING",
    joinedAt: "2026-04-11",
    permissions: [],
  },
];

const MOCK_PENDING_INVITES = [
  { id: "inv-1", email: "teacher1@gmail.com", role: "STAFF", invitedAt: "2026-04-10", expiresAt: "2026-04-17" },
  { id: "inv-2", email: "hr@school.ac.th", role: "ADMIN", invitedAt: "2026-04-09", expiresAt: "2026-04-16" },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const ROLE_CONFIG: Record<MemberRole, { label: string; color: string; icon: React.ReactNode }> = {
  OWNER: { label: "เจ้าของ", color: "gold", icon: <CrownOutlined /> },
  ADMIN: { label: "ผู้ดูแล", color: "blue", icon: <SafetyCertificateOutlined /> },
  STAFF: { label: "เจ้าหน้าที่", color: "default", icon: <UserOutlined /> },
};

const STATUS_CONFIG: Record<MemberStatus, { label: string; color: string }> = {
  ACTIVE: { label: "ใช้งาน", color: "success" },
  PENDING: { label: "รอยืนยัน", color: "warning" },
  INACTIVE: { label: "ไม่ใช้งาน", color: "default" },
};

const PERMISSION_LABELS: Record<string, string> = {
  manage_jobs: "จัดการประกาศงาน",
  manage_members: "จัดการสมาชิก",
  manage_profile: "จัดการโปรไฟล์โรงเรียน",
  view_applicants: "ดูผู้สมัคร",
};

const ALL_PERMISSIONS = Object.keys(PERMISSION_LABELS);

// ─── Invite Modal ─────────────────────────────────────────────────────────────
const InviteModal = ({
  open,
  onClose,
  onInvite,
}: {
  open: boolean;
  onClose: () => void;
  onInvite: (email: string, role: MemberRole, permissions: string[]) => void;
}) => {
  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState<MemberRole>("STAFF");
  const { token } = theme.useToken();

  const defaultPermissions: Record<MemberRole, string[]> = {
    OWNER: ALL_PERMISSIONS,
    ADMIN: ["manage_jobs", "view_applicants"],
    STAFF: ["view_applicants"],
  };

  const handleRoleChange = (role: MemberRole) => {
    setSelectedRole(role);
    form.setFieldValue("permissions", defaultPermissions[role]);
  };

  const handleSubmit = (values: { email: string; role: MemberRole; permissions: string[] }) => {
    onInvite(values.email, values.role, values.permissions);
    form.resetFields();
    setSelectedRole("STAFF");
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      title={
        <Flex align="center" gap={10}>
          <Flex
            align="center"
            justify="center"
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: `linear-gradient(135deg, ${PRIMARY} 0%, #0878a8 100%)`,
            }}
          >
            <UserAddOutlined style={{ color: "#fff", fontSize: 16 }} />
          </Flex>
          <Flex vertical gap={1}>
            <Text strong style={{ fontSize: 15 }}>เชิญสมาชิกใหม่</Text>
            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
              ส่งคำเชิญทางอีเมล
            </Text>
          </Flex>
        </Flex>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ role: "STAFF", permissions: defaultPermissions["STAFF"] }}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label="อีเมลผู้รับเชิญ"
          name="email"
          rules={[{ required: true, type: "email", message: "กรุณากรอกอีเมลที่ถูกต้อง" }]}
        >
          <Input prefix={<MailOutlined />} placeholder="email@example.com" size="large" />
        </Form.Item>

        <Form.Item label="บทบาท" name="role" rules={[{ required: true }]}>
          <Select size="large" onChange={handleRoleChange}>
            <Select.Option value="ADMIN">
              <Flex align="center" gap={8}>
                <SafetyCertificateOutlined style={{ color: token.colorInfo }} />
                <Flex vertical gap={0}>
                  <Text strong style={{ fontSize: 13 }}>ผู้ดูแล (Admin)</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>จัดการประกาศงานและดูผู้สมัครได้</Text>
                </Flex>
              </Flex>
            </Select.Option>
            <Select.Option value="STAFF">
              <Flex align="center" gap={8}>
                <UserOutlined />
                <Flex vertical gap={0}>
                  <Text strong style={{ fontSize: 13 }}>เจ้าหน้าที่ (Staff)</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>ดูผู้สมัครได้เท่านั้น</Text>
                </Flex>
              </Flex>
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="สิทธิ์การใช้งาน" name="permissions">
          <Select
            mode="multiple"
            size="large"
            placeholder="เลือกสิทธิ์ที่ต้องการ"
            options={ALL_PERMISSIONS.filter((p) => p !== "manage_members").map((p) => ({
              value: p,
              label: PERMISSION_LABELS[p],
              disabled: selectedRole === "OWNER",
            }))}
          />
        </Form.Item>

        <Flex
          style={{
            backgroundColor: token.colorInfoBg,
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 16,
          }}
          gap={8}
          align="flex-start"
        >
          <MailOutlined style={{ color: token.colorInfo, marginTop: 2 }} />
          <Text style={{ fontSize: 12, color: token.colorInfoText }}>
            ผู้รับจะได้รับอีเมลเชิญและต้องยืนยันภายใน 7 วัน ก่อนจึงจะเข้าถึงระบบได้
          </Text>
        </Flex>

        <Flex justify="flex-end" gap={8}>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button type="primary" htmlType="submit" icon={<MailOutlined />}>
            ส่งคำเชิญ
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

// ─── Edit Role Modal ──────────────────────────────────────────────────────────
const EditMemberModal = ({
  open,
  member,
  onClose,
  onSave,
}: {
  open: boolean;
  member: SchoolMember | null;
  onClose: () => void;
  onSave: (id: string, role: MemberRole, permissions: string[]) => void;
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (member) {
      form.setFieldsValue({ role: member.role, permissions: member.permissions });
    }
  }, [member, form]);

  if (!member) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      centered
      title={
        <Flex align="center" gap={10}>
          <Avatar
            size={36}
            style={{ backgroundColor: PRIMARY, fontSize: 14, flexShrink: 0 }}
          >
            {member.name.charAt(0)}
          </Avatar>
          <Flex vertical gap={1}>
            <Text strong style={{ fontSize: 15 }}>{member.name}</Text>
            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>{member.email}</Text>
          </Flex>
        </Flex>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(v) => {
          onSave(member.id, v.role, v.permissions);
          form.resetFields();
        }}
        style={{ marginTop: 16 }}
      >
        <Form.Item label="บทบาท" name="role">
          <Select size="large">
            <Select.Option value="ADMIN">ผู้ดูแล (Admin)</Select.Option>
            <Select.Option value="STAFF">เจ้าหน้าที่ (Staff)</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="สิทธิ์การใช้งาน" name="permissions">
          <Select
            mode="multiple"
            size="large"
            placeholder="เลือกสิทธิ์"
            options={ALL_PERMISSIONS.filter((p) => p !== "manage_members").map((p) => ({
              value: p,
              label: PERMISSION_LABELS[p],
            }))}
          />
        </Form.Item>

        <Flex justify="flex-end" gap={8}>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button type="primary" htmlType="submit" icon={<EditOutlined />}>
            บันทึก
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

// ─── หน้าหลัก ─────────────────────────────────────────────────────────────────
export default function SchoolManagementPage() {
  const { token } = theme.useToken();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [members, setMembers] = useState<SchoolMember[]>(MOCK_MEMBERS);
  const [pendingInvites, setPendingInvites] = useState(MOCK_PENDING_INVITES);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editMember, setEditMember] = useState<SchoolMember | null>(null);
  const [activeTab, setActiveTab] = useState<"members" | "invites" | "rbac" | "settings">("members");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMounted) return;
    if (!isAuthenticated || !user) {
      router.replace("/pages/signin?redirect=%2Fpages%2Femployer%2Fschool-management");
      return;
    }
    if (user.role !== "EMPLOYER") {
      router.replace(user.role === "EMPLOYEE" ? "/pages/employee/profile" : "/");
    }
  }, [isMounted, isAuthenticated, user?.role]);

  if (!isMounted) return null;

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleInvite = (email: string, role: MemberRole, permissions: string[]) => {
    const newInvite = {
      id: `inv-${Date.now()}`,
      email,
      role,
      invitedAt: new Date().toISOString().split("T")[0],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    };
    setPendingInvites((prev) => [newInvite, ...prev]);
    setIsInviteOpen(false);
    messageApi.success(`ส่งคำเชิญไปยัง ${email} แล้ว`);
  };

  const handleEditSave = (id: string, role: MemberRole, permissions: string[]) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role, permissions } : m)),
    );
    setEditMember(null);
    messageApi.success("อัปเดตสิทธิ์เรียบร้อยแล้ว");
  };

  const handleRemoveMember = (member: SchoolMember) => {
    Modal.confirm({
      title: `ลบ ${member.name} ออกจากทีม?`,
      content: "สมาชิกจะสูญเสียสิทธิ์การเข้าถึงระบบทั้งหมดทันที",
      okText: "ยืนยัน ลบออก",
      cancelText: "ยกเลิก",
      okButtonProps: { danger: true },
      onOk: () => {
        setMembers((prev) => prev.filter((m) => m.id !== member.id));
        messageApi.success(`ลบ ${member.name} ออกจากทีมแล้ว`);
      },
    });
  };

  const handleCancelInvite = (id: string, email: string) => {
    Modal.confirm({
      title: "ยกเลิกคำเชิญ?",
      content: `คำเชิญที่ส่งไป ${email} จะถูกยกเลิก`,
      okText: "ยืนยัน",
      cancelText: "ไม่",
      onOk: () => {
        setPendingInvites((prev) => prev.filter((i) => i.id !== id));
        messageApi.info("ยกเลิกคำเชิญแล้ว");
      },
    });
  };

  const handleCopyInviteLink = (email: string) => {
    navigator.clipboard?.writeText(`https://schooljob.th/invite?ref=xxx&email=${email}`);
    messageApi.success("คัดลอกลิงก์เชิญแล้ว");
  };

  // ─── Stats Cards ───────────────────────────────────────────────────────────
  const activeMembers = members.filter((m) => m.status === "ACTIVE").length;
  const pendingMembers = members.filter((m) => m.status === "PENDING").length;

  const statCards = [
    {
      label: "สมาชิกทั้งหมด",
      value: members.length,
      icon: <TeamOutlined style={{ fontSize: 20, color: PRIMARY }} />,
      bg: token.colorPrimaryBg,
    },
    {
      label: "กำลังใช้งาน",
      value: activeMembers,
      icon: <CheckCircleFilled style={{ fontSize: 20, color: token.colorSuccess }} />,
      bg: token.colorSuccessBg,
    },
    {
      label: "รอยืนยัน",
      value: pendingMembers + pendingInvites.length,
      icon: <MailOutlined style={{ fontSize: 20, color: token.colorWarning }} />,
      bg: token.colorWarningBg,
    },
    {
      label: "คำเชิญที่ส่งออก",
      value: pendingInvites.length,
      icon: <KeyOutlined style={{ fontSize: 20, color: "#6366F1" }} />,
      bg: "#EEF2FF",
    },
  ];

  // ─── Members Table columns ─────────────────────────────────────────────────
  const memberColumns = [
    {
      title: "สมาชิก",
      key: "member",
      render: (_: unknown, record: SchoolMember) => (
        <Flex align="center" gap={12}>
          <Avatar
            size={40}
            src={record.avatarUrl}
            style={{ backgroundColor: PRIMARY, fontSize: 15, flexShrink: 0 }}
          >
            {record.name.charAt(0)}
          </Avatar>
          <Flex vertical gap={2}>
            <Flex align="center" gap={6}>
              <Text strong style={{ fontSize: 14 }}>{record.name}</Text>
              {record.role === "OWNER" && (
                <CrownOutlined style={{ color: "#F59E0B", fontSize: 12 }} />
              )}
            </Flex>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
            {record.lastActiveAt && (
              <Text style={{ fontSize: 11, color: token.colorTextQuaternary }}>
                ใช้งานล่าสุด: {record.lastActiveAt}
              </Text>
            )}
          </Flex>
        </Flex>
      ),
    },
    {
      title: "บทบาท",
      dataIndex: "role",
      key: "role",
      width: 130,
      render: (role: MemberRole) => {
        const cfg = ROLE_CONFIG[role];
        return (
          <Tag color={cfg.color} icon={cfg.icon} style={{ fontSize: 12 }}>
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: MemberStatus) => {
        const cfg = STATUS_CONFIG[status];
        return <Badge status={cfg.color as "success" | "warning" | "default"} text={cfg.label} />;
      },
    },
    {
      title: "สิทธิ์การใช้งาน",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions: string[]) => (
        <Flex wrap="wrap" gap={4}>
          {permissions.length === 0 ? (
            <Text type="secondary" style={{ fontSize: 12 }}>รอยืนยัน</Text>
          ) : (
            permissions.map((p) => (
              <Tag key={p} style={{ fontSize: 11, margin: 0 }}>
                {PERMISSION_LABELS[p] ?? p}
              </Tag>
            ))
          )}
        </Flex>
      ),
    },
    {
      title: "เข้าร่วมเมื่อ",
      dataIndex: "joinedAt",
      key: "joinedAt",
      width: 110,
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>{date}</Text>
      ),
    },
    {
      title: "",
      key: "action",
      width: 60,
      render: (_: unknown, record: SchoolMember) => {
        if (record.role === "OWNER") return null;
        const items: MenuProps["items"] = [
          {
            key: "edit",
            icon: <EditOutlined />,
            label: "แก้ไขสิทธิ์",
            onClick: () => setEditMember(record),
          },
          { type: "divider" },
          {
            key: "remove",
            icon: <DeleteOutlined />,
            label: "ลบออกจากทีม",
            danger: true,
            onClick: () => handleRemoveMember(record),
          },
        ];
        return (
          <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        );
      },
    },
  ];

  // ─── Invites Table columns ──────────────────────────────────────────────────
  const inviteColumns = [
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <Flex align="center" gap={8}>
          <Avatar size={32} icon={<MailOutlined />} style={{ backgroundColor: token.colorFillSecondary, color: token.colorTextSecondary }} />
          <Text strong style={{ fontSize: 14 }}>{email}</Text>
        </Flex>
      ),
    },
    {
      title: "บทบาทที่เชิญ",
      dataIndex: "role",
      key: "role",
      width: 130,
      render: (role: MemberRole) => {
        const cfg = ROLE_CONFIG[role];
        return <Tag color={cfg.color} icon={cfg.icon}>{cfg.label}</Tag>;
      },
    },
    {
      title: "ส่งเมื่อ",
      dataIndex: "invitedAt",
      key: "invitedAt",
      width: 120,
      render: (date: string) => <Text type="secondary" style={{ fontSize: 13 }}>{date}</Text>,
    },
    {
      title: "หมดอายุ",
      dataIndex: "expiresAt",
      key: "expiresAt",
      width: 120,
      render: (date: string) => {
        const daysLeft = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
        return (
          <Tag color={daysLeft <= 2 ? "red" : "orange"} style={{ fontSize: 11 }}>
            เหลือ {daysLeft} วัน
          </Tag>
        );
      },
    },
    {
      title: "",
      key: "action",
      width: 120,
      render: (_: unknown, record: typeof MOCK_PENDING_INVITES[0]) => (
        <Space size={4}>
          <Tooltip title="คัดลอกลิงก์เชิญ">
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopyInviteLink(record.email)}
            />
          </Tooltip>
          <Tooltip title="ยกเลิกคำเชิญ">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleCancelInvite(record.id, record.email)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // ─── Tab Nav ────────────────────────────────────────────────────────────────
  const tabs = [
    { key: "members",  label: "สมาชิกในทีม",   icon: <TeamOutlined />,              count: members.length },
    { key: "invites",  label: "คำเชิญที่รอ",    icon: <MailOutlined />,              count: pendingInvites.length },
    { key: "rbac",     label: "จัดการสิทธิ์",   icon: <KeyOutlined style={{ color: activeTab === "rbac" ? PRIMARY : undefined }} /> },
    { key: "settings", label: "ตั้งค่าองค์กร",  icon: <SettingOutlined /> },
  ] as const;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: token.colorBgLayout, paddingBottom: 80 }}>
      {contextHolder}

      {/* ─── Hero Header ──────────────────────────────────────────────── */}
      <div
        style={{
          background: `linear-gradient(135deg, #0f2044 0%, #1a3a6b 50%, #0878a8 100%)`,
          padding: "32px 0 48px",
          marginBottom: -24,
        }}
      >
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>
          <Breadcrumb
            style={{ marginBottom: 20 }}
            items={[
              { title: <Link href="/pages/employer" style={{ color: "rgba(255,255,255,0.6)" }}>แดชบอร์ด</Link> },
              { title: <Text style={{ color: "rgba(255,255,255,0.9)" }}>จัดการโรงเรียน</Text> },
            ]}
          />

          <Flex align="center" justify="space-between" wrap="wrap" gap={16}>
            <Flex align="center" gap={16}>
              <Flex
                align="center"
                justify="center"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <BankOutlined style={{ fontSize: 26, color: "#fff" }} />
              </Flex>
              <Flex vertical gap={4}>
                <Title level={3} style={{ color: "#fff", margin: 0 }}>
                  จัดการโรงเรียน
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                  จัดการทีมงานและสิทธิ์การเข้าถึงระบบของโรงเรียน
                </Text>
              </Flex>
            </Flex>

            <Button
              type="primary"
              size="large"
              icon={<UserAddOutlined />}
              onClick={() => setIsInviteOpen(true)}
              style={{
                background: "rgba(255,255,255,0.15)",
                borderColor: "rgba(255,255,255,0.4)",
                color: "#fff",
                backdropFilter: "blur(8px)",
              }}
            >
              เชิญสมาชิกใหม่
            </Button>
          </Flex>
        </div>
      </div>

      {/* ─── Stats Row ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {statCards.map((card) => (
            <Col xs={12} md={6} key={card.label}>
              <Card
                variant="borderless"
                style={{
                  borderRadius: 12,
                  backgroundColor: card.bg,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
                styles={{ body: { padding: "16px 20px" } }}
              >
                <Flex align="center" gap={12}>
                  <Flex
                    align="center"
                    justify="center"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      backgroundColor: "rgba(255,255,255,0.7)",
                    }}
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

        {/* ─── Tab Navigation ────────────────────────────────────────── */}
        <Flex
          style={{
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            marginBottom: 20,
          }}
          gap={0}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "12px 20px",
                border: "none",
                borderBottom: activeTab === tab.key ? `2px solid ${PRIMARY}` : "2px solid transparent",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 14,
                fontWeight: activeTab === tab.key ? 600 : 400,
                color: activeTab === tab.key ? PRIMARY : token.colorTextSecondary,
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
                marginBottom: -1,
              }}
            >
              {tab.icon}
              {tab.label}
              {"count" in tab && tab.count > 0 && (
                <span
                  style={{
                    backgroundColor: activeTab === tab.key ? PRIMARY : token.colorFillSecondary,
                    color: activeTab === tab.key ? "#fff" : token.colorTextSecondary,
                    borderRadius: 10,
                    padding: "0 7px",
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: "18px",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </Flex>

        {/* ─── Tab: สมาชิก ───────────────────────────────────────────── */}
        {activeTab === "members" && (
          <Card
            variant="borderless"
            style={{ borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            styles={{ body: { padding: 0 } }}
            title={
              <Flex justify="space-between" align="center" style={{ padding: "4px 0" }}>
                <Flex align="center" gap={8}>
                  <TeamOutlined style={{ color: PRIMARY }} />
                  <Text strong style={{ fontSize: 15 }}>สมาชิกในทีม</Text>
                </Flex>
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  size="small"
                  onClick={() => setIsInviteOpen(true)}
                >
                  เชิญสมาชิก
                </Button>
              </Flex>
            }
          >
            <Table
              columns={memberColumns}
              dataSource={members}
              rowKey="id"
              pagination={false}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<Text type="secondary">ยังไม่มีสมาชิก</Text>}
                  />
                ),
              }}
            />
          </Card>
        )}

        {/* ─── Tab: คำเชิญที่รอ ──────────────────────────────────────── */}
        {activeTab === "invites" && (
          <Card
            variant="borderless"
            style={{ borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            styles={{ body: { padding: 0 } }}
            title={
              <Flex justify="space-between" align="center" style={{ padding: "4px 0" }}>
                <Flex align="center" gap={8}>
                  <MailOutlined style={{ color: "#F59E0B" }} />
                  <Text strong style={{ fontSize: 15 }}>คำเชิญที่รอการตอบรับ</Text>
                </Flex>
                <Button
                  icon={<ReloadOutlined />}
                  size="small"
                  onClick={() => messageApi.info("รีเฟรชแล้ว")}
                >
                  รีเฟรช
                </Button>
              </Flex>
            }
          >
            {pendingInvites.length === 0 ? (
              <Flex justify="center" align="center" style={{ padding: "60px 0" }}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<Text type="secondary">ไม่มีคำเชิญที่รอการตอบรับ</Text>}
                >
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsInviteOpen(true)}
                  >
                    ส่งคำเชิญ
                  </Button>
                </Empty>
              </Flex>
            ) : (
              <Table
                columns={inviteColumns}
                dataSource={pendingInvites}
                rowKey="id"
                pagination={false}
              />
            )}
          </Card>
        )}

        {/* ─── Tab: จัดการสิทธิ์ (RBAC) ─────────────────────────────── */}
        {activeTab === "rbac" && <RbacTab />}

        {/* ─── Tab: ตั้งค่าองค์กร ────────────────────────────────────── */}
        {activeTab === "settings" && (
          <Row gutter={[20, 20]}>
            {/* โรงเรียน */}
            <Col xs={24} lg={14}>
              <Card
                variant="borderless"
                style={{ borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                title={
                  <Flex align="center" gap={8}>
                    <BankOutlined style={{ color: PRIMARY }} />
                    <Text strong>ข้อมูลองค์กร</Text>
                  </Flex>
                }
                extra={
                  <Link href="/pages/employer/profile">
                    <Button size="small" icon={<EditOutlined />}>แก้ไขโปรไฟล์</Button>
                  </Link>
                }
              >
                <Descriptions column={1} size="small" styles={{ label: { width: 140 } }}>
                  <Descriptions.Item label="ชื่อโรงเรียน">
                    <Text strong>โรงเรียนตัวอย่าง (Mock)</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="ประเภท">
                    <Tag color="blue">รัฐบาล</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="จังหวัด">กรุงเทพมหานคร</Descriptions.Item>
                  <Descriptions.Item label="อีเมลองค์กร">school@example.ac.th</Descriptions.Item>
                  <Descriptions.Item label="เบอร์โทร">02-XXX-XXXX</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* นโยบายสิทธิ์ */}
            <Col xs={24} lg={10}>
              <Card
                variant="borderless"
                style={{ borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                title={
                  <Flex align="center" gap={8}>
                    <KeyOutlined style={{ color: "#6366F1" }} />
                    <Text strong>สิทธิ์ตามบทบาท</Text>
                  </Flex>
                }
              >
                <Flex vertical gap={16}>
                  {(["OWNER", "ADMIN", "STAFF"] as MemberRole[]).map((role) => {
                    const cfg = ROLE_CONFIG[role];
                    const perms: Record<MemberRole, string[]> = {
                      OWNER: ALL_PERMISSIONS,
                      ADMIN: ["manage_jobs", "view_applicants"],
                      STAFF: ["view_applicants"],
                    };
                    return (
                      <Flex vertical gap={8} key={role}>
                        <Tag color={cfg.color} icon={cfg.icon} style={{ width: "fit-content" }}>
                          {cfg.label}
                        </Tag>
                        <Flex wrap="wrap" gap={4}>
                          {perms[role].map((p) => (
                            <Tag key={p} style={{ fontSize: 11, margin: 0 }}>
                              {PERMISSION_LABELS[p]}
                            </Tag>
                          ))}
                        </Flex>
                        <Divider style={{ margin: "4px 0" }} />
                      </Flex>
                    );
                  })}
                </Flex>
              </Card>
            </Col>

            {/* Danger Zone */}
            <Col xs={24}>
              <Card
                variant="borderless"
                style={{
                  borderRadius: 14,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  borderColor: token.colorErrorBorder,
                  border: `1px solid ${token.colorErrorBorder}`,
                }}
                title={
                  <Flex align="center" gap={8}>
                    <CloseCircleFilled style={{ color: token.colorError }} />
                    <Text strong style={{ color: token.colorError }}>Danger Zone</Text>
                  </Flex>
                }
              >
                <Flex align="center" justify="space-between" wrap="wrap" gap={12}>
                  <Flex vertical gap={4}>
                    <Text strong>ออกจากองค์กรนี้</Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      คุณจะสูญเสียสิทธิ์ทั้งหมดในการจัดการโรงเรียนนี้
                    </Text>
                  </Flex>
                  <Button
                    danger
                    disabled
                    style={{ minWidth: 120 }}
                  >
                    ออกจากองค์กร
                  </Button>
                </Flex>
              </Card>
            </Col>
          </Row>
        )}
      </div>

      {/* ─── Modals ────────────────────────────────────────────────────── */}
      <InviteModal
        open={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={handleInvite}
      />
      <EditMemberModal
        open={!!editMember}
        member={editMember}
        onClose={() => setEditMember(null)}
        onSave={handleEditSave}
      />
    </div>
  );
}
