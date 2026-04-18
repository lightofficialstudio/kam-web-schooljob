"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Select } from "antd";
import { useAdminJobStore } from "../_state/admin-job-store";

const STATUS_OPTIONS = [
  { label: "ทุกสถานะ",   value: "" },
  { label: "เปิดรับสมัคร", value: "OPEN" },
  { label: "ปิดรับสมัคร", value: "CLOSED" },
  { label: "ฉบับร่าง",    value: "DRAFT" },
];

interface JobFilterBarProps {
  onSearch: () => void;
}

export function JobFilterBar({ onSearch }: JobFilterBarProps) {
  const { filters, setFilters } = useAdminJobStore();

  return (
    <Row gutter={[12, 12]} align="middle">
      <Col xs={24} sm={10} md={8}>
        <Input
          placeholder="ค้นหาชื่อตำแหน่ง / รายละเอียด"
          prefix={<SearchOutlined />}
          value={filters.keyword}
          onChange={(e) => setFilters({ keyword: e.target.value })}
          onPressEnter={onSearch}
          allowClear
        />
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Select
          style={{ width: "100%" }}
          value={filters.status}
          options={STATUS_OPTIONS}
          onChange={(v) => setFilters({ status: v })}
        />
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Input
          placeholder="จังหวัด"
          value={filters.province}
          onChange={(e) => setFilters({ province: e.target.value })}
          onPressEnter={onSearch}
          allowClear
        />
      </Col>
      <Col xs={24} sm={2}>
        <Button type="primary" onClick={onSearch} block>
          ค้นหา
        </Button>
      </Col>
    </Row>
  );
}
