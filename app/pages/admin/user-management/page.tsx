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
  Flex,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  theme,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

// ✨ [แปลงวันที่เป็นรูปแบบไทย dd/mm/yyyy hh:mm]
const formatDateThai = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const thaiYear = date.getFullYear() + 543;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${thaiYear} ${hours}:${minutes}`;
};

// ✨ [Type Definition สำหรับ User]
interface UserRecord {
  id: string;
  userId: string;
  email: string;
  fullName: string | null;
  role: "EMPLOYEE" | "EMPLOYER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

// ✨ [Component หลัก]
export default function UserManagementPage() {
  const { token } = theme.useToken();
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

  // 🔄 [โหลด users เมื่อ mount]
  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 🔍 [Filter users ตาม search text]
  useEffect(() => {
    const filtered = users.filter((user) =>
      [user.email, user.fullName, user.role]
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchText, users]);

  // ✨ [ลบ user]
  const handleDelete = (userId: string, email: string) => {
    Modal.confirm({
      title: "ลบผู้ใช้",
      content: `คุณแน่ใจหรือว่าต้องการลบ ${email}?`,
      okText: "ลบ",
      okType: "danger",
      cancelText: "ยกเลิก",
      onOk: async () => {
        openNotification({
          type: "info",
          mainTitle: "แจ้งเตือน",
          subTitle: "API ลบผู้ใช้ยังไม่ได้เตรียม",
        });
        console.log("Delete user:", userId);
      },
    });
  };

  // ✨ [helper แปลง role เป็น label + color]
  const getRoleDisplay = (role: string) => {
    if (role === "ADMIN") return { color: "error", label: "ผู้ดูแล" };
    if (role === "EMPLOYER") return { color: "processing", label: "โรงเรียน" };
    return { color: "success", label: "ครู" };
  };

  // ✨ [Column Definitions]
  const columns: ColumnsType<UserRecord> = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 140,
      render: (userId: string) => (
        <Tooltip title={userId}>
          <Text code style={{ fontSize: 12 }}>{userId.substring(0, 12)}...</Text>
        </Tooltip>
      ),
    },
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
      width: 220,
      render: (email: string) => (
        <Text strong style={{ color: token.colorText }}>{email}</Text>
      ),
    },
    {
      title: "ชื่อเต็ม",
      dataIndex: "fullName",
      key: "fullName",
      width: 160,
      render: (fullName: string | null) =>
        fullName
          ? <Text>{fullName}</Text>
          : <Text type="secondary">-</Text>,
    },
    {
      title: "บทบาท",
      dataIndex: "role",
      key: "role",
      width: 110,
      render: (role: string) => {
        const { color, label } = getRoleDisplay(role);
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "สร้างเมื่อ",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>{formatDateThai(date)}</Text>
      ),
    },
    {
      title: "อัปเดตล่าสุด",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 160,
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>{formatDateThai(date)}</Text>
      ),
    },
    {
      title: "การกระทำ",
      key: "actions",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="ดูรายละเอียด">
            <Link href={`/pages/admin/users/${record.id}`}>
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

  // ✨ [คำนวณ stats จาก raw data]
  const countByRole = (role: string) => users.filter((u) => u.role === role).length;

  return (
    <Row gutter={[16, 16]}>

      {/* ── Header ── */}
      <Col xs={24}>
        <Card
          styles={{ body: { padding: "20px 24px" } }}
          style={{
            background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryActive} 100%)`,
            border: "none",
            borderRadius: token.borderRadiusLG,
          }}
        >
          <Title level={3} style={{ color: "#fff", margin: 0 }}>
            จัดการผู้ใช้
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.80)", fontSize: 14 }}>
            ดูและจัดการผู้ใช้ที่ลงทะเบียนทั้งหมดในระบบ
          </Text>
        </Card>
      </Col>

      {/* ── Stats ── */}
      <Col xs={24}>
        <Row gutter={[16, 16]}>
          {[
            { title: "ผู้ใช้ทั้งหมด", value: users.length, color: token.colorText },
            { title: "ครู", value: countByRole("EMPLOYEE"), color: token.colorSuccess },
            { title: "โรงเรียน", value: countByRole("EMPLOYER"), color: token.colorPrimary },
            { title: "ผู้ดูแล", value: countByRole("ADMIN"), color: token.colorError },
          ].map((stat) => (
            <Col xs={24} sm={12} lg={6} key={stat.title}>
              <Card
                style={{
                  background: token.colorBgContainer,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  borderRadius: token.borderRadiusLG,
                }}
              >
                <Statistic
                  title={<Text type="secondary">{stat.title}</Text>}
                  value={stat.value}
                  styles={{ content: { fontSize: 28, fontWeight: 700, color: stat.color } }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Col>

      {/* ── Toolbar ── */}
      <Col xs={24}>
        <Card
          style={{
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
          }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12}>
              <Input
                placeholder="ค้นหาจากอีเมล ชื่อ หรือบทบาท..."
                prefix={<SearchOutlined style={{ color: token.colorTextDescription }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12}>
              <Flex justify="flex-end" gap={8}>
                <Button icon={<ReloadOutlined />} onClick={fetchUsers} loading={loading}>
                  รีเฟรช
                </Button>
                <Link href="/pages/admin/users/new">
                  <Button type="primary" icon={<PlusOutlined />}>
                    เพิ่มผู้ใช้ใหม่
                  </Button>
                </Link>
              </Flex>
            </Col>
          </Row>
        </Card>
      </Col>

      {/* ── Table ── */}
      <Col xs={24}>
        <Card
          style={{
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
          }}
          styles={{ body: { padding: 0 } }}
        >
          <Spin spinning={loading} tip="กำลังโหลดผู้ใช้...">
            <Table<UserRecord>
              columns={columns}
              dataSource={filteredUsers}
              rowKey="id"
              pagination={{
                pageSize: 10,
                total: filteredUsers.length,
                showTotal: (total, range) =>
                  `แสดง ${range[0]}–${range[1]} จากทั้งหมด ${total} ผู้ใช้`,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              scroll={{ x: 1200 }}
              locale={{ emptyText: "ไม่พบผู้ใช้" }}
              rowSelection={{
                selectedRowKeys,
                onChange: (keys) => setSelectedRowKeys(keys),
              }}
              expandable={{
                expandedRowRender: (record) => (
                  <Row
                    gutter={[24, 16]}
                    style={{
                      padding: "12px 16px",
                      background: token.colorFillQuaternary,
                      borderRadius: token.borderRadius,
                    }}
                  >
                    <Col xs={24} sm={12} md={8}>
                      <Flex vertical gap={8}>
                        <div>
                          <Text type="secondary" strong>User ID:</Text>
                          <br />
                          <Text code>{record.userId}</Text>
                        </div>
                        <div>
                          <Text type="secondary" strong>ID ระเบียน:</Text>
                          <br />
                          <Text code>{record.id}</Text>
                        </div>
                      </Flex>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Flex vertical gap={8}>
                        <div>
                          <Text type="secondary" strong>สร้างเมื่อ:</Text>
                          <br />
                          <Text>{formatDateThai(record.createdAt)}</Text>
                        </div>
                        <div>
                          <Text type="secondary" strong>แก้ไขล่าสุด:</Text>
                          <br />
                          <Text>{formatDateThai(record.updatedAt)}</Text>
                        </div>
                      </Flex>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Flex vertical gap={8}>
                        <div>
                          <Text type="secondary" strong>ชื่อเต็ม:</Text>
                          <br />
                          <Text>{record.fullName || <Text type="secondary">ยังไม่ได้ตั้ง</Text>}</Text>
                        </div>
                        <div>
                          <Text type="secondary" strong>บทบาท:</Text>
                          <br />
                          <Tag color={getRoleDisplay(record.role).color}>
                            {getRoleDisplay(record.role).label}
                          </Tag>
                        </div>
                      </Flex>
                    </Col>
                  </Row>
                ),
              }}
            />
          </Spin>
        </Card>
      </Col>

      {/* ── Bulk Actions ── */}
      {selectedRowKeys.length > 0 && (
        <Col xs={24}>
          <Card
            style={{
              background: `${token.colorPrimaryBg}`,
              border: `1px solid ${token.colorPrimaryBorder}`,
              borderRadius: token.borderRadiusLG,
            }}
          >
            <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
              <Text>
                เลือก <Text strong style={{ color: token.colorPrimary }}>{selectedRowKeys.length}</Text> ผู้ใช้
              </Text>
              <Space>
                <Button danger onClick={() => {}}>ลบที่เลือก</Button>
                <Button onClick={() => {}}>ส่งออก CSV (ทั้งหมด)</Button>
                <Button onClick={() => {}}>ส่งออก CSV (ที่เลือก)</Button>
              </Space>
            </Flex>
          </Card>
        </Col>
      )}

      {/* ── Summary ── */}
      <Col xs={24}>
        <Card
          style={{
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
          }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Flex vertical gap={6}>
                <Text type="secondary" strong>ข้อมูลล่าสุด</Text>
                {users.length > 0 && (
                  <>
                    <Text>ผู้ใช้ล่าสุด: {formatDateThai(users[users.length - 1].createdAt)}</Text>
                    <Text>อีเมล: {users[users.length - 1].email}</Text>
                  </>
                )}
              </Flex>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Flex vertical gap={6}>
                <Text type="secondary" strong>สถิติบทบาท</Text>
                <Text>ผู้ดูแล: {countByRole("ADMIN")}</Text>
                <Text>โรงเรียน: {countByRole("EMPLOYER")}</Text>
                <Text>ครู: {countByRole("EMPLOYEE")}</Text>
              </Flex>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Flex vertical gap={6}>
                <Text type="secondary" strong>สถิติข้อมูล</Text>
                <Text>มีชื่อเต็ม: {users.filter((u) => u.fullName).length}</Text>
                <Text>ยังไม่มีชื่อ: {users.filter((u) => !u.fullName).length}</Text>
              </Flex>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Flex vertical gap={6}>
                <Text type="secondary" strong>การจัดการ</Text>
                <Button
                  type="text"
                  size="small"
                  style={{ padding: 0, textAlign: "left" }}
                  onClick={() => {
                    console.log("Export data:", users.map((u) => ({
                      ...u,
                      createdAt: formatDateThai(u.createdAt),
                      updatedAt: formatDateThai(u.updatedAt),
                    })));
                  }}
                >
                  ดาวน์โหลด (JSON)
                </Button>
              </Flex>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
