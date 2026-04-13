"use client";

import { useTheme } from "@/app/contexts/theme-context";
import { GlobalOutlined, RocketOutlined } from "@ant-design/icons";
import {
  theme as antTheme,
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchLatestJobs } from "../_api/landing-api";

const { Title, Text } = Typography;

interface LatestJob {
  id: string;
  title: string;
  school: string;
  schoolLogo: string;
  location: string;
  salary: string;
  postedAt: string;
  isNew: boolean;
  tags: string[];
}

// ✨ แปลง ISO → ข้อความ relative
const formatRelativeDate = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (hours < 1) return "เมื่อกี้";
  if (hours < 24) return `${hours} ชม. ที่แล้ว`;
  if (days === 1) return "1 วันที่ผ่านมา";
  return `${days} วันที่ผ่านมา`;
};

// ส่วนแสดงประกาศงานใหม่ล่าสุดแบบ Horizontal Scroll
export default function LatestJobsSection() {
  const { mode } = useTheme();
  const { token } = antTheme.useToken();
  const isDark = mode === "dark";

  const [jobs, setJobs] = useState<LatestJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✨ ดึงงานล่าสุดจาก API
  useEffect(() => {
    fetchLatestJobs()
      .then((res) => {
        if (res.status_code === 200 && res.data) {
          setJobs(res.data);
        }
      })
      .catch((err) => console.error("❌ fetchLatestJobs:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div
      style={{
        padding: "80px 24px",
        position: "relative",
        overflow: "hidden",
        background: isDark ? "#070d1a" : "#ffffff",
      }}
    >
      {/* Grid pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: isDark
          ? "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)"
          : "linear-gradient(rgba(17,182,245,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(17,182,245,0.06) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        pointerEvents: "none",
      }} />
      {/* Glow */}
      <div style={{
        position: "absolute", top: "-20%", right: "5%",
        width: "400px", height: "400px", borderRadius: "50%",
        background: isDark
          ? "radial-gradient(circle, rgba(17,182,245,0.10) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(17,182,245,0.14) 0%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <Flex justify="space-between" align="flex-end" style={{ marginBottom: "40px" }}>
          <div>
            <Badge status="processing" text="อัปเดตล่าสุด" />
            <Title level={2} style={{ marginTop: "12px", marginBottom: 0 }}>
              ประกาศงานใหม่ล่าสุด
            </Title>
          </div>
          <Link href="/pages/job">
            <Button type="link" size="large">
              ดูงานทั้งหมด <RocketOutlined />
            </Button>
          </Link>
        </Flex>

        {/* Skeleton */}
        {isLoading && (
          <Flex gap={24}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ minWidth: "350px", flexShrink: 0 }}>
                <Card style={{ borderRadius: "20px" }} styles={{ body: { padding: "24px" } }}>
                  <Skeleton active paragraph={{ rows: 3 }} />
                </Card>
              </div>
            ))}
          </Flex>
        )}

        {/* Horizontal Scroll Container */}
        {!isLoading && jobs.length > 0 && (
          <div
            className="job-scroll-container"
            style={{
              overflowX: "auto",
              padding: "20px 0",
              display: "flex",
              gap: "24px",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {jobs.map((job) => (
              <div key={job.id} style={{ minWidth: "350px", flexShrink: 0 }}>
                <Card
                  hoverable
                  style={{ borderRadius: "20px", height: "100%" }}
                  styles={{ body: { padding: "24px" } }}
                >
                  <Space orientation="vertical" size={16} style={{ width: "100%" }}>
                    {/* Badge + Posted Date */}
                    <Flex justify="space-between" align="flex-start">
                      {job.isNew ? <Badge count="New" color="#ef4444" /> : <div />}
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {formatRelativeDate(job.postedAt)}
                      </Text>
                    </Flex>

                    {/* School Info */}
                    <Flex gap={12} align="center">
                      <Avatar
                        src={job.schoolLogo}
                        size={48}
                        shape="square"
                        style={{ borderRadius: "8px", flexShrink: 0 }}
                      />
                      <div style={{ overflow: "hidden" }}>
                        <Title
                          level={4}
                          style={{ marginBottom: 0, fontSize: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                          {job.title}
                        </Title>
                        <Text style={{ color: "#5B5B5B", fontSize: "13px" }}>{job.school}</Text>
                      </div>
                    </Flex>

                    {/* Location + Salary */}
                    <Space orientation="vertical" size={4}>
                      <Text type="secondary" style={{ fontSize: "13px" }}>
                        <GlobalOutlined /> {job.location}
                      </Text>
                      <Text style={{ color: "#2b3244", fontSize: "15px", fontWeight: 500 }}>
                        ฿ {job.salary}
                      </Text>
                    </Space>

                    {/* Tags */}
                    <Space size={[4, 4]} wrap>
                      {job.tags.map((tag) => (
                        <Tag key={tag} color="#11b6f5" style={{ borderRadius: "4px" }}>{tag}</Tag>
                      ))}
                    </Space>

                    <Link href={`/pages/job/${job.id}/apply`}>
                      <Button
                        type="primary"
                        block
                        style={{ borderRadius: "10px", height: "40px", backgroundColor: "#11b6f5", borderColor: "#11b6f5" }}
                      >
                        ดูรายละเอียด
                      </Button>
                    </Link>
                  </Space>
                </Card>
              </div>
            ))}
          </div>
        )}

        <style jsx global>{`
          .job-scroll-container::-webkit-scrollbar { display: none; }
        `}</style>
      </div>
    </div>
  );
}
