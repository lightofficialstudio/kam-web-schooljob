"use client";

import { PlusOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Flex,
  Layout,
  Row,
  Typography,
  theme as antTheme,
} from "antd";
import Link from "next/link";
import { FilterSection } from "./_components/filter-section";
import { InsightsCard } from "./_components/insights-card";
import { JobsTable } from "./_components/jobs-table";
import { StatsSection } from "./_components/stats-section";

const { Title, Text } = Typography;
const { Content } = Layout;

// หน้าจัดการงานของ Employer: ดูรายการ, สถิติ, และจัดการประกาศ
export default function MyJobsPage() {
  const { token } = antTheme.useToken();

  return (
    <Layout
      style={{ minHeight: "100vh", backgroundColor: token.colorBgLayout, paddingBottom: 100 }}
    >
      {/* Page Header */}
      <Flex
        vertical
        style={{
          backgroundColor: token.colorBgContainer,
          padding: "24px 0",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          marginBottom: 32,
        }}
      >
        <Flex
          vertical
          gap={16}
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%" }}
        >
          <Breadcrumb
            items={[
              { title: <Link href="/pages/employer">แดชบอร์ด</Link> },
              { title: "การจัดการงาน" },
              { title: "งานของฉัน" },
            ]}
          />
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                งานของฉัน (My Job Listings)
              </Title>
              <Text type="secondary">จัดการและติดตามสถานะประกาศรับสมัครงานของคุณ</Text>
            </Col>
            <Col>
              <Link href="/pages/employer/job/post">
                <Button type="primary" size="large" icon={<PlusOutlined />}>
                  ลงประกาศงานใหม่
                </Button>
              </Link>
            </Col>
          </Row>
        </Flex>
      </Flex>

      {/* Main Content */}
      <Content>
        <Flex
          vertical
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}
        >
          <InsightsCard />
          <StatsSection />
          <FilterSection />
          <JobsTable />
        </Flex>
      </Content>
    </Layout>
  );
}
