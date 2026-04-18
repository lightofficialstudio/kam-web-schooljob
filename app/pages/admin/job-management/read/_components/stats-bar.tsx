"use client";

import { Col, Row, Statistic, theme } from "antd";
import { AdminJob } from "../_api/admin-job-api";

interface StatsBarProps {
  jobs: AdminJob[];
  total: number;
}

export function StatsBar({ jobs, total }: StatsBarProps) {
  const { token } = theme.useToken();

  const open   = jobs.filter((j) => j.status === "OPEN").length;
  const closed = jobs.filter((j) => j.status === "CLOSED").length;
  const draft  = jobs.filter((j) => j.status === "DRAFT").length;
  const apps   = jobs.reduce((s, j) => s + j._count.applications, 0);

  const items = [
    { title: "ทั้งหมด",     value: total, color: token.colorText },
    { title: "เปิดรับสมัคร", value: open,  color: token.colorSuccess },
    { title: "ปิดรับสมัคร", value: closed, color: token.colorError },
    { title: "ฉบับร่าง",    value: draft,  color: token.colorTextSecondary },
    { title: "ใบสมัครรวม", value: apps,   color: "#11b6f5" },
  ];

  return (
    <Row gutter={[16, 16]}>
      {items.map((it) => (
        <Col key={it.title} xs={12} sm={8} md={4}>
          <div
            style={{
              background: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadius,
              padding: "12px 16px",
            }}
          >
            <Statistic
              title={it.title}
              value={it.value}
              styles={{ content: { color: it.color, fontSize: 22, fontWeight: 700 } }}
            />
          </div>
        </Col>
      ))}
    </Row>
  );
}
