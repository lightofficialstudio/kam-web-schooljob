"use client";

import { Col, Layout, Row } from "antd";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { JobDetailDrawer } from "./_components/job-detail-drawer";
import { JobListSection } from "./_components/job-list-section";
import { SearchFilterSection } from "./_components/search-filter-section";
import { SidebarSection } from "./_components/sidebar-section";
import { useJobSearchStore } from "./_state/job-search-store";

// Inner component ที่ใช้ useSearchParams (ต้องอยู่ใน Suspense)
function JobSearchPageContent() {
  const searchParams = useSearchParams();
  const { setFilters } = useJobSearchStore();

  // Sync URL params → store เมื่อ mount
  useEffect(() => {
    const keyword = searchParams.get("keyword");
    const province = searchParams.get("province");
    const category = searchParams.get("category");

    const partial: Record<string, string> = {};
    if (keyword) partial.keyword = keyword;
    if (province) partial.province = province;
    if (category) partial.category = category;

    if (Object.keys(partial).length > 0) {
      setFilters(partial);
    }
  }, [searchParams, setFilters]);

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

      {/* Drawer แสดงรายละเอียดงาน */}
      <JobDetailDrawer />
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
