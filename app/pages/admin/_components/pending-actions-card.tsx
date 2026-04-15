"use client";

// ✨ Pending Actions Card — สิ่งที่ Admin ควรทำ ดึงจาก live data
import {
  AlertOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  RightOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Empty,
  Flex,
  Skeleton,
  Typography,
  theme,
} from "antd";
import Link from "next/link";
import { useDashboardStore } from "../_state/dashboard-store";

const { Text } = Typography;

// ✨ สี + icon ตาม severity
const severityConfig = {
  high: { color: "#ff4d4f", bgColor: "#fff1f0", borderColor: "#ffccc7", icon: <ExclamationCircleOutlined /> },
  medium: { color: "#fa8c16", bgColor: "#fff7e6", borderColor: "#ffd591", icon: <WarningOutlined /> },
  low: { color: "#52c41a", bgColor: "#f6ffed", borderColor: "#b7eb8f", icon: <CheckCircleOutlined /> },
};

export function PendingActionsCard() {
  const { token } = theme.useToken();
  const { data, isLoading } = useDashboardStore();

  const actions = data?.pendingActions ?? [];
  const highCount = actions.filter((a) => a.severity === "high").length;

  return (
    <Card
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        height: "100%",
      }}
      styles={{ body: { padding: "16px 20px" } }}
      title={
        <Flex align="center" gap={8}>
          <AlertOutlined style={{ color: highCount > 0 ? "#ff4d4f" : token.colorPrimary }} />
          <Text strong>Action ที่ต้องทำ</Text>
          {highCount > 0 && (
            <Badge
              count={highCount}
              style={{ backgroundColor: "#ff4d4f", fontSize: 11 }}
            />
          )}
        </Flex>
      }
    >
      {isLoading ? (
        <Flex vertical gap={10}>
          {[0, 1, 2].map((i) => (
            <Skeleton.Input key={i} active size="small" style={{ width: "100%", height: 52 }} />
          ))}
        </Flex>
      ) : actions.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary" style={{ fontSize: 13 }}>
              ไม่มี Action ที่ค้างอยู่ 🎉
            </Text>
          }
          style={{ padding: "12px 0" }}
        />
      ) : (
        <Flex vertical gap={8}>
          {/* ✨ เรียง high ก่อน */}
          {[...actions]
            .sort((a, b) => {
              const order = { high: 0, medium: 1, low: 2 };
              return order[a.severity] - order[b.severity];
            })
            .map((action) => {
              const cfg = severityConfig[action.severity];
              return (
                <Link key={action.type} href={action.href} style={{ textDecoration: "none" }}>
                  <Flex
                    align="center"
                    justify="space-between"
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: token.colorMode === "dark" ? token.colorFillQuaternary : cfg.bgColor,
                      border: `1px solid ${token.colorMode === "dark" ? token.colorBorderSecondary : cfg.borderColor}`,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = "0.8";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = "1";
                    }}
                  >
                    <Flex align="center" gap={10}>
                      <Text style={{ color: cfg.color, fontSize: 16 }}>{cfg.icon}</Text>
                      <Flex vertical gap={1}>
                        <Text strong style={{ fontSize: 13, color: token.colorText }}>
                          {action.label}
                        </Text>
                        <Text style={{ fontSize: 12, color: cfg.color, fontWeight: 600 }}>
                          {action.count} รายการ
                        </Text>
                      </Flex>
                    </Flex>
                    <Button
                      type="text"
                      size="small"
                      icon={<RightOutlined />}
                      style={{ color: cfg.color }}
                    />
                  </Flex>
                </Link>
              );
            })}
        </Flex>
      )}
    </Card>
  );
}
