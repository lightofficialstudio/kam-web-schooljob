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
  const { searchQuery, setSearchQuery, setProvinceFilter, setTypeFilter } =
    useSchoolStore();

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
      <Row gutter={[20, 20]} align="bottom">
        <Col xs={24} md={10}>
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
        <Col xs={12} md={5}>
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
        <Col xs={12} md={5}>
          <Flex vertical style={{ marginBottom: 8 }}>
            <Text
              strong
              style={{ fontSize: 13, color: token.colorTextSecondary }}
            >
              ประเภทสถาบัน
            </Text>
          </Flex>
          <Select
            size="large"
            placeholder="ทุกประเภท"
            style={{ width: "100%", height: 48 }}
            allowClear
            onChange={setTypeFilter}
            options={[
              { value: "โรงเรียน", label: "โรงเรียน" },
              { value: "กวดวิชา", label: "กวดวิชา" },
              { value: "นานาชาติ", label: "นานาชาติ" },
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
