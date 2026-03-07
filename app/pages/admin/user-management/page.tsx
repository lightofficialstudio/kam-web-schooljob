"use client";

import { AdminLayout } from "@/app/components/layouts/admin/admin-layout";
import { AdminGuard } from "@/app/components/layouts/admin/admin-guard";
import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  message,
  Modal,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useEffect, useState } from "react";

// ✨ [Type Definition สำหรับ User]
interface UserRecord {
  id: string;
  userId: string;
  email: string;
  fullName: string | null;
  role: "TEACHER" | "SCHOOL" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

// ✨ [Component]
export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserRecord[]>([]);

  // 🔍 [ดึงข้อมูล User ทั้งหมด]
  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log("📊 [USER MANAGEMENT] Fetching users...");

      const response = await fetch("/api/v1/admin/users");
      const data = await response.json();

      if (response.ok && data.data?.users) {
        console.log(`✅ [USER MANAGEMENT] Found ${data.data.total} users`);
        setUsers(data.data.users);
        setFilteredUsers(data.data.users);
        message.success(`Loaded ${data.data.total} users`);
      } else {
        message.error(data.message_th || "Failed to load users");
      }
    } catch (error: unknown) {
      console.error("❌ [USER MANAGEMENT] Error:", error);
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 [Load users on mount]
  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔍 [Filter users by search text]
  useEffect(() => {
    const filtered = users.filter((user) =>
      [user.email, user.fullName, user.role]
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchText, users]);

  // ✨ [Delete user]
  const handleDelete = (userId: string, email: string) => {
    Modal.confirm({
      title: "Delete User",
      content: `Are you sure you want to delete ${email}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        // TODO: Implement delete API
        message.info("Delete API not yet implemented");
        console.log("Delete user:", userId);
      },
    });
  };

  // ✨ [Column Definitions]
  const columns: ColumnsType<UserRecord> = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (email: string) => (
        <Tooltip title={email}>
          <span className="font-medium text-slate-800">{email}</span>
        </Tooltip>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      width: 180,
      render: (fullName: string | null) => (
        <span className="text-slate-700">{fullName || "-"}</span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => {
        let color = "default";
        if (role === "ADMIN") color = "red";
        else if (role === "SCHOOL") color = "blue";
        else if (role === "TEACHER") color = "green";

        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Link href={`/pages/admin/users/${record.id}/edit`}>
              <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                className="text-blue-600"
              />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => handleDelete(record.id, record.email)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <AdminGuard>
      <AdminLayout title="User Management">
        <div className="space-y-6">
          {/* ✨ [Header Section] */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                User Management
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Manage all registered users in the system
              </p>
            </div>
          </div>

          {/* ✨ [Toolbar] */}
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between gap-4">
            {/* ✨ [Search Box] */}
            <Input
              placeholder="Search by email, name, or role..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              className="flex-1 max-w-xs"
            />

            {/* ✨ [Action Buttons] */}
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchUsers}
                loading={loading}
              >
                Refresh
              </Button>
              <Link href="/pages/admin/users/new">
                <Button type="primary">Add New User</Button>
              </Link>
            </Space>
          </div>

          {/* ✨ [Stats Section] */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-slate-600 text-sm font-semibold">
                Total Users
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-2">
                {users.length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-slate-600 text-sm font-semibold">
                Teachers
              </div>
              <div className="text-3xl font-bold text-green-600 mt-2">
                {users.filter((u) => u.role === "TEACHER").length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-slate-600 text-sm font-semibold">Schools</div>
              <div className="text-3xl font-bold text-blue-600 mt-2">
                {users.filter((u) => u.role === "SCHOOL").length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-slate-600 text-sm font-semibold">Admins</div>
              <div className="text-3xl font-bold text-red-600 mt-2">
                {users.filter((u) => u.role === "ADMIN").length}
              </div>
            </div>
          </div>

          {/* ✨ [Data Table] */}
          <div className="bg-white rounded-lg shadow">
            <Spin spinning={loading} tip="Loading users...">
              <Table<UserRecord>
                columns={columns}
                dataSource={filteredUsers}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  total: filteredUsers.length,
                  showTotal: (total) => `Total ${total} users`,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
                scroll={{ x: true }}
                locale={{
                  emptyText: "No users found",
                }}
                rowSelection={{
                  selectedRowKeys,
                  onChange: (keys) => setSelectedRowKeys(keys),
                }}
              />
            </Spin>
          </div>

          {/* ✨ [Bulk Actions] */}
          {selectedRowKeys.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <div className="text-slate-700">
                <strong>{selectedRowKeys.length}</strong> user(s) selected
              </div>
              <Space>
                <Button danger>Delete Selected</Button>
                <Button>Export CSV</Button>
              </Space>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
