"use client";

import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Flex,
  Input,
  Row,
  Select,
  Typography,
  theme as antTheme,
} from "antd";
import { useSchoolStore } from "../_stores/school-store";

const { Text } = Typography;

// ✨ ประเภทโรงเรียน — ตรงกับ schoolType ใน DB
const SCHOOL_TYPE_OPTIONS = [
  { value: "โรงเรียนรัฐบาล", label: "โรงเรียนรัฐบาล" },
  { value: "โรงเรียนเอกชน", label: "โรงเรียนเอกชน" },
  { value: "โรงเรียนนานาชาติ", label: "โรงเรียนนานาชาติ" },
  { value: "มหาวิทยาลัย / วิทยาลัย", label: "มหาวิทยาลัย / วิทยาลัย" },
  { value: "สถาบันกวดวิชา", label: "สถาบันกวดวิชา" },
  { value: "ศูนย์การเรียน / สถาบันการศึกษาอื่น ๆ", label: "ศูนย์การเรียน / สถาบันการศึกษาอื่น ๆ" },
];

export const SchoolSearch = () => {
  const { token } = antTheme.useToken();
  const {
    searchQuery,
    provinceFilter,
    typeFilter,
    isLoadingGeo,
    provinceOptions,
    setSearchQuery,
    setProvinceFilter,
    setTypeFilter,
    fetchSchoolList,
  } = useSchoolStore();

  return (
    <Card
      style={{
        marginBottom: 40,
        borderRadius: token.borderRadiusLG,
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        border: "none",
      }}
      styles={{ body: { padding: "32px" } }}
    >
      <Row gutter={[16, 16]} align="bottom">
        <Col xs={24} md={8}>
          <Flex vertical style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: 13, color: token.colorTextSecondary }}>
              ค้นหาด้วยชื่อโรงเรียน
            </Text>
          </Flex>
          <Input
            size="large"
            placeholder="เช่น นานาชาติเซนต์แอนดรูว์ส..."
            style={{ borderRadius: token.borderRadius, height: 48, fontSize: 15 }}
            prefix={
              <SearchOutlined style={{ color: token.colorTextDescription, marginRight: 8 }} />
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col xs={24} md={6}>
          <Flex vertical style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: 13, color: token.colorTextSecondary }}>
              เลือกจังหวัด
            </Text>
          </Flex>
          {/* ✨ จังหวัดดึงจาก GitHub thai-province-data ผ่าน store */}
          <Select
            size="large"
            placeholder={isLoadingGeo ? "กำลังโหลด..." : "ทุกจังหวัด"}
            style={{ width: "100%", height: 48 }}
            allowClear
            showSearch
            loading={isLoadingGeo}
            value={provinceFilter}
            onChange={(value) => setProvinceFilter(value ?? null)}
            options={provinceOptions}
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
          />
        </Col>
        <Col xs={24} md={6}>
          <Flex vertical style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: 13, color: token.colorTextSecondary }}>
              ประเภทโรงเรียน
            </Text>
          </Flex>
          <Select
            size="large"
            placeholder="ทุกประเภท"
            style={{ width: "100%", height: 48 }}
            allowClear
            value={typeFilter}
            onChange={(value) => setTypeFilter(value ?? null)}
            options={SCHOOL_TYPE_OPTIONS}
          />
        </Col>
        <Col xs={24} md={4}>
          {/* ✨ ปุ่มค้นหา trigger fetchSchoolList โดยตรง */}
          <Button
            type="primary"
            size="large"
            block
            onClick={fetchSchoolList}
            style={{
              height: 48,
              fontWeight: 600,
              borderRadius: token.borderRadius,
              boxShadow: `0 4px 12px ${token.colorPrimary}40`,
            }}
          >
            ค้นหา
          </Button>
        </Col>
      </Row>
    </Card>
  );
};
