"use client";

// ✨ User Table — ตารางแสดง User พร้อม filter, sort, analytics, Drawer
import {
  BankOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  LockOutlined,
  MailOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Pagination,
  Progress,
  Skeleton,
  Table,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UserRecord } from "../_api/user-management-api";
import { useUserManagementStore } from "../_state/user-management-store";

const { Text } = Typography;

// ✨ แปลงวันที่ ISO → ภาษาไทย
const formatThai = (iso?: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ✨ แปลงวันที่ + เวลา
const formatThaiFull = (iso?: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ✨ relative time — "3 ชม.ที่แล้ว" / "2 วันที่แล้ว"
const relativeTime = (iso?: string | null): string => {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "เมื่อกี้";
  if (m < 60) return `${m} นาทีที่แล้ว`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ชม.ที่แล้ว`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} วันที่แล้ว`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} เดือนที่แล้ว`;
  return `${Math.floor(mo / 12)} ปีที่แล้ว`;
};

// ✨ Role display
const roleDisplay = (role: string) => {
  if (role === "ADMIN") return { color: "error", label: "ผู้ดูแล", icon: <LockOutlined /> };
  if (role === "EMPLOYER") return { color: "processing", label: "โรงเรียน", icon: <BankOutlined /> };
  return { color: "success", label: "ครู", icon: <UserOutlined /> };
};

export function UserTable() {
  const { token } = theme.useToken();
  const {
    users,
    total,
    totalPages,
    page,
    pageSize,
    isLoading,
    selectedRowKeys,
    setSelectedRowKeys,
    setPage,
    openDrawer,
  } = useUserManagementStore();

  const columns: ColumnsType<UserRecord> = [
    // ─── ผู้ใช้ ───
    {
      title: "ผู้ใช้",
      key: "user",
      fixed: "left",
      width: 240,
      render: (_, r) => (
        <Flex align="center" gap={10}>
          <Badge
            dot
            color={r.isEmailVerified && !r.isBanned ? "green" : r.isBanned ? "red" : "orange"}
            offset={[-3, 36]}
          >
            <Avatar
              size={36}
              src={r.profileImageUrl}
              icon={<UserOutlined />}
              style={{ background: token.colorPrimary, flexShrink: 0 }}
            />
          </Badge>
          <Flex vertical gap={1}>
            <Text strong style={{ fontSize: 13, lineHeight: 1.3 }}>
              {r.fullName || <Text type="secondary" style={{ fontWeight: 400 }}>—ยังไม่มีชื่อ—</Text>}
            </Text>
            <Flex align="center" gap={4}>
              <MailOutlined style={{ fontSize: 10, color: token.colorTextTertiary }} />
              <Text type="secondary" style={{ fontSize: 11 }}>{r.email}</Text>
            </Flex>
          </Flex>
        </Flex>
      ),
    },

    // ─── Role ───
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 110,
      sorter: (a, b) => a.role.localeCompare(b.role),
      render: (role) => {
        const { color, label, icon } = roleDisplay(role);
        return (
          <Tag color={color} icon={icon} style={{ fontSize: 12 }}>
            {label}
          </Tag>
        );
      },
    },

    // ─── สถานะ ───
    {
      title: "สถานะ",
      key: "status",
      width: 100,
      render: (_, r) => (
        <Flex vertical gap={3}>
          {r.isBanned ? (
            <Tag color="error" icon={<StopOutlined />} style={{ fontSize: 11, margin: 0 }}>แบน</Tag>
          ) : r.isEmailVerified ? (
            <Tag color="success" icon={<CheckCircleOutlined />} style={{ fontSize: 11, margin: 0 }}>Active</Tag>
          ) : (
            <Tag color="warning" icon={<CloseCircleOutlined />} style={{ fontSize: 11, margin: 0 }}>ยังไม่ยืนยัน</Tag>
          )}
          {!r.hasPrismaProfile && (
            <Tag style={{ fontSize: 10, margin: 0, borderStyle: "dashed" }}>ไม่มี Profile</Tag>
          )}
        </Flex>
      ),
    },

    // ─── Provider ───
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
      width: 90,
      render: (v) => (
        <Tag style={{ fontSize: 11, textTransform: "capitalize" }}>{v}</Tag>
      ),
    },

    // ─── โรงเรียน / Plan (EMPLOYER) ───
    {
      title: "โรงเรียน / Plan",
      key: "school",
      width: 170,
      render: (_, r) =>
        r.role === "EMPLOYER" ? (
          <Flex vertical gap={3}>
            <Text style={{ fontSize: 12 }} ellipsis>
              {r.schoolName ?? <Text type="secondary">—</Text>}
            </Text>
            {r.accountPlan && (
              <Tag
                style={{
                  fontSize: 10,
                  margin: 0,
                  textTransform: "uppercase",
                  width: "fit-content",
                }}
              >
                {r.accountPlan}
              </Tag>
            )}
          </Flex>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
        ),
    },

    // ─── Activity ───
    {
      title: "Activity",
      key: "activity",
      width: 160,
      render: (_, r) => (
        <Flex vertical gap={4}>
          {r.role === "EMPLOYER" ? (
            <Tooltip title="จำนวนประกาศงาน">
              <Flex align="center" gap={6}>
                <FileTextOutlined style={{ fontSize: 11, color: token.colorPrimary }} />
                <Text style={{ fontSize: 12 }}>{r.jobCount} งาน</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  / {r.orgMemberCount} สมาชิก
                </Text>
              </Flex>
            </Tooltip>
          ) : (
            <Tooltip title="จำนวนใบสมัคร">
              <Flex align="center" gap={6}>
                <FileTextOutlined style={{ fontSize: 11, color: "#52c41a" }} />
                <Text style={{ fontSize: 12 }}>{r.applicationCount} ใบสมัคร</Text>
              </Flex>
            </Tooltip>
          )}
          {r.blogCount > 0 && (
            <Text type="secondary" style={{ fontSize: 11 }}>{r.blogCount} บทความ</Text>
          )}
          {/* ─── Quota bar (EMPLOYER) ─── */}
          {r.role === "EMPLOYER" && r.schoolName && (
            <Tooltip title={`${r.jobCount} จาก quota`}>
              <Progress
                percent={Math.min(100, Math.round((r.jobCount / Math.max(1, 20)) * 100))}
                size="small"
                showInfo={false}
                strokeColor={token.colorPrimary}
                style={{ margin: 0 }}
              />
            </Tooltip>
          )}
        </Flex>
      ),
    },

    // ─── เข้าสู่ระบบล่าสุด ───
    {
      title: "เข้าสู่ระบบล่าสุด",
      dataIndex: "lastSignInAt",
      key: "lastSignInAt",
      width: 140,
      sorter: (a, b) =>
        new Date(a.lastSignInAt ?? 0).getTime() -
        new Date(b.lastSignInAt ?? 0).getTime(),
      render: (v) => (
        <Tooltip title={formatThaiFull(v)}>
          <Flex align="center" gap={5}>
            <ClockCircleOutlined style={{ fontSize: 11, color: token.colorTextTertiary }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {relativeTime(v)}
            </Text>
          </Flex>
        </Tooltip>
      ),
    },

    // ─── สมัครเมื่อ ───
    {
      title: "สมัครเมื่อ",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 110,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: "descend",
      render: (v) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {formatThai(v)}
        </Text>
      ),
    },

    // ─── Actions ───
    {
      title: "",
      key: "actions",
      width: 60,
      fixed: "right",
      render: (_, r) => (
        <Tooltip title="ดูรายละเอียด / Audit Log">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => openDrawer(r.id)}
            style={{ color: token.colorPrimary }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Card
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
      styles={{ body: { padding: 0 } }}
    >
      {isLoading ? (
        <div style={{ padding: "16px 24px" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Flex
              key={i}
              gap={8}
              align="center"
              style={{
                padding: "12px 0",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <Skeleton.Avatar size={36} active />
              {[180, 90, 90, 80, 150, 140, 100, 110].map((w, j) => (
                <Skeleton.Input key={j} active size="small" style={{ width: w, minWidth: w }} />
              ))}
            </Flex>
          ))}
        </div>
      ) : (
        <>
          <Table<UserRecord>
            columns={columns}
            dataSource={users}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1260 }}
            size="middle"
            locale={{ emptyText: "ไม่พบผู้ใช้" }}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys as string[]),
            }}
            rowClassName={(r) =>
              r.isBanned ? "ant-table-row-banned" : ""
            }
            onRow={(r) => ({
              onDoubleClick: () => openDrawer(r.id),
              style: { cursor: "pointer" },
            })}
          />

          {/* ─── Pagination ─── */}
          {total > pageSize && (
            <Flex justify="flex-end" style={{ padding: "12px 24px", borderTop: `1px solid ${token.colorBorderSecondary}` }}>
              <Pagination
                current={page}
                total={total}
                pageSize={pageSize}
                onChange={setPage}
                showSizeChanger={false}
                showTotal={(t) => `ทั้งหมด ${t} User`}
                size="small"
              />
            </Flex>
          )}
        </>
      )}
    </Card>
  );
}
