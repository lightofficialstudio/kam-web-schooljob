"use client";

import { useNotificationModalStore } from "@/app/stores/notification-modal-store";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

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
  const { openNotification } = useNotificationModalStore();
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
        openNotification({
          type: "success",
          mainTitle: "โหลดข้อมูลสำเร็จ",
          subTitle: `โหลดผู้ใช้ ${data.data.total} คน เสร็จสิ้น`,
        });
      } else {
        openNotification({
          type: "error",
          mainTitle: "ล้มเหลวในการโหลด",
          subTitle: data.message_th || "ล้มเหลวในการโหลดผู้ใช้",
        });
      }
    } catch (error: unknown) {
      console.error("❌ [USER MANAGEMENT] Error:", error);
      openNotification({
        type: "error",
        mainTitle: "เกิดข้อผิดพลาด",
        subTitle: "ล้มเหลวในการดึงข้อมูลผู้ใช้",
      });
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
      title: "ลบผู้ใช้",
      content: `คุณแน่ใจหรือว่าต้องการลบ ${email}?`,
      okText: "ลบ",
      okType: "danger",
      cancelText: "ยกเลิก",
      onOk: async () => {
        // TODO: Implement delete API
        openNotification({
          type: "info",
          mainTitle: "แจ้งเตือน",
          subTitle: "API ลบผู้ใช้ยังไม่ได้เตรียม",
        });
        console.log("Delete user:", userId);
      },
    });
  };

  // ✨ [Column Definitions]
  const columns: ColumnsType<UserRecord> = [
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (email: string) => (
        <Tooltip title={email}>
          <Text strong>{email}</Text>
        </Tooltip>
      ),
    },
    {
      title: "ชื่อเต็ม",
      dataIndex: "fullName",
      key: "fullName",
      width: 180,
      render: (fullName: string | null) => <Text>{fullName || "-"}</Text>,
    },
    {
      title: "บทบาท",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => {
        let color = "default";
        let label = role;
        if (role === "ADMIN") {
          color = "red";
          label = "ผู้ดูแล";
        } else if (role === "SCHOOL") {
          color = "blue";
          label = "โรงเรียน";
        } else if (role === "TEACHER") {
          color = "green";
          label = "ครู";
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "สร้างเมื่อ",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString("th-TH"),
    },
    {
      title: "การกระทำ",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="แก้ไข">
            <Link href={`/pages/admin/users/${record.id}/edit`}>
              <Button type="text" icon={<EditOutlined />} size="small" />
            </Link>
          </Tooltip>
          <Tooltip title="ลบ">
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
    <Row gutter={[16, 16]}>
      {/* ✨ [Header Section] */}
      <Col xs={24}>
        <Card
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "8px",
          }}
        >
          <Title level={2} style={{ color: "white", margin: 0 }}>
            จัดการผู้ใช้
          </Title>
          <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
            ดูและจัดการผู้ใช้ที่ลงทะเบียนทั้งหมดในระบบ
          </Text>
        </Card>
      </Col>

      {/* ✨ [Stats Section] */}
      <Col xs={24}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="จำนวนผู้ใช้ทั้งหมด"
                value={users.length}
                valueStyle={{ fontSize: "28px", fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="ครู"
                value={users.filter((u) => u.role === "TEACHER").length}
                valueStyle={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#52C41A",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="โรงเรียน"
                value={users.filter((u) => u.role === "SCHOOL").length}
                valueStyle={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#1890ff",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="ผู้ดูแล"
                value={users.filter((u) => u.role === "ADMIN").length}
                valueStyle={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#f5222d",
                }}
              />
            </Card>
          </Col>
        </Row>
      </Col>

      {/* ✨ [Toolbar] */}
      <Col xs={24}>
        <Card>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12}>
              <Input
                placeholder="ค้นหาจากอีเมล ชื่อ หรือบทบาท..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12}>
              <Row justify="end">
                <Space>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchUsers}
                    loading={loading}
                  >
                    รีเฟรช
                  </Button>
                  <Link href="/pages/admin/users/new">
                    <Button type="primary" icon={<PlusOutlined />}>
                      เพิ่มผู้ใช้ใหม่
                    </Button>
                  </Link>
                </Space>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>

      {/* ✨ [Data Table] */}
      <Col xs={24}>
        <Card>
          <Spin spinning={loading} description="กำลังโหลดผู้ใช้...">
            <Table<UserRecord>
              columns={columns}
              dataSource={filteredUsers}
              rowKey="id"
              pagination={{
                pageSize: 10,
                total: filteredUsers.length,
                showTotal: (total) => `รวม ${total} ผู้ใช้`,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              scroll={{ x: true }}
              locale={{
                emptyText: "ไม่พบผู้ใช้",
              }}
              rowSelection={{
                selectedRowKeys,
                onChange: (keys) => setSelectedRowKeys(keys),
              }}
            />
          </Spin>
        </Card>
      </Col>

      {/* ✨ [Bulk Actions] */}
      {selectedRowKeys.length > 0 && (
        <Col xs={24}>
          <Card
            style={{
              background: "linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%)",
              border: "1px solid #91d5ff",
              borderRadius: "8px",
            }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Text>
                  เลือก <Text strong>{selectedRowKeys.length}</Text> ผู้ใช้
                </Text>
              </Col>
              <Col>
                <Space>
                  <Button danger>ลบที่เลือก</Button>
                  <Button>ส่งออก CSV</Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      )}
    </Row>
  );
}
