"use client";

// ✨ Admin Dashboard — Orchestrator จัดหมวดหมู่ Section + ดึง live data เมื่อ mount
import { ModalComponent } from "@/app/components/modal/modal.component";
import {
  AlertOutlined,
  BarChartOutlined,
  DashboardOutlined,
  RiseOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Col, Row, theme } from "antd";
import { useEffect } from "react";
import { AdminBreadcrumb } from "@/app/components/admin/header/breadcrumb.component";
import { AdminHeader } from "@/app/components/admin/header/header.component";
import { ApplicationFunnelChart } from "./_components/application-funnel-chart";
import { DeadlineJobsPanel } from "./_components/deadline-jobs-panel";
import { InactiveSchoolsPanel } from "./_components/inactive-schools-panel";
import { JobApplicationTrendChart } from "./_components/job-application-trend-chart";
import { JobStatusDonutChart } from "./_components/job-status-donut-chart";
import { PendingActionsCard } from "./_components/pending-actions-card";
import { PlatformHealthChart } from "./_components/platform-health-chart";
import { ProvinceDistributionChart } from "./_components/province-distribution-chart";
import { QuickLinksSection } from "./_components/quick-links-section";
import { RecentSignupsCard } from "./_components/recent-signups-card";
import { RoleDistributionChart } from "./_components/role-distribution-chart";
import { SectionHeader } from "./_components/section-header";
import { StatsSection } from "./_components/stats-section";
import { SystemHealthSection } from "./_components/system-health-section";
import { SystemInfoSection } from "./_components/system-info-section";
import { UserGrowthChart } from "./_components/user-growth-chart";
import { WelcomeSection } from "./_components/welcome-section";
import { useDashboardStore } from "./_state/dashboard-store";

export default function AdminDashboardPage() {
  const { token } = theme.useToken();
  const { fetchDashboard, modal, hideModal } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div style={{ padding: "24px 24px 48px" }}>
      {/* 1. Breadcrumb */}
      <AdminBreadcrumb
        items={[{ title: "แดชบอร์ดระบบ" }]}
      />

      {/* 2. Header */}
      <AdminHeader
        title="ภาพรวมระบบ (Dashboard)"
        description="สรุปข้อมูลสถิติและการทำงานของระบบแบบ Real-time"
        icon={<DashboardOutlined style={{ fontSize: 22, color: "#fff" }} />}
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]}>
        {/* ══════════════════════════════════════════════
            SECTION 0 — Welcome + Quick Stats
        ══════════════════════════════════════════════ */}
        <Col xs={24}>
          <WelcomeSection />
        </Col>

        <Col xs={24} className="animate-[fadeInUp_0.4s_ease-out_0.05s_both]">
          <StatsSection />
        </Col>

        <Col xs={24} className="animate-[fadeInUp_0.4s_ease-out_0.1s_both]">
          <QuickLinksSection />
        </Col>

        {/* ══════════════════════════════════════════════
            SECTION 1 — ภาพรวมผู้ใช้งาน
        ══════════════════════════════════════════════ */}
        <Col xs={24} className="animate-[fadeInUp_0.4s_ease-out_0.15s_both]">
          <SectionHeader
            icon={<RiseOutlined />}
            title="ภาพรวมผู้ใช้งาน"
            subtitle="การเติบโตของฐานผู้ใช้และการกระจายตัว"
            color={token.colorPrimary}
          />
        </Col>

        <Col xs={24} lg={14} className="animate-[fadeInUp_0.4s_ease-out_0.2s_both]">
          <UserGrowthChart />
        </Col>
        <Col xs={24} lg={10} className="animate-[fadeInUp_0.4s_ease-out_0.25s_both]">
          <RoleDistributionChart />
        </Col>

        <Col xs={24} className="animate-[fadeInUp_0.4s_ease-out_0.28s_both]">
          <ProvinceDistributionChart />
        </Col>

        {/* ══════════════════════════════════════════════
            SECTION 2 — วิเคราะห์ตลาดงาน
        ══════════════════════════════════════════════ */}
        <Col xs={24} className="animate-[fadeInUp_0.4s_ease-out_0.3s_both]">
          <SectionHeader
            icon={<BarChartOutlined />}
            title="วิเคราะห์ตลาดงาน"
            subtitle="Supply & Demand · สถานะประกาศงาน · Conversion Funnel"
            color={token.colorSuccess}
          />
        </Col>

        <Col xs={24} lg={15} className="animate-[fadeInUp_0.4s_ease-out_0.35s_both]">
          <JobApplicationTrendChart />
        </Col>
        <Col xs={24} lg={9} className="animate-[fadeInUp_0.4s_ease-out_0.4s_both]">
          <ApplicationFunnelChart />
        </Col>

        <Col xs={24} lg={9} className="animate-[fadeInUp_0.4s_ease-out_0.43s_both]">
          <JobStatusDonutChart />
        </Col>
        <Col xs={24} lg={15} className="animate-[fadeInUp_0.4s_ease-out_0.46s_both]">
          <PlatformHealthChart />
        </Col>

        {/* ══════════════════════════════════════════════
            SECTION 3 — Action Required
        ══════════════════════════════════════════════ */}
        <Col xs={24} className="animate-[fadeInUp_0.4s_ease-out_0.48s_both]">
          <SectionHeader
            icon={<AlertOutlined />}
            title="รายการที่ต้องดำเนินการ"
            subtitle="งานค้างอยู่ · งานใกล้ปิดรับ · โรงเรียนที่ยังไม่ได้ใช้งาน"
            color={token.colorWarning}
          />
        </Col>

        <Col xs={24} lg={8} className="animate-[fadeInUp_0.4s_ease-out_0.5s_both]">
          <PendingActionsCard />
        </Col>
        <Col xs={24} lg={8} className="animate-[fadeInUp_0.4s_ease-out_0.53s_both]">
          <DeadlineJobsPanel />
        </Col>
        <Col xs={24} lg={8} className="animate-[fadeInUp_0.4s_ease-out_0.56s_both]">
          <InactiveSchoolsPanel />
        </Col>

        {/* ══════════════════════════════════════════════
            SECTION 4 — กิจกรรมล่าสุด
        ══════════════════════════════════════════════ */}
        <Col xs={24} className="animate-[fadeInUp_0.4s_ease-out_0.58s_both]">
          <SectionHeader
            icon={<DashboardOutlined />}
            title="กิจกรรมล่าสุด"
            subtitle="ผู้ใช้ที่สมัครใหม่ล่าสุด"
            color={token.colorInfo}
          />
        </Col>

        <Col xs={24} className="animate-[fadeInUp_0.4s_ease-out_0.6s_both]">
          <RecentSignupsCard />
        </Col>

        {/* ══════════════════════════════════════════════
            SECTION 5 — สถานะระบบ
        ══════════════════════════════════════════════ */}
        <Col xs={24} className="animate-[fadeInUp_0.4s_ease-out_0.62s_both]">
          <SectionHeader
            icon={<SafetyOutlined />}
            title="สถานะระบบ"
            subtitle="Server Health · Environment · Connection"
            color={token.colorError}
          />
        </Col>

        <Col xs={24} lg={12} className="animate-[fadeInUp_0.4s_ease-out_0.65s_both]">
          <SystemHealthSection />
        </Col>
        <Col xs={24} lg={12} className="animate-[fadeInUp_0.4s_ease-out_0.68s_both]">
          <SystemInfoSection />
        </Col>

      </Row>

      {/* ✨ Modal รายงานสถานะ (5) */}
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
    </div>
  );
}
