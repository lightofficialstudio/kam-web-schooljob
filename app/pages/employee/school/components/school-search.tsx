"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Card, Col, Input, Row, Select, theme as antTheme } from "antd";
import { useSchoolStore } from "../stores/school-store";

export const SchoolSearch = () => {
  const { token } = antTheme.useToken();
  const { searchQuery, setSearchQuery, setProvinceFilter, setTypeFilter } =
    useSchoolStore();

  return (
    <Card
      style={{
        marginBottom: 32,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary,
      }}
      styles={{ body: { padding: "24px" } }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Input
            size="large"
            placeholder="ค้นหาชื่อโรงเรียน..."
            prefix={
              <SearchOutlined style={{ color: token.colorTextDescription }} />
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col xs={12} md={6}>
          <Select
            size="large"
            placeholder="จังหวัด"
            style={{ width: "100%" }}
            allowClear
            onChange={setProvinceFilter}
            options={[
              { value: "กรุงเทพมหานคร", label: "กรุงเทพมหานคร" },
              { value: "นนทบุรี", label: "นนทบุรี" },
              { value: "เชียงใหม่", label: "เชียงใหม่" },
            ]}
          />
        </Col>
        <Col xs={12} md={6}>
          <Select
            size="large"
            placeholder="ประเภทสถาบัน"
            style={{ width: "100%" }}
            allowClear
            onChange={setTypeFilter}
            options={[
              { value: "โรงเรียน", label: "โรงเรียน" },
              { value: "กวดวิชา", label: "กวดวิชา" },
              { value: "นานาชาติ", label: "นานาชาติ" },
            ]}
          />
        </Col>
      </Row>
    </Card>
  );
};
