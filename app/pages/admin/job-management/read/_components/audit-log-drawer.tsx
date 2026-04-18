"use client";

import { AuditOutlined } from "@ant-design/icons";
import {
  Avatar, Drawer, Empty, Flex, List, Pagination,
  Select, Spin, Tag, Typography,
} from "antd";
import dayjs from "dayjs";
import { useAdminJobStore } from "../_state/admin-job-store";

const { Text } = Typography;

const ACTION_OPTIONS = [
  { label: "ทุก action",        value: "" },
  { label: "สร้างประกาศงาน",   value: "CREATE_JOB" },
  { label: "เปลี่ยนสถานะ",     value: "UPDATE_JOB_STATUS" },
  { label: "ลบประกาศงาน",       value: "DELETE_JOB" },
];

const ACTION_COLOR: Record<string, string> = {
  CREATE_JOB:        "green",
  UPDATE_JOB_STATUS: "blue",
  DELETE_JOB:        "red",
};

const ACTION_TH: Record<string, string> = {
  CREATE_JOB:        "สร้างประกาศ",
  UPDATE_JOB_STATUS: "เปลี่ยนสถานะ",
  DELETE_JOB:        "ลบประกาศ",
};

interface AuditLogDrawerProps {
  adminUserId: string;
}

export function AuditLogDrawer({ adminUserId }: AuditLogDrawerProps) {
  const {
    auditDrawerOpen, closeAuditDrawer,
    auditLogs, auditTotal, auditPage, auditTotalPages,
    auditFilterAction, setAuditFilterAction,
    isLoadingAudit, fetchAuditLogs,
  } = useAdminJobStore();

  const handleFilterChange = (val: string) => {
    setAuditFilterAction(val);
    fetchAuditLogs(adminUserId, 1, val);
  };

  return (
    <Drawer
      open={auditDrawerOpen}
      onClose={closeAuditDrawer}
      title={
        <Flex gap={8} align="center">
          <AuditOutlined />
          <span>Audit Log รวม — ประกาศงาน</span>
          {auditTotal > 0 && (
            <Tag color="blue" style={{ marginLeft: 4, fontSize: 11 }}>
              {auditTotal} รายการ
            </Tag>
          )}
        </Flex>
      }
      size="large"
    >
      {/* filter */}
      <Flex justify="flex-end" style={{ marginBottom: 16 }}>
        <Select
          style={{ width: 180 }}
          value={auditFilterAction}
          options={ACTION_OPTIONS}
          onChange={handleFilterChange}
          size="small"
        />
      </Flex>

      {isLoadingAudit ? (
        <Flex justify="center" style={{ paddingTop: 40 }}>
          <Spin />
        </Flex>
      ) : auditLogs.length === 0 ? (
        <Empty description="ยังไม่มีการดำเนินการ" />
      ) : (
        <Flex vertical gap={16}>
          <List
            dataSource={auditLogs}
            renderItem={(log) => (
              <List.Item style={{ padding: "10px 0" }}>
                <Flex gap={12} align="flex-start" style={{ width: "100%" }}>
                  <Avatar src={log.admin.profileImageUrl} size={36} style={{ flexShrink: 0 }}>
                    {log.admin.firstName?.[0] ?? "A"}
                  </Avatar>
                  <Flex vertical gap={4} style={{ flex: 1, minWidth: 0 }}>
                    <Flex gap={8} align="center" wrap="wrap">
                      <Text strong style={{ fontSize: 12 }}>
                        {[log.admin.firstName, log.admin.lastName].filter(Boolean).join(" ") || log.admin.email}
                      </Text>
                      <Tag
                        color={ACTION_COLOR[log.action] ?? "default"}
                        style={{ fontSize: 10, margin: 0 }}
                      >
                        {ACTION_TH[log.action] ?? log.action}
                      </Tag>
                    </Flex>
                    {log.targetLabel && (
                      <Text style={{ fontSize: 12 }} ellipsis={{ tooltip: log.targetLabel }}>
                        {log.targetLabel}
                      </Text>
                    )}
                    {log.note && (
                      <Text style={{ fontSize: 11 }} type="secondary">
                        {log.note}
                      </Text>
                    )}
                    <Text style={{ fontSize: 10 }} type="secondary">
                      {dayjs(log.createdAt).format("D MMM YYYY HH:mm:ss")}
                    </Text>
                  </Flex>
                </Flex>
              </List.Item>
            )}
          />

          {auditTotalPages > 1 && (
            <Flex justify="center">
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
    </Drawer>
  );
}
