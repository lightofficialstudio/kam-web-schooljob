"use client";

import {
  Card,
  Col,
  Flex,
  Layout,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  theme as antTheme,
} from "antd";
import { SchoolCard } from "./_components/school-card";
import { SchoolJobsDrawer } from "./_components/school-jobs-drawer";
import { SchoolSearch } from "./_components/school-search";
import { useSchoolStore } from "./_stores/school-store";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function SchoolDirectoryPage() {
  const { token } = antTheme.useToken();
  const {
    schools,
    searchQuery,
    provinceFilter,
    typeFilter,
    gradeFilter,
    contractFilter,
    sortBy,
    setTypeFilter,
    setProvinceFilter,
    setSortBy,
  } = useSchoolStore();

  // Quick Filter Tags — toggle เมื่อกดซ้ำจะ clear
  const handleQuickType = (value: string) =>
    setTypeFilter(typeFilter === value ? null : value);
  const handleQuickProvince = (value: string) =>
    setProvinceFilter(provinceFilter === value ? null : value);

  const filteredSchools = schools
    .filter((school) => {
      const matchesSearch = school.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesProvince =
        !provinceFilter || school.province === provinceFilter;
      const matchesType = !typeFilter || school.type.includes(typeFilter);
      const matchesGrade =
        !gradeFilter ||
        school.jobs.some((job) => job.gradeLevels.includes(gradeFilter));
      const matchesContract =
        !contractFilter ||
        school.jobs.some((job) => job.type === contractFilter);
      return matchesSearch && matchesProvince && matchesType && matchesGrade && matchesContract;
    })
    .sort((a, b) => {
      if (sortBy === "most_jobs") return b.jobCount - a.jobCount;
      return parseInt(a.id) - parseInt(b.id); // "latest" — ใช้ id เป็น proxy
    });

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: token.colorBgLayout,
      }}
    >
      {/* 1. Header Hero Section */}
      <Flex
        vertical
        align="center"
        justify="center"
        style={{
          background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorInfoBgHover} 100%)`,
          padding: "120px 24px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements using Flex/Box pattern */}
        <Flex
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: token.colorWhite,
            opacity: 0.05,
          }}
        />
        <Flex
          style={{
            position: "absolute",
            bottom: -80,
            left: "10%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: token.colorWhite,
            opacity: 0.03,
          }}
        />

        <Flex
          vertical
          style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}
        >
          <Title
            level={1}
            style={{
              color: token.colorWhite,
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
              color: token.colorWhite,
              opacity: 0.85,
              fontSize: "18px",
              display: "block",
              maxWidth: 600,
              margin: "0 auto 32px",
            }}
          >
            สำรวจโรงเรียนในระบบที่กำลังเปิดรับสมัครงานครูทั่วประเทศ
            พร้อมดูข้อมูลเบื้องต้นและตำแหน่งงานที่รอคุณอยู่
          </Text>
        </Flex>
      </Flex>

      <Content style={{ marginTop: -40, padding: "0 24px 80px" }}>
        <Row justify="center">
          <Col span={24} style={{ maxWidth: 1100 }}>
            <SchoolSearch />

            {/* [ข้อ 2] Quick Filter Tags */}
            <Flex gap={8} wrap="wrap" style={{ marginBottom: 24 }}>
              <Text type="secondary" style={{ lineHeight: "28px", fontSize: 13 }}>
                กรองด่วน:
              </Text>
              {[
                { label: "โรงเรียนนานาชาติ", kind: "type" },
                { label: "โรงเรียนรัฐบาล", kind: "type" },
                { label: "โรงเรียนเอกชน", kind: "type" },
                { label: "สถาบันกวดวิชา", kind: "type" },
                { label: "กรุงเทพมหานคร", kind: "province" },
                { label: "เชียงใหม่", kind: "province" },
              ].map(({ label, kind }) => {
                const isActive =
                  kind === "type" ? typeFilter === label : provinceFilter === label;
                return (
                  <Tag
                    key={label}
                    color={isActive ? "#11b6f5" : undefined}
                    style={{
                      cursor: "pointer",
                      borderRadius: 100,
                      padding: "2px 14px",
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      border: isActive ? "none" : `1px solid ${token.colorBorder}`,
                      backgroundColor: isActive ? undefined : token.colorBgContainer,
                    }}
                    onClick={() =>
                      kind === "type"
                        ? handleQuickType(label)
                        : handleQuickProvince(label)
                    }
                  >
                    {label}
                  </Tag>
                );
              })}
            </Flex>

            <Flex vertical style={{ marginBottom: 24 }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Space size={8}>
                    <Text strong style={{ fontSize: "18px" }}>
                      โรงเรียนทั้งหมด
                    </Text>
                    <Tag
                      color="#11b6f5"
                      style={{ borderRadius: 4, transform: "translateY(-1px)" }}
                    >
                      {filteredSchools.length}
                    </Tag>
                  </Space>
                </Col>
                <Col>
                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    style={{ width: 180 }}
                    options={[
                      { value: "latest", label: "เรียงตาม: ล่าสุด" },
                      { value: "most_jobs", label: "เรียงตาม: ตำแหน่งมากสุด" },
                    ]}
                  />
                </Col>
              </Row>
            </Flex>

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
                    variant="borderless"
                    style={{
                      borderRadius: token.borderRadiusLG,
                      textAlign: "center",
                      padding: "60px 32px",
                      background: token.colorBgContainer,
                    }}
                  >
                    <Flex vertical align="center" gap={20}>
                      <Text style={{ fontSize: 48 }}>🏫</Text>
                      <Flex vertical align="center" gap={8}>
                        <Title level={4} style={{ margin: 0 }}>ไม่พบโรงเรียนที่ตรงกับเงื่อนไข</Title>
                        <Text type="secondary">
                          ลองเลือก Quick Filter ด้านล่างหรือเปลี่ยนตัวกรองใหม่
                        </Text>
                      </Flex>
                      <Flex gap={8} wrap="wrap" justify="center">
                        {[
                          { label: "โรงเรียนนานาชาติ", kind: "type" },
                          { label: "โรงเรียนรัฐบาล", kind: "type" },
                          { label: "โรงเรียนเอกชน", kind: "type" },
                          { label: "สถาบันกวดวิชา", kind: "type" },
                          { label: "กรุงเทพมหานคร", kind: "province" },
                          { label: "เชียงใหม่", kind: "province" },
                        ].map(({ label, kind }) => (
                          <Tag
                            key={label}
                            style={{
                              cursor: "pointer",
                              borderRadius: 100,
                              padding: "4px 16px",
                              fontSize: 13,
                              border: `1px solid ${token.colorBorder}`,
                              backgroundColor: token.colorBgLayout,
                            }}
                            onClick={() =>
                              kind === "type"
                                ? handleQuickType(label)
                                : handleQuickProvince(label)
                            }
                          >
                            {label}
                          </Tag>
                        ))}
                      </Flex>
                    </Flex>
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
