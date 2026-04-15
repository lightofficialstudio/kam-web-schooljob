"use client";

// ✨ Bulk Action Section — action กลุ่มเมื่อเลือก rows
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Modal, Space, Typography, message, theme } from "antd";
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
  } = useUserManagementStore();

  if (selectedRowKeys.length === 0) return null;

  const selectedUsers = users.filter((u) => selectedRowKeys.includes(u.id));

  // ✨ Export CSV ที่เลือก
  const handleExport = () => {
    const headers = ["ID", "Email", "ชื่อ-นามสกุล", "Role", "สถานะ", "สมัครเมื่อ"];
    const rows = selectedUsers.map((u) => [
      u.id, u.email, u.fullName ?? "", u.role,
      u.isBanned ? "แบน" : u.isEmailVerified ? "Active" : "ยังไม่ยืนยัน",
      u.createdAt,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_selected.csv";
    a.click();
    URL.revokeObjectURL(url);
    message.success(`Export ${selectedUsers.length} รายการสำเร็จ`);
  };

  // ✨ ลบทั้งหมดที่เลือก
  const handleDeleteAll = () => {
    Modal.confirm({
      title: `ลบ ${selectedRowKeys.length} User?`,
      content: (
        <Text type="danger">
          ลบ Supabase Auth + Prisma Profile ทั้งหมด — ไม่สามารถย้อนกลับได้
        </Text>
      ),
      okText: "ลบทั้งหมด",
      okButtonProps: { danger: true },
      cancelText: "ยกเลิก",
      onOk: async () => {
        for (const id of selectedRowKeys) {
          try {
            await deleteUser(id as string);
          } catch {
            message.error(`ลบ ${id} ไม่สำเร็จ`);
          }
        }
        setSelectedRowKeys([]);
        message.success("ลบ User ที่เลือกสำเร็จ");
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
