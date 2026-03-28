"use client";

import {
  BarChartOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  RiseOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Divider,
  Flex,
  Modal,
  Progress,
  Row,
  Statistic,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useJobStatsModalStore, type DailyTrend } from "../_state/job-stats-modal-store";

const { Title, Text } = Typography;

const PRIMARY = "#11b6f5";

// ─── Mini Bar Chart ──────────────────────────────────────────────────────────
// แสดงแท่งกราฟขนาดเล็กจาก dailyTrend โดยไม่ใช้ library ภายนอก
const MiniBarChart = ({
  data,
  valueKey,
  color,
}: {
  data: DailyTrend[];
  valueKey: "views" | "applicants";
  color: string;
}) => {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <Flex align="flex-end" gap={4} style={{ height: 80 }}>
      {data.map((d) => {
        const heightPercent = (d[valueKey] / max) * 100;
        return (
          <Tooltip
            key={d.date}
            title={`${d.date}: ${d[valueKey].toLocaleString()} ${valueKey === "views" ? "ครั้ง" : "คน"}`}
          >
            <Flex vertical align="center" gap={4} style={{ flex: 1 }}>
              <Flex
                style={{
                  width: "100%",
                  height: `${heightPercent}%`,
                  minHeight: 4,
                  backgroundColor: color,
                  borderRadius: "4px 4px 0 0",
                  opacity: 0.85,
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
              />
              <Text style={{ fontSize: 9, color: "#94A3B8", whiteSpace: "nowrap" }}>
                {d.date.split(" ")[0]}
              </Text>
            </Flex>
          </Tooltip>
        );
      })}
    </Flex>
  );
};

// ─── Breakdown Bar ───────────────────────────────────────────────────────────
const BreakdownBar = ({
  label,
  count,
  percent,
  color,
}: {
  label: string;
  count: number;
  percent: number;
  color: string;
}) => (
  <Flex vertical gap={4}>
    <Flex justify="space-between" align="center">
      <Text style={{ fontSize: 13 }}>{label}</Text>
      <Flex gap={6} align="center">
        <Text strong style={{ fontSize: 13 }}>{count} คน</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>({percent}%)</Text>
      </Flex>
    </Flex>
    <Progress
      percent={percent}
      showInfo={false}
      strokeColor={color}
      trailColor="#F1F5F9"
      size="small"
      style={{ margin: 0 }}
    />
  </Flex>
);

// ─── Modal หลัก ──────────────────────────────────────────────────────────────
// Modal แสดงสถิติเชิงลึกของตำแหน่งงาน สำหรับฝ่ายบุคลากรของโรงเรียน
export const JobStatsModal = () => {
  const { isOpen, stats, closeModal } = useJobStatsModalStore();

  if (!stats) return null;

  const hiringRate = stats.pipeline.length > 0
    ? Math.round((stats.pipeline[stats.pipeline.length - 1].count / stats.pipeline[0].count) * 100)
    : 0;

  return (
    <Modal
      open={isOpen}
      onCancel={closeModal}
      footer={null}
      width={960}
      centered
      title={
        <Flex align="center" gap={12}>
          <Flex
            align="center"
            justify="center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${PRIMARY} 0%, #0878a8 100%)`,
            }}
          >
            <BarChartOutlined style={{ color: "#fff", fontSize: 18 }} />
          </Flex>
          <Flex vertical gap={1}>
            <Text strong style={{ fontSize: 16 }}>สถิติการประกาศ</Text>
            <Text type="secondary" style={{ fontSize: 13, fontWeight: 400 }}>
              {stats.jobTitle}
            </Text>
          </Flex>
        </Flex>
      }
      styles={{ body: { padding: "0 24px 24px", maxHeight: "80vh", overflowY: "auto" } }}
    >
      {/* ─── Row 1: Key Metrics ─── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20, marginTop: 8 }}>
        {[
          {
            icon: <EyeOutlined style={{ color: PRIMARY }} />,
            label: "ยอดเข้าชมรวม",
            value: stats.totalViews.toLocaleString(),
            suffix: "ครั้ง",
            bg: "#EFF9FF",
          },
          {
            icon: <UserAddOutlined style={{ color: "#6366F1" }} />,
            label: "ผู้สมัครทั้งหมด",
            value: stats.totalApplicants,
            suffix: "คน",
            bg: "#EEF2FF",
          },
          {
            icon: <RiseOutlined style={{ color: "#10B981" }} />,
            label: "อัตราการสมัคร",
            value: stats.conversionRate,
            suffix: "",
            bg: "#F0FDF4",
          },
          {
            icon: <ClockCircleOutlined style={{ color: "#F59E0B" }} />,
            label: "เวลาเฉลี่ยก่อนสมัคร",
            value: stats.avgTimeToApply,
            suffix: "",
            bg: "#FFFBEB",
          },
        ].map((item) => (
          <Col xs={12} md={6} key={item.label}>
            <Card
              variant="borderless"
              style={{ borderRadius: 12, backgroundColor: item.bg }}
              styles={{ body: { padding: "16px 20px" } }}
            >
              <Flex vertical gap={8}>
                <Flex align="center" gap={6}>
                  {item.icon}
                  <Text style={{ fontSize: 12, color: "#64748B" }}>{item.label}</Text>
                </Flex>
                <Text strong style={{ fontSize: 22, color: "#0F172A", lineHeight: 1 }}>
                  {item.value}
                  {item.suffix && (
                    <Text style={{ fontSize: 13, color: "#94A3B8", fontWeight: 400, marginLeft: 4 }}>
                      {item.suffix}
                    </Text>
                  )}
                </Text>
              </Flex>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ─── Row 2: Pipeline + Trend ─── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>

        {/* Hiring Pipeline */}
        <Col xs={24} md={12}>
          <Card
            variant="borderless"
            style={{ borderRadius: 12, height: "100%" }}
            title={
              <Flex align="center" gap={6}>
                <TeamOutlined style={{ color: PRIMARY }} />
                <Text strong style={{ fontSize: 14 }}>Pipeline การรับสมัคร</Text>
              </Flex>
            }
          >
            <Flex vertical gap={12}>
              {stats.pipeline.map((step, index) => (
                <Flex vertical gap={4} key={step.label}>
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap={8}>
                      <Flex
                        align="center"
                        justify="center"
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: step.color,
                          fontSize: 11,
                          color: "#fff",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </Flex>
                      <Text style={{ fontSize: 13 }}>{step.label}</Text>
                    </Flex>
                    <Flex align="center" gap={6}>
                      <Text strong style={{ fontSize: 15 }}>{step.count}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>คน</Text>
                    </Flex>
                  </Flex>
                  <Progress
                    percent={Math.round((step.count / stats.pipeline[0].count) * 100)}
                    showInfo={false}
                    strokeColor={step.color}
                    trailColor="#F1F5F9"
                    size="small"
                    style={{ margin: 0 }}
                  />
                </Flex>
              ))}

              <Divider style={{ margin: "8px 0" }} />
              <Flex justify="space-between" align="center">
                <Text type="secondary" style={{ fontSize: 13 }}>อัตราความสำเร็จ (Offer Rate)</Text>
                <Tag
                  color={hiringRate >= 10 ? "green" : hiringRate >= 5 ? "orange" : "red"}
                  style={{ fontWeight: 700, fontSize: 13 }}
                >
                  {hiringRate}%
                </Tag>
              </Flex>
            </Flex>
          </Card>
        </Col>

        {/* Daily Trend */}
        <Col xs={24} md={12}>
          <Card
            variant="borderless"
            style={{ borderRadius: 12, height: "100%" }}
            title={
              <Flex align="center" gap={6}>
                <ThunderboltOutlined style={{ color: "#F59E0B" }} />
                <Text strong style={{ fontSize: 14 }}>แนวโน้ม 7 วันล่าสุด</Text>
              </Flex>
            }
          >
            <Flex vertical gap={16}>
              <Flex vertical gap={6}>
                <Flex align="center" gap={6}>
                  <Flex
                    style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: PRIMARY }}
                  />
                  <Text style={{ fontSize: 12, color: "#64748B" }}>ยอดเข้าชม (ครั้ง)</Text>
                </Flex>
                <MiniBarChart data={stats.dailyTrend} valueKey="views" color={PRIMARY} />
              </Flex>

              <Flex vertical gap={6}>
                <Flex align="center" gap={6}>
                  <Flex
                    style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "#10B981" }}
                  />
                  <Text style={{ fontSize: 12, color: "#64748B" }}>ผู้สมัครใหม่ (คน)</Text>
                </Flex>
                <MiniBarChart data={stats.dailyTrend} valueKey="applicants" color="#10B981" />
              </Flex>
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* ─── Row 3: Sources + Experience ─── */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            variant="borderless"
            style={{ borderRadius: 12 }}
            title={
              <Flex align="center" gap={6}>
                <CalendarOutlined style={{ color: "#6366F1" }} />
                <Text strong style={{ fontSize: 14 }}>แหล่งที่มาของผู้สมัคร</Text>
              </Flex>
            }
          >
            <Flex vertical gap={12}>
              {stats.sources.map((src, i) => (
                <BreakdownBar
                  key={src.label}
                  label={src.label}
                  count={src.count}
                  percent={src.percent}
                  color={["#11b6f5", "#6366F1", "#F59E0B", "#94A3B8"][i % 4]}
                />
              ))}
            </Flex>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            variant="borderless"
            style={{ borderRadius: 12 }}
            title={
              <Flex align="center" gap={6}>
                <UserAddOutlined style={{ color: "#10B981" }} />
                <Text strong style={{ fontSize: 14 }}>ประสบการณ์ผู้สมัคร</Text>
              </Flex>
            }
          >
            <Flex vertical gap={12}>
              {stats.experienceLevels.map((exp, i) => (
                <BreakdownBar
                  key={exp.label}
                  label={exp.label}
                  count={exp.count}
                  percent={exp.percent}
                  color={["#10B981", "#11b6f5", "#6366F1", "#F59E0B"][i % 4]}
                />
              ))}
            </Flex>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};
