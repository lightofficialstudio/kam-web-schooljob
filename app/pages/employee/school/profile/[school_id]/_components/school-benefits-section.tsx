"use client";

import { CheckCircleFilled, GiftOutlined, StarFilled } from "@ant-design/icons";
import { Card, Flex, Tag, Typography, theme as antTheme } from "antd";
import type { SchoolProfileDetail } from "../_api/school-profile-api";

const { Title, Text } = Typography;

interface SchoolBenefitsSectionProps {
  benefits: SchoolProfileDetail["benefits"];
}

// ✨ สีวนรอบ 3 โทน — primary / success / warning (ไม่ hardcode hex)
const BENEFIT_ACCENT_COLORS = [
  { bg: "colorPrimaryBg", text: "colorPrimary" },
  { bg: "colorSuccessBg", text: "colorSuccess" },
  { bg: "colorWarningBg", text: "colorWarning" },
] as const;

// ✨ แสดงสวัสดิการที่โรงเรียนมีให้ — 1 column list
export const SchoolBenefitsSection = ({
  benefits,
}: SchoolBenefitsSectionProps) => {
  const { token } = antTheme.useToken();

  if (!benefits.length) return null;

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: token.borderRadiusLG * 2,
        backgroundColor: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        overflow: "hidden",
      }}
      styles={{ body: { padding: 0 } }}
    >
      {/* ✨ Header gradient banner */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 60%, #5dd5fb 100%)",
          padding: "28px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* dot grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.12) 1px, transparent 0)",
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }}
        />
        {/* glow blob */}
        <div
          style={{
            position: "absolute",
            top: "-40%",
            right: "-5%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <Flex
          align="center"
          gap={14}
          style={{ position: "relative", zIndex: 1 }}
        >
          <Flex
            align="center"
            justify="center"
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "rgba(255,255,255,0.2)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              backdropFilter: "blur(8px)",
              flexShrink: 0,
            }}
          >
            <GiftOutlined style={{ fontSize: 22, color: "#fff" }} />
          </Flex>

          <Flex vertical gap={2}>
            <Title
              level={4}
              style={{
                margin: 0,
                color: "#fff",
                fontWeight: 800,
                letterSpacing: "-0.3px",
              }}
            >
              สวัสดิการและจุดเด่น
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
              {benefits.length} รายการสวัสดิการ
            </Text>
          </Flex>

          <Tag
            icon={<StarFilled style={{ fontSize: 10 }} />}
            style={{
              marginLeft: "auto",
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.35)",
              color: "#fff",
              borderRadius: 100,
              padding: "4px 14px",
              fontSize: 12,
              fontWeight: 600,
              backdropFilter: "blur(8px)",
            }}
          >
            {benefits.length} สิทธิ์
          </Tag>
        </Flex>
      </div>

      {/* ✨ Benefits list — 1 column พร้อม divider ระหว่างแถว */}
      <div style={{ padding: "8px 24px 24px" }}>
        <Flex vertical gap={0}>
          {benefits.map((benefit, i) => {
            const accent =
              BENEFIT_ACCENT_COLORS[i % BENEFIT_ACCENT_COLORS.length];
            const bgColor = token[accent.bg as keyof typeof token] as string;
            const textColor = token[
              accent.text as keyof typeof token
            ] as string;
            const isLast = i === benefits.length - 1;

            return (
              <div key={i}>
                {/* ✨ แถวสวัสดิการ */}
                <Flex
                  align="center"
                  gap={16}
                  style={{
                    padding: "16px 12px",
                    borderRadius: token.borderRadius,
                    transition: "background 0.18s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      token.colorBgLayout;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "transparent";
                  }}
                >
                  {/* ✨ icon พร้อมป้ายเลขลำดับ */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <Flex
                      align="center"
                      justify="center"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: bgColor,
                      }}
                    >
                      <CheckCircleFilled
                        style={{ fontSize: 18, color: textColor }}
                      />
                    </Flex>
                    {/* ✨ เลขลำดับมุมขวาล่าง */}
                    <span
                      style={{
                        position: "absolute",
                        bottom: -4,
                        right: -4,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: textColor,
                        color: "#fff",
                        fontSize: 9,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `2px solid ${token.colorBgContainer}`,
                        lineHeight: 1,
                      }}
                    >
                      {i + 1}
                    </span>
                  </div>

                  {/* ✨ ข้อความสวัสดิการ */}
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 15,
                      fontWeight: 600,
                      color: token.colorText,
                      lineHeight: 1.4,
                    }}
                  >
                    {benefit}
                  </Text>

                  {/* ✨ accent bar ขวาสุด */}
                  <div
                    style={{
                      width: 4,
                      height: 28,
                      borderRadius: 99,
                      backgroundColor: bgColor,
                      flexShrink: 0,
                    }}
                  />
                </Flex>

                {/* ✨ divider — ไม่แสดงแถวสุดท้าย */}
                {!isLast && (
                  <div
                    style={{
                      height: 1,
                      background: token.colorBorderSecondary,
                      margin: "0 12px",
                    }}
                  />
                )}
              </div>
            );
          })}
        </Flex>
      </div>
    </Card>
  );
};
