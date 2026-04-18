"use client";

import { Tag } from "antd";

const STATUS_MAP = {
  OPEN:   { label: "เปิดรับสมัคร", color: "green" },
  CLOSED: { label: "ปิดรับสมัคร", color: "red" },
  DRAFT:  { label: "ฉบับร่าง",    color: "default" },
} as const;

export function JobStatusTag({ status }: { status: keyof typeof STATUS_MAP }) {
  const { label, color } = STATUS_MAP[status] ?? { label: status, color: "default" };
  return <Tag color={color}>{label}</Tag>;
}
