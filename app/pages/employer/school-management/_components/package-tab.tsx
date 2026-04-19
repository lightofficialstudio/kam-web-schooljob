"use client";

// ✨ Tab แพ็คเกจ — แสดงแผนปัจจุบัน, quota, ตาราง plan เปรียบเทียบ, CTA upgrade
// ✨ Reuse pattern จาก account-setting/components/package-section.tsx
import {
  requestGetAllPlans,
  requestGetEmployerPackage,
} from "@/app/pages/employer/account-setting/_api/account-setting-api";
import {
  CheckCircleOutlined,
  CrownOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Skeleton,
  Tag,
  theme,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

// ✨ ข้อมูล Package ปัจจุบัน
interface PackageData {
  plan: string;
  planLabel: string;
  planColor: string;
  planPrice: number;
  planFeatures: string[];
  jobQuotaMax: number;
  jobQuotaUsed: number;
  jobQuotaRemaining: number;
  quotaUsagePercent: number;
  isAtLimit: boolean;
  isNearLimit: boolean;
}

// ✨ ข้อมูล Plan จาก Admin DB
interface PlanRow {
  plan: string;
  label: string;
  color: string;
  price: number;
  job_quota: number;
  features: string[];
  badge_icon: "default" | "crown" | "thunder";
  sort_order: number;
  is_active: boolean;
}

// ✨ icon ตาม badge_icon
const PlanIcon = ({
  badgeIcon,
  color,
  size = 18,
}: {
  badgeIcon: "default" | "crown" | "thunder";
  color: string;
  size?: number;
}) => {
  if (badgeIcon === "crown")
    return <CrownOutlined style={{ color, fontSize: size }} />;
  if (badgeIcon === "thunder")
    return <ThunderboltOutlined style={{ color, fontSize: size }} />;
  return <CheckCircleOutlined style={{ color, fontSize: size }} />;
};

// ✨ SectionCard — Card พร้อม top accent bar
const SectionCard: React.FC<{
  children: React.ReactNode;
  accentColor: string;
}> = ({ children, accentColor }) => (
  <Card
    variant="borderless"
    style={{
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }}
    styles={{ body: { padding: 0 } }}
  >
    <div
      style={{
        height: 4,
        background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}55 100%)`,
      }}
    />
    <div style={{ padding: "28px 28px 24px" }}>{children}</div>
  </Card>
);

// ✨ SectionHeader — icon pill + title/desc
const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}> = ({ icon, title, desc, color }) => {
  const { token } = theme.useToken();
  return (
    <Flex align="flex-start" gap={16} style={{ marginBottom: 28 }}>
      <Flex
        align="center"
        justify="center"
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: token.colorFillTertiary,
          border: `1.5px solid ${token.colorBorderSecondary}`,
          color,
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {icon}
      </Flex>
      <Flex vertical gap={2}>
        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {desc}
        </Text>
      </Flex>
    </Flex>
  );
};

const getProgressStatus = (
  isAtLimit: boolean,
  isNearLimit: boolean,
): "exception" | "active" | "normal" => {
  if (isAtLimit) return "exception";
  if (isNearLimit) return "active";
  return "normal";
};

const getProgressStroke = (
  isAtLimit: boolean,
  isNearLimit: boolean,
  token: ReturnType<typeof theme.useToken>["token"],
) => {
  if (isAtLimit) return token.colorError;
  if (isNearLimit) return token.colorWarning;
  return token.colorSuccess;
};

// ─────────────────────────────────────────────
export default function PackageTab({ userId }: { userId: string }) {
  const { token } = theme.useToken();
  const [data, setData] = useState<PackageData | null>(null);
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(true);

  // ✨ ดึงข้อมูล Package + Plan พร้อมกัน
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([requestGetEmployerPackage(userId), requestGetAllPlans()])
      .then(([pkgRes, plansRes]) => {
        if (pkgRes.data?.data) setData(pkgRes.data.data);
        if (Array.isArray(plansRes.data?.data)) {
          const sorted = [...plansRes.data.data].sort(
            (a: PlanRow, b: PlanRow) => a.sort_order - b.sort_order,
          );
          setPlans(sorted);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <SectionCard accentColor={token.colorPrimary}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </SectionCard>
    );
  }

  if (!data) {
    return (
      <SectionCard accentColor={token.colorPrimary}>
        <Alert
          type="error"
          showIcon
          message="ไม่สามารถโหลดข้อมูลแพ็คเกจได้ กรุณาลองใหม่"
        />
      </SectionCard>
    );
  }

  const progressStatus = getProgressStatus(data.isAtLimit, data.isNearLimit);
  const progressStroke = getProgressStroke(data.isAtLimit, data.isNearLimit, token);
  const currentPlan = plans.find((p) => p.plan === data.plan);
  const currentPlanIndex = plans.findIndex((p) => p.plan === data.plan);
  const isTopPlan =
    currentPlanIndex !== -1 && currentPlanIndex === plans.length - 1;

  return (
    <Flex vertical gap={20}>
      {/* ─── 1. Current plan card ─── */}
      <SectionCard accentColor={data.planColor}>
        <SectionHeader
          icon={
            <PlanIcon
              badgeIcon={currentPlan?.badge_icon ?? "default"}
              color={data.planColor}
            />
          }
          title="แพ็คเกจปัจจุบัน"
          desc="แผนที่โรงเรียนของคุณใช้อยู่ในขณะนี้"
          color={data.planColor}
        />

        <Flex align="flex-start" gap={24} wrap="wrap">
          {/* ✨ Badge + ราคา */}
          <Flex vertical gap={8} style={{ minWidth: 160 }}>
            <div
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                background: `${data.planColor}22`,
                border: `1.5px solid ${data.planColor}55`,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <PlanIcon
                badgeIcon={currentPlan?.badge_icon ?? "default"}
                color={data.planColor}
                size={15}
              />
              <Text
                style={{ color: data.planColor, fontWeight: 700, fontSize: 15 }}
              >
                {data.planLabel}
              </Text>
            </div>
            <Flex align="baseline" gap={4}>
              <Title level={2} style={{ margin: 0, color: data.planColor }}>
                {data.planPrice === 0
                  ? "ฟรี"
                  : `฿${data.planPrice.toLocaleString()}`}
              </Title>
              {data.planPrice > 0 && (
                <Text type="secondary" style={{ fontSize: 13 }}>
                  /เดือน
                </Text>
              )}
            </Flex>
          </Flex>

          {/* ✨ Features list */}
          <Flex vertical gap={8} style={{ flex: 1, minWidth: 200 }}>
            <Text
              type="secondary"
              style={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              สิทธิ์ที่ได้รับ
            </Text>
            {data.planFeatures.map((f) => (
              <Flex key={f} align="center" gap={8}>
                <CheckCircleOutlined
                  style={{
                    color: data.planColor,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                />
                <Text style={{ fontSize: 14 }}>{f}</Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </SectionCard>

      {/* ─── 2. Quota usage ─── */}
      <SectionCard accentColor={progressStroke}>
        <SectionHeader
          icon={<ThunderboltOutlined />}
          title="การใช้งาน Quota ประกาศงาน"
          desc="จำนวนประกาศงาน OPEN ที่ใช้งานอยู่เทียบกับ quota"
          color={progressStroke}
        />

        <Flex vertical gap={16}>
          <Flex justify="space-between" align="center">
            <Text style={{ fontSize: 15 }}>
              <Text strong style={{ fontSize: 22, color: progressStroke }}>
                {data.jobQuotaUsed}
              </Text>
              <Text type="secondary">
                {" "}
                /{" "}
                {data.jobQuotaMax === 999 ? "ไม่จำกัด" : data.jobQuotaMax}{" "}
                ตำแหน่ง
              </Text>
            </Text>
            <Tag
              color={
                data.isAtLimit
                  ? "error"
                  : data.isNearLimit
                    ? "warning"
                    : "success"
              }
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              {data.quotaUsagePercent}%
            </Tag>
          </Flex>

          <Progress
            percent={
              data.jobQuotaMax === 999
                ? Math.min(data.jobQuotaUsed, 100)
                : data.quotaUsagePercent
            }
            status={progressStatus}
            strokeColor={progressStroke}
            railColor={token.colorFillSecondary}
            strokeLinecap="round"
            size={{ height: 12 }}
          />

          <Text type="secondary" style={{ fontSize: 13 }}>
            {data.isAtLimit
              ? "คุณถึง quota สูงสุดแล้ว — ปิดงานเก่าหรืออัปเกรดแผนเพื่อประกาศงานเพิ่มเติม"
              : data.isNearLimit
                ? `เหลือ ${data.jobQuotaRemaining} ตำแหน่ง — ใกล้ถึง quota สูงสุด`
                : `เหลือ ${data.jobQuotaRemaining} ตำแหน่งจาก ${data.jobQuotaMax === 999 ? "ไม่จำกัด" : data.jobQuotaMax} ตำแหน่ง`}
          </Text>
        </Flex>
      </SectionCard>

      {/* ─── 3. Plan comparison ─── */}
      {plans.length > 0 && (
        <SectionCard accentColor={token.colorPrimary}>
          <SectionHeader
            icon={<CrownOutlined />}
            title="เปรียบเทียบแผน"
            desc="ดูความแตกต่างของแต่ละแผนและเลือกที่เหมาะกับโรงเรียนของคุณ"
            color={token.colorPrimary}
          />

          <Row gutter={[16, 16]}>
            {plans.map((plan, index) => {
              const isCurrent = plan.plan === data.plan;
              const isLower = index < currentPlanIndex;

              return (
                <Col
                  key={plan.plan}
                  xs={24}
                  sm={Math.max(8, Math.floor(24 / plans.length))}
                >
                  <div
                    style={{
                      borderRadius: 14,
                      border: `2px solid ${isCurrent ? plan.color : token.colorBorderSecondary}`,
                      background: isCurrent
                        ? `${plan.color}0a`
                        : token.colorBgContainer,
                      padding: "20px 18px",
                      opacity: isLower ? 0.5 : 1,
                      transition: "all 0.2s",
                      position: "relative",
                      height: "100%",
                    }}
                  >
                    {/* ✨ Badge current */}
                    {isCurrent && (
                      <div
                        style={{
                          position: "absolute",
                          top: -12,
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        <Tag
                          color={plan.color}
                          style={{ fontWeight: 700, fontSize: 11, border: "none" }}
                        >
                          แผนปัจจุบัน
                        </Tag>
                      </div>
                    )}

                    <Flex vertical gap={12}>
                      <Flex align="center" gap={8}>
                        <PlanIcon
                          badgeIcon={plan.badge_icon}
                          color={plan.color}
                          size={16}
                        />
                        <Text
                          style={{
                            fontWeight: 700,
                            fontSize: 16,
                            color: plan.color,
                          }}
                        >
                          {plan.label}
                        </Text>
                      </Flex>

                      <Flex align="baseline" gap={4}>
                        <Text
                          style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color: isCurrent ? plan.color : token.colorText,
                          }}
                        >
                          {plan.price === 0
                            ? "ฟรี"
                            : `฿${plan.price.toLocaleString()}`}
                        </Text>
                        {plan.price > 0 && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            /เดือน
                          </Text>
                        )}
                      </Flex>

                      <Tag
                        color={isCurrent ? plan.color : "default"}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          alignSelf: "flex-start",
                        }}
                      >
                        {plan.job_quota === 999
                          ? "ไม่จำกัดตำแหน่ง"
                          : `${plan.job_quota} ตำแหน่ง`}
                      </Tag>

                      <Flex vertical gap={6}>
                        {plan.features.map((f) => (
                          <Flex key={f} align="flex-start" gap={7}>
                            <CheckCircleOutlined
                              style={{
                                color: isCurrent
                                  ? plan.color
                                  : token.colorTextTertiary,
                                fontSize: 12,
                                marginTop: 3,
                                flexShrink: 0,
                              }}
                            />
                            <Text
                              style={{
                                fontSize: 12,
                                color: isLower
                                  ? token.colorTextTertiary
                                  : token.colorText,
                              }}
                            >
                              {f}
                            </Text>
                          </Flex>
                        ))}
                      </Flex>
                    </Flex>
                  </div>
                </Col>
              );
            })}
          </Row>
        </SectionCard>
      )}

      {/* ─── 4. Upgrade CTA ─── */}
      <SectionCard accentColor={isTopPlan ? token.colorSuccess : token.colorPrimary}>
        <SectionHeader
          icon={isTopPlan ? <CheckCircleOutlined /> : <CrownOutlined />}
          title={isTopPlan ? "คุณอยู่ในแผนสูงสุดแล้ว" : "อัปเกรดแผน"}
          desc={
            isTopPlan
              ? "ขอบคุณที่ไว้วางใจเรา — คุณได้รับสิทธิ์ทุกอย่างครบถ้วนแล้ว"
              : "ติดต่อทีมงานเพื่ออัปเกรดแผน หรือรอ Payment Gateway ที่กำลังพัฒนา"
          }
          color={isTopPlan ? token.colorSuccess : token.colorPrimary}
        />

        {isTopPlan ? (
          <Alert
            type="success"
            showIcon
            icon={<CrownOutlined />}
            message={`${data.planLabel} — แผนสูงสุด`}
            description="คุณได้รับสิทธิ์ทุกอย่างครบถ้วน รวมถึงทุก feature ที่ Admin กำหนด"
            style={{ borderRadius: 12 }}
          />
        ) : (
          <Flex vertical gap={16}>
            <Alert
              type="info"
              showIcon
              icon={<ThunderboltOutlined />}
              message="Payment Gateway กำลังพัฒนา"
              description="ระบบชำระเงินออนไลน์อยู่ระหว่างการพัฒนา — กรุณาติดต่อทีมงานโดยตรงเพื่ออัปเกรดแผน"
              style={{ borderRadius: 12 }}
            />
            <Flex gap={12} wrap="wrap">
              <Button
                type="primary"
                icon={<CrownOutlined />}
                size="large"
                style={{
                  height: 44,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 100%)",
                  border: "none",
                  fontWeight: 600,
                  minWidth: 180,
                }}
                onClick={() =>
                  window.open(
                    "mailto:support@kamschool.co.th?subject=ขอข้อมูลอัปเกรดแผน",
                    "_blank",
                  )
                }
              >
                ติดต่อทีมงาน
              </Button>
              <Tag
                color="processing"
                icon={<ThunderboltOutlined />}
                style={{
                  fontSize: 12,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Payment Gateway — เร็วๆ นี้
              </Tag>
            </Flex>
          </Flex>
        )}
      </SectionCard>
    </Flex>
  );
}
