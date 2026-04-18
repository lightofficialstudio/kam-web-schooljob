"use client";

// ✨ Admin Dashboard — Orchestrator ประกอบ Components จัด Layout + ดึง live data เมื่อ mount
import { ModalComponent } from "@/app/components/modal/modal.component";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { ApplicationFunnelChart } from "./_components/application-funnel-chart";
import { JobApplicationTrendChart } from "./_components/job-application-trend-chart";
import { JobStatusDonutChart } from "./_components/job-status-donut-chart";
import { PendingActionsCard } from "./_components/pending-actions-card";
import { PlatformHealthChart } from "./_components/platform-health-chart";
import { QuickLinksSection } from "./_components/quick-links-section";
import { RecentSignupsCard } from "./_components/recent-signups-card";
import { RoleDistributionChart } from "./_components/role-distribution-chart";
import { StatsSection } from "./_components/stats-section";
import { SystemHealthSection } from "./_components/system-health-section";
import { SystemInfoSection } from "./_components/system-info-section";
import { UserGrowthChart } from "./_components/user-growth-chart";
import { WelcomeSection } from "./_components/welcome-section";
import { useDashboardStore } from "./_state/dashboard-store";

export default function AdminPage() {
  const { fetchDashboard, modal, hideModal } = useDashboardStore();

  // ✨ ดึง live data เมื่อเปิดหน้า Dashboard
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <>
      <Row gutter={[16, 16]}>
        {/* ✨ Welcome Banner */}
        <Col xs={24}>
          <WelcomeSection />
        </Col>

        {/* ✨ KPI Stats Cards */}
        <Col xs={24}>
          <StatsSection />
        </Col>

        {/* ✨ Charts Row — User Growth + Role Distribution */}
        <Col xs={24} lg={14}>
          <UserGrowthChart />
        </Col>
        <Col xs={24} lg={10}>
          <RoleDistributionChart />
        </Col>

        {/* ✨ Analytics Row 1 — Supply vs Demand + Application Funnel */}
        <Col xs={24} lg={15}>
          <JobApplicationTrendChart />
        </Col>
        <Col xs={24} lg={9}>
          <ApplicationFunnelChart />
        </Col>

        {/* ✨ Analytics Row 2 — Job Status Donut + Platform Health Score */}
        <Col xs={24} lg={9}>
          <JobStatusDonutChart />
        </Col>
        <Col xs={24} lg={15}>
          <PlatformHealthChart />
        </Col>

        {/* ✨ Pending Actions + Recent Signups */}
        <Col xs={24} lg={10}>
          <PendingActionsCard />
        </Col>
        <Col xs={24} lg={14}>
          <RecentSignupsCard />
        </Col>

        {/* ✨ System Status Row */}
        <Col xs={24} lg={12}>
          <SystemHealthSection />
        </Col>
        <Col xs={24} lg={12}>
          <SystemInfoSection />
        </Col>

        {/* ✨ Quick Links */}
        <Col xs={24}>
          <QuickLinksSection />
        </Col>
      </Row>

      {/* ✨ Modal รายงานสถานะ — Success / Error / Warning */}
      <ModalComponent
        open={modal.open}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        errorDetails={modal.errorDetails}
        onClose={hideModal}
        onConfirm={modal.onConfirm ?? hideModal}
        confirmLabel={modal.confirmLabel}
        cancelLabel={modal.cancelLabel}
      />
    </>
  );
}
