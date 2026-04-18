"use client";

// ✨ Announcement History — ตาราง Broadcast ที่ส่งแล้ว + pagination
import { BellOutlined, ClockCircleOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Empty, Flex, Pagination, Skeleton, Tag, Typography, theme } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { useAnnouncementStore } from "../_state/announcement-store";

const { Text } = Typography;

dayjs.locale("th");

// ✨ config Tag สำหรับแต่ละ target role
const TARGET_TAG: Record<"ALL" | "EMPLOYEE" | "EMPLOYER", { label: string; color: string; icon: React.ReactNode }> = {
  ALL:      { label: "ทุกคน",          color: "#11b6f5", icon: <TeamOutlined /> },
  EMPLOYEE: { label: "ครู / ผู้หางาน", color: "#22c55e", icon: <UserOutlined /> },
  EMPLOYER: { label: "โรงเรียน",       color: "#f59e0b", icon: <BellOutlined /> },
};

interface Props {
  adminUserId: string;
}

export function AnnouncementHistory({ adminUserId }: Props) {
  const { token } = theme.useToken();
  const { history, historyTotal, historyPage, isLoadingHistory, fetchHistory } = useAnnouncementStore();

  const pageSize = 20;

  if (isLoadingHistory) {
    return (
      <Flex vertical gap={10}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} active paragraph={{ rows: 2 }} />
        ))}
      </Flex>
    );
  }

  if (history.length === 0) {
    return (
      <Card
        style={{ borderRadius: 16, border: `1px solid ${token.colorBorderSecondary}` }}
        styles={{ body: { padding: 48 } }}
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Text type="secondary">ยังไม่มี Announcement ที่ส่งออกไป</Text>}
        />
      </Card>
    );
  }

  return (
    <Flex vertical gap={12}>
      {/* ── ข้อมูลรวม ── */}
      <Flex align="center" justify="space-between">
        <Text type="secondary" style={{ fontSize: 12 }}>
          ทั้งหมด {historyTotal} Announcement
        </Text>
      </Flex>

      {/* ── รายการ ── */}
      {history.map((item, idx) => (
        <Card
          key={`${item.title}-${item.createdAt}-${idx}`}
          style={{
            borderRadius: 12,
            border: `1px solid ${token.colorBorderSecondary}`,
            overflow: "hidden",
            transition: "box-shadow 0.15s",
          }}
          styles={{ body: { padding: "16px 20px" } }}
          className="hover:shadow-md"
        >
          <Flex gap={14} align="flex-start">
            {/* ✨ Icon */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(17,182,245,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "1px solid rgba(17,182,245,0.2)",
              }}
            >
              <BellOutlined style={{ color: "#11b6f5", fontSize: 16 }} />
            </div>

            {/* ✨ Content */}
            <Flex vertical gap={4} style={{ flex: 1, minWidth: 0 }}>
              <Flex justify="space-between" align="flex-start" gap={8} wrap="wrap">
                <Text strong style={{ fontSize: 14, lineHeight: 1.4, flex: 1, minWidth: 0 }}>{item.title}</Text>
                <Flex gap={6} align="center" style={{ flexShrink: 0 }}>
                  {/* ✨ Target Role Tag */}
                  {(() => {
                    const cfg = TARGET_TAG[item.targetRole] ?? TARGET_TAG.ALL;
                    return (
                      <Tag
                        icon={cfg.icon}
                        style={{
                          fontSize: 11,
                          borderRadius: 20,
                          border: `1px solid ${cfg.color}50`,
                          color: cfg.color,
                          background: `${cfg.color}10`,
                          margin: 0,
                        }}
                      >
                        {cfg.label}
                      </Tag>
                    );
                  })()}
                  {/* ✨ Sent count */}
                  <Tag
                    icon={<TeamOutlined />}
                    style={{
                      fontSize: 11,
                      borderRadius: 20,
                      border: "1px solid rgba(17,182,245,0.4)",
                      color: "#11b6f5",
                      background: "rgba(17,182,245,0.08)",
                      margin: 0,
                    }}
                  >
                    {item.sentCount.toLocaleString()} คนได้รับ
                  </Tag>
                </Flex>
              </Flex>

              <Text
                type="secondary"
                style={{
                  fontSize: 12,
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  whiteSpace: "pre-wrap",
                }}
              >
                {item.message}
              </Text>

              <Flex align="center" gap={4} style={{ marginTop: 4 }}>
                <ClockCircleOutlined style={{ fontSize: 10, color: token.colorTextTertiary }} />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {dayjs(item.createdAt).format("D MMM YYYY · HH:mm น.")}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      ))}

      {/* ── Pagination ── */}
      {historyTotal > pageSize && (
        <Flex justify="center" style={{ marginTop: 8 }}>
          <Pagination
            current={historyPage}
            total={historyTotal}
            pageSize={pageSize}
            onChange={(p) => fetchHistory(adminUserId, p)}
            showSizeChanger={false}
            size="small"
          />
        </Flex>
      )}
    </Flex>
  );
}
