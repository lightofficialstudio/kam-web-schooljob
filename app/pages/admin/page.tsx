"use client";

import {
  AppstoreOutlined,
  DatabaseOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";

/**
 * 📊 Admin Dashboard Page
 */
export default function AdminPage() {
  return (
    <Row gutter={[16, 16]}>
      {/* ✨ [Header] */}
      <Col xs={24}>
        <Card
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            color: "white",
          }}
        >
          <h2 style={{ color: "white", marginBottom: "8px", fontSize: "24px" }}>
            ยินดีต้อนรับเข้าแดชบอร์ดแอดมิน
          </h2>
          <p style={{ color: "rgba(255, 255, 255, 0.8)", marginBottom: 0 }}>
            จำหน่าย KAM - ระบบจัดการงานสำหรับโรงเรียน
          </p>
        </Card>
      </Col>

      {/* ✨ [Statistics Cards] */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          style={{
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            borderRadius: "8px",
          }}
        >
          <Statistic
            title="จำนวนผู้ใช้ทั้งหมด"
            value={2}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#0066FF", fontSize: "28px" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card
          style={{
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            borderRadius: "8px",
          }}
        >
          <Statistic
            title="ผู้ดูแลระบบ"
            value={1}
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#FF4D4F", fontSize: "28px" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card
          style={{
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            borderRadius: "8px",
          }}
        >
          <Statistic
            title="เซสชั่นใช้งาน"
            value={1}
            prefix={<AppstoreOutlined />}
            valueStyle={{ color: "#52C41A", fontSize: "28px" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card
          style={{
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            borderRadius: "8px",
          }}
        >
          <Statistic
            title="เรคคอร์ดฐานข้อมูล"
            value={2}
            prefix={<DatabaseOutlined />}
            valueStyle={{ color: "#722ED1", fontSize: "28px" }}
          />
        </Card>
      </Col>

      {/* ✨ [System Status Card] */}
      <Col xs={24} lg={12}>
        <Card
          title="สถานะระบบ"
          style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Row
                justify="space-between"
                style={{
                  paddingBottom: "12px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Col>
                  <span style={{ color: "rgba(0,0,0,0.65)" }}>ฐานข้อมูล</span>
                </Col>
                <Col>
                  <span style={{ color: "#52C41A", fontWeight: 600 }}>
                    ✓ เชื่อมต่อ
                  </span>
                </Col>
              </Row>
            </Col>
            <Col xs={24}>
              <Row
                justify="space-between"
                style={{
                  paddingBottom: "12px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Col>
                  <span style={{ color: "rgba(0,0,0,0.65)" }}>
                    เซิร์ฟเวอร์ API
                  </span>
                </Col>
                <Col>
                  <span style={{ color: "#52C41A", fontWeight: 600 }}>
                    ✓ ทำงาน
                  </span>
                </Col>
              </Row>
            </Col>
            <Col xs={24}>
              <Row justify="space-between">
                <Col>
                  <span style={{ color: "rgba(0,0,0,0.65)" }}>
                    การยืนยันตัวตน
                  </span>
                </Col>
                <Col>
                  <span style={{ color: "#52C41A", fontWeight: 600 }}>
                    ✓ ใช้งานอยู่
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>

      {/* ✨ [Quick Actions Card] */}
      <Col xs={24} lg={12}>
        <Card
          title="การจัดการด่วน"
          style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card
                hoverable
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  color: "white",
                }}
              >
                <div style={{ fontSize: "18px", marginBottom: "8px" }}>
                  👥 จัดการผู้ใช้
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.8)",
                    margin: 0,
                  }}
                >
                  ดูและจัดการผู้ใช้ทั้งหมด
                </p>
              </Card>
            </Col>
            <Col xs={24}>
              <Card
                hoverable
                style={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  border: "none",
                  color: "white",
                }}
              >
                <div style={{ fontSize: "18px", marginBottom: "8px" }}>
                  📊 ดูรายงาน
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.8)",
                    margin: 0,
                  }}
                >
                  การวิเคราะห์และรายงานระบบ
                </p>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
