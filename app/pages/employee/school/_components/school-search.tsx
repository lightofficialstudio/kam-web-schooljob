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

export const SchoolSearch = () => {
  const { token } = antTheme.useToken();
  const {
    searchQuery,
    setSearchQuery,
    setProvinceFilter,
    setTypeFilter,
    setGradeFilter,
    setContractFilter,
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
            <Text
              strong
              style={{ fontSize: 13, color: token.colorTextSecondary }}
            >
              ค้นหาด้วยชื่อโรงเรียน
            </Text>
          </Flex>
          <Input
            size="large"
            placeholder="เช่น นานาชาติเซนต์แอนดรูว์ส..."
            style={{
              borderRadius: token.borderRadius,
              height: 48,
              fontSize: 15,
            }}
            prefix={
              <SearchOutlined
                style={{ color: token.colorTextDescription, marginRight: 8 }}
              />
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col xs={12} md={4}>
          <Flex vertical style={{ marginBottom: 8 }}>
            <Text
              strong
              style={{ fontSize: 13, color: token.colorTextSecondary }}
            >
              เลือกจังหวัด
            </Text>
          </Flex>
          <Select
            size="large"
            placeholder="กรุงเทพมหานคร"
            style={{ width: "100%", height: 48 }}
            allowClear
            onChange={setProvinceFilter}
            options={[
              { value: "กรุงเทพมหานคร", label: "กรุงเทพมหานคร" },
              { value: "นนทบุรี", label: "นนทบุรี" },
              { value: "เชียงใหม่", label: "เชียงใหม่" },
            ]}
          />
        </Col>
        <Col xs={12} md={4}>
          <Flex vertical style={{ marginBottom: 8 }}>
            <Text
              strong
              style={{ fontSize: 13, color: token.colorTextSecondary }}
            >
              ประเภทโรงเรียน
            </Text>
          </Flex>
          <Select
            size="large"
            placeholder="ทุกประเภท"
            style={{ width: "100%", height: 48 }}
            allowClear
            onChange={setTypeFilter}
            options={[
              { value: "โรงเรียนรัฐบาล", label: "โรงเรียนรัฐบาล" },
              { value: "โรงเรียนเอกชน", label: "โรงเรียนเอกชน" },
              { value: "โรงเรียนนานาชาติ", label: "โรงเรียนนานาชาติ" },
              { value: "มหาวิทยาลัย / วิทยาลัย", label: "มหาวิทยาลัย / วิทยาลัย" },
              { value: "สถาบันกวดวิชา", label: "สถาบันกวดวิชา" },
              { value: "ศูนย์การเรียน / สถาบันการศึกษาอื่น ๆ", label: "ศูนย์การเรียน / สถาบันการศึกษาอื่น ๆ" },
            ]}
          />
        </Col>
        <Col xs={12} md={4}>
          <Flex vertical style={{ marginBottom: 8 }}>
            <Text
              strong
              style={{ fontSize: 13, color: token.colorTextSecondary }}
            >
              ระดับชั้นที่สอน
            </Text>
          </Flex>
          <Select
            size="large"
            placeholder="ทุกระดับ"
            style={{ width: "100%", height: 48 }}
            allowClear
            onChange={setGradeFilter}
            options={[
              { value: "ประถมศึกษา", label: "ประถมศึกษา" },
              { value: "มัธยมศึกษาตอนต้น", label: "มัธยมศึกษาตอนต้น" },
              { value: "มัธยมศึกษาตอนปลาย", label: "มัธยมศึกษาตอนปลาย" },
            ]}
          />
        </Col>
        <Col xs={12} md={4}>
          <Flex vertical style={{ marginBottom: 8 }}>
            <Text
              strong
              style={{ fontSize: 13, color: token.colorTextSecondary }}
            >
              ประเภทสัญญา
            </Text>
          </Flex>
          <Select
            size="large"
            placeholder="ทุกประเภท"
            style={{ width: "100%", height: 48 }}
            allowClear
            onChange={setContractFilter}
            options={[
              { value: "Full-time", label: "Full-time" },
              { value: "Part-time", label: "Part-time" },
            ]}
          />
        </Col>
        <Col xs={24} md={4}>
          <Button
            type="primary"
            size="large"
            block
            style={{
              height: 48,
              fontWeight: 600,
              borderRadius: token.borderRadius,
              boxShadow: `0 4px 12px ${token.colorPrimary}40`,
            }}
          >
            ค้นหาเลย
          </Button>
        </Col>
      </Row>
    </Card>
  );
};
