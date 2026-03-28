"use client";

import { SearchOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Card, Col, Flex, Input, Row, Tabs, Typography, theme } from "antd";
import { useJobReadStore } from "../_state/job-read-store";

const { Text } = Typography;

// ส่วนค้นหาและกรองสถานะงาน พร้อม Tip แนะนำด่วน
export const FilterSection = () => {
  const { token } = theme.useToken();
  const { jobs, searchKeyword, activeTab, setSearchKeyword, setActiveTab } =
    useJobReadStore();

  const activeCount = jobs.filter((j) => j.status === "ACTIVE").length;
  const closedCount = jobs.filter((j) => j.status === "CLOSED").length;
  const draftCount = jobs.filter((j) => j.status === "DRAFT").length;

  return (
    <Row gutter={24} align="stretch" style={{ marginBottom: 24 }}>
      <Col flex="auto">
        <Card variant="borderless" style={{ borderRadius: 12, height: "100%" }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Input
                placeholder="ค้นหาตามชื่อตำแหน่งงาน หรือวิชาที่สอน..."
                prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder }} />}
                size="large"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                style={{ borderRadius: 8 }}
              />
            </Col>
            <Col>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                  { key: "ACTIVE", label: `เปิดรับสมัคร (${activeCount})` },
                  { key: "CLOSED", label: `ปิดรับแล้ว (${closedCount})` },
                  { key: "DRAFT", label: `ฉบับร่าง (${draftCount})` },
                ]}
              />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={6}>
        <Card
          variant="borderless"
          style={{
            borderRadius: 12,
            backgroundColor: token.colorWarningBg,
            border: `1px solid ${token.colorWarningBorder}`,
            height: "100%",
          }}
          styles={{ body: { padding: "12px 20px" } }}
        >
          <Flex vertical gap={2}>
            <Text type="warning" strong style={{ fontSize: 12 }}>
              <ThunderboltOutlined /> แนะนำด่วน
            </Text>
            <Text style={{ fontSize: 14 }}>
              เพิ่ม <b>&quot;สวัสดิการ&quot;</b> ในประกาศ <br />
              เพื่อดึงดูดผู้สมัครเพิ่ม <b>30%</b>
            </Text>
          </Flex>
        </Card>
      </Col>
    </Row>
  );
};
