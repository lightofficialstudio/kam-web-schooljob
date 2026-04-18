"use client";

// ✨ Quota Alert Panel — โรงเรียนที่ใช้ quota ใกล้เต็ม (Feature 2) + Upsell Signal
import {
  ArrowRightOutlined,
  RiseOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Empty,
  Flex,
  Progress,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import { PackagePlanItem, SchoolPackageItem, usePackageStore } from "../_state/package-store";

const { Text } = Typography;

interface Props {
  plans: PackagePlanItem[];
  onChangePlan: (school: SchoolPackageItem, targetPlan: PackagePlanItem) => void;
  onViewDetail: (schoolId: string) => void;
}

export function QuotaAlertPanel({ plans, onChangePlan, onViewDetail }: Props) {
  const { token } = theme.useToken();
  const { schools, isLoading } = usePackageStore();

  // ✨ โรงเรียนที่ใช้ quota เกิน warning threshold ของ plan ตัวเอง
  const alertSchools = schools
    .filter((s) => {
      const planDef = plans.find((p) => p.plan === s.accountPlan);
      const threshold = planDef?.quotaWarningThreshold ?? 80;
      return s.quotaUsagePercent >= threshold;
    })
    .sort((a, b) => b.quotaUsagePercent - a.quotaUsagePercent)
    .slice(0, 8);

  if (!isLoading && alertSchools.length === 0) return null;

  const getUpgradePlan = (school: SchoolPackageItem) => {
    const planDef = plans.find((p) => p.plan === school.accountPlan);
    const upgradeKey = planDef?.upgradeTarget;
    return upgradeKey ? plans.find((p) => p.plan === upgradeKey) ?? null : null;
  };

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: 16,
        marginBottom: 24,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        border: `1px solid ${token.colorWarningBorder}`,
        background: token.colorWarningBg,
      }}
      title={
        <Flex align="center" gap={8}>
          <WarningOutlined style={{ color: token.colorWarning, fontSize: 15 }} />
          <Text strong style={{ color: token.colorWarning }}>
            Quota Alert — {alertSchools.length} โรงเรียนใกล้เต็ม
          </Text>
          <Tag color="orange" style={{ fontSize: 10, borderRadius: 20, marginLeft: 4 }}>
            Upsell Opportunity
          </Tag>
        </Flex>
      }
      extra={
        <Flex align="center" gap={4}>
          <RiseOutlined style={{ color: token.colorWarning, fontSize: 12 }} />
          <Text type="secondary" style={{ fontSize: 12 }}>ควร Upgrade เพื่อรักษา Revenue</Text>
        </Flex>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
        {alertSchools.map((school) => {
          const planDef = plans.find((p) => p.plan === school.accountPlan);
          const upgradePlan = getUpgradePlan(school);
          const pct = school.quotaUsagePercent;
          const isFull = pct >= 100;
          const barColor = isFull ? token.colorError : token.colorWarning;

          return (
            <div
              key={school.id}
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: token.colorBgContainer,
                border: `1px solid ${barColor}40`,
                cursor: "pointer",
                transition: "box-shadow 0.15s",
              }}
              onClick={() => onViewDetail(school.id)}
            >
              <Flex gap={10} align="flex-start">
                <Avatar
                  src={school.logoUrl ?? undefined}
                  size={34}
                  style={{ flexShrink: 0, border: `1px solid ${token.colorBorderSecondary}` }}
                >
                  {school.schoolName[0]}
                </Avatar>
                <Flex vertical gap={4} style={{ flex: 1, minWidth: 0 }}>
                  <Flex justify="space-between" align="center" gap={4}>
                    <Text strong style={{ fontSize: 12 }} ellipsis>{school.schoolName}</Text>
                    {isFull && (
                      <Tag color="error" style={{ fontSize: 10, padding: "0 6px", borderRadius: 20, flexShrink: 0 }}>เต็ม</Tag>
                    )}
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <Text type="secondary" style={{ fontSize: 10 }}>
                      {school.activeJobCount}/{school.jobQuotaMax >= 999 ? "∞" : school.jobQuotaMax} งาน
                    </Text>
                    <Text strong style={{ fontSize: 11, color: barColor }}>{pct}%</Text>
                  </Flex>

                  <Progress
                    percent={pct}
                    showInfo={false}
                    size="small"
                    strokeColor={barColor}
                    railColor={token.colorFillSecondary}
                  />

                  {/* ✨ Plan + Upgrade CTA */}
                  <Flex justify="space-between" align="center" style={{ marginTop: 2 }}>
                    <Tag
                      style={{
                        fontSize: 10,
                        padding: "0 6px",
                        borderRadius: 20,
                        border: `1px solid ${planDef?.color ?? token.colorBorder}`,
                        color: planDef?.color ?? token.colorTextSecondary,
                        background: `${planDef?.color ?? "#000"}12`,
                        margin: 0,
                      }}
                    >
                      {planDef?.label ?? school.accountPlan}
                    </Tag>
                    {upgradePlan && (
                      <Tooltip title={`Upgrade เป็น ${upgradePlan.label}`}>
                        <Button
                          size="small"
                          type="link"
                          icon={<ArrowRightOutlined />}
                          style={{ fontSize: 10, padding: "0 4px", height: 20, color: upgradePlan.color }}
                          onClick={(e) => { e.stopPropagation(); onChangePlan(school, upgradePlan); }}
                        >
                          {upgradePlan.label}
                        </Button>
                      </Tooltip>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
