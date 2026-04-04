"use client";

import { Col, Row } from "antd";
import { ActivityTableSection } from "./_components/activity-table-section";
import { QuickLinksSection } from "./_components/quick-links-section";
import { StatsSection } from "./_components/stats-section";
import { SystemHealthSection } from "./_components/system-health-section";
import { SystemInfoSection } from "./_components/system-info-section";
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
      <Col xs={24} lg={12}>
        <SystemHealthSection />
      </Col>
      <Col xs={24} lg={12}>
        <SystemInfoSection />
      </Col>
      <Col xs={24}>
        <ActivityTableSection />
      </Col>
      <Col xs={24}>
        <QuickLinksSection />
      </Col>
    </Row>
  );
}
