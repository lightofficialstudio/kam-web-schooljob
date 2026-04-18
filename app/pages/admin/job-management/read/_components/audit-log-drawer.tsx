"use client";

import { AuditOutlined, FilterOutlined } from "@ant-design/icons";
import {
  Avatar,
  Drawer,
  Empty,
  Flex,
  Pagination,
  Select,
  Spin,
  Tag,
  Typography,
  theme,
} from "antd";
import dayjs from "dayjs";
import { useAdminJobStore } from "../_state/admin-job-store";

const { Text } = Typography;

const ACTION_OPTIONS = [
  { label: "ทุก action", value: "" },
  { label: "สร้างประกาศงาน", value: "CREATE_JOB" },
  { label: "เปลี่ยนสถานะ", value: "UPDATE_JOB_STATUS" },
  { label: "ลบประกาศงาน", value: "DELETE_JOB" },
];

// ✨ สีสำหรับ action badge
const ACTION_DOT: Record<string, string> = {
  CREATE_JOB: "#22c55e",
  UPDATE_JOB_STATUS: "#11b6f5",
  DELETE_JOB: "#ef4444",
};

const ACTION_TAG_COLOR: Record<string, string> = {
  CREATE_JOB: "green",
  UPDATE_JOB_STATUS: "blue",
  DELETE_JOB: "red",
};

const ACTION_TH: Record<string, string> = {
  CREATE_JOB: "สร้างประกาศ",
  UPDATE_JOB_STATUS: "เปลี่ยนสถานะ",
  DELETE_JOB: "ลบประกาศ",
};

interface AuditLogDrawerProps {
  adminUserId: string;
}

export function AuditLogDrawer({ adminUserId }: AuditLogDrawerProps) {
  const { token } = theme.useToken();
  const {
    auditDrawerOpen,
    closeAuditDrawer,
    auditLogs,
    auditTotal,
    auditPage,
    auditTotalPages,
    auditFilterAction,
    setAuditFilterAction,
    isLoadingAudit,
    fetchAuditLogs,
  } = useAdminJobStore();

  const handleFilterChange = (val: string) => {
    setAuditFilterAction(val);
    fetchAuditLogs(adminUserId, 1, val);
  };

  return (
    <Drawer
      open={auditDrawerOpen}
      onClose={closeAuditDrawer}
      title={null}
      size="large"
      styles={{
        body: {
          padding: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
        wrapper: { boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" },
      }}
    >
      {/* ✨ Gradient header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 55%, #5dd5fb 100%)",
          padding: "20px 24px 18px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ✨ Decorative blob */}
        <div
          style={{
            position: "absolute",
            top: -24,
            right: -24,
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />
        <Flex
          align="center"
          gap={12}
          style={{ position: "relative", zIndex: 1 }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <AuditOutlined style={{ fontSize: 18, color: "#fff" }} />
          </div>
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.3,
              }}
            >
              Audit Log — ประกาศงาน
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.75)",
                marginTop: 2,
              }}
            >
              บันทึกการดำเนินการทั้งหมดของ Admin
            </div>
          </div>
          {auditTotal > 0 && (
            <span
              style={{
                marginLeft: "auto",
                background: "rgba(255,255,255,0.22)",
                border: "1px solid rgba(255,255,255,0.32)",
                borderRadius: 20,
                padding: "3px 12px",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {auditTotal} รายการ
            </span>
          )}
        </Flex>
      </div>

      {/* ✨ Filter bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 24px",
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <FilterOutlined
          style={{ fontSize: 12, color: token.colorTextTertiary }}
        />
        <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
          กรองตาม:
        </Text>
        <Select
          style={{ width: 180 }}
          value={auditFilterAction}
          options={ACTION_OPTIONS}
          onChange={handleFilterChange}
          size="small"
        />
      </div>

      {/* ✨ Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
        {isLoadingAudit ? (
          <Flex justify="center" style={{ paddingTop: 60 }}>
            <Spin size="large" />
          </Flex>
        ) : auditLogs.length === 0 ? (
          <Empty description="ยังไม่มีการดำเนินการ" style={{ marginTop: 60 }} />
        ) : (
          <Flex vertical gap={8}>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: token.colorBgContainer,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 2px 12px rgba(0,0,0,0.07)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <Flex gap={12} align="flex-start">
                  {/* ✨ Avatar with action dot */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <Avatar
                      src={log.admin.profileImageUrl}
                      size={36}
                      style={{
                        border: `1px solid ${token.colorBorderSecondary}`,
                      }}
                    >
                      {log.admin.firstName?.[0] ?? "A"}
                    </Avatar>
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background:
                          ACTION_DOT[log.action] ?? token.colorTextQuaternary,
                        border: `2px solid ${token.colorBgContainer}`,
                      }}
                    />
                  </div>

                  {/* ✨ Content */}
                  <Flex vertical gap={4} style={{ flex: 1, minWidth: 0 }}>
                    <Flex
                      align="center"
                      gap={8}
                      wrap="wrap"
                      justify="space-between"
                    >
                      <Flex align="center" gap={8}>
                        <Text strong style={{ fontSize: 12 }}>
                          {[log.admin.firstName, log.admin.lastName]
                            .filter(Boolean)
                            .join(" ") || log.admin.email}
                        </Text>
                        <Tag
                          color={ACTION_TAG_COLOR[log.action] ?? "default"}
                          style={{
                            fontSize: 10,
                            margin: 0,
                            borderRadius: 20,
                            padding: "0 8px",
                          }}
                        >
                          {ACTION_TH[log.action] ?? log.action}
                        </Tag>
                      </Flex>
                      <Text style={{ fontSize: 10 }} type="secondary">
                        {dayjs(log.createdAt).format("D MMM YY HH:mm")}
                      </Text>
                    </Flex>

                    {log.targetLabel && (
                      <Text
                        style={{ fontSize: 12, color: token.colorText }}
                        ellipsis={{ tooltip: log.targetLabel }}
                      >
                        {log.targetLabel}
                      </Text>
                    )}
                    {log.note && (
                      <Text style={{ fontSize: 11 }} type="secondary">
                        {log.note}
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </div>
            ))}

            {auditTotalPages > 1 && (
              <Flex justify="center" style={{ paddingTop: 8 }}>
                <Pagination
                  current={auditPage}
                  total={auditTotal}
                  pageSize={20}
                  size="small"
                  onChange={(p) => fetchAuditLogs(adminUserId, p)}
                />
              </Flex>
            )}
          </Flex>
        )}
      </div>
    </Drawer>
  );
}
