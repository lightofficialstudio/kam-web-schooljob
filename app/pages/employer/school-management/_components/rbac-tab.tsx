"use client";

/**
 * RBAC Tab — จัดการ Role-Based Access Control
 *
 * โครงสร้าง:
 *  ├── RoleList         (ซ้าย) — รายการ Role ทั้งหมด + ปุ่มสร้าง
 *  ├── PermissionMatrix (ขวา) — ตาราง Resource × Action (checkbox)
 *  └── MemberRolePanel  (ล่าง) — กำหนด/เปลี่ยน Role ให้ Members
 *
 * RBAC Model (เตรียมไว้สำหรับ DB):
 *  Role → หลาย Permission (resource + action)
 *  Member → มีได้หลาย Role
 *  Permission = resource:action  เช่น  jobs:create, applicants:view
 */

import {
  AppstoreOutlined,
  BarChartOutlined,
  CheckCircleFilled,
  CloseCircleOutlined,
  CrownOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  FileTextOutlined,
  LockOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Table,
  Tag,
  Tooltip,
  Typography,
  theme,
  message,
} from "antd";
import { useState } from "react";

const { Text, Title } = Typography;
const PRIMARY = "#11b6f5";

// ─── RBAC Types ───────────────────────────────────────────────────────────────

type Resource = "jobs" | "applicants" | "profile" | "members" | "analytics" | "settings";
type Action   = "view" | "create" | "edit" | "delete" | "export" | "manage";

interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: React.ReactNode; // Ant Design icon — ไม่ใช้ emoji
  isSystem: boolean;
  permissions: string[];
  memberCount: number;
  createdAt: string;
}

interface RbacMember {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: "ACTIVE" | "PENDING";
}

// ─── Resource & Action Definitions ───────────────────────────────────────────

const RESOURCES: {
  key: Resource;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  { key: "jobs",       label: "ประกาศงาน",      icon: <FileTextOutlined />,          description: "สร้าง แก้ไข ปิดประกาศงาน" },
  { key: "applicants", label: "ผู้สมัคร",        icon: <TeamOutlined />,              description: "ดู อัปเดตสถานะ ส่งออกข้อมูลผู้สมัคร" },
  { key: "profile",    label: "โปรไฟล์โรงเรียน", icon: <AppstoreOutlined />,          description: "แก้ไขข้อมูล โลโก้ รูปภาพโรงเรียน" },
  { key: "members",    label: "จัดการสมาชิก",    icon: <SafetyCertificateOutlined />, description: "เชิญ ลบ เปลี่ยนบทบาทสมาชิก" },
  { key: "analytics",  label: "สถิติ & รายงาน",  icon: <BarChartOutlined />,          description: "ดูสถิติประกาศ ยอดเข้าชม ผู้สมัคร" },
  { key: "settings",   label: "ตั้งค่าระบบ",     icon: <SettingOutlined />,           description: "ตั้งค่าองค์กร notification และความปลอดภัย" },
];

const ACTIONS: {
  key: Action;
  label: string;
  description: string;
  risk: "low" | "medium" | "high";
}[] = [
  { key: "view",   label: "ดู",     description: "อ่านข้อมูล",            risk: "low" },
  { key: "create", label: "สร้าง",  description: "เพิ่มข้อมูลใหม่",       risk: "medium" },
  { key: "edit",   label: "แก้ไข",  description: "แก้ไขข้อมูลที่มีอยู่",  risk: "medium" },
  { key: "delete", label: "ลบ",     description: "ลบข้อมูลถาวร",          risk: "high" },
  { key: "export", label: "ส่งออก", description: "ดาวน์โหลด / Export",    risk: "medium" },
  { key: "manage", label: "จัดการ", description: "ควบคุมเต็มรูปแบบ",      risk: "high" },
];

const buildPermissionKey = (resource: Resource, action: Action) => `${resource}:${action}`;

// ─── Role Icon Map (ใช้ Ant Design icon ตาม role id) ─────────────────────────

const ROLE_ICON_MAP: Record<string, React.ReactNode> = {
  owner:      <CrownOutlined />,
  admin:      <SafetyCertificateOutlined />,
  hr_manager: <TeamOutlined />,
  staff:      <UserOutlined />,
  recruiter:  <SearchOutlined />,
};

const getRoleIcon = (id: string): React.ReactNode =>
  ROLE_ICON_MAP[id] ?? <UserOutlined />;

// ─── PRESET icon options สำหรับ Custom Role ──────────────────────────────────

const ICON_OPTIONS: { value: string; label: string; icon: React.ReactNode }[] = [
  { value: "user",       label: "User",          icon: <UserOutlined /> },
  { value: "team",       label: "Team",          icon: <TeamOutlined /> },
  { value: "safety",     label: "Safety",        icon: <SafetyCertificateOutlined /> },
  { value: "setting",    label: "Setting",       icon: <SettingOutlined /> },
  { value: "file",       label: "File",          icon: <FileTextOutlined /> },
  { value: "bar-chart",  label: "Analytics",     icon: <BarChartOutlined /> },
  { value: "search",     label: "Search",        icon: <SearchOutlined /> },
  { value: "export",     label: "Export",        icon: <ExportOutlined /> },
  { value: "eye",        label: "View",          icon: <EyeOutlined /> },
  { value: "lock",       label: "Lock",          icon: <LockOutlined /> },
];

const getIconByValue = (value: string): React.ReactNode =>
  ICON_OPTIONS.find((o) => o.value === value)?.icon ?? <UserOutlined />;

// ─── Mock Initial Data ────────────────────────────────────────────────────────

const INITIAL_ROLES: Role[] = [
  {
    id: "owner",
    name: "Owner",
    slug: "owner",
    description: "เจ้าขององค์กร — มีสิทธิ์ทุกอย่าง ไม่สามารถจำกัดได้",
    color: "#F59E0B",
    icon: <CrownOutlined />,
    isSystem: true,
    permissions: RESOURCES.flatMap((r) => ACTIONS.map((a) => buildPermissionKey(r.key, a.key))),
    memberCount: 1,
    createdAt: "2024-01-15",
  },
  {
    id: "admin",
    name: "Admin",
    slug: "admin",
    description: "ผู้ดูแลระบบ — จัดการงานและผู้สมัครได้ แต่ไม่สามารถลบองค์กรหรือจัดการสมาชิกได้",
    color: "#3B82F6",
    icon: <SafetyCertificateOutlined />,
    isSystem: true,
    permissions: [
      "jobs:view", "jobs:create", "jobs:edit", "jobs:delete",
      "applicants:view", "applicants:edit", "applicants:export",
      "analytics:view",
      "profile:view", "profile:edit",
    ],
    memberCount: 2,
    createdAt: "2024-01-15",
  },
  {
    id: "hr_manager",
    name: "HR Manager",
    slug: "hr_manager",
    description: "ผู้จัดการฝ่าย HR — เน้นดูแลผู้สมัครและออกรายงาน",
    color: "#10B981",
    icon: <TeamOutlined />,
    isSystem: false,
    permissions: [
      "jobs:view",
      "applicants:view", "applicants:edit", "applicants:export",
      "analytics:view", "analytics:export",
    ],
    memberCount: 1,
    createdAt: "2024-06-01",
  },
  {
    id: "staff",
    name: "Staff",
    slug: "staff",
    description: "เจ้าหน้าที่ทั่วไป — ดูข้อมูลได้อย่างเดียว",
    color: "#94A3B8",
    icon: <UserOutlined />,
    isSystem: true,
    permissions: ["jobs:view", "applicants:view", "analytics:view"],
    memberCount: 3,
    createdAt: "2024-01-15",
  },
  {
    id: "recruiter",
    name: "Recruiter",
    slug: "recruiter",
    description: "นักสรรหา — สร้างประกาศ จัดการผู้สมัครได้ แต่ไม่แก้ไขโปรไฟล์โรงเรียน",
    color: "#8B5CF6",
    icon: <SearchOutlined />,
    isSystem: false,
    permissions: [
      "jobs:view", "jobs:create", "jobs:edit",
      "applicants:view", "applicants:edit",
    ],
    memberCount: 0,
    createdAt: "2026-03-01",
  },
];

const MOCK_RBAC_MEMBERS: RbacMember[] = [
  { id: "1", name: "สมชาย รักการศึกษา", email: "somchai@school.ac.th",  roles: ["owner"],               status: "ACTIVE" },
  { id: "2", name: "สมหญิง ใจดี",        email: "somying@school.ac.th", roles: ["admin", "hr_manager"], status: "ACTIVE" },
  { id: "3", name: "วิชัย มุ่งมั่น",    email: "wichai@school.ac.th",  roles: ["staff"],               status: "ACTIVE" },
  { id: "4", name: "นิดา รอการตอบรับ",  email: "nida@gmail.com",        roles: ["recruiter"],           status: "PENDING" },
];

// ─── Risk Badge ───────────────────────────────────────────────────────────────

const RiskBadge = ({ risk }: { risk: "low" | "medium" | "high" }) => {
  const COLOR = { low: "#10B981", medium: "#F59E0B", high: "#EF4444" };
  const LABEL = { low: "ต่ำ", medium: "กลาง", high: "สูง" };
  return (
    <span style={{ fontSize: 10, color: COLOR[risk], fontWeight: 600 }}>
      {LABEL[risk]}
    </span>
  );
};

// ─── Role Form Modal ──────────────────────────────────────────────────────────

const RoleFormModal = ({
  open,
  role,
  onClose,
  onSave,
}: {
  open: boolean;
  role: Role | null;
  onClose: () => void;
  onSave: (data: { name: string; description: string; color: string; iconValue: string }) => void;
}) => {
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const isCreate = !role;

  const PRESET_COLORS = [
    "#11b6f5", "#3B82F6", "#10B981", "#F59E0B",
    "#8B5CF6", "#EF4444", "#EC4899", "#94A3B8",
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      centered
      title={
        <Flex align="center" gap={10}>
          <Flex
            align="center"
            justify="center"
            style={{
              width: 36, height: 36, borderRadius: 9,
              background: `linear-gradient(135deg, ${PRIMARY} 0%, #0878a8 100%)`,
            }}
          >
            <SafetyCertificateOutlined style={{ color: "#fff", fontSize: 16 }} />
          </Flex>
          <Text strong style={{ fontSize: 15 }}>
            {isCreate ? "สร้าง Role ใหม่" : `แก้ไข: ${role?.name}`}
          </Text>
        </Flex>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={
          role
            ? { name: role.name, description: role.description, color: role.color, iconValue: "user" }
            : { color: "#11b6f5", iconValue: "user" }
        }
        onFinish={(v) => { onSave(v); form.resetFields(); }}
        style={{ marginTop: 16 }}
      >
        <Row gutter={12}>
          <Col span={16}>
            <Form.Item
              label="ชื่อ Role"
              name="name"
              rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}
            >
              <Input placeholder="เช่น HR Manager" size="large" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Icon" name="iconValue">
              <Select size="large">
                {ICON_OPTIONS.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    <Flex align="center" gap={6}>
                      <span style={{ fontSize: 14 }}>{opt.icon}</span>
                      <Text style={{ fontSize: 12 }}>{opt.label}</Text>
                    </Flex>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="คำอธิบาย" name="description">
          <Input.TextArea rows={2} placeholder="อธิบายหน้าที่และขอบเขตของ Role นี้" />
        </Form.Item>

        <Form.Item label="สีประจำ Role" name="color">
          <Flex gap={8} wrap="wrap">
            {PRESET_COLORS.map((c) => (
              <div
                key={c}
                onClick={() => form.setFieldValue("color", c)}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  backgroundColor: c, cursor: "pointer",
                  outline: form.getFieldValue("color") === c ? `3px solid ${token.colorText}` : "2px solid transparent",
                  outlineOffset: 2,
                  transition: "outline 0.15s",
                }}
              />
            ))}
          </Flex>
        </Form.Item>

        <Flex
          style={{
            backgroundColor: token.colorWarningBg, borderRadius: 8,
            padding: "10px 14px", marginBottom: 16,
          }}
          gap={8}
          align="flex-start"
        >
          <WarningOutlined style={{ color: token.colorWarning, marginTop: 2 }} />
          <Text style={{ fontSize: 12, color: token.colorWarningText }}>
            หลังสร้าง Role แล้ว ให้ไปกำหนด Permission ใน Permission Matrix
          </Text>
        </Flex>

        <Flex justify="flex-end" gap={8}>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button type="primary" htmlType="submit" icon={isCreate ? <PlusOutlined /> : <EditOutlined />}>
            {isCreate ? "สร้าง Role" : "บันทึก"}
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

// ─── Permission Matrix ────────────────────────────────────────────────────────

const PermissionMatrix = ({
  role,
  onPermissionChange,
}: {
  role: Role;
  onPermissionChange: (key: string, checked: boolean) => void;
}) => {
  const { token } = theme.useToken();

  const isChecked = (resource: Resource, action: Action) =>
    role.permissions.includes(buildPermissionKey(resource, action));

  const isRowAllChecked = (resource: Resource) =>
    ACTIONS.every((a) => role.permissions.includes(buildPermissionKey(resource, a.key)));

  const isRowIndeterminate = (resource: Resource) => {
    const count = ACTIONS.filter((a) =>
      role.permissions.includes(buildPermissionKey(resource, a.key)),
    ).length;
    return count > 0 && count < ACTIONS.length;
  };

  const toggleRow = (resource: Resource, checked: boolean) => {
    ACTIONS.forEach((a) => {
      const key = buildPermissionKey(resource, a.key);
      const has = role.permissions.includes(key);
      if (checked && !has) onPermissionChange(key, true);
      if (!checked && has) onPermissionChange(key, false);
    });
  };

  if (role.isSystem && role.id === "owner") {
    return (
      <Flex align="center" justify="center" style={{ padding: "40px 0" }}>
        <Flex vertical align="center" gap={12}>
          <CrownOutlined style={{ fontSize: 32, color: "#F59E0B" }} />
          <Text strong>Owner มีสิทธิ์ทุกอย่างโดย default</Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            ไม่สามารถจำกัดหรือแก้ไขสิทธิ์ของ Owner ได้
          </Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex vertical gap={0}>
      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px repeat(6, 1fr)",
          backgroundColor: token.colorFillQuaternary,
          borderRadius: "8px 8px 0 0",
          padding: "10px 16px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Text
          type="secondary"
          style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}
        >
          ทรัพยากร
        </Text>
        {ACTIONS.map((a) => (
          <Flex key={a.key} vertical align="center" gap={3}>
            <Text style={{ fontSize: 12, fontWeight: 600 }}>{a.label}</Text>
            <RiskBadge risk={a.risk} />
          </Flex>
        ))}
      </div>

      {/* Rows */}
      {RESOURCES.map((res, ri) => (
        <div
          key={res.key}
          style={{
            display: "grid",
            gridTemplateColumns: "220px repeat(6, 1fr)",
            padding: "12px 16px",
            alignItems: "center",
            backgroundColor: ri % 2 === 0 ? token.colorBgContainer : token.colorFillQuaternary,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          {/* Resource label */}
          <Flex align="center" gap={10}>
            <Checkbox
              checked={isRowAllChecked(res.key)}
              indeterminate={isRowIndeterminate(res.key)}
              onChange={(e) => toggleRow(res.key, e.target.checked)}
              disabled={role.isSystem}
            />
            <Flex align="center" gap={6}>
              <span style={{ color: PRIMARY, fontSize: 14 }}>{res.icon}</span>
              <Flex vertical gap={1}>
                <Text style={{ fontSize: 13, fontWeight: 500 }}>{res.label}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>{res.description}</Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Action checkboxes */}
          {ACTIONS.map((action) => {
            const key = buildPermissionKey(res.key, action.key);
            const checked = isChecked(res.key, action.key);
            const notApplicable =
              (res.key === "analytics" && ["create", "edit", "delete", "manage"].includes(action.key)) ||
              (res.key === "settings"  && ["create", "delete", "export"].includes(action.key));

            return (
              <Flex key={key} justify="center" align="center">
                {notApplicable ? (
                  <Text type="secondary" style={{ fontSize: 16, lineHeight: 1 }}>—</Text>
                ) : (
                  <Tooltip title={`${res.label}: ${action.label} (ความเสี่ยง: ${action.risk})`}>
                    <Checkbox
                      checked={checked}
                      onChange={(e) => onPermissionChange(key, e.target.checked)}
                      disabled={role.isSystem}
                    />
                  </Tooltip>
                )}
              </Flex>
            );
          })}
        </div>
      ))}

      {/* Summary footer */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px repeat(6, 1fr)",
          padding: "10px 16px",
          backgroundColor: token.colorFillSecondary,
          borderRadius: "0 0 8px 8px",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Text type="secondary" style={{ fontSize: 12 }}>
          {role.permissions.length} permission ทั้งหมด
        </Text>
        {ACTIONS.map((a) => {
          const count = RESOURCES.filter((r) =>
            role.permissions.includes(buildPermissionKey(r.key, a.key)),
          ).length;
          return (
            <Flex key={a.key} justify="center">
              <Text style={{ fontSize: 12, color: count > 0 ? PRIMARY : token.colorTextQuaternary }}>
                {count}/{RESOURCES.length}
              </Text>
            </Flex>
          );
        })}
      </div>

      {role.isSystem && (
        <Alert
          style={{ marginTop: 12, borderRadius: 8 }}
          message="System Role — ไม่สามารถแก้ไข Permission ได้"
          description="Role นี้เป็น built-in role ของระบบ หากต้องการ Permission แบบกำหนดเอง ให้สร้าง Custom Role ใหม่"
          type="warning"
          showIcon
          icon={<LockOutlined />}
        />
      )}
    </Flex>
  );
};

// ─── Member Role Assignment Panel ────────────────────────────────────────────

const MemberRolePanel = ({
  members,
  roles,
  onUpdate,
}: {
  members: RbacMember[];
  roles: Role[];
  onUpdate: (memberId: string, roleIds: string[]) => void;
}) => {
  const { token } = theme.useToken();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getEffectivePermissions = (member: RbacMember): Set<string> => {
    const all = new Set<string>();
    member.roles.forEach((roleId) => {
      roles.find((r) => r.id === roleId)?.permissions.forEach((p) => all.add(p));
    });
    return all;
  };

  const columns = [
    {
      title: "สมาชิก",
      key: "member",
      render: (_: unknown, m: RbacMember) => (
        <Flex align="center" gap={10}>
          <Avatar size={36} style={{ backgroundColor: PRIMARY, fontSize: 13, flexShrink: 0 }}>
            {m.name.charAt(0)}
          </Avatar>
          <Flex vertical gap={1}>
            <Text strong style={{ fontSize: 13 }}>{m.name}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{m.email}</Text>
          </Flex>
        </Flex>
      ),
    },
    {
      title: "Roles ที่ได้รับ",
      key: "roles",
      render: (_: unknown, m: RbacMember) => (
        <Select
          mode="multiple"
          value={m.roles}
          style={{ minWidth: 260 }}
          onChange={(vals) => onUpdate(m.id, vals)}
          disabled={m.roles.includes("owner")}
          placeholder="เลือก Role"
          options={roles.map((r) => ({
            value: r.id,
            label: (
              <Flex align="center" gap={6}>
                <span style={{ color: r.color, fontSize: 13 }}>{r.icon}</span>
                <Text style={{ fontSize: 12 }}>{r.name}</Text>
              </Flex>
            ),
            disabled: r.id === "owner",
          }))}
        />
      ),
    },
    {
      title: "สิทธิ์รวม (Effective)",
      key: "perms",
      render: (_: unknown, m: RbacMember) => {
        const perms = getEffectivePermissions(m);
        return (
          <Flex align="center" gap={6}>
            <Tag color="blue" style={{ fontSize: 12 }}>{perms.size} permissions</Tag>
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
              style={{ fontSize: 12 }}
            >
              {expandedId === m.id ? "ซ่อน" : "ดูรายละเอียด"}
            </Button>
          </Flex>
        );
      },
    },
    {
      title: "สถานะ",
      key: "status",
      width: 100,
      render: (_: unknown, m: RbacMember) => (
        <Badge
          status={m.status === "ACTIVE" ? "success" : "warning"}
          text={m.status === "ACTIVE" ? "ใช้งาน" : "รอยืนยัน"}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={members}
      rowKey="id"
      pagination={false}
      expandable={{
        expandedRowKeys: expandedId ? [expandedId] : [],
        showExpandColumn: false,
        expandedRowRender: (m: RbacMember) => {
          const perms = getEffectivePermissions(m);
          return (
            <div
              style={{
                padding: "16px 24px",
                backgroundColor: token.colorFillQuaternary,
                borderRadius: 8,
                margin: "4px 0",
              }}
            >
              <Text strong style={{ fontSize: 13, display: "block", marginBottom: 12 }}>
                Effective Permissions ของ {m.name}
              </Text>

              {/* Mini matrix */}
              <div style={{ display: "grid", gridTemplateColumns: "160px repeat(6, 1fr)", gap: "6px 0" }}>
                <div />
                {ACTIONS.map((a) => (
                  <Text key={a.key} style={{ fontSize: 11, textAlign: "center", color: token.colorTextSecondary }}>
                    {a.label}
                  </Text>
                ))}
                {RESOURCES.map((res) => (
                  <>
                    <Flex key={`${res.key}-label`} align="center" gap={4}>
                      <span style={{ color: PRIMARY, fontSize: 12 }}>{res.icon}</span>
                      <Text style={{ fontSize: 12 }}>{res.label}</Text>
                    </Flex>
                    {ACTIONS.map((a) => {
                      const key = buildPermissionKey(res.key, a.key);
                      return (
                        <Flex key={key} justify="center" align="center">
                          {perms.has(key)
                            ? <CheckCircleFilled style={{ color: "#10B981", fontSize: 14 }} />
                            : <CloseCircleOutlined style={{ color: token.colorTextQuaternary, fontSize: 14 }} />
                          }
                        </Flex>
                      );
                    })}
                  </>
                ))}
              </div>

              <Divider style={{ margin: "12px 0 8px" }} />
              <Flex align="center" gap={8} wrap="wrap">
                <Text type="secondary" style={{ fontSize: 12 }}>มาจาก Role:</Text>
                {m.roles.map((roleId) => {
                  const r = roles.find((x) => x.id === roleId);
                  if (!r) return null;
                  return (
                    <Tag
                      key={roleId}
                      icon={<span style={{ marginRight: 4, fontSize: 12 }}>{r.icon}</span>}
                      style={{
                        backgroundColor: r.color + "22",
                        borderColor: r.color,
                        color: r.color,
                        fontSize: 12,
                      }}
                    >
                      {r.name}
                    </Tag>
                  );
                })}
              </Flex>
            </div>
          );
        },
      }}
    />
  );
};

// ─── RBAC Tab (main export) ───────────────────────────────────────────────────

export const RbacTab = () => {
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();

  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [members, setMembers] = useState<RbacMember[]>(MOCK_RBAC_MEMBERS);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("admin");
  const [roleFormOpen, setRoleFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [section, setSection] = useState<"matrix" | "members">("matrix");

  const selectedRole = roles.find((r) => r.id === selectedRoleId)!;

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handlePermissionChange = (key: string, checked: boolean) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id !== selectedRoleId
          ? r
          : {
              ...r,
              permissions: checked
                ? [...r.permissions, key]
                : r.permissions.filter((p) => p !== key),
            },
      ),
    );
  };

  const handleSaveRole = (data: {
    name: string;
    description: string;
    color: string;
    iconValue: string;
  }) => {
    const resolvedIcon = getIconByValue(data.iconValue);
    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id
            ? { ...r, name: data.name, description: data.description, color: data.color, icon: resolvedIcon }
            : r,
        ),
      );
      messageApi.success(`อัปเดต Role "${data.name}" แล้ว`);
    } else {
      const newRole: Role = {
        id: `custom_${Date.now()}`,
        slug: data.name.toLowerCase().replace(/\s+/g, "_"),
        name: data.name,
        description: data.description ?? "",
        color: data.color ?? "#94A3B8",
        icon: resolvedIcon,
        isSystem: false,
        permissions: [],
        memberCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setRoles((prev) => [...prev, newRole]);
      setSelectedRoleId(newRole.id);
      messageApi.success(`สร้าง Role "${newRole.name}" แล้ว — กำหนด Permission ได้เลย`);
    }
    setRoleFormOpen(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (role: Role) => {
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
    if (selectedRoleId === role.id) setSelectedRoleId("admin");
    messageApi.success(`ลบ Role "${role.name}" แล้ว`);
  };

  const handleMemberRoleUpdate = (memberId: string, roleIds: string[]) => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, roles: roleIds } : m)));
    messageApi.success("อัปเดต Role ของสมาชิกแล้ว");
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <Flex vertical gap={20}>
      {contextHolder}

      {/* Header card */}
      <Card
        variant="borderless"
        style={{ borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        styles={{ body: { padding: "20px 24px" } }}
      >
        <Flex align="center" justify="space-between" wrap="wrap" gap={12}>
          <Flex vertical gap={4}>
            <Flex align="center" gap={8}>
              <LockOutlined style={{ color: PRIMARY, fontSize: 18 }} />
              <Title level={5} style={{ margin: 0 }}>
                Role-Based Access Control (RBAC)
              </Title>
            </Flex>
            <Text type="secondary" style={{ fontSize: 13 }}>
              กำหนดสิทธิ์การเข้าถึงระบบตามบทบาท — รองรับ Custom Role, Multi-Role per Member
            </Text>
          </Flex>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => { setEditingRole(null); setRoleFormOpen(true); }}
          >
            สร้าง Role ใหม่
          </Button>
        </Flex>

        {/* Sub-section tabs */}
        <Flex gap={0} style={{ marginTop: 16, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
          {[
            { key: "matrix",  label: "Permission Matrix",        icon: <AppstoreOutlined /> },
            { key: "members", label: "กำหนด Role ให้สมาชิก",     icon: <TeamOutlined /> },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setSection(t.key as typeof section)}
              style={{
                padding: "8px 18px",
                border: "none",
                borderBottom: section === t.key ? `2px solid ${PRIMARY}` : "2px solid transparent",
                background: "transparent",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: section === t.key ? 600 : 400,
                color: section === t.key ? PRIMARY : token.colorTextSecondary,
                display: "flex", alignItems: "center", gap: 6,
                marginBottom: -1,
                transition: "all 0.2s",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </Flex>
      </Card>

      {/* Main content */}
      <Row gutter={[16, 16]}>

        {/* Left: Role List */}
        <Col xs={24} lg={6}>
          <Card
            variant="borderless"
            style={{
              borderRadius: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              position: "sticky",
              top: 80,
            }}
            styles={{ body: { padding: 0 } }}
            title={
              <Flex align="center" gap={6}>
                <SafetyCertificateOutlined style={{ color: PRIMARY }} />
                <Text strong style={{ fontSize: 14 }}>Roles ({roles.length})</Text>
              </Flex>
            }
          >
            <Flex vertical gap={0}>
              {roles.map((role, i) => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    backgroundColor: selectedRoleId === role.id ? PRIMARY + "14" : "transparent",
                    borderLeft: selectedRoleId === role.id ? `3px solid ${PRIMARY}` : "3px solid transparent",
                    borderBottom: i < roles.length - 1 ? `1px solid ${token.colorBorderSecondary}` : "none",
                    transition: "all 0.15s",
                  }}
                >
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap={10}>
                      <Flex
                        align="center"
                        justify="center"
                        style={{
                          width: 32, height: 32, borderRadius: 8,
                          backgroundColor: role.color + "22",
                          color: role.color,
                          fontSize: 15,
                          flexShrink: 0,
                        }}
                      >
                        {role.icon}
                      </Flex>
                      <Flex vertical gap={1}>
                        <Flex align="center" gap={4}>
                          <Text
                            strong
                            style={{
                              fontSize: 13,
                              color: selectedRoleId === role.id ? PRIMARY : token.colorText,
                            }}
                          >
                            {role.name}
                          </Text>
                          {role.isSystem && (
                            <Tooltip title="System Role — ไม่สามารถลบได้">
                              <LockOutlined style={{ fontSize: 10, color: token.colorTextQuaternary }} />
                            </Tooltip>
                          )}
                        </Flex>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {role.memberCount} คน · {role.permissions.length} perms
                        </Text>
                      </Flex>
                    </Flex>

                    {!role.isSystem && (
                      <Flex gap={2} onClick={(e) => e.stopPropagation()}>
                        <Tooltip title="แก้ไข">
                          <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined style={{ fontSize: 12 }} />}
                            onClick={() => { setEditingRole(role); setRoleFormOpen(true); }}
                          />
                        </Tooltip>
                        <Popconfirm
                          title={`ลบ Role "${role.name}"?`}
                          description="สมาชิกที่มี Role นี้จะสูญเสีย Permission ที่เกี่ยวข้อง"
                          onConfirm={() => handleDeleteRole(role)}
                          okText="ลบ"
                          cancelText="ยกเลิก"
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined style={{ fontSize: 12 }} />}
                          />
                        </Popconfirm>
                      </Flex>
                    )}
                  </Flex>
                </div>
              ))}
            </Flex>
          </Card>
        </Col>

        {/* Right: Matrix or Member assignment */}
        <Col xs={24} lg={18}>
          {section === "matrix" ? (
            <Card
              variant="borderless"
              style={{ borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              title={
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={10}>
                    <Flex
                      align="center"
                      justify="center"
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        backgroundColor: selectedRole.color + "22",
                        color: selectedRole.color,
                        fontSize: 16,
                      }}
                    >
                      {selectedRole.icon}
                    </Flex>
                    <Flex vertical gap={1}>
                      <Flex align="center" gap={8}>
                        <Text strong style={{ fontSize: 15 }}>{selectedRole.name}</Text>
                        <Tag
                          color={selectedRole.isSystem ? "default" : "green"}
                          style={{ fontSize: 11 }}
                        >
                          {selectedRole.isSystem ? "System" : "Custom"}
                        </Tag>
                      </Flex>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {selectedRole.description}
                      </Text>
                    </Flex>
                  </Flex>
                  {!selectedRole.isSystem && (
                    <Button
                      type="primary"
                      size="small"
                      icon={<CheckCircleFilled />}
                      onClick={() => messageApi.success("บันทึก Permission แล้ว")}
                    >
                      บันทึก
                    </Button>
                  )}
                </Flex>
              }
            >
              {/* Legend */}
              <Flex gap={20} style={{ marginBottom: 16 }} wrap="wrap" align="center">
                <Text type="secondary" style={{ fontSize: 12 }}>ระดับความเสี่ยง:</Text>
                {[
                  { color: "#10B981", label: "ต่ำ — อ่านข้อมูล" },
                  { color: "#F59E0B", label: "กลาง — แก้ไข / ส่งออก" },
                  { color: "#EF4444", label: "สูง — ลบ / จัดการเต็ม" },
                ].map((item) => (
                  <Flex key={item.label} align="center" gap={5}>
                    <span
                      style={{
                        width: 8, height: 8, borderRadius: "50%",
                        backgroundColor: item.color, display: "inline-block",
                      }}
                    />
                    <Text type="secondary" style={{ fontSize: 11 }}>{item.label}</Text>
                  </Flex>
                ))}
                <Flex align="center" gap={4}>
                  <Text type="secondary" style={{ fontSize: 11 }}>— = ไม่มี Action นี้สำหรับ Resource นี้</Text>
                </Flex>
              </Flex>

              <PermissionMatrix
                role={selectedRole}
                onPermissionChange={handlePermissionChange}
              />
            </Card>
          ) : (
            <Card
              variant="borderless"
              style={{ borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              title={
                <Flex align="center" gap={8}>
                  <TeamOutlined style={{ color: PRIMARY }} />
                  <Text strong style={{ fontSize: 15 }}>กำหนด Role ให้สมาชิก</Text>
                  <Tooltip title="สมาชิก 1 คนสามารถมีได้หลาย Role — สิทธิ์จะถูกรวม (Union) จากทุก Role">
                    <QuestionCircleOutlined style={{ color: token.colorTextQuaternary }} />
                  </Tooltip>
                </Flex>
              }
            >
              <Alert
                style={{ marginBottom: 16, borderRadius: 8 }}
                message="Multi-Role Support"
                description="สมาชิก 1 คนมีได้หลาย Role — ระบบจะรวม Permission จากทุก Role โดยอัตโนมัติ (Union) กด 'ดูรายละเอียด' เพื่อดู Effective Permissions จริง"
                type="info"
                showIcon
              />
              <MemberRolePanel
                members={members}
                roles={roles}
                onUpdate={handleMemberRoleUpdate}
              />
            </Card>
          )}
        </Col>
      </Row>

      <RoleFormModal
        open={roleFormOpen}
        role={editingRole}
        onClose={() => { setRoleFormOpen(false); setEditingRole(null); }}
        onSave={handleSaveRole}
      />
    </Flex>
  );
};
