"use client";

import { Col, Row } from "antd";
import { useEffect } from "react";
import { BulkActionSection } from "./_components/bulk-action-section";
import { FilterSection } from "./_components/filter-section";
import { HeaderSection } from "./_components/header-section";
import { StatsSection } from "./_components/stats-section";
import { SummarySection } from "./_components/summary-section";
import { UserTable } from "./_components/user-table";
import { useUserManagementStore } from "./_state/user-management-store";

// ✨ [Orchestrator — ประกอบ Components และจัด Layout เท่านั้น]
export default function UserManagementPage() {
  const fetchUsers = useUserManagementStore((s) => s.fetchUsers);

  // 🔄 [โหลด users เมื่อ mount]
  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <HeaderSection />
      </Col>
      <Col xs={24}>
        <StatsSection />
      </Col>
      <Col xs={24}>
        <FilterSection />
      </Col>
      <Col xs={24}>
        <UserTable />
      </Col>
      <Col xs={24}>
        <BulkActionSection />
      </Col>
      <Col xs={24}>
        <SummarySection />
      </Col>
    </Row>
  );
}
