"use client";

import { Avatar, Space, Typography, theme as antTheme } from "antd";
import Link from "next/link";

const { Title, Text } = Typography;

interface JobSummaryProps {
  job: {
    title: string;
    company: string;
    logo: string;
  };
}

export default function JobSummary({ job }: JobSummaryProps) {
  const { token } = antTheme.useToken();

  return (
    <Space size={24} align="start" style={{ marginBottom: 40, width: "100%" }}>
      <Avatar
        shape="square"
        size={80}
        src={job.logo}
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          backgroundColor: token.colorBgContainer,
        }}
      />
      <Space direction="vertical" size={2}>
        <Text type="secondary" style={{ fontSize: 14 }}>
          กำลังสมัครตำแหน่ง
        </Text>
        <Title level={3} style={{ margin: 0, color: token.colorTextHeading }}>
          {job.title}
        </Title>
        <Text strong style={{ color: token.colorText }}>
          {job.company}
        </Text>
        <Link href="#" style={{ fontSize: 14, color: token.colorPrimary }}>
          ดูรายละเอียดงาน
        </Link>
      </Space>
    </Space>
  );
}
