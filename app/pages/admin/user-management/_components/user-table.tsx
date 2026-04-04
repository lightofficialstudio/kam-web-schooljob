"use client";

import { useNotificationModalStore } from "@/app/stores/notification-modal-store";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Flex,
  Modal,
  Row,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import type { UserRecord } from "../_api/user-management-api";
import { useUserManagementStore } from "../_state/user-management-store";

const { Text } = Typography;

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

// ดึง label และ color ของ role สำหรับแสดง Tag
const getRoleDisplay = (role: string) => {
  if (role === "ADMIN") return { color: "error", label: "ผู้ดูแล" };
  if (role === "EMPLOYER") return { color: "processing", label: "โรงเรียน" };
  return { color: "success", label: "ครู" };
};

// ✨ [User Table — ตารางแสดง users พร้อม expand row และ pagination]
export function UserTable() {
  const { token } = theme.useToken();
  const { openNotification } = useNotificationModalStore();
  const isLoading = useUserManagementStore((s) => s.isLoading);
  const filteredUsers = useUserManagementStore((s) => s.filteredUsers);
  const selectedRowKeys = useUserManagementStore((s) => s.selectedRowKeys);
  const setSelectedRowKeys = useUserManagementStore(
    (s) => s.setSelectedRowKeys,
  );

  // ยืนยันและดำเนินการลบผู้ใช้
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

  const columns: ColumnsType<UserRecord> = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 140,
      render: (userId: string) => (
        <Tooltip title={userId}>
          <Text code style={{ fontSize: 12 }}>
            {userId.substring(0, 12)}...
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
      width: 220,
      render: (email: string) => (
        <Text strong style={{ color: token.colorText }}>
          {email}
        </Text>
      ),
    },
    {
      title: "ชื่อเต็ม",
      dataIndex: "fullName",
      key: "fullName",
      width: 160,
      render: (fullName: string | null) =>
        fullName ? <Text>{fullName}</Text> : <Text type="secondary">-</Text>,
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
        <Text type="secondary" style={{ fontSize: 13 }}>
          {formatDateThai(date)}
        </Text>
      ),
    },
    {
      title: "อัปเดตล่าสุด",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 160,
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {formatDateThai(date)}
        </Text>
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
        // ── Skeleton Table ──
        <div style={{ padding: "16px 24px" }}>
          {/* Skeleton Header */}
          <Flex
            gap={8}
            style={{
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            {[140, 220, 160, 110, 160, 160, 100].map((w, i) => (
              <Skeleton.Input
                key={i}
                active
                size="small"
                style={{ width: w, minWidth: w }}
              />
            ))}
          </Flex>
          {/* Skeleton Rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <Flex
              key={i}
              gap={8}
              align="center"
              style={{
                padding: "12px 0",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                background:
                  i % 2 === 1 ? token.colorFillQuaternary : "transparent",
                borderRadius: token.borderRadius,
              }}
            >
              {[140, 220, 160, 110, 160, 160, 100].map((w, j) => (
                <Skeleton.Input
                  key={j}
                  active
                  size="small"
                  style={{ width: w, minWidth: w }}
                />
              ))}
            </Flex>
          ))}
        </div>
      ) : (
        <Table<UserRecord>
          columns={columns}
          dataSource={filteredUsers()}
          rowKey="id"
          rowClassName={(_, index) =>
            index % 2 === 1 ? "table-row-striped" : ""
          }
          pagination={{
            pageSize: 10,
            total: filteredUsers().length,
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
                      <Text type="secondary" strong>
                        User ID:
                      </Text>
                      <br />
                      <Text code>{record.userId}</Text>
                    </div>
                    <div>
                      <Text type="secondary" strong>
                        ID ระเบียน:
                      </Text>
                      <br />
                      <Text code>{record.id}</Text>
                    </div>
                  </Flex>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Flex vertical gap={8}>
                    <div>
                      <Text type="secondary" strong>
                        สร้างเมื่อ:
                      </Text>
                      <br />
                      <Text>{formatDateThai(record.createdAt)}</Text>
                    </div>
                    <div>
                      <Text type="secondary" strong>
                        แก้ไขล่าสุด:
                      </Text>
                      <br />
                      <Text>{formatDateThai(record.updatedAt)}</Text>
                    </div>
                  </Flex>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Flex vertical gap={8}>
                    <div>
                      <Text type="secondary" strong>
                        ชื่อเต็ม:
                      </Text>
                      <br />
                      <Text>
                        {record.fullName || (
                          <Text type="secondary">ยังไม่ได้ตั้ง</Text>
                        )}
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary" strong>
                        บทบาท:
                      </Text>
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
      )}
    </Card>
  );
}
