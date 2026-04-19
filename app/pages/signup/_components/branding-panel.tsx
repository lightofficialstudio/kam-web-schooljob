"use client";

import { Col, Flex, Typography, theme as antTheme } from "antd";
import { useSignupStore } from "../_state/signup-store";

const { Title, Text } = Typography;

// ✨ ขั้นตอนการสมัคร — เพิ่มได้ที่นี่
const STEPS = [
  { step: 1, label: "ขั้นตอนที่ 1", title: "เลือกประเภท" },
  { step: 2, label: "ขั้นตอนที่ 2", title: "กรอกข้อมูล" },
  { step: 3, label: "ขั้นตอนที่ 3", title: "เสร็จสมบูรณ์" },
] as const;

// ✨ แผงซ้าย — gradient + step indicator แทน features list
export const BrandingPanel = () => {
  const { token } = antTheme.useToken();
  const { step: currentStep } = useSignupStore();

  return (
    <Col
      xs={0}
      md={9}
      style={{
        background:
          "linear-gradient(160deg, #0d8fd4 0%, #11b6f5 55%, #5dd5fb 100%)",
        padding: "48px 36px",
        position: "relative",
        overflow: "hidden",
        minHeight: 520,
      }}
    >
      {/* ✨ decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: -70,
          right: -70,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.09)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
          pointerEvents: "none",
        }}
      />
      {/* ✨ dot grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.09) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          pointerEvents: "none",
        }}
      />

      <Flex
        vertical
        justify="space-between"
        style={{ height: "100%", position: "relative", zIndex: 1 }}
        gap={40}
      >
        {/* ✨ Logo + Brand */}
        <Flex vertical gap={20} className="signup-branding-top">
          <Flex
            align="center"
            justify="center"
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: "rgba(255,255,255,0.22)",
              backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(255,255,255,0.35)",
            }}
          >
            <Title level={3} style={{ margin: 0, color: "#fff" }}>
              S
            </Title>
          </Flex>

          <Flex vertical gap={8}>
            <Title
              level={2}
              style={{ margin: 0, color: "#fff", lineHeight: 1.3 }}
            >
              ก้าวสู่ <br /> อนาคตใหม่
            </Title>
            <Text
              style={{
                color: "#fff",
                opacity: 0.82,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              แพลตฟอร์มที่เชื่อมต่อครูคุณภาพ <br />
              กับสถานศึกษาชั้นนำทั่วประเทศ
            </Text>
          </Flex>
        </Flex>

        {/* ✨ Step indicators */}
        <Flex vertical gap={0} className="signup-branding-steps">
          {STEPS.map((s, i) => {
            const isActive = currentStep === s.step;
            const isDone = currentStep > s.step;
            const isLast = i === STEPS.length - 1;

            return (
              <div key={s.step}>
                <Flex align="center" gap={16}>
                  {/* ✨ circle + connector */}
                  <Flex vertical align="center" style={{ flexShrink: 0 }}>
                    {/* ✨ circle number */}
                    <Flex
                      align="center"
                      justify="center"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: isActive || isDone ? "#fff" : "transparent",
                        border:
                          isActive || isDone
                            ? "none"
                            : "2px solid rgba(255,255,255,0.45)",
                        transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                        boxShadow: isActive
                          ? "0 4px 16px rgba(0,0,0,0.18)"
                          : "none",
                      }}
                    >
                      {isDone ? (
                        // ✨ checkmark เมื่อผ่านแล้ว
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M3 8.5L6.5 12L13 5"
                            stroke="#11b6f5"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <Text
                          strong
                          style={{
                            fontSize: 14,
                            color: isActive
                              ? "#11b6f5"
                              : "rgba(255,255,255,0.6)",
                            lineHeight: 1,
                          }}
                        >
                          {s.step}
                        </Text>
                      )}
                    </Flex>

                    {/* ✨ connector line ระหว่าง step */}
                    {!isLast && (
                      <div
                        style={{
                          width: 2,
                          height: 32,
                          marginTop: 4,
                          marginBottom: 4,
                          borderRadius: 99,
                          background: isDone
                            ? "rgba(255,255,255,0.75)"
                            : "rgba(255,255,255,0.2)",
                          transition: "background 0.4s ease",
                        }}
                      />
                    )}
                  </Flex>

                  {/* ✨ text */}
                  <Flex
                    vertical
                    gap={1}
                    style={{ paddingBottom: isLast ? 0 : 36 }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: isActive
                          ? "rgba(255,255,255,0.65)"
                          : "rgba(255,255,255,0.35)",
                        transition: "color 0.3s",
                      }}
                    >
                      {s.label}
                    </Text>
                    <Text
                      strong
                      style={{
                        fontSize: 15,
                        color:
                          isActive || isDone
                            ? "#fff"
                            : "rgba(255,255,255,0.45)",
                        letterSpacing: "0.01em",
                        transition: "color 0.3s",
                      }}
                    >
                      {s.title}
                    </Text>
                  </Flex>
                </Flex>
              </div>
            );
          })}
        </Flex>

        {/* ✨ Footer */}
        <Text
          className="signup-branding-bottom"
          style={{ color: "#fff", opacity: 0.4, fontSize: 12 }}
        >
          © {new Date().getFullYear()} School Job Board
        </Text>
      </Flex>
    </Col>
  );
};
