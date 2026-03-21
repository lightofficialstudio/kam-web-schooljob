"use client";

import {
  Card,
  Col,
  Layout,
  Row,
  Space,
  Tag,
  Typography,
  theme as antTheme,
} from "antd";
import { SchoolCard } from "./components/school-card";
import { SchoolJobsDrawer } from "./components/school-jobs-drawer";
import { SchoolSearch } from "./components/school-search";
import { useSchoolStore } from "./stores/school-store";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function SchoolDirectoryPage() {
  const { token } = antTheme.useToken();
  const { schools, searchQuery, provinceFilter, typeFilter } = useSchoolStore();

  const filteredSchools = schools.filter((school) => {
    const matchesSearch = school.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesProvince =
      !provinceFilter || school.province === provinceFilter;
    const matchesType = !typeFilter || school.type.includes(typeFilter);
    return matchesSearch && matchesProvince && matchesType;
  });

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: token.colorBgLayout,
      }}
    >
      {/* 1. Header Hero Section */}
      <div
        style={{
          background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryDark} 100%)`,
          padding: "120px 24px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: "10%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }}
        />

        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <Title
            level={1}
            style={{
              color: "#fff",
              fontSize: "48px",
              fontWeight: 800,
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            ค้นหาโรงเรียนและสถาบัน
          </Title>
          <Text
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "18px",
              display: "block",
              maxWidth: 600,
              margin: "0 auto 32px",
            }}
          >
            สำรวจสถานศึกษาในระบบที่กำลังเปิดรับสมัครงานครูทั่วมุมโลก
            พร้อมดูข้อมูลเบื้องต้นและตำแหน่งงานที่รอคุณอยู่
          </Text>
        </div>
      </div>

      <Content style={{ marginTop: -40, padding: "0 24px 80px" }}>
        <Row justify="center">
          <Col span={24} style={{ maxWidth: 1100 }}>
            <SchoolSearch />

            <div style={{ marginBottom: 24 }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Space size={8}>
                    <Text strong style={{ fontSize: "18px" }}>
                      สถานศึกษาทั้งหมด
                    </Text>
                    <Tag
                      color="blue"
                      style={{ borderRadius: 4, transform: "translateY(-1px)" }}
                    >
                      {filteredSchools.length}
                    </Tag>
                  </Space>
                </Col>
                <Col>
                  <Text type="secondary">เรียงตาม: ล่าสุด</Text>
                </Col>
              </Row>
            </div>

            <Row gutter={[24, 24]}>
              {filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <Col xs={24} key={school.id}>
                    <SchoolCard {...school} />
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: token.borderRadiusLG,
                      textAlign: "center",
                      padding: "60px 0",
                      background: token.colorBgContainer,
                    }}
                  >
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🏫</div>
                    <Title level={4}>ไม่พบสถานศึกษา</Title>
                    <Text type="secondary">
                      ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อให้เราพบโรงเรียนที่คุณต้องการ
                    </Text>
                  </Card>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Content>
      <SchoolJobsDrawer />
    </Layout>
  );
}
