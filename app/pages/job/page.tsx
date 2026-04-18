"use client";

import { FileSearchOutlined } from "@ant-design/icons";
import { Badge, Button, Col, Layout, Row, Tooltip } from "antd";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ApplicationTrackerDrawer } from "./_components/application-tracker-drawer";
import { JobDetailDrawer } from "./_components/job-detail-drawer";
import { JobListSection } from "./_components/job-list-section";
import { SearchFilterSection } from "./_components/search-filter-section";
import { SidebarSection } from "./_components/sidebar-section";
import { useApplicationTrackerStore } from "./_state/application-tracker-store";
import { useJobSearchStore } from "./_state/job-search-store";
import { useAuthStore } from "@/app/stores/auth-store";

// Inner component ที่ใช้ useSearchParams (ต้องอยู่ใน Suspense)
function JobSearchPageContent() {
  const searchParams = useSearchParams();
  const { setFilters, fetchAndOpenJob } = useJobSearchStore();
  const { applications, setIsTrackerOpen, fetchApplications } = useApplicationTrackerStore();
  const { user } = useAuthStore();

  // จำนวนใบสมัครที่ยังอยู่ระหว่างดำเนินการ
  const activeApplicationCount = applications.filter(
    (a) => a.status !== "accepted" && a.status !== "rejected"
  ).length;

  // ✨ Sync URL params → store เมื่อ mount
  useEffect(() => {
    const keyword  = searchParams.get("keyword");
    const province = searchParams.get("province");
    const category = searchParams.get("category");

    const partial: Parameters<typeof setFilters>[0] = {};
    if (keyword)  partial.keyword  = keyword;
    if (province) partial.location = province;

    // ✨ category จาก URL คือ JSON ของ string[][] เช่น [["general_subject","thai_teacher"]]
    if (category) {
      try {
        const parsed = JSON.parse(category);
        if (Array.isArray(parsed)) partial.category = parsed as string[][];
      } catch {
        // ถ้า parse ไม่ได้ ให้ข้ามไป
      }
    }

    if (Object.keys(partial).length > 0) {
      setFilters(partial);
    }
  }, [searchParams, setFilters]);

  // ✨ เปิด Drawer อัตโนมัติเมื่อมี ?job_id= param (เช่น มาจาก Landing Page)
  useEffect(() => {
    const jobId = searchParams.get("job_id");
    if (jobId) fetchAndOpenJob(jobId);
  }, [searchParams]);

  // ✨ ดึงใบสมัครของ Employee เมื่อ login แล้ว
  useEffect(() => {
    if (user?.user_id && user?.role === "EMPLOYEE") {
      fetchApplications(user.user_id);
    }
  }, [user?.user_id]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SearchFilterSection />

      <Layout.Content>
        <Row justify="center" style={{ marginTop: 40, paddingBottom: 80 }}>
          <Col xs={24} style={{ maxWidth: 1152, padding: "0 24px" }}>
            <Row gutter={40}>
              <Col xs={24} lg={16}>
                <JobListSection />
              </Col>
              <Col xs={24} lg={8}>
                <SidebarSection />
              </Col>
            </Row>
          </Col>
        </Row>
      </Layout.Content>

      {/* ปุ่มลอย — เปิด Application Tracker */}
      <Tooltip title="ติดตามใบสมัครของฉัน" placement="left">
        <Badge count={activeApplicationCount} offset={[-4, 4]}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<FileSearchOutlined style={{ fontSize: 22 }} />}
            onClick={() => setIsTrackerOpen(true)}
            style={{
              position: "fixed",
              bottom: 32,
              right: 32,
              width: 56,
              height: 56,
              zIndex: 999,
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}
          />
        </Badge>
      </Tooltip>

      {/* Drawers */}
      <JobDetailDrawer />
      <ApplicationTrackerDrawer />
    </Layout>
  );
}

// Orchestrator หลัก — ครอบด้วย Suspense เพราะใช้ useSearchParams
export default function JobSearchPage() {
  return (
    <Suspense fallback={null}>
      <JobSearchPageContent />
    </Suspense>
  );
}
