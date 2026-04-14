"use client";

import { TeamOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Flex,
  Row,
  Skeleton,
  Space,
  Typography,
  theme as antTheme,
} from "antd";
import { useEffect, useRef } from "react";
import { useJobSearchStore } from "../_state/job-search-store";
import { JobCard } from "./job-card";

const { Title: AntTitle, Text } = Typography;

// ส่วนแสดงรายการงาน พร้อม Lazy Loading (Cursor-based)
export const JobListSection = () => {
  const { token } = antTheme.useToken();
  const {
    filters,
    isLoading,
    isLoadingMore,
    hasMore,
    fetchJobs,
    loadMore,
    getFilteredJobs,
  } = useJobSearchStore();

  const jobs = getFilteredJobs();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ✨ โหลดงานใหม่เมื่อ filter เปลี่ยน
  useEffect(() => {
    fetchJobs();
  }, [filters]);

  // ✨ IntersectionObserver — โหลดเพิ่มเมื่อ scroll ถึงล่างสุด
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore]);

  return (
    <Flex vertical gap={16}>
      {/* Title */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
        <Col>
          <AntTitle level={4} style={{ margin: 0 }}>
            {filters.keyword
              ? `ผลการค้นหาสำหรับ "${filters.keyword}"`
              : "งานที่แนะนำสำหรับคุณ"}
          </AntTitle>
        </Col>
        <Col>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {jobs.length > 0 ? `แสดง ${jobs.length} รายการ` : ""}
          </Text>
        </Col>
      </Row>

      {/* Initial Loading Skeleton */}
      {isLoading && (
        <Space orientation="vertical" size={16} style={{ width: "100%" }}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Card key={idx} style={{ borderRadius: token.borderRadiusLG }}>
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          ))}
        </Space>
      )}

      {/* Job Cards */}
      {!isLoading && (
        <Space orientation="vertical" size={16} style={{ width: "100%" }}>
          {jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <Card
              style={{
                textAlign: "center",
                padding: 40,
                borderRadius: token.borderRadiusLG,
              }}
            >
              <Flex vertical align="center" gap={12}>
                <TeamOutlined
                  style={{ fontSize: 48, color: token.colorTextQuaternary }}
                />
                <AntTitle level={4} style={{ margin: 0 }}>
                  ไม่พบงานที่ตรงตามเงื่อนไข
                </AntTitle>
                <Text type="secondary">
                  ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองใหม่อีกครั้ง
                </Text>
              </Flex>
            </Card>
          )}
        </Space>
      )}

      {/* Load More Skeleton (inline) */}
      {isLoadingMore && (
        <Space orientation="vertical" size={16} style={{ width: "100%" }}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card
              key={`more-${idx}`}
              style={{ borderRadius: token.borderRadiusLG }}
            >
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ))}
        </Space>
      )}

      {/* Sentinel div — trigger IntersectionObserver */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {/* Load More Button (fallback / explicit) */}
      {hasMore && !isLoadingMore && !isLoading && jobs.length > 0 && (
        <Button
          type="default"
          size="large"
          block
          onClick={loadMore}
          style={{ borderRadius: token.borderRadius, marginTop: 8 }}
        >
          โหลดงานเพิ่มเติม
        </Button>
      )}

      {/* End of list */}
      {!hasMore && !isLoading && jobs.length > 0 && (
        <Text
          type="secondary"
          style={{
            textAlign: "center",
            display: "block",
            padding: "16px 0",
            fontSize: 13,
          }}
        >
          แสดงครบทุกตำแหน่งงานแล้ว ({jobs.length} รายการ)
        </Text>
      )}
    </Flex>
  );
};
