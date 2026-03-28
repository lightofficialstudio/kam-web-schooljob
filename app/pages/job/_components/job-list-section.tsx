"use client";

import { TeamOutlined } from "@ant-design/icons";
import {
  Badge,
  Card,
  Col,
  Flex,
  Pagination,
  Row,
  Space,
  Typography,
  theme as antTheme,
} from "antd";
import { useMemo } from "react";
import { useJobSearchStore } from "../_state/job-search-store";
import { JobCard } from "./job-card";

const { Title: AntTitle, Text } = Typography;

// ส่วนแสดงรายการงาน พร้อม pagination และ empty state
export const JobListSection = () => {
  const { token } = antTheme.useToken();
  const {
    filters,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    getFilteredJobs,
  } = useJobSearchStore();

  // คำนวณ filteredJobs จาก Store
  const filteredJobs = useMemo(() => getFilteredJobs(), [filters]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredJobs.slice(startIndex, startIndex + pageSize);
  }, [filteredJobs, currentPage, pageSize]);

  return (
    <Flex vertical gap={16}>
      {/* Title + Count Badge */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
        <Col>
          <AntTitle level={4} style={{ margin: 0 }}>
            {filters.keyword ? `ผลการค้นหาสำหรับ "${filters.keyword}"` : "งานที่แนะนำสำหรับคุณ"}
          </AntTitle>
        </Col>
        <Col>
          <Badge
            count={`ค้นหางานเจอทั้งหมด ${filteredJobs.length} งาน`}
            style={{
              backgroundColor: "#f50",
              padding: "0 12px",
              height: 28,
              lineHeight: "28px",
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 600,
            }}
          />
        </Col>
      </Row>

      {/* Job Cards */}
      <Space orientation="vertical" size={16} style={{ width: "100%" }}>
        {paginatedJobs.length > 0 ? (
          paginatedJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <Card
            style={{ textAlign: "center", padding: 40, borderRadius: token.borderRadiusLG }}
          >
            <Flex vertical align="center" gap={12}>
              <TeamOutlined style={{ fontSize: 48, color: token.colorTextQuaternary }} />
              <AntTitle level={4} style={{ margin: 0 }}>ไม่พบงานที่ตรงตามเงื่อนไข</AntTitle>
              <Text type="secondary">ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองใหม่อีกครั้ง</Text>
            </Flex>
          </Card>
        )}
      </Space>

      {/* Pagination */}
      {filteredJobs.length > 0 && (
        <Card
          style={{ borderRadius: token.borderRadiusLG, textAlign: "center" }}
          styles={{ body: { padding: "16px 24px" } }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredJobs.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            showSizeChanger
            pageSizeOptions={["5", "10", "25", "50"]}
            locale={{ items_per_page: "/ หน้า" }}
          />
        </Card>
      )}
    </Flex>
  );
};
