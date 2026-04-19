"use client";

// ✨ [Orchestrator] Admin Config Page — จัดการตัวเลือก Dropdown ในระบบ
import { ModalComponent } from "@/app/components/modal/modal.component";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography, theme } from "antd";
import { useEffect } from "react";
import { AddOptionModal } from "./_components/add-option-modal";
import { ConfigTable } from "./_components/config-table";
import { EditOptionModal } from "./_components/edit-option-modal";
import {
  GROUP_META,
  getAllGroups,
  useConfigStore,
} from "./_state/config-store";
import { AdminBreadcrumb } from "@/app/components/admin/header/breadcrumb.component";
import { AdminHeader } from "@/app/components/admin/header/header.component";
import { SummaryCard } from "@/app/components/admin/card/summary-card.component";

const { Title, Text } = Typography;

export default function AdminConfigPage() {
  const { token } = theme.useToken();
  const {
    options,
    isLoading,
    activeGroup,
    setActiveGroup,
    fetchOptions,
    openAddModal,
    modal,
    hideModal,
  } = useConfigStore();

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // ✨ #7 fix: ใช้ selector ใน store แทน inline logic
  const allGroups = getAllGroups(options);

  return (
    <div style={{ padding: "24px 24px 48px", minHeight: "100vh", background: token.colorBgLayout }}>
      {/* 1. Breadcrumb */}
      <AdminBreadcrumb
        items={[
          { title: "แดชบอร์ด", path: "/pages/admin/dashboard" },
          { title: "จัดการตัวเลือกระบบ" }
        ]}
      />

      {/* 2. Header */}
      <AdminHeader
        title="จัดการตัวเลือกระบบ (System Configuration)"
        description="ปรับแต่งประเภทโรงเรียน, ระดับชั้น และหมวดหมู่งานที่แสดงในระบบ"
        icon={<SettingOutlined style={{ fontSize: 22, color: "#fff" }} />}
        style={{ marginBottom: 24 }}
        action={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openAddModal()}
            style={{ fontWeight: 600, borderRadius: 10 }}
          >
            เพิ่มตัวเลือก
          </Button>
        }
      />

      {/* ─── Main Content ─── */}
      <div style={{ position: "relative" }}>
        {/* 3. Summary Cards — แสดงสถิติและคลิกเพื่อสลับ group ─── */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {allGroups.map((g) => {
            const count = options.filter((o) => o.group === g).length;
            const activeCount = options.filter(
              (o) => o.group === g && o.isActive,
            ).length;
            const isSelected = activeGroup === g;
            return (
              <Col key={g} xs={24} sm={12} md={8}>
                <div
                  style={{
                    outline: isSelected
                      ? `2px solid ${token.colorPrimary}`
                      : "2px solid transparent",
                    outlineOffset: 1,
                    borderRadius: 15,
                    transition: "outline-color 0.2s",
                  }}
                >
                  <SummaryCard
                    title={GROUP_META[g]?.label ?? g}
                    value={count}
                    unit="รายการ"
                    subtitle={`เปิดใช้งาน ${activeCount} รายการ`}
                    icon={<SettingOutlined />}
                    color={isSelected ? token.colorPrimary : undefined}
                    isLoading={isLoading}
                    onClick={() => setActiveGroup(g)}
                  />
                </div>
              </Col>
            );
          })}
        </Row>

        {/* 4. Content (Table) */}
        <ConfigTable />
      </div>

      {/* ─── Modals ─── */}
      <AddOptionModal />
      <EditOptionModal />

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
