"use client";

// ✨ Blog Analytics Section — ยอดวิว, top บทความ, daily chart, category breakdown
import {
  BarChartOutlined,
  EyeOutlined,
  FireOutlined,
  RiseOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Skeleton,
  Statistic,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAdminBlogStore } from "../_state/blog-store";

const { Text, Title } = Typography;

// ✨ แปลง YYYY-MM-DD → DD/MM
const fmtDay = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

// ✨ สีสำหรับ category
const CATEGORY_COLORS = [
  "#11b6f5", "#52c41a", "#fa8c16", "#722ed1", "#eb2f96", "#13c2c2",
];

export function BlogAnalyticsSection() {
  const { token } = theme.useToken();
  const { statsOverview, isStatsLoading, fetchStatsOverview } = useAdminBlogStore();

  const s = statsOverview;

  // ✨ คำนวณ max views สำหรับ progress bar
  const maxViews = s?.topBlogs?.[0]?.views ?? 1;
  const maxCategory = s?.byCategory?.[0]?.views ?? 1;

  return (
    <Row gutter={[16, 16]}>
      {/* ─── Header ─── */}
      <Col xs={24}>
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={8}>
            <BarChartOutlined style={{ color: token.colorPrimary, fontSize: 18 }} />
            <Title level={5} style={{ margin: 0 }}>Blog Analytics</Title>
            <Badge status="processing" color={token.colorPrimary} />
            <Text type="secondary" style={{ fontSize: 12 }}>real-time view tracking</Text>
          </Flex>
          <Tooltip title="รีเฟรชสถิติ">
            <Button
              size="small"
              icon={<ReloadOutlined />}
              loading={isStatsLoading}
              onClick={fetchStatsOverview}
            />
          </Tooltip>
        </Flex>
      </Col>

      {/* ─── KPI Cards ─── */}
      {[
        {
          label: "ยอดวิวทั้งหมด",
          value: s?.totalViews ?? 0,
          icon: <EyeOutlined />,
          color: token.colorPrimary,
          sub: "ตลอดเวลา",
        },
        {
          label: "วิว 7 วันล่าสุด",
          value: s?.views7d ?? 0,
          icon: <RiseOutlined />,
          color: "#52c41a",
          sub: s?.totalViews && s.views7d
            ? `${Math.round((s.views7d / s.totalViews) * 100)}% ของทั้งหมด`
            : "—",
        },
        {
          label: "วิว 30 วันล่าสุด",
          value: s?.views30d ?? 0,
          icon: <FireOutlined />,
          color: "#fa8c16",
          sub: "เฉลี่ย " + (s?.views30d ? Math.round(s.views30d / 30) : 0) + " วิว/วัน",
        },
      ].map((c) => (
        <Col xs={24} sm={8} key={c.label}>
          <Card
            variant="borderless"
            style={{
              borderRadius: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              borderTop: `3px solid ${c.color}`,
            }}
            styles={{ body: { padding: "14px 18px" } }}
          >
            {isStatsLoading ? (
              <Skeleton.Input active style={{ width: "100%", height: 52 }} />
            ) : (
              <Flex vertical gap={3}>
                <Flex align="center" gap={6}>
                  <Text style={{ color: c.color, fontSize: 14 }}>{c.icon}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{c.label}</Text>
                </Flex>
                <Statistic value={c.value} styles={{ content: { fontSize: 24, fontWeight: 700, color: c.color } }} />
                <Text type="secondary" style={{ fontSize: 11 }}>{c.sub}</Text>
              </Flex>
            )}
          </Card>
        </Col>
      ))}

      {/* ─── Daily Chart (30 วัน) ─── */}
      <Col xs={24} lg={16}>
        <Card
          variant="borderless"
          style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          title={
            <Flex align="center" gap={6}>
              <RiseOutlined style={{ color: token.colorPrimary }} />
              <Text strong style={{ fontSize: 13 }}>ยอดวิวรายวัน (30 วันล่าสุด)</Text>
            </Flex>
          }
        >
          {isStatsLoading ? (
            <Skeleton.Input active style={{ width: "100%", height: 200 }} />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={s?.dailyChart?.map((d) => ({ ...d, day: fmtDay(d.day) })) ?? []}
                margin={{ top: 6, right: 8, left: -24, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={token.colorPrimary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={token.colorPrimary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={token.colorBorderSecondary} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: token.colorTextSecondary, fontSize: 11 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fill: token.colorTextSecondary, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <RTooltip
                  contentStyle={{ background: token.colorBgElevated, border: `1px solid ${token.colorBorderSecondary}`, borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${v} วิว`, "ยอดวิว"]}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke={token.colorPrimary}
                  strokeWidth={2.5}
                  fill="url(#gradViews)"
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>
      </Col>

      {/* ─── Category Breakdown ─── */}
      <Col xs={24} lg={8}>
        <Card
          variant="borderless"
          style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "100%" }}
          title={
            <Flex align="center" gap={6}>
              <BarChartOutlined style={{ color: token.colorWarning }} />
              <Text strong style={{ fontSize: 13 }}>วิวตามหมวดหมู่</Text>
            </Flex>
          }
        >
          {isStatsLoading ? (
            <Flex vertical gap={10}>
              {[0, 1, 2, 3].map((i) => <Skeleton.Input key={i} active size="small" style={{ width: "100%", height: 32 }} />)}
            </Flex>
          ) : (s?.byCategory?.length ?? 0) === 0 ? (
            <Text type="secondary" style={{ fontSize: 13 }}>ยังไม่มีข้อมูล</Text>
          ) : (
            <Flex vertical gap={10}>
              {s!.byCategory.slice(0, 6).map((c, i) => (
                <Flex vertical gap={3} key={c.category}>
                  <Flex align="center" justify="space-between">
                    <Tag color={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} style={{ margin: 0, fontSize: 11, borderRadius: 6 }}>
                      {c.category}
                    </Tag>
                    <Text style={{ fontSize: 12, fontWeight: 600 }}>{c.views.toLocaleString()}</Text>
                  </Flex>
                  <Progress
                    percent={Math.round((c.views / maxCategory) * 100)}
                    strokeColor={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                    showInfo={false}
                    size="small"
                  />
                </Flex>
              ))}
            </Flex>
          )}
        </Card>
      </Col>

      {/* ─── Top 10 บทความ ─── */}
      <Col xs={24}>
        <Card
          variant="borderless"
          style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          title={
            <Flex align="center" gap={6}>
              <FireOutlined style={{ color: "#fa8c16" }} />
              <Text strong style={{ fontSize: 13 }}>Top บทความ (30 วัน)</Text>
            </Flex>
          }
        >
          {isStatsLoading ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : (s?.topBlogs?.length ?? 0) === 0 ? (
            <Flex justify="center" style={{ padding: "20px 0" }}>
              <Text type="secondary">ยังไม่มียอดวิว — เริ่มนับเมื่อมีคนเปิดอ่านบทความ</Text>
            </Flex>
          ) : (
            <Flex vertical gap={8}>
              {s!.topBlogs.map((b, i) => (
                <Flex key={b.blogId} align="center" gap={12}>
                  {/* Rank */}
                  <Flex
                    align="center" justify="center"
                    style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: i < 3 ? ["#ffd700", "#c0c0c0", "#cd7f32"][i] + "22" : token.colorFillSecondary,
                      border: i < 3 ? `2px solid ${["#ffd700", "#c0c0c0", "#cd7f32"][i]}` : `1px solid ${token.colorBorderSecondary}`,
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: 700, color: i < 3 ? ["#b8860b", "#808080", "#8b4513"][i] : token.colorTextSecondary }}>
                      {i + 1}
                    </Text>
                  </Flex>

                  {/* Title + progress */}
                  <Flex vertical gap={2} style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ fontSize: 13 }} ellipsis>{b.title}</Text>
                    <Progress
                      percent={Math.round((b.views / maxViews) * 100)}
                      strokeColor={i < 3 ? ["#ffd700", "#c0c0c0", "#cd7f32"][i] : token.colorPrimary}
                      showInfo={false}
                      size="small"
                    />
                  </Flex>

                  {/* View count */}
                  <Flex align="center" gap={4} style={{ flexShrink: 0 }}>
                    <EyeOutlined style={{ color: token.colorTextSecondary, fontSize: 13 }} />
                    <Text strong style={{ fontSize: 13, color: token.colorPrimary }}>
                      {b.views.toLocaleString()}
                    </Text>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          )}
        </Card>
      </Col>
    </Row>
  );
}
