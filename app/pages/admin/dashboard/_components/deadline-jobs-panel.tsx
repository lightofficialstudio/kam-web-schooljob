"use client";

// ✨ Deadline Jobs Panel — งานที่ใกล้ปิดรับสมัคร เพื่อให้ Admin แจ้งเตือนโรงเรียนได้ทัน
import { ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { Empty, Flex, Skeleton, Tag, Typography, theme } from "antd";
import Link from "next/link";
import { useDashboardStore } from "../_state/dashboard-store";

const { Text } = Typography;

export function DeadlineJobsPanel() {
  const { token } = theme.useToken();
  const { data, isLoading } = useDashboardStore();
  const jobs = data?.deadlineJobs ?? [];

  // ✨ แยกระดับความเร่งด่วนตามจำนวนวันที่เหลือ
  const urgencyConfig = (daysLeft: number | null) => {
    if (daysLeft === null || daysLeft < 0)
      return { color: token.colorError, bg: `${token.colorError}12`, border: `${token.colorError}30`, label: "หมดแล้ว" };
    if (daysLeft <= 1)
      return { color: token.colorError, bg: `${token.colorError}12`, border: `${token.colorError}30`, label: "วันนี้" };
    if (daysLeft <= 3)
      return { color: token.colorWarning, bg: `${token.colorWarning}12`, border: `${token.colorWarning}30`, label: `${daysLeft} วัน` };
    return { color: "#52c41a", bg: "rgba(82,196,26,0.08)", border: "rgba(82,196,26,0.25)", label: `${daysLeft} วัน` };
  };

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
              background: `${token.colorWarning}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ClockCircleOutlined style={{ color: token.colorWarning, fontSize: 16 }} />
          </div>
          <div>
            <Text strong style={{ fontSize: 14 }}>
              งานใกล้ปิดรับสมัคร
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              ภายใน 7 วันข้างหน้า
            </Text>
          </div>
        </Flex>
        {jobs.length > 0 && (
          <Tag
            color="warning"
            style={{ borderRadius: 100, fontWeight: 600, fontSize: 11 }}
          >
            {jobs.length} รายการ
          </Tag>
        )}
      </Flex>

      {/* ✨ Content */}
      {isLoading ? (
        <Flex vertical gap={10}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton.Input key={i} active size="small" block />
          ))}
        </Flex>
      ) : jobs.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary" style={{ fontSize: 13 }}>
              ไม่มีงานที่ใกล้ปิดรับ
            </Text>
          }
          style={{ padding: "24px 0" }}
        />
      ) : (
        <Flex vertical gap={8}>
          {jobs.map((job) => {
            const urg = urgencyConfig(job.daysLeft);
            return (
              <Link
                key={job.id}
                href={`/pages/admin/job-management/edit/${job.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: token.colorFillQuaternary,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                  className="hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Flex align="center" justify="space-between" gap={8}>
                    <Flex align="center" gap={8} style={{ minWidth: 0 }}>
                      <FileTextOutlined
                        style={{ color: token.colorTextTertiary, flexShrink: 0 }}
                      />
                      <Flex vertical gap={1} style={{ minWidth: 0 }}>
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
                          {job.title}
                        </Text>
                        <Text
                          type="secondary"
                          style={{
                            fontSize: 11,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "block",
                          }}
                        >
                          {job.schoolName} · {job.applicationCount} ใบสมัคร
                        </Text>
                      </Flex>
                    </Flex>
                    <div
                      style={{
                        padding: "3px 10px",
                        borderRadius: 100,
                        background: urg.bg,
                        border: `1px solid ${urg.border}`,
                        flexShrink: 0,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: urg.color,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {urg.label}
                      </Text>
                    </div>
                  </Flex>
                </div>
              </Link>
            );
          })}
        </Flex>
      )}
    </div>
  );
}
