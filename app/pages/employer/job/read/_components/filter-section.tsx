"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Card, Flex, Input, Tabs, Typography } from "antd";
import { useJobReadStore } from "../_state/job-read-store";

const { Text } = Typography;

// ส่วนค้นหาและกรองสถานะประกาศ
export const FilterSection = () => {
  const { jobs, searchKeyword, activeTab, setSearchKeyword, setActiveTab } =
    useJobReadStore();

  const activeCount = jobs.filter((j) => j.status === "ACTIVE").length;
  const closedCount = jobs.filter((j) => j.status === "CLOSED").length;
  const draftCount = jobs.filter((j) => j.status === "DRAFT").length;
  const totalNewApplicants = jobs.reduce((sum, j) => sum + j.newApplicants, 0);

  return (
    <Card
      variant="borderless"
      style={{ borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      styles={{ body: { padding: "16px 24px 0" } }}
    >
      <Flex vertical gap={0}>
        {/* Search Row */}
        <Flex justify="space-between" align="center" gap={16} style={{ paddingBottom: 16 }}>
          <Input
            placeholder="ค้นหาตามชื่อตำแหน่ง หรือวิชาที่สอน..."
            prefix={<SearchOutlined style={{ color: "#94A3B8" }} />}
            size="large"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ borderRadius: 10, maxWidth: 480 }}
            allowClear
          />
          {totalNewApplicants > 0 && (
            <Text style={{ fontSize: 13, color: "#64748B" }}>
              มีผู้สมัครใหม่รอตรวจสอบ{" "}
              <Text strong style={{ color: "#11b6f5" }}>
                {totalNewApplicants} คน
              </Text>
            </Text>
          )}
        </Flex>

        {/* Status Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="middle"
          items={[
            {
              key: "ACTIVE",
              label: (
                <Flex align="center" gap={6}>
                  <span>กำลังเปิดรับสมัคร</span>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "1px 8px",
                      borderRadius: 20,
                      background: activeTab === "ACTIVE" ? "#11b6f5" : "#E2E8F0",
                      color: activeTab === "ACTIVE" ? "#fff" : "#64748B",
                    }}
                  >
                    {activeCount}
                  </Text>
                </Flex>
              ),
            },
            {
              key: "CLOSED",
              label: (
                <Flex align="center" gap={6}>
                  <span>ปิดรับแล้ว</span>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "1px 8px",
                      borderRadius: 20,
                      background: activeTab === "CLOSED" ? "#64748B" : "#E2E8F0",
                      color: activeTab === "CLOSED" ? "#fff" : "#64748B",
                    }}
                  >
                    {closedCount}
                  </Text>
                </Flex>
              ),
            },
            {
              key: "DRAFT",
              label: (
                <Flex align="center" gap={6}>
                  <span>ฉบับร่าง</span>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "1px 8px",
                      borderRadius: 20,
                      background: activeTab === "DRAFT" ? "#F59E0B" : "#E2E8F0",
                      color: activeTab === "DRAFT" ? "#fff" : "#64748B",
                    }}
                  >
                    {draftCount}
                  </Text>
                </Flex>
              ),
            },
          ]}
        />
      </Flex>
    </Card>
  );
};
