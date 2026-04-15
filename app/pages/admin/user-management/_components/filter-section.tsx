"use client";

// ✨ Filter Section — ค้นหา, กรอง role/สถานะ, refresh, export CSV
import {
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Input, Select, Space, Tooltip, message, theme } from "antd";
import { useUserManagementStore } from "../_state/user-management-store";
import { UserRecord } from "../_api/user-management-api";

// ✨ Export CSV จาก UserRecord array
const exportCsv = (users: UserRecord[], filename = "users.csv") => {
  const headers = [
    "ID", "Email", "ชื่อ-นามสกุล", "Role", "โรงเรียน", "Plan",
    "ยืนยันอีเมล", "แบน", "Provider", "เข้าสู่ระบบล่าสุด", "สมัครเมื่อ",
    "ใบสมัคร/งาน", "บทความ", "จังหวัด",
  ];

  const rows = users.map((u) => [
    u.id,
    u.email,
    u.fullName ?? "",
    u.role,
    u.schoolName ?? "",
    u.accountPlan ?? "",
    u.isEmailVerified ? "ใช่" : "ไม่ใช่",
    u.isBanned ? "แบน" : "ปกติ",
    u.provider,
    u.lastSignInAt ?? "",
    u.createdAt,
    u.role === "EMPLOYER" ? u.jobCount : u.applicationCount,
    u.blogCount,
    u.province ?? "",
  ]);

  const csv =
    [headers, ...rows]
      .map((row) =>
        row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export function FilterSection() {
  const { token } = theme.useToken();
  const {
    filterRole,
    filterStatus,
    filterKeyword,
    users,
    selectedRowKeys,
    isLoading,
    setFilterRole,
    setFilterStatus,
    setFilterKeyword,
    fetchUsers,
  } = useUserManagementStore();

  const handleRefresh = async () => {
    await fetchUsers();
    message.success("โหลดข้อมูลสำเร็จ");
  };

  const handleExportAll = () => {
    exportCsv(users, "users_all.csv");
    message.success(`Export ${users.length} รายการสำเร็จ`);
  };

  const handleExportSelected = () => {
    const selected = users.filter((u) => selectedRowKeys.includes(u.id));
    if (selected.length === 0) {
      message.warning("ยังไม่ได้เลือก User");
      return;
    }
    exportCsv(selected, "users_selected.csv");
    message.success(`Export ${selected.length} รายการสำเร็จ`);
  };

  return (
    <Card
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
      styles={{ body: { padding: "14px 20px" } }}
    >
      <Flex align="center" gap={10} wrap="wrap">
        <FilterOutlined style={{ color: token.colorTextTertiary }} />
        {/* ─── ค้นหา ─── */}
        <Input
          placeholder="ค้นหา อีเมล, ชื่อ, โรงเรียน..."
          prefix={<SearchOutlined style={{ color: token.colorTextDescription }} />}
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          allowClear
          style={{ width: 260, borderRadius: 8 }}
        />

        {/* ─── Filter Role ─── */}
        <Select
          value={filterRole}
          onChange={setFilterRole}
          style={{ width: 140 }}
          options={[
            { value: "all", label: "ทุก Role" },
            { value: "EMPLOYEE", label: "ครู" },
            { value: "EMPLOYER", label: "โรงเรียน" },
            { value: "ADMIN", label: "ผู้ดูแล" },
          ]}
        />

        {/* ─── Filter Status ─── */}
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 160 }}
          options={[
            { value: "all", label: "ทุกสถานะ" },
            { value: "active", label: "✅ Active" },
            { value: "unverified", label: "⚠️ ยังไม่ยืนยัน" },
            { value: "banned", label: "🚫 ถูกแบน" },
            { value: "no_profile", label: "❓ ไม่มี Profile" },
          ]}
        />

        {/* ─── Actions ─── */}
        <Space style={{ marginLeft: "auto" }}>
          <Tooltip title="Export CSV ทั้งหมด">
            <Button icon={<DownloadOutlined />} onClick={handleExportAll} size="small">
              Export CSV
            </Button>
          </Tooltip>
          {selectedRowKeys.length > 0 && (
            <Button size="small" onClick={handleExportSelected}>
              Export ที่เลือก ({selectedRowKeys.length})
            </Button>
          )}
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={isLoading}
            size="small"
          >
            รีเฟรช
          </Button>
        </Space>
      </Flex>
    </Card>
  );
}
