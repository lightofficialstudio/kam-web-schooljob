"use client";

import {
  Avatar,
  Badge,
  Card,
  Drawer,
  Empty,
  Flex,
  Space,
  Steps,
  Tag,
  Typography,
  theme as antTheme,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/th";
import relativeTime from "dayjs/plugin/relativeTime";
import type {
  ApplicationStatus,
  JobApplication,
} from "../_state/application-tracker-store";
import { useApplicationTrackerStore } from "../_state/application-tracker-store";

dayjs.extend(relativeTime);
dayjs.locale("th");

const { Title, Text } = Typography;

// ✨ URL base สำหรับ Dicebear avatar (fallback เมื่อไม่มีโลโก้)
const DICEBEAR_BASE_URL = "https://api.dicebear.com/7.x/initials/svg";

// แปลง status → index และ label สำหรับ Steps
const STATUS_STEP_MAP: Record<ApplicationStatus, number> = {
  submitted: 0,
  acknowledged: 1,
  interview: 2,
  pending_result: 3,
  accepted: 4,
  rejected: 4,
};

const STATUS_LABEL: Record<
  ApplicationStatus,
  { label: string; color: string }
> = {
  submitted: { label: "ส่งแล้ว", color: "default" },
  acknowledged: { label: "รับทราบแล้ว", color: "processing" },
  interview: { label: "นัดสัมภาษณ์", color: "warning" },
  pending_result: { label: "รอผล", color: "blue" },
  accepted: { label: "ผ่านการคัดเลือก", color: "success" },
  rejected: { label: "ไม่ผ่านการคัดเลือก", color: "error" },
};

const TRACKER_STEPS = [
  { title: "ส่งใบสมัคร" },
  { title: "รับทราบ" },
  { title: "สัมภาษณ์" },
  { title: "รอผล" },
  { title: "ผลตัดสิน" },
];

interface ApplicationCardProps {
  app: JobApplication;
}

const ApplicationCard = ({ app }: ApplicationCardProps) => {
  const { token } = antTheme.useToken();
  const stepCurrent = STATUS_STEP_MAP[app.status];
  const isRejected = app.status === "rejected";
  const isAccepted = app.status === "accepted";

  return (
    <Card
      variant="outlined"
      style={{
        borderRadius: token.borderRadiusLG,
        borderColor: isAccepted
          ? token.colorSuccess
          : isRejected
            ? token.colorError
            : token.colorBorderSecondary,
        marginBottom: 16,
      }}
      styles={{ body: { padding: 20 } }}
    >
      {/* Header: logo + title + status badge */}
      <Flex align="center" gap={12} style={{ marginBottom: 16 }}>
        <Avatar
          shape="square"
          size={48}
          src={`${DICEBEAR_BASE_URL}?seed=${app.schoolName}&backgroundColor=003366`}
        />
        <Flex vertical style={{ flex: 1, minWidth: 0 }}>
          <Text strong style={{ fontSize: 15 }} ellipsis>
            {app.jobTitle}
          </Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {app.schoolName}
          </Text>
        </Flex>
        <Tag
          color={STATUS_LABEL[app.status].color}
          style={{ margin: 0, whiteSpace: "nowrap" }}
        >
          {STATUS_LABEL[app.status].label}
        </Tag>
      </Flex>

      {/* Steps Progress */}
      <Steps
        size="small"
        current={stepCurrent}
        status={isRejected ? "error" : isAccepted ? "finish" : "process"}
        items={TRACKER_STEPS}
        style={{ marginBottom: 12 }}
      />

      {/* Meta info */}
      <Space size={16} style={{ marginTop: 8 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          สมัครเมื่อ {dayjs(app.appliedAt).fromNow()}
        </Text>
        {app.interviewDate && (
          <Text style={{ fontSize: 12, color: token.colorWarning }}>
            สัมภาษณ์: {dayjs(app.interviewDate).format("D MMM BBBB HH:mm น.")}
          </Text>
        )}
      </Space>
    </Card>
  );
};

// Drawer ติดตามสถานะใบสมัครทั้งหมด
export const ApplicationTrackerDrawer = () => {
  const { token } = antTheme.useToken();
  const { applications, isTrackerOpen, setIsTrackerOpen } =
    useApplicationTrackerStore();

  const activeCount = applications.filter(
    (a) => a.status !== "accepted" && a.status !== "rejected",
  ).length;

  return (
    <Drawer
      open={isTrackerOpen}
      onClose={() => setIsTrackerOpen(false)}
      title={
        <Flex align="center" gap={12}>
          <Title level={5} style={{ margin: 0 }}>
            ติดตามใบสมัคร
          </Title>
          {activeCount > 0 && (
            <Badge
              count={`${activeCount} รออยู่`}
              style={{ backgroundColor: token.colorWarning }}
            />
          )}
        </Flex>
      }
      size="large"
    >
      {applications.length === 0 ? (
        <Empty description="ยังไม่มีใบสมัครงาน" style={{ marginTop: 80 }} />
      ) : (
        <>
          <Text type="secondary" style={{ display: "block", marginBottom: 20 }}>
            คุณมีใบสมัครทั้งหมด {applications.length} รายการ
          </Text>
          {applications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </>
      )}
    </Drawer>
  );
};
