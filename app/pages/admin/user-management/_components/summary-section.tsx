"use client";

import {
  Button,
  Card,
  Col,
  Flex,
  Row,
  Skeleton,
  Typography,
  theme,
} from "antd";
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

// ✨ [Summary Section — สรุปสถิติและข้อมูลล่าสุด]
export function SummarySection() {
  const { token } = theme.useToken();
  const users = useUserManagementStore((s) => s.users);
  const isLoading = useUserManagementStore((s) => s.isLoading);
  const countByRole = useUserManagementStore((s) => s.countByRole);

  const lastUser = users.length > 0 ? users[users.length - 1] : null;

  // ดาวน์โหลดข้อมูล users ทั้งหมดเป็น JSON
  const handleDownloadJson = () => {
    console.log(
      "Export data:",
      users.map((u) => ({
        ...u,
        createdAt: formatDateThai(u.createdAt),
        updatedAt: formatDateThai(u.updatedAt),
      })),
    );
  };

  return (
    <Card
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
    >
      {isLoading ? (
        <Row gutter={[24, 16]}>
          {[0, 1, 2, 3].map((i) => (
            <Col xs={24} sm={12} md={6} key={i}>
              <Skeleton active paragraph={{ rows: 2 }} title={false} />
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Flex vertical gap={6}>
              <Text type="secondary" strong>
                ข้อมูลล่าสุด
              </Text>
              {lastUser && (
                <>
                  <Text>
                    ผู้ใช้ล่าสุด: {formatDateThai(lastUser.createdAt)}
                  </Text>
                  <Text>อีเมล: {lastUser.email}</Text>
                </>
              )}
            </Flex>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Flex vertical gap={6}>
              <Text type="secondary" strong>
                สถิติบทบาท
              </Text>
              <Text>ผู้ดูแล: {countByRole("ADMIN")}</Text>
              <Text>โรงเรียน: {countByRole("EMPLOYER")}</Text>
              <Text>ครู: {countByRole("EMPLOYEE")}</Text>
            </Flex>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Flex vertical gap={6}>
              <Text type="secondary" strong>
                สถิติข้อมูล
              </Text>
              <Text>มีชื่อเต็ม: {users.filter((u) => u.fullName).length}</Text>
              <Text>
                ยังไม่มีชื่อ: {users.filter((u) => !u.fullName).length}
              </Text>
            </Flex>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Flex vertical gap={6}>
              <Text type="secondary" strong>
                การจัดการ
              </Text>
              <Button
                type="text"
                size="small"
                style={{ padding: 0, textAlign: "left" }}
                onClick={handleDownloadJson}
              >
                ดาวน์โหลด (JSON)
              </Button>
            </Flex>
          </Col>
        </Row>
      )}
    </Card>
  );
}
