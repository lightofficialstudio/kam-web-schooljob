"use client";

// ✨ Blog Stats Bar — KPI cards + category breakdown
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileAddOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { Card, Col, Flex, Row, Skeleton, Statistic, Typography, theme } from "antd";
import { useAdminBlogStore } from "../_state/blog-store";

const { Text } = Typography;

export function BlogStatsBar() {
  const { token } = theme.useToken();
  const { blogs, total, isLoading } = useAdminBlogStore();

  const published = blogs.filter((b) => b.status === "PUBLISHED").length;
  const draft = blogs.filter((b) => b.status === "DRAFT").length;

  // ✨ นับ category ที่เยอะที่สุด
  const categoryCount: Record<string, number> = {};
  blogs.forEach((b) => { if (b.category) categoryCount[b.category] = (categoryCount[b.category] ?? 0) + 1; });
  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];

  const cards = [
    {
      label: "บทความทั้งหมด",
      value: total,
      icon: <FileAddOutlined />,
      color: token.colorPrimary,
      sub: `แสดงผล ${blogs.length} รายการ`,
    },
    {
      label: "เผยแพร่แล้ว",
      value: published,
      icon: <CheckCircleOutlined />,
      color: "#52c41a",
      sub: total > 0 ? `${Math.round((published / Math.max(blogs.length, 1)) * 100)}% ของทั้งหมด` : "—",
    },
    {
      label: "ฉบับร่าง",
      value: draft,
      icon: <ClockCircleOutlined />,
      color: "#fa8c16",
      sub: draft > 0 ? "รอการเผยแพร่" : "ไม่มี draft",
    },
    {
      label: "หมวดหมู่ยอดนิยม",
      value: topCategory ? topCategory[1] : 0,
      icon: <RiseOutlined />,
      color: "#722ed1",
      sub: topCategory ? topCategory[0] : "ยังไม่มีข้อมูล",
    },
  ];

  return (
    <Row gutter={[14, 14]}>
      {cards.map((c) => (
        <Col xs={12} sm={6} key={c.label}>
          <Card
            variant="borderless"
            style={{
              borderRadius: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              borderTop: `3px solid ${c.color}`,
            }}
            styles={{ body: { padding: "14px 18px" } }}
          >
            {isLoading ? (
              <Flex vertical gap={6}>
                <Skeleton.Input active size="small" style={{ width: 80, height: 12 }} />
                <Skeleton.Input active size="large" style={{ width: 60, height: 28 }} />
              </Flex>
            ) : (
              <Flex vertical gap={3}>
                <Flex align="center" gap={6}>
                  <Text style={{ color: c.color, fontSize: 14 }}>{c.icon}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{c.label}</Text>
                </Flex>
                <Statistic
                  value={c.value}
                  styles={{ content: { fontSize: 24, fontWeight: 700, color: c.color } }}
                />
                <Text type="secondary" style={{ fontSize: 11 }} ellipsis>{c.sub}</Text>
              </Flex>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
}
