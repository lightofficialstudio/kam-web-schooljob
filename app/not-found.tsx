"use client";

import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const { Title, Text, Paragraph } = Typography;

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: "40px 20px",
      }}
    >
      <Row
        justify="center"
        align="middle"
        gutter={[64, 0]}
        style={{ maxWidth: "1200px", width: "100%" }}
      >
        <Col xs={24} md={12} style={{ textAlign: "center" }}>
          {/* Illustration - Using a clean educational/teacher themed 404 illustration style */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <img
              src="https://illustrations.popsy.co/amber/falling.svg"
              alt="404 Not Found"
              style={{ width: "100%", height: "auto", marginBottom: "40px" }}
            />
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div style={{ textAlign: "left" }}>
            <Title
              style={{
                fontSize: "120px",
                margin: "0",
                lineHeight: "1",
                fontWeight: 900,
                background: "linear-gradient(45deg, #001e45 30%, #e60278 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                opacity: 0.1,
                position: "absolute",
                top: "-40px",
                left: "-20px",
                zIndex: 0,
              }}
            >
              404
            </Title>

            <div style={{ position: "relative", zIndex: 1 }}>
              <Title
                level={1}
                style={{
                  fontSize: "42px",
                  marginBottom: "16px",
                  fontWeight: 700,
                }}
              >
                อุ๊ปส์! ไม่พบหน้าที่คุณต้องการ
              </Title>
              <Paragraph
                style={{
                  fontSize: "18px",
                  color: "#666",
                  marginBottom: "32px",
                  maxWidth: "450px",
                }}
              >
                ดูเหมือนว่าบทเรียนหรือหน้าที่คุณกำลังตามหาจะถูกย้ายที่ตั้ง
                หรืออาจจะยังไม่ได้เขียนขึ้นมา
                ลองย้อนกลับไปตั้งหลักที่หน้าแรกกันอีกครั้งนะครับ
              </Paragraph>

              <Space size="large">
                <Link href="/">
                  <Button
                    type="primary"
                    size="large"
                    icon={<HomeOutlined />}
                    style={{
                      height: "50px",
                      padding: "0 32px",
                      borderRadius: "12px",
                      backgroundColor: "#001e45",
                      borderColor: "#001e45",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    กลับหน้าหลัก
                  </Button>
                </Link>
                <Button
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => router.back()}
                  style={{
                    height: "50px",
                    padding: "0 32px",
                    borderRadius: "12px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  ย้อนกลับ
                </Button>
              </Space>
            </div>
          </div>
        </Col>
      </Row>

      {/* Background Decorative Elements */}
      <div
        style={{
          position: "fixed",
          bottom: "10%",
          right: "5%",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(230,2,120,0.05) 0%, rgba(255,255,255,0) 70%)",
          zIndex: -1,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "10%",
          left: "5%",
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, rgba(0,30,69,0.03) 0%, rgba(255,255,255,0) 70%)",
          zIndex: -1,
        }}
      />
    </div>
  );
}

// Helper component for Space if not imported
function Space({
  children,
  size,
}: {
  children: React.ReactNode;
  size: "large";
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: size === "large" ? "16px" : "8px",
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  );
}
