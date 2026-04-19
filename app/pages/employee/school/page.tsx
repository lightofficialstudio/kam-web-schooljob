"use client";

import {
  Card,
  Col,
  Flex,
  Layout,
  Row,
  Select,
  Skeleton,
  Space,
  Tag,
  Typography,
  theme as antTheme,
} from "antd";
import { useEffect } from "react";
import { SchoolCard } from "./_components/school-card";
import { SchoolJobsDrawer } from "./_components/school-jobs-drawer";
import { SchoolSearch } from "./_components/school-search";
import { QUICK_FILTER_TYPES, useSchoolStore } from "./_stores/school-store";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function SchoolDirectoryPage() {
  const { token } = antTheme.useToken();
  const {
    schools,
    isLoading,
    searchQuery,
    provinceFilter,
    typeFilter,
    sortBy,
    provinceOptions,
    setTypeFilter,
    setProvinceFilter,
    setSortBy,
    fetchSchoolList,
    fetchProvinces,
  } = useSchoolStore();

  // ✨ โหลดจังหวัด + โรงเรียนครั้งเดียวตอน mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  // ✨ fetch ใหม่ทุกครั้งที่ filter หรือ sort เปลี่ยน — API เป็นคนกรองและเรียงทั้งหมด
  useEffect(() => {
    fetchSchoolList();
  }, [searchQuery, provinceFilter, typeFilter, sortBy]);

  // ✨ Quick Filter toggle — กดซ้ำ = clear
  const handleQuickType = (value: string) =>
    setTypeFilter(typeFilter === value ? null : value);
  const handleQuickProvince = (value: string) =>
    setProvinceFilter(provinceFilter === value ? null : value);

  // ✨ จังหวัด Quick Filter — 2 แรกจาก provinceOptions ที่ดึงจาก GitHub API
  const quickProvinces = provinceOptions.slice(0, 2).map((p) => p.value);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: token.colorBgLayout,
      }}
    >
      {/* Header Hero Section */}
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

            {/* Quick Filter Tags */}
            <Flex gap={8} wrap="wrap" style={{ marginBottom: 24 }}>
              <Text type="secondary" style={{ lineHeight: "28px", fontSize: 13 }}>
                กรองด่วน:
              </Text>
              {/* ✨ ประเภทโรงเรียน — static */}
              {QUICK_FILTER_TYPES.map((label) => {
                const isActive = typeFilter === label;
                return (
                  <Tag
                    key={label}
                    color={isActive ? token.colorPrimary : undefined}
                    style={{
                      cursor: "pointer",
                      borderRadius: 100,
                      padding: "2px 14px",
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      border: isActive ? "none" : `1px solid ${token.colorBorder}`,
                      backgroundColor: isActive ? undefined : token.colorBgContainer,
                    }}
                    onClick={() => handleQuickType(label)}
                  >
                    {label}
                  </Tag>
                );
              })}
              {/* ✨ จังหวัด — 2 แรกจาก provinceOptions ที่ดึงจาก GitHub API */}
              {quickProvinces.map((label) => {
                const isActive = provinceFilter === label;
                return (
                  <Tag
                    key={label}
                    color={isActive ? token.colorPrimary : undefined}
                    style={{
                      cursor: "pointer",
                      borderRadius: 100,
                      padding: "2px 14px",
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      border: isActive ? "none" : `1px solid ${token.colorBorder}`,
                      backgroundColor: isActive ? undefined : token.colorBgContainer,
                    }}
                    onClick={() => handleQuickProvince(label)}
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
                      color={token.colorPrimary}
                      style={{ borderRadius: 4, transform: "translateY(-1px)" }}
                    >
                      {schools.length}
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
              {isLoading ? (
                // ✨ Skeleton ขณะโหลด
                Array.from({ length: 4 }).map((_, idx) => (
                  <Col xs={24} key={idx}>
                    <Card style={{ borderRadius: token.borderRadiusLG }}>
                      <Skeleton active avatar paragraph={{ rows: 2 }} />
                    </Card>
                  </Col>
                ))
              ) : schools.length > 0 ? (
                schools.map((school) => (
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
                        <Title level={4} style={{ margin: 0 }}>
                          ไม่พบโรงเรียนที่ตรงกับเงื่อนไข
                        </Title>
                        <Text type="secondary">
                          ลองเลือก Quick Filter ด้านล่างหรือเปลี่ยนตัวกรองใหม่
                        </Text>
                      </Flex>
                      {/* ✨ Empty state Quick Filter — ใช้ตัวแปรเดียวกับด้านบน */}
                      <Flex gap={8} wrap="wrap" justify="center">
                        {QUICK_FILTER_TYPES.map((label) => (
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
                            onClick={() => handleQuickType(label)}
                          >
                            {label}
                          </Tag>
                        ))}
                        {quickProvinces.map((label) => (
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
                            onClick={() => handleQuickProvince(label)}
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
