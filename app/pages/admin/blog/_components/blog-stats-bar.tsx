"use client";

// ✨ Blog Stats Bar — KPI cards โดยใช้ SummaryCard กลาง
import { SummaryCard } from "@/app/components/admin/card/summary-card.component";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileAddOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { Col, Row, theme } from "antd";
import { useAdminBlogStore } from "../_state/blog-store";

export function BlogStatsBar() {
  const { token } = theme.useToken();
  const { blogs, total, isLoading } = useAdminBlogStore();

  const published = blogs.filter((b) => b.status === "PUBLISHED").length;
  const draft = blogs.filter((b) => b.status === "DRAFT").length;

  // ✨ นับ category ที่เยอะที่สุด
  const categoryCount: Record<string, number> = {};
  blogs.forEach((b) => {
    if (b.category)
      categoryCount[b.category] = (categoryCount[b.category] ?? 0) + 1;
  });
  const topCategory = Object.entries(categoryCount).sort(
    (a, b) => b[1] - a[1],
  )[0];

  return (
    <Row gutter={[14, 14]}>
      <Col xs={12} sm={6}>
        <SummaryCard
          title="บทความทั้งหมด"
          value={total}
          unit="บทความ"
          subtitle={`แสดงผล ${blogs.length} รายการ`}
          icon={<FileAddOutlined />}
          color={token.colorPrimary}
          isLoading={isLoading}
        />
      </Col>
      <Col xs={12} sm={6}>
        <SummaryCard
          title="เผยแพร่แล้ว"
          value={published}
          unit="บทความ"
          subtitle={
            total > 0
              ? `${Math.round((published / Math.max(blogs.length, 1)) * 100)}% ของทั้งหมด`
              : "—"
          }
          icon={<CheckCircleOutlined />}
          color="#52c41a"
          isLoading={isLoading}
          trend={
            published > 0
              ? { value: `${published}`, direction: "up" }
              : undefined
          }
        />
      </Col>
      <Col xs={12} sm={6}>
        <SummaryCard
          title="ฉบับร่าง"
          value={draft}
          unit="บทความ"
          subtitle={draft > 0 ? "รอการเผยแพร่" : "ไม่มี draft"}
          icon={<ClockCircleOutlined />}
          color="#fa8c16"
          isLoading={isLoading}
          trend={
            draft > 0 ? { value: `${draft}`, direction: "neutral" } : undefined
          }
        />
      </Col>
      <Col xs={12} sm={6}>
        <SummaryCard
          title="หมวดหมู่ยอดนิยม"
          value={topCategory ? topCategory[1] : 0}
          unit="บทความ"
          subtitle={topCategory ? topCategory[0] : "ยังไม่มีข้อมูล"}
          icon={<RiseOutlined />}
          color="#722ed1"
          isLoading={isLoading}
        />
      </Col>
    </Row>
  );
}
