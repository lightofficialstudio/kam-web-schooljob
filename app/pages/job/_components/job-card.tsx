"use client";

import {
  ClockCircleOutlined,
  DollarCircleOutlined,
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Row,
  Space,
  Tag,
  Typography,
  theme as antTheme,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/th";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import type { Job } from "../_state/job-search-store";
import { useJobSearchStore } from "../_state/job-search-store";
import { useSavedJobsStore } from "../_state/saved-jobs-store";

dayjs.extend(relativeTime);
dayjs.locale("th");

const { Title, Text } = Typography;

interface JobCardProps {
  job: Job;
}

// การ์ดแสดงข้อมูลงานแต่ละรายการในหน้าค้นหา
export const JobCard = ({ job }: JobCardProps) => {
  const { token } = antTheme.useToken();
  const { openJobDrawer } = useJobSearchStore();
  const { isSaved, toggleSavedJob } = useSavedJobsStore();

  // ป้องกัน Hydration mismatch — localStorage ไม่มีบน server
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  const saved = hasMounted && isSaved(job.id);

  return (
    <Card
      hoverable
      onClick={() => openJobDrawer(job)}
      style={{
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
      styles={{ body: { padding: 24 } }}
    >
      <Row gutter={24}>
        <Col flex="auto">
          <Flex vertical gap={8}>
            <Title level={3} style={{ margin: 0, color: token.colorPrimary, fontSize: 22 }}>
              {job.title}
            </Title>
            <Text strong style={{ color: token.colorTextSecondary, fontSize: 17 }}>
              {job.schoolName}
            </Text>

            <Space size={12} wrap>
              {job.isNew && (
                <Tag
                  color="success"
                  style={{ borderRadius: token.borderRadiusSM, margin: 0, padding: "4px 12px", fontSize: 14, fontWeight: 600, border: "none" }}
                >
                  มาใหม่
                </Tag>
              )}
              {job.educationLevel.includes("ปริญญาโท") && (
                <Tag
                  color="processing"
                  style={{ borderRadius: token.borderRadiusSM, margin: 0, padding: "4px 12px", fontSize: 14, fontWeight: 600, border: "none" }}
                >
                  เน้นวุฒิสูง
                </Tag>
              )}
              <Tag
                color="default"
                style={{ borderRadius: token.borderRadiusSM, margin: 0, padding: "4px 12px", fontSize: 13, border: "none" }}
              >
                {job.schoolType}
              </Tag>
            </Space>

            <Flex vertical gap={8}>
              <Space size={12} align="center">
                <ClockCircleOutlined style={{ color: token.colorPrimary, fontSize: 18 }} />
                <Text style={{ fontSize: 16 }}>งานเต็มเวลา</Text>
              </Space>
              <Space size={12} align="center">
                <EnvironmentOutlined style={{ color: token.colorPrimary, fontSize: 18 }} />
                <Text style={{ fontSize: 16 }}>{job.address}</Text>
              </Space>
              <Space size={12} align="center">
                <DollarCircleOutlined style={{ color: token.colorSuccess, fontSize: 20 }} />
                <Text strong style={{ fontSize: 18, color: token.colorSuccess }}>
                  {job.salaryType === "ระบุเงินเดือน"
                    ? `฿${job.salaryMin?.toLocaleString()} - ฿${job.salaryMax?.toLocaleString()} ต่อเดือน`
                    : "ตามประสบการณ์ / ไม่ระบุ"}
                </Text>
              </Space>
            </Flex>

            <Card
              size="small"
              variant="borderless"
              style={{ backgroundColor: token.colorBgLayout, borderRadius: token.borderRadiusLG }}
              styles={{ body: { padding: 16 } }}
            >
              <ul style={{ paddingLeft: 20, margin: 0, lineHeight: 1.8 }}>
                <li><Text style={{ fontSize: 15 }}>รับทั้งสิ้น <Text strong>{job.vacancyCount}</Text> อัตรา</Text></li>
                <li><Text style={{ fontSize: 15 }}>ประสบการณ์: <Text strong>{job.teachingExperience}</Text></Text></li>
                <li><Text style={{ fontSize: 15 }}>ใบอนุญาต: <Text strong>{job.licenseRequired}</Text></Text></li>
              </ul>
            </Card>
          </Flex>
        </Col>
        <Col flex="120px" style={{ textAlign: "right" }}>
          <Avatar
            shape="square"
            size={100}
            src={job.logoUrl || undefined}
            style={{
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: 12,
              background: "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 100%)",
              fontSize: 32,
              fontWeight: 700,
              color: "#fff",
            }}
            onError={() => true}
          >
            {job.schoolName?.charAt(0) || "S"}
          </Avatar>
        </Col>
      </Row>

      <Divider style={{ margin: "24px 0" }} />

      <Row justify="space-between" align="middle">
        <Col>
          <Text type="secondary" style={{ fontSize: 14 }}>
            <HistoryOutlined /> {dayjs(job.postedAt).fromNow()}
          </Text>
        </Col>
        <Col>
          <Space size={12}>
            {/* ปุ่มบันทึกงาน — stopPropagation เพื่อไม่ให้ card click trigger */}
            <Button
              type="text"
              size="large"
              icon={
                saved ? (
                  <HeartFilled style={{ color: token.colorError, fontSize: 20 }} />
                ) : (
                  <HeartOutlined style={{ fontSize: 20 }} />
                )
              }
              onClick={(e) => {
                e.stopPropagation();
                toggleSavedJob(job.id);
              }}
              title={saved ? "ยกเลิกการบันทึก" : "บันทึกงานนี้"}
            />
            <Button type="primary" size="large" style={{ fontWeight: 600, padding: "0 32px" }}>
              รายละเอียดงาน
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};
