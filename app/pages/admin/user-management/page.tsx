"use client";

// ✨ [Orchestrator — User Management Page with Audit Log + Deep Analytics]
import { ModalComponent } from "@/app/components/modal/modal.component";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { BulkActionSection } from "./_components/bulk-action-section";
import { FilterSection } from "./_components/filter-section";
import { HeaderSection } from "./_components/header-section";
import { StatsSection } from "./_components/stats-section";
import { UserDetailDrawer } from "./_components/user-detail-drawer";
import { UserTable } from "./_components/user-table";
import { useUserManagementStore } from "./_state/user-management-store";

export default function UserManagementPage() {
  const {
    fetchUsers,
    filterRole,
    filterStatus,
    filterKeyword,
    page,
    modal,
    hideModal,
  } = useUserManagementStore();

  // ✨ โหลดข้อมูลเมื่อ mount
  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ✨ refetch เมื่อ filter เปลี่ยน
  useEffect(() => {
    fetchUsers();
  }, [filterRole, filterStatus, filterKeyword, page]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
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
          <BulkActionSection />
        </Col>
        <Col xs={24}>
          <UserTable />
        </Col>
      </Row>

      {/* ─── User Detail Drawer (Audit Log + Analytics) ─── */}
      <UserDetailDrawer />

      {/* ─── Global Modal สำหรับ feedback ทั้งหน้า ─── */}
      <ModalComponent
        open={modal.open}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        errorDetails={modal.errorDetails}
        loading={modal.loading}
        confirmLabel={modal.confirmLabel}
        cancelLabel={modal.cancelLabel}
        onClose={hideModal}
        onConfirm={modal.onConfirm}
      />
    </>
  );
}
