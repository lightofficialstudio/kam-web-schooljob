"use client";

import { PlusOutlined, TeamOutlined } from "@ant-design/icons";
import { Badge, Breadcrumb, Button, Flex, Layout, Typography } from "antd";
import Link from "next/link";
import { FilterSection } from "./_components/filter-section";
import { InsightsCard } from "./_components/insights-card";
import { JobsTable } from "./_components/jobs-table";
import { StatsSection } from "./_components/stats-section";
import { useJobReadStore } from "./_state/job-read-store";

const { Title, Text } = Typography;
const { Content } = Layout;

const PRIMARY = "#11b6f5";
const PRIMARY_DARK = "#0878a8";

// หน้าจัดการประกาศรับสมัครครู — สำหรับฝ่ายบุคลากรของโรงเรียน
export default function MyJobsPage() {
  const { jobs } = useJobReadStore();
  const totalNewApplicants = jobs.reduce((sum, j) => sum + j.newApplicants, 0);

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#F1F5F9", paddingBottom: 80 }}>

      {/* Gradient Hero Header */}
      <Flex
        vertical
        style={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`,
          padding: "32px 0 56px",
        }}
      >
        <Flex
          vertical
          gap={20}
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%" }}
        >
          <Breadcrumb
            items={[
              {
                title: (
                  <Link href="/pages/employer" style={{ color: "rgba(255,255,255,0.65)" }}>
                    แดชบอร์ด
                  </Link>
                ),
              },
              {
                title: <span style={{ color: "rgba(255,255,255,0.9)" }}>ประกาศรับสมัครครู</span>,
              },
            ]}
          />

          <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
            {/* Title Block */}
            <Flex gap={16} align="center">
              <Flex
                align="center"
                justify="center"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  flexShrink: 0,
                }}
              >
                <TeamOutlined style={{ fontSize: 26, color: "#fff" }} />
              </Flex>
              <Flex vertical gap={3}>
                <Title level={2} style={{ margin: 0, color: "#fff", lineHeight: 1.2 }}>
                  ประกาศรับสมัครครู
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
                  จัดการและติดตามประกาศรับสมัครบุคลากรของโรงเรียน
                </Text>
              </Flex>
            </Flex>

            {/* Action Buttons */}
            <Flex gap={12} align="center">
              {totalNewApplicants > 0 && (
                <Badge count={totalNewApplicants} size="default" offset={[-4, 4]}>
                  <Button
                    size="large"
                    style={{
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.35)",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    ผู้สมัครใหม่
                  </Button>
                </Badge>
              )}
              <Link href="/pages/employer/job/post">
                <Button
                  size="large"
                  icon={<PlusOutlined />}
                  style={{
                    borderRadius: 10,
                    background: "#fff",
                    color: PRIMARY,
                    border: "none",
                    fontWeight: 700,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  }}
                >
                  ลงประกาศงานใหม่
                </Button>
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      {/* Main Content — overlaps header by pulling up */}
      <Content>
        <Flex
          vertical
          gap={24}
          style={{
            maxWidth: 1200,
            margin: "-32px auto 0",
            padding: "0 24px 0",
          }}
        >
          <StatsSection />
          <InsightsCard />
          <FilterSection />
          <JobsTable />
        </Flex>
      </Content>
    </Layout>
  );
}
