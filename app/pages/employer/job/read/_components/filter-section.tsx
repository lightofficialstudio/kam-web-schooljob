"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Card, Flex, Input, Tabs, Typography, theme } from "antd";
import { useJobReadStore } from "../_state/job-read-store";

const { Text } = Typography;

// ส่วนค้นหาและกรองสถานะประกาศ
export const FilterSection = () => {
  const { jobs, searchKeyword, activeTab, setSearchKeyword, setActiveTab } =
    useJobReadStore();
  const { token } = theme.useToken();

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
        <Flex
          justify="space-between"
          align="center"
          gap={16}
          style={{ paddingBottom: 16 }}
        >
          <Input
            placeholder="ค้นหาตามชื่อตำแหน่ง หรือวิชาที่สอน..."
            prefix={
              <SearchOutlined style={{ color: token.colorTextTertiary }} />
            }
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
                      background:
                        activeTab === "ACTIVE"
                          ? "#11b6f5"
                          : token.colorFillSecondary,
                      color:
                        activeTab === "ACTIVE"
                          ? "#fff"
                          : token.colorTextSecondary,
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
                      background:
                        activeTab === "CLOSED"
                          ? token.colorTextQuaternary
                          : token.colorFillSecondary,
                      color:
                        activeTab === "CLOSED"
                          ? "#fff"
                          : token.colorTextSecondary,
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
                      background:
                        activeTab === "DRAFT"
                          ? token.colorWarning
                          : token.colorFillSecondary,
                      color:
                        activeTab === "DRAFT"
                          ? "#fff"
                          : token.colorTextSecondary,
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
