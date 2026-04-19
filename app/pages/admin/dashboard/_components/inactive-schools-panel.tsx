"use client";

// ✨ Inactive Schools Panel — โรงเรียนที่สมัครแล้วยังไม่เคยลงประกาศงาน (re-engagement / upsell)
import { BankOutlined, MailOutlined, RiseOutlined } from "@ant-design/icons";
import { Avatar, Empty, Flex, Skeleton, Tag, Typography, theme } from "antd";
import Link from "next/link";
import { useDashboardStore } from "../_state/dashboard-store";

const { Text } = Typography;

export function InactiveSchoolsPanel() {
  const { token } = theme.useToken();
  const { data, isLoading } = useDashboardStore();
  const schools = data?.inactiveSchools ?? [];

  return (
    <div
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        padding: "20px 20px 16px",
        height: "100%",
      }}
    >
      {/* ✨ Header */}
      <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
        <Flex align="center" gap={8}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `${token.colorInfo}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RiseOutlined style={{ color: token.colorInfo, fontSize: 16 }} />
          </div>
          <div>
            <Text strong style={{ fontSize: 14 }}>
              โรงเรียนที่ยังไม่ได้ใช้งาน
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              สมัครแล้วแต่ยังไม่เคยลงประกาศงาน
            </Text>
          </div>
        </Flex>
        {schools.length > 0 && (
          <Tag
            color="processing"
            style={{ borderRadius: 100, fontWeight: 600, fontSize: 11 }}
          >
            {schools.length} โรงเรียน
          </Tag>
        )}
      </Flex>

      {/* ✨ Hint bar */}
      {!isLoading && schools.length > 0 && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            background: `${token.colorInfo}08`,
            border: `1px solid ${token.colorInfo}25`,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 11, color: token.colorInfo }}>
            💡 ส่งอีเมลแนะนำ หรือโทรติดต่อเพื่อช่วยโรงเรียนเหล่านี้เริ่มต้นใช้งาน
          </Text>
        </div>
      )}

      {/* ✨ Content */}
      {isLoading ? (
        <Flex vertical gap={10}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Flex key={i} align="center" gap={10}>
              <Skeleton.Avatar active size="small" />
              <Skeleton.Input active size="small" block />
            </Flex>
          ))}
        </Flex>
      ) : schools.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary" style={{ fontSize: 13 }}>
              โรงเรียนทุกแห่งมีประกาศงานแล้ว 🎉
            </Text>
          }
          style={{ padding: "24px 0" }}
        />
      ) : (
        <Flex vertical gap={7}>
          {schools.map((school) => (
            <Link
              key={school.id}
              href={`/pages/admin/user-management`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  padding: "9px 12px",
                  borderRadius: 10,
                  background: token.colorFillQuaternary,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  cursor: "pointer",
                  transition: "all 0.18s",
                }}
                className="hover:-translate-y-0.5 hover:shadow-md"
              >
                <Flex align="center" gap={10}>
                  <Avatar
                    size={32}
                    icon={<BankOutlined />}
                    style={{
                      background: `${token.colorInfo}20`,
                      color: token.colorInfo,
                      flexShrink: 0,
                    }}
                  />
                  <Flex vertical gap={1} style={{ minWidth: 0, flex: 1 }}>
                    <Text
                      strong
                      style={{
                        fontSize: 13,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                      }}
                    >
                      {school.schoolName}
                    </Text>
                    <Flex align="center" gap={6}>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {school.province}
                      </Text>
                      {school.email && (
                        <>
                          <Text type="secondary" style={{ fontSize: 11 }}>·</Text>
                          <MailOutlined style={{ fontSize: 10, color: token.colorTextTertiary }} />
                          <Text
                            type="secondary"
                            style={{
                              fontSize: 11,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 160,
                              display: "inline-block",
                            }}
                          >
                            {school.email}
                          </Text>
                        </>
                      )}
                    </Flex>
                  </Flex>
                  <div
                    style={{
                      padding: "2px 8px",
                      borderRadius: 100,
                      background: `${token.colorInfo}12`,
                      border: `1px solid ${token.colorInfo}30`,
                      flexShrink: 0,
                    }}
                  >
                    <Text style={{ fontSize: 10, color: token.colorInfo, fontWeight: 600 }}>
                      0 งาน
                    </Text>
                  </div>
                </Flex>
              </div>
            </Link>
          ))}
        </Flex>
      )}
    </div>
  );
}
