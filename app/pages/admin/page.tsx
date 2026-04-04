"use client";

import { Col, Row } from "antd";
import { ActivityTableSection } from "./_components/activity-table-section";
import { QuickLinksSection } from "./_components/quick-links-section";
import { RoleDistributionChart } from "./_components/role-distribution-chart";
import { StatsSection } from "./_components/stats-section";
import { SystemHealthSection } from "./_components/system-health-section";
import { SystemInfoSection } from "./_components/system-info-section";
import { UserGrowthChart } from "./_components/user-growth-chart";
import { WelcomeSection } from "./_components/welcome-section";

// ✨ [Orchestrator — ประกอบ Components และจัด Layout เท่านั้น]
export default function AdminPage() {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <WelcomeSection />
      </Col>
      <Col xs={24}>
        <StatsSection />
      </Col>

      {/* Charts Row */}
      <Col xs={24} lg={14}>
        <UserGrowthChart />
      </Col>
      <Col xs={24} lg={10}>
        <RoleDistributionChart />
      </Col>

      {/* System Status Row */}
      <Col xs={24} lg={12}>
        <SystemHealthSection />
      </Col>
      <Col xs={24} lg={12}>
        <SystemInfoSection />
      </Col>

      {/* Activity + Quick Links */}
      <Col xs={24} lg={16}>
        <ActivityTableSection />
      </Col>
      <Col xs={24} lg={8}>
        <QuickLinksSection />
      </Col>
    </Row>
  );
}
