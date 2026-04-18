"use client";

import { SummaryCard } from "@/app/components/card/summary-card.component";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import { AdminJob } from "../_api/admin-job-api";

interface StatsBarProps {
  jobs: AdminJob[];
  total: number;
  isLoading?: boolean;
}

export function StatsBar({ jobs, total, isLoading }: StatsBarProps) {
  const open = jobs.filter((j) => j.status === "OPEN").length;
  const closed = jobs.filter((j) => j.status === "CLOSED").length;
  const draft = jobs.filter((j) => j.status === "DRAFT").length;
  const apps = jobs.reduce((s, j) => s + j._count.applications, 0);

  const cards = [
    {
      title: "ทั้งหมด",
      value: total,
      unit: "รายการ",
      icon: <UnorderedListOutlined />,
      color: "#11b6f5",
    },
    {
      title: "เปิดรับสมัคร",
      value: open,
      unit: "รายการ",
      icon: <CheckCircleOutlined />,
      color: "#22c55e",
    },
    {
      title: "ปิดรับสมัคร",
      value: closed,
      unit: "รายการ",
      icon: <CloseCircleOutlined />,
      color: "#ef4444",
    },
    {
      title: "ฉบับร่าง",
      value: draft,
      unit: "รายการ",
      icon: <FileTextOutlined />,
      color: "#94a3b8",
    },
    {
      title: "ใบสมัครรวม",
      value: apps,
      unit: "ใบ",
      icon: <TeamOutlined />,
      color: "#f59e0b",
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map((c) => (
        <Col key={c.title} xs={12} sm={8} md={24 / cards.length}>
          <SummaryCard
            title={c.title}
            value={c.value}
            unit={c.unit}
            icon={c.icon}
            color={c.color}
            isLoading={isLoading}
          />
        </Col>
      ))}
    </Row>
  );
}
