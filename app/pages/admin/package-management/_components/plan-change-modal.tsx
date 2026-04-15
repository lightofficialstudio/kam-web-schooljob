"use client";

// ✨ Modal ยืนยันการเปลี่ยน Package — แสดง feature ก่อนหลังชัดเจน (Dynamic Plans)
import { CheckCircleFilled, SwapRightOutlined } from "@ant-design/icons";
import {
  Col,
  Flex,
  InputNumber,
  Modal,
  Row,
  Tag,
  theme,
  Typography,
} from "antd";
import { useState } from "react";
import { PackagePlanItem, SchoolPackageItem } from "../_state/package-store";

const { Text } = Typography;

interface PlanChangeModalProps {
  school: SchoolPackageItem | null;
  targetPlan: PackagePlanItem | null;
  currentPlanDef: PackagePlanItem | null;
  open: boolean;
  isUpdating: boolean;
  onConfirm: (jobQuotaMax: number) => void;
  onCancel: () => void;
}

export const PlanChangeModal: React.FC<PlanChangeModalProps> = ({
  school,
  targetPlan,
  currentPlanDef,
  open,
  isUpdating,
  onConfirm,
  onCancel,
}) => {
  const { token } = theme.useToken();
  const [customQuota, setCustomQuota] = useState<number | null>(null);

  if (!school || !targetPlan) return null;

  const fromDef = currentPlanDef;
  const toDef = targetPlan;
  const finalQuota = customQuota ?? toDef.jobQuota;

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
      title={
        <Flex align="center" gap={10}>
          <SwapRightOutlined style={{ color: token.colorPrimary, fontSize: 18 }} />
          <span>เปลี่ยน Package</span>
        </Flex>
      }
      okText="ยืนยันการเปลี่ยน"
      cancelText="ยกเลิก"
      onOk={handleConfirm}
      onCancel={handleCancel}
      confirmLoading={isUpdating}
      width={520}
    >
      {/* ─── โรงเรียน ─── */}
      <div
        style={{
          padding: "12px 16px",
          borderRadius: 10,
          background: token.colorFillQuaternary,
          border: `1px solid ${token.colorBorderSecondary}`,
          marginBottom: 20,
        }}
      >
        <Text strong style={{ fontSize: 15 }}>
          {school.schoolName}
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: 12 }}>
          {school.owner.email}
        </Text>
      </div>

      {/* ─── Before → After ─── */}
      <Row gutter={8} align="middle" style={{ marginBottom: 20 }}>
        {/* ─── Plan ปัจจุบัน ─── */}
        <Col flex={1}>
          <Flex
            vertical
            align="center"
            gap={6}
            style={{
              padding: "16px 12px",
              borderRadius: 12,
              background: token.colorFillTertiary,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            {fromDef ? (
              <>
                <Tag color={fromDef.color} style={{ margin: 0, fontWeight: 700 }}>
                  {fromDef.label}
                </Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {fromDef.jobQuota >= 999 ? "ไม่จำกัด" : `${fromDef.jobQuota} งาน`}
                </Text>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {fromDef.price === 0 ? "ฟรี" : `฿${fromDef.price.toLocaleString()}/เดือน`}
                </Text>
              </>
            ) : (
              <Tag style={{ margin: 0 }}>{school.accountPlan}</Tag>
            )}
          </Flex>
        </Col>

        <Col>
          <SwapRightOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
        </Col>

        {/* ─── Plan ใหม่ ─── */}
        <Col flex={1}>
          <Flex
            vertical
            align="center"
            gap={6}
            style={{
              padding: "16px 12px",
              borderRadius: 12,
              background: `${toDef.color}12`,
              border: `2px solid ${toDef.color}`,
            }}
          >
            <Tag color={toDef.color} style={{ margin: 0, fontWeight: 700 }}>
              {toDef.label}
            </Tag>
            <Text style={{ fontSize: 12, color: toDef.color, fontWeight: 600 }}>
              {toDef.jobQuota >= 999 ? "ไม่จำกัด" : `${toDef.jobQuota} งาน`}
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {toDef.price === 0 ? "ฟรี" : `฿${toDef.price.toLocaleString()}/เดือน`}
            </Text>
          </Flex>
        </Col>
      </Row>

      {/* ─── Features ของ Plan ใหม่ ─── */}
      <div style={{ marginBottom: 20 }}>
        <Text
          type="secondary"
          style={{ fontSize: 12, display: "block", marginBottom: 8 }}
        >
          สิทธิ์ที่จะได้รับ
        </Text>
        <Flex vertical gap={4}>
          {toDef.features.map((f) => (
            <Flex key={f} align="center" gap={8}>
              <CheckCircleFilled style={{ color: "#52c41a", fontSize: 13 }} />
              <Text style={{ fontSize: 13 }}>{f}</Text>
            </Flex>
          ))}
        </Flex>
      </div>

      {/* ─── Custom Quota Override ─── */}
      <div
        style={{
          padding: "12px 16px",
          borderRadius: 10,
          background: token.colorInfoBg,
          border: `1px solid ${token.colorInfoBorder}`,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: token.colorInfoText,
            display: "block",
            marginBottom: 8,
          }}
        >
          Job Quota (ปรับได้ตามต้องการ — ค่าเริ่มต้นตาม Plan)
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
          <Text type="secondary" style={{ fontSize: 12 }}>
            ค่าเริ่มต้น:{" "}
            {toDef.jobQuota >= 999 ? "ไม่จำกัด (999)" : toDef.jobQuota}
          </Text>
        </Flex>
      </div>
    </Modal>
  );
};
