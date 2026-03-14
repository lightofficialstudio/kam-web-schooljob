"use client";

import {
  Card,
  Col,
  Layout,
  Row,
  Space,
  Typography,
  theme as antTheme,
} from "antd";
import { SchoolCard } from "./components/school-card";
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
      style={{ minHeight: "100vh", backgroundColor: token.colorBgLayout }}
    >
      <Content style={{ padding: "100px 24px 80px" }}>
        <Row justify="center">
          <Col span={24} style={{ maxWidth: "1000px" }}>
            <Space
              direction="vertical"
              size={16}
              style={{ width: "100%", marginBottom: 40 }}
            >
              <Title
                level={1}
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: "32px",
                  color: token.colorText,
                }}
              >
                ค้นหาโรงเรียนและสถาบัน
              </Title>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                สำรวจสถานศึกษาในระบบที่กำลังเปิดรับสมัครงานครู
                พร้อมดูข้อมูลเบื้องต้นและสาขาที่กำลังเปิดรับ
              </Text>
            </Space>

            <SchoolSearch />

            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: 8 }}
              >
                <Col>
                  <Text
                    strong
                    style={{ fontSize: "16px", color: token.colorText }}
                  >
                    พบสถานศึกษาทั้งหมด {filteredSchools.length} แห่ง
                  </Text>
                </Col>
              </Row>

              {filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <SchoolCard key={school.id} {...school} />
                ))
              ) : (
                <Card
                  bordered={false}
                  style={{
                    borderRadius: token.borderRadiusLG,
                    textAlign: "center",
                    padding: "40px 0",
                  }}
                >
                  <Text type="secondary">
                    ไม่พบสถานศึกษาที่ตรงกับเงื่อนไขการค้นหาของคุณ
                  </Text>
                </Card>
              )}
            </Space>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
