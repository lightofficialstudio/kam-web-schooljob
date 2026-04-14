"use client";

import { EnvironmentOutlined, UserOutlined } from "@ant-design/icons";
import {
  Badge,
  Card,
  Divider,
  Flex,
  Progress,
  Space,
  Spin,
  Tag,
  Typography,
  theme,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/stores/auth-store";

const { Title, Text, Paragraph } = Typography;

// ✨ ข้อมูล Account Plan จาก API
interface PlanInfo {
  account_plan: string;
  job_quota_max: number;
  job_used: number;
  job_remaining: number;
}

// ✨ แมป plan name → ชื่อแสดงผลและสี Tag
const PLAN_DISPLAY: Record<string, { label: string; color: string }> = {
  basic: { label: "Basic", color: "default" },
  premium: { label: "Premium", color: "gold" },
  enterprise: { label: "Enterprise", color: "blue" },
};

interface JobTipsSidebarProps {
  isEdit?: boolean;
}

// ✨ Sidebar สำหรับแสดงคำแนะนำการลงประกาศ และสถานะบัญชีจริงจาก DB
export const JobTipsSidebar = ({ isEdit = false }: JobTipsSidebarProps) => {
  const { token } = theme.useToken();
  const { user } = useAuthStore();

  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  // ✨ ดึงข้อมูล Plan + Quota จาก API
  useEffect(() => {
    if (!user?.user_id) return;
    setIsLoadingPlan(true);
    axios
      .get<{ status_code: number; data: PlanInfo }>(
        `/api/v1/employer/organization/plan?user_id=${user.user_id}`,
      )
      .then((res) => {
        if (res.data.status_code === 200) {
          setPlanInfo(res.data.data);
        }
      })
      .catch((err) => console.error("❌ [JobTipsSidebar] ดึง plan ไม่สำเร็จ:", err))
      .finally(() => setIsLoadingPlan(false));
  }, [user?.user_id]);

  // ✨ คำนวณเปอร์เซ็นต์ที่ใช้ไป
  const usedPercent = planInfo
    ? Math.round((planInfo.job_used / planInfo.job_quota_max) * 100)
    : 0;

  // ✨ สีของ Progress bar ตามเปอร์เซ็นต์ที่ใช้
  const progressStatus =
    usedPercent >= 100 ? "exception" : usedPercent >= 80 ? "active" : "normal";

  const planDisplay = PLAN_DISPLAY[planInfo?.account_plan ?? "basic"] ?? PLAN_DISPLAY.basic;

  return (
    <Flex vertical gap={24} style={{ position: "sticky", top: 120 }}>
      {/* Rocket Card — แสดงเฉพาะตอนสร้างใหม่ */}
      {!isEdit && (
        <Card
          variant="borderless"
          style={{
            borderRadius: 24,
            background: "linear-gradient(135deg, #001e45 0%, #003370 100%)",
            overflow: "hidden",
          }}
        >
          <Flex vertical gap={8} style={{ padding: 10 }}>
            <Title level={4} style={{ color: token.colorWhite, margin: 0 }}>
              มาสร้างประกาศงานที่น่าสนใจกันเถอะ!
            </Title>
            <Paragraph
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 14,
                margin: 0,
              }}
            >
              การระบุรายละเอียดวิชาและระดับชั้นที่ชัดเจน
              จะช่วยให้คุณพบครูที่ตรงใจได้เร็วขึ้นถึง 2 เท่า
            </Paragraph>
          </Flex>
        </Card>
      )}

      {/* Tips Card */}
      <Card
        variant="borderless"
        style={{
          borderRadius: 16,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Flex vertical gap={24}>
          <Flex vertical gap={8}>
            <Title level={4} style={{ margin: 0 }}>
              เทคนิคการลงประกาศ
            </Title>
            <Text type="secondary">
              ทำตามคำแนะนำเพื่อดึงดูดผู้สมัครที่มีคุณภาพ
            </Text>
          </Flex>

          <Space align="start">
            <Flex
              align="center"
              justify="center"
              style={{
                padding: 8,
                borderRadius: 10,
                background: token.colorPrimaryBg,
                color: token.colorPrimary,
                flexShrink: 0,
              }}
            >
              <UserOutlined />
            </Flex>
            <Flex vertical gap={4}>
              <Text strong>ระบุตำแหน่งที่ชัดเจน</Text>
              <Text type="secondary" style={{ fontSize: 13 }}>
                เช่น "ครูสอนคณิตศาสตร์ (มัธยมปลาย)"
                จะได้รับความสนใจมากกว่าตำแหน่งทั่วไป
              </Text>
            </Flex>
          </Space>

          <Space align="start">
            <Flex
              align="center"
              justify="center"
              style={{
                padding: 8,
                borderRadius: 10,
                background: token.colorSuccessBg,
                color: token.colorSuccess,
                flexShrink: 0,
              }}
            >
              <EnvironmentOutlined />
            </Flex>
            <Flex vertical gap={4}>
              <Text strong>ข้อมูลสวัสดิการ</Text>
              <Text type="secondary" style={{ fontSize: 13 }}>
                การระบุสวัสดิการที่ชัดเจนช่วยให้คนตัดสินใจสมัครได้ง่ายขึ้น 2
                เท่า
              </Text>
            </Flex>
          </Space>

          <Divider style={{ margin: 0 }} />

          {/* ✨ สถานะบัตรสมาชิก — ดึงจาก DB จริง */}
          <Flex vertical gap={12}>
            <Text strong>สถานะบัตรสมาชิก</Text>
            {isLoadingPlan ? (
              <Flex align="center" gap={8}>
                <Spin size="small" />
                <Text type="secondary" style={{ fontSize: 12 }}>กำลังโหลด...</Text>
              </Flex>
            ) : (
              <>
                <Tag
                  color={planDisplay.color}
                  style={{
                    width: "fit-content",
                    padding: "4px 12px",
                    borderRadius: 8,
                    textTransform: "capitalize",
                  }}
                >
                  {planDisplay.label}
                </Tag>

                {planInfo && (
                  <Flex vertical gap={6}>
                    <Flex justify="space-between" align="center">
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        ประกาศที่ใช้ไป
                      </Text>
                      <Text style={{ fontSize: 12, fontWeight: 600 }}>
                        {planInfo.job_used} / {planInfo.job_quota_max}
                      </Text>
                    </Flex>
                    <Progress
                      percent={usedPercent}
                      size="small"
                      status={progressStatus}
                      showInfo={false}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        color:
                          planInfo.job_remaining === 0
                            ? token.colorError
                            : planInfo.job_remaining <= 1
                              ? token.colorWarning
                              : token.colorTextSecondary,
                      }}
                    >
                      {planInfo.job_remaining === 0
                        ? "ถึงขีดจำกัดแล้ว ติดต่อทีมงานเพื่ออัปเกรด"
                        : `ลงประกาศได้อีก ${planInfo.job_remaining} ตำแหน่ง`}
                    </Text>
                  </Flex>
                )}
              </>
            )}
          </Flex>

          <Space align="start">
            <Badge status="success" />
            <Text type="secondary" style={{ fontSize: 14 }}>
              เข้าถึงเครือข่ายครูคุณภาพทั่วประเทศ
            </Text>
          </Space>
          <Space align="start">
            <Badge status="success" />
            <Text type="secondary" style={{ fontSize: 14 }}>
              ระบบคัดกรองผู้สมัครอัตโนมัติ
            </Text>
          </Space>
        </Flex>
      </Card>
    </Flex>
  );
};
