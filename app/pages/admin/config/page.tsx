"use client";

// ✨ [Orchestrator] Admin Config Page — จัดการตัวเลือก Dropdown ในระบบ
import { SummaryCard } from "@/app/components/card/summary-card.component";
import { ModalComponent } from "@/app/components/modal/modal.component";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Row, Typography, theme } from "antd";
import { useEffect } from "react";
import { AddOptionModal } from "./_components/add-option-modal";
import { ConfigTable } from "./_components/config-table";
import { EditOptionModal } from "./_components/edit-option-modal";
import {
  GROUP_META,
  getAllGroups,
  useConfigStore,
} from "./_state/config-store";

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
    <>
      <Flex vertical gap={24}>
        {/* ─── Header ─── */}
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={12}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: token.colorPrimaryBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SettingOutlined
                style={{ color: token.colorPrimary, fontSize: 18 }}
              />
            </div>
            <Flex vertical gap={0}>
              <Title level={4} style={{ margin: 0 }}>
                จัดการตัวเลือก Dropdown
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                ประเภทโรงเรียน, ระดับชั้น, หมวดหมู่งาน และอื่นๆ
                ที่แสดงในฟอร์มระบบ
              </Text>
            </Flex>
          </Flex>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openAddModal()}
          >
            เพิ่มตัวเลือก
          </Button>
        </Flex>

        {/* ─── Summary Cards — แสดงสถิติและคลิกเพื่อสลับ group ─── */}
        <Row gutter={[16, 16]}>
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
                    borderRadius: 16,
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

        {/* ─── Table ─── */}
        <ConfigTable />
      </Flex>

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
    </>
  );
}
