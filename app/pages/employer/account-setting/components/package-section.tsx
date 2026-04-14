"use client";

// ✨ Section แพ็คเกจ — แสดงแผนปัจจุบัน, quota, ตาราง plan, CTA upgrade
import {
  PACKAGE_DEFINITIONS,
  PLAN_LIST,
  PlanType,
} from "@/app/api/v1/admin/packages/validation/package-schema";
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
import axios from "axios";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

// ✨ ข้อมูล Package ที่ได้จาก API
interface PackageData {
  plan: PlanType;
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

// ✨ สร้าง PLAN_TABLE จาก PACKAGE_DEFINITIONS — Admin แก้ที่เดียว กระทบทุกที่
const PLAN_TABLE = PLAN_LIST.map((key) => {
  const def = PACKAGE_DEFINITIONS[key];
  return { key, ...def };
});

// ✨ icon ตาม badgeIcon — ค่ามาจาก PACKAGE_DEFINITIONS (Admin config)
const PlanIcon = ({ badgeIcon, color, size = 18 }: { badgeIcon: "default" | "thunder" | "crown"; color: string; size?: number }) => {
  if (badgeIcon === "crown") return <CrownOutlined style={{ color, fontSize: size }} />;
  if (badgeIcon === "thunder") return <ThunderboltOutlined style={{ color, fontSize: size }} />;
  return <CheckCircleOutlined style={{ color, fontSize: size }} />;
};

// ✨ SectionCard — Card พร้อม top accent bar (ดู dark mode ด้วย token)
const SectionCard: React.FC<{ children: React.ReactNode; accentColor: string }> = ({ children, accentColor }) => (
  <Card
    variant="borderless"
    style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    styles={{ body: { padding: 0 } }}
  >
    <div style={{ height: 4, background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}55 100%)` }} />
    <div style={{ padding: "28px 28px 24px" }}>{children}</div>
  </Card>
);

// ✨ SectionHeader — flex icon pill + title/desc
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
          width: 48, height: 48, borderRadius: 14,
          background: token.colorFillTertiary,
          border: `1.5px solid ${token.colorBorderSecondary}`,
          color, fontSize: 20, flexShrink: 0,
        }}
      >
        {icon}
      </Flex>
      <Flex vertical gap={2}>
        <Title level={4} style={{ margin: 0 }}>{title}</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>{desc}</Text>
      </Flex>
    </Flex>
  );
};

// ✨ คืนสี Progress bar ตาม quota usage
const getProgressStatus = (isAtLimit: boolean, isNearLimit: boolean): "exception" | "active" | "normal" => {
  if (isAtLimit) return "exception";
  if (isNearLimit) return "active";
  return "normal";
};

const getProgressStrokeColor = (isAtLimit: boolean, isNearLimit: boolean, token: ReturnType<typeof theme.useToken>["token"]) => {
  if (isAtLimit) return token.colorError;
  if (isNearLimit) return token.colorWarning;
  return token.colorSuccess;
};

// ─────────────────────────────────────────────
// ✨ Main Component
// ─────────────────────────────────────────────
export default function PackageSection({ userId }: { userId: string }) {
  const { token } = theme.useToken();
  const [data, setData] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);

  // ✨ ดึงข้อมูล Package จาก API
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios
      .get(`/api/v1/employer/package/read?user_id=${userId}`)
      .then((res) => {
        if (res.data?.data) setData(res.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  // ✨ Skeleton ขณะโหลด
  if (loading) {
    return (
      <SectionCard accentColor="#722ed1">
        <Skeleton active paragraph={{ rows: 6 }} />
      </SectionCard>
    );
  }

  if (!data) {
    return (
      <SectionCard accentColor="#722ed1">
        <Alert type="error" message="ไม่สามารถโหลดข้อมูลแพ็คเกจได้ กรุณาลองใหม่" showIcon />
      </SectionCard>
    );
  }

  const currentPlanDef = PLAN_TABLE.find((p) => p.key === data.plan) ?? PLAN_TABLE[0];
  const progressStatus = getProgressStatus(data.isAtLimit, data.isNearLimit);
  const progressStroke = getProgressStrokeColor(data.isAtLimit, data.isNearLimit, token);
  const isEnterprise = data.plan === "enterprise";

  return (
    <Flex vertical gap={20}>

      {/* ─── 1. Current plan card ─── */}
      <SectionCard accentColor={data.planColor}>
        <SectionHeader
          icon={<PlanIcon badgeIcon={currentPlanDef.badgeIcon} color={data.planColor} />}
          title="แพ็คเกจปัจจุบัน"
          desc="แผนที่โรงเรียนของคุณใช้อยู่ในขณะนี้"
          color={data.planColor}
        />

        <Flex align="flex-start" gap={24} wrap="wrap">
          {/* ✨ Badge + ราคา */}
          <Flex vertical gap={8} style={{ minWidth: 160 }}>
            <Flex align="center" gap={10}>
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
                <PlanIcon badgeIcon={currentPlanDef.badgeIcon} color={data.planColor} size={15} />
                <Text style={{ color: data.planColor, fontWeight: 700, fontSize: 15 }}>
                  {data.planLabel}
                </Text>
              </div>
            </Flex>
            <Flex align="baseline" gap={4}>
              <Title level={2} style={{ margin: 0, color: data.planColor }}>
                {data.planPrice === 0 ? "ฟรี" : `฿${data.planPrice.toLocaleString()}`}
              </Title>
              {data.planPrice > 0 && (
                <Text type="secondary" style={{ fontSize: 13 }}>/เดือน</Text>
              )}
            </Flex>
          </Flex>

          {/* ✨ Features list */}
          <Flex vertical gap={8} style={{ flex: 1, minWidth: 200 }}>
            <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              สิทธิ์ที่ได้รับ
            </Text>
            {data.planFeatures.map((f) => (
              <Flex key={f} align="center" gap={8}>
                <CheckCircleOutlined style={{ color: data.planColor, fontSize: 13, flexShrink: 0 }} />
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
              <Text strong style={{ fontSize: 22, color: progressStroke }}>{data.jobQuotaUsed}</Text>
              <Text type="secondary"> / {data.jobQuotaMax === 999 ? "ไม่จำกัด" : data.jobQuotaMax} ตำแหน่ง</Text>
            </Text>
            <Tag
              color={data.isAtLimit ? "error" : data.isNearLimit ? "warning" : "success"}
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              {data.quotaUsagePercent}%
            </Tag>
          </Flex>

          <Progress
            percent={data.jobQuotaMax === 999 ? Math.min(data.jobQuotaUsed, 100) : data.quotaUsagePercent}
            status={progressStatus}
            strokeColor={progressStroke}
            trailColor={token.colorFillSecondary}
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

      {/* ─── 3. Plan comparison table ─── */}
      <SectionCard accentColor="#722ed1">
        <SectionHeader
          icon={<CrownOutlined />}
          title="เปรียบเทียบแผน"
          desc="ดูความแตกต่างของแต่ละแผนและเลือกที่เหมาะกับโรงเรียนของคุณ"
          color="#722ed1"
        />

        <Row gutter={[16, 16]}>
          {PLAN_TABLE.map((plan) => {
            const isCurrent = plan.key === data.plan;
            // ✨ ระบุว่า plan นี้ tier ต่ำกว่า current หรือไม่ — ใช้ index จาก PLAN_LIST
            const isLower = PLAN_LIST.indexOf(plan.key as PlanType) < PLAN_LIST.indexOf(data.plan);

            return (
              <Col key={plan.key} xs={24} sm={8}>
                <div
                  style={{
                    borderRadius: 14,
                    border: `2px solid ${isCurrent ? plan.color : token.colorBorderSecondary}`,
                    background: isCurrent ? `${plan.color}0a` : token.colorBgContainer,
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
                    {/* Plan name */}
                    <Flex align="center" gap={8}>
                      <PlanIcon badgeIcon={plan.badgeIcon} color={plan.color} size={16} />
                      <Text style={{ fontWeight: 700, fontSize: 16, color: plan.color }}>
                        {plan.label}
                      </Text>
                    </Flex>

                    {/* ราคา */}
                    <Flex align="baseline" gap={4}>
                      <Text style={{ fontSize: 22, fontWeight: 800, color: isCurrent ? plan.color : token.colorText }}>
                        {plan.price === 0 ? "ฟรี" : `฿${plan.price.toLocaleString()}`}
                      </Text>
                      {plan.price > 0 && (
                        <Text type="secondary" style={{ fontSize: 12 }}>/เดือน</Text>
                      )}
                    </Flex>

                    {/* Quota */}
                    <Tag
                      color={isCurrent ? plan.color : "default"}
                      style={{ fontSize: 12, fontWeight: 600, alignSelf: "flex-start" }}
                    >
                      {plan.quota === 999 ? "ไม่จำกัดตำแหน่ง" : `${plan.quota} ตำแหน่ง`}
                    </Tag>

                    {/* Features */}
                    <Flex vertical gap={6}>
                      {plan.features.map((f) => (
                        <Flex key={f} align="flex-start" gap={7}>
                          <CheckCircleOutlined
                            style={{
                              color: isCurrent ? plan.color : token.colorTextTertiary,
                              fontSize: 12,
                              marginTop: 3,
                              flexShrink: 0,
                            }}
                          />
                          <Text style={{ fontSize: 12, color: isLower ? token.colorTextTertiary : token.colorText }}>
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

      {/* ─── 4. Upgrade CTA ─── */}
      <SectionCard accentColor={isEnterprise ? token.colorSuccess : "#11b6f5"}>
        <SectionHeader
          icon={isEnterprise ? <CheckCircleOutlined /> : <CrownOutlined />}
          title={isEnterprise ? "คุณอยู่ในแผนสูงสุดแล้ว" : "อัปเกรดแผน"}
          desc={
            isEnterprise
              ? "ขอบคุณที่ไว้วางใจเรา — คุณได้รับสิทธิ์ทุกอย่างครบถ้วนแล้ว"
              : "ติดต่อทีมงานเพื่ออัปเกรดแผน หรือรอ Payment Gateway ที่กำลังพัฒนา"
          }
          color={isEnterprise ? token.colorSuccess : "#11b6f5"}
        />

        {isEnterprise ? (
          <Alert
            type="success"
            showIcon
            icon={<CrownOutlined />}
            message="Enterprise Plan — แผนสูงสุด"
            description="คุณได้รับสิทธิ์ทุกอย่างครบถ้วน รวมถึง API Access, Custom branding และ Dedicated support"
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
                onClick={() => window.open("mailto:support@kamschool.co.th?subject=ขอข้อมูลอัปเกรดแผน", "_blank")}
              >
                ติดต่อทีมงาน
              </Button>
              <Flex align="center" gap={8}>
                <Tag color="processing" icon={<ThunderboltOutlined />} style={{ fontSize: 12, height: 32, display: "flex", alignItems: "center" }}>
                  Payment Gateway — เร็วๆ นี้
                </Tag>
              </Flex>
            </Flex>
          </Flex>
        )}
      </SectionCard>

      {/* ─── 5. Usage history placeholder ─── */}
      <SectionCard accentColor={token.colorTextQuaternary}>
        <Flex align="center" gap={16}>
          <Flex
            align="center"
            justify="center"
            style={{
              width: 48, height: 48, borderRadius: 14,
              background: token.colorFillTertiary,
              border: `1.5px solid ${token.colorBorderSecondary}`,
              color: token.colorTextSecondary,
              fontSize: 20, flexShrink: 0,
            }}
          >
            <ThunderboltOutlined />
          </Flex>
          <Flex vertical gap={4} style={{ flex: 1 }}>
            <Flex align="center" gap={8}>
              <Text strong style={{ fontSize: 15 }}>ประวัติการชำระเงิน</Text>
              <Tag color="processing" style={{ fontSize: 11 }}>เร็วๆ นี้</Tag>
            </Flex>
            <Text type="secondary" style={{ fontSize: 13 }}>
              กำลังพัฒนา — รองรับ Payment Gateway ในอนาคต
            </Text>
          </Flex>
        </Flex>
      </SectionCard>

    </Flex>
  );
}
