"use client";

import { useNotificationModalStore } from "@/app/stores/notification-modal-store";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Flex, Input, Row, theme } from "antd";
import Link from "next/link";
import { useUserManagementStore } from "../_state/user-management-store";

// ✨ [Filter Section — ช่องค้นหาและปุ่มควบคุม]
export function FilterSection() {
  const { token } = theme.useToken();
  const { openNotification } = useNotificationModalStore();
  const searchText = useUserManagementStore((s) => s.searchText);
  const isLoading = useUserManagementStore((s) => s.isLoading);
  const setSearchText = useUserManagementStore((s) => s.setSearchText);
  const fetchUsers = useUserManagementStore((s) => s.fetchUsers);

  // โหลดข้อมูลใหม่และแจ้งเตือนผลลัพธ์
  const handleRefresh = async () => {
    const result = await fetchUsers();
    if (result.success) {
      openNotification({
        type: "success",
        mainTitle: "โหลดข้อมูลสำเร็จ",
        subTitle: `โหลดผู้ใช้ ${result.total} คน เสร็จสิ้น`,
      });
    } else {
      openNotification({
        type: "error",
        mainTitle: "เกิดข้อผิดพลาด",
        subTitle: result.message ?? "ล้มเหลวในการดึงข้อมูลผู้ใช้",
      });
    }
  };

  return (
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
            prefix={
              <SearchOutlined style={{ color: token.colorTextDescription }} />
            }
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12}>
          <Flex justify="flex-end" gap={8}>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={isLoading}
            >
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
  );
}
