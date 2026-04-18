"use client";

// ✨ Bulk Plan Change Modal — เปลี่ยน Plan หลายโรงเรียนพร้อมกัน (Feature 4)
import { SwapRightOutlined, TeamOutlined } from "@ant-design/icons";
import {
  Avatar,
  Flex,
  InputNumber,
  Modal,
  Tag,
  Typography,
  theme,
} from "antd";
import { useState } from "react";
import { PackagePlanItem, SchoolPackageItem, usePackageStore } from "../_state/package-store";

const { Text } = Typography;

interface Props {
  open: boolean;
  targetPlan: PackagePlanItem | null;
  selectedSchools: SchoolPackageItem[];
  plans: PackagePlanItem[];
  onConfirm: (quota: number) => void;
  onCancel: () => void;
}

export function BulkPlanModal({ open, targetPlan, selectedSchools, plans, onConfirm, onCancel }: Props) {
  const { token } = theme.useToken();
  const { isBulkUpdating } = usePackageStore();
  const [customQuota, setCustomQuota] = useState<number | null>(null);

  if (!targetPlan) return null;

  const finalQuota = customQuota ?? targetPlan.jobQuota;

  const handleConfirm = () => {
    onConfirm(finalQuota);
    setCustomQuota(null);
  };
  const handleCancel = () => {
    setCustomQuota(null);
    onCancel();
  };

  return (
    <Modal
      open={open}
      onOk={handleConfirm}
      onCancel={handleCancel}
      confirmLoading={isBulkUpdating}
      okText={`เปลี่ยน ${selectedSchools.length} โรงเรียน`}
      cancelText="ยกเลิก"
      okButtonProps={{ danger: false, style: { background: targetPlan.color, borderColor: targetPlan.color } }}
      title={
        <Flex align="center" gap={10}>
          <SwapRightOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />
          <span>Bulk Plan Change</span>
        </Flex>
      }
      width={500}
    >
      {/* ── Summary ── */}
      <div style={{ padding: "12px 16px", borderRadius: 10, background: token.colorFillQuaternary, border: `1px solid ${token.colorBorderSecondary}`, marginBottom: 20 }}>
        <Flex align="center" gap={8}>
          <TeamOutlined style={{ color: token.colorPrimary }} />
          <Text strong>{selectedSchools.length} โรงเรียนที่เลือก</Text>
        </Flex>
        {/* ── แสดงสูงสุด 5 โรงเรียน ── */}
        <Flex gap={6} wrap="wrap" style={{ marginTop: 10 }}>
          {selectedSchools.slice(0, 5).map((s) => (
            <Flex key={s.id} align="center" gap={5} style={{ padding: "3px 8px", borderRadius: 20, background: token.colorBgContainer, border: `1px solid ${token.colorBorderSecondary}` }}>
              <Avatar src={s.logoUrl ?? undefined} size={16} style={{ flexShrink: 0 }}>{s.schoolName[0]}</Avatar>
              <Text style={{ fontSize: 11 }} ellipsis={{ tooltip: s.schoolName }}>{s.schoolName}</Text>
            </Flex>
          ))}
          {selectedSchools.length > 5 && (
            <Text type="secondary" style={{ fontSize: 11, padding: "3px 6px" }}>+{selectedSchools.length - 5} อื่นๆ</Text>
          )}
        </Flex>
      </div>

      {/* ── Target Plan ── */}
      <div style={{ marginBottom: 20 }}>
        <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>เปลี่ยนทุกโรงเรียนไปเป็น</Text>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: `${targetPlan.color}10`, border: `2px solid ${targetPlan.color}` }}>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={8}>
              <Tag style={{ fontWeight: 700, fontSize: 13, border: `1.5px solid ${targetPlan.color}`, color: targetPlan.color, background: `${targetPlan.color}20`, margin: 0 }}>
                {targetPlan.label}
              </Tag>
              <Text style={{ fontSize: 12, color: targetPlan.color, fontWeight: 600 }}>
                {targetPlan.price === 0 ? "ฟรี" : `฿${targetPlan.price.toLocaleString()}/เดือน`}
              </Text>
            </Flex>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Quota: {targetPlan.jobQuota >= 999 ? "∞" : targetPlan.jobQuota} งาน
            </Text>
          </Flex>
        </div>
      </div>

      {/* ── Plan breakdown ── */}
      <div style={{ marginBottom: 20 }}>
        <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>สรุปจากทุก Plan ที่เลือก</Text>
        <Flex gap={6} wrap="wrap">
          {Object.entries(
            selectedSchools.reduce<Record<string, number>>((acc, s) => {
              acc[s.accountPlan] = (acc[s.accountPlan] ?? 0) + 1;
              return acc;
            }, {})
          ).map(([planKey, count]) => {
            const p = plans.find((x) => x.plan === planKey);
            return (
              <Tag key={planKey} style={{ fontSize: 11, borderRadius: 20, border: `1px solid ${p?.color ?? token.colorBorder}`, color: p?.color ?? token.colorText, background: `${p?.color ?? "#000"}12` }}>
                {p?.label ?? planKey} × {count}
              </Tag>
            );
          })}
        </Flex>
      </div>

      {/* ── Custom Quota ── */}
      <div style={{ padding: "12px 16px", borderRadius: 10, background: token.colorInfoBg, border: `1px solid ${token.colorInfoBorder}` }}>
        <Text style={{ fontSize: 12, color: token.colorInfoText, display: "block", marginBottom: 8 }}>
          Job Quota สำหรับทุกโรงเรียน (ปรับได้)
        </Text>
        <Flex align="center" gap={12}>
          <InputNumber
            min={0}
            max={99999}
            value={finalQuota}
            onChange={(v) => setCustomQuota(v)}
            addonAfter="ประกาศงาน"
            style={{ width: 200 }}
          />
          <Text type="secondary" style={{ fontSize: 11 }}>
            ค่า default: {targetPlan.jobQuota >= 999 ? "ไม่จำกัด" : targetPlan.jobQuota}
          </Text>
        </Flex>
      </div>
    </Modal>
  );
}
