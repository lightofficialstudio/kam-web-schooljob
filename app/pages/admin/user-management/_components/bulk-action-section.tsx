"use client";

// ✨ Bulk Action Section — action กลุ่มเมื่อเลือก rows
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Space, Typography, theme } from "antd";
import { useUserManagementStore } from "../_state/user-management-store";

const { Text } = Typography;

export function BulkActionSection() {
  const { token } = theme.useToken();
  const {
    selectedRowKeys,
    users,
    setSelectedRowKeys,
    deleteUser,
    isUpdatingUser,
    showModal,
    setModalLoading,
  } = useUserManagementStore();

  if (selectedRowKeys.length === 0) return null;

  const selectedUsers = users.filter((u) => selectedRowKeys.includes(u.id));

  // ✨ Export CSV ที่เลือก
  const handleExport = () => {
    const headers = [
      "ID",
      "Email",
      "ชื่อ-นามสกุล",
      "Role",
      "สถานะ",
      "สมัครเมื่อ",
    ];
    const rows = selectedUsers.map((u) => [
      u.id,
      u.email,
      u.fullName ?? "",
      u.role,
      u.isBanned ? "แบน" : u.isEmailVerified ? "Active" : "ยังไม่ยืนยัน",
      u.createdAt,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_selected.csv";
    a.click();
    URL.revokeObjectURL(url);
    showModal({
      type: "success",
      title: "Export สำเร็จ",
      description: `Export ${selectedUsers.length} รายการเสร็จแล้ว`,
    });
  };

  // ✨ ลบทั้งหมดที่เลือก
  const handleDeleteAll = () => {
    showModal({
      type: "delete",
      title: `ลบ ${selectedRowKeys.length} User?`,
      description: `ลบ Supabase Auth + Prisma Profile ทั้งหมด — ไม่สามารถย้อนกลับได้`,
      confirmLabel: "ลบทั้งหมด",
      cancelLabel: "ยกเลิก",
      onConfirm: async () => {
        setModalLoading(true);
        const errors: string[] = [];
        for (const id of selectedRowKeys) {
          try {
            await deleteUser(id as string);
          } catch (err) {
            errors.push(
              `ID ${id}: ${err instanceof Error ? err.message : String(err)}`,
            );
          }
        }
        setSelectedRowKeys([]);
        if (errors.length > 0) {
          showModal({
            type: "error",
            title: "ลบบางรายการไม่สำเร็จ",
            description: `ลบสำเร็จ ${selectedRowKeys.length - errors.length} รายการ, ล้มเหลว ${errors.length} รายการ`,
            errorDetails: errors.join("\n"),
          });
        } else {
          showModal({
            type: "success",
            title: "ลบ User สำเร็จ",
            description: `ลบ ${selectedRowKeys.length} รายการเรียบร้อยแล้ว`,
          });
        }
      },
    });
  };

  return (
    <Card
      style={{
        background: token.colorPrimaryBg,
        border: `1px solid ${token.colorPrimaryBorder}`,
        borderRadius: token.borderRadiusLG,
      }}
      styles={{ body: { padding: "10px 20px" } }}
    >
      <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
        <Text>
          เลือก{" "}
          <Text strong style={{ color: token.colorPrimary }}>
            {selectedRowKeys.length}
          </Text>{" "}
          User
        </Text>
        <Space>
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            loading={isUpdatingUser}
            onClick={handleDeleteAll}
          >
            ลบที่เลือก
          </Button>
          <Button size="small" onClick={() => setSelectedRowKeys([])}>
            ยกเลิก
          </Button>
        </Space>
      </Flex>
    </Card>
  );
}
