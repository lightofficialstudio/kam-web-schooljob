"use client";

// ✨ SEO Checker Panel — ตรวจสอบ SEO แบบ real-time ใต้ AI Assistant
// ตรวจ title / excerpt / slug และแสดง Google Preview + Score badge
import {
  CheckCircleFilled,
  CloseCircleFilled,
  GlobalOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { Divider, Flex, Progress, Tag, Tooltip, Typography, theme } from "antd";

const { Text } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeoCheckerPanelProps {
  title?: string;
  excerpt?: string;
  slug?: string;
}

// ─── Score ────────────────────────────────────────────────────────────────────

interface SeoCheckItem {
  label: string;
  value: string;
  length: number;
  min: number;
  max: number;
  ideal: string;
  score: number; // คะแนนที่ได้จาก item นี้ (0–maxScore)
  maxScore: number;
}

// ✨ คำนวณ SeoCheckItem จาก field ค่าหนึ่ง
function buildCheckItem(
  label: string,
  rawValue: string | undefined,
  min: number,
  max: number,
  ideal: string,
  maxScore: number,
): SeoCheckItem {
  const value = (rawValue ?? "").trim();
  const length = value.length;
  let score: number;

  if (length === 0) {
    score = 0;
  } else if (length >= min && length <= max) {
    score = maxScore; // อยู่ใน ideal range
  } else if (length >= min * 0.6 && length <= max * 1.3) {
    score = Math.round(maxScore * 0.55); // ใกล้เคียง — partial
  } else {
    score = Math.round(maxScore * 0.2); // ผิดมาก
  }

  return { label, value, length, min, max, ideal, score, maxScore };
}

// ✨ คำนวณ total score (0–100) จาก 3 items
function calcScore(items: SeoCheckItem[]): number {
  const total = items.reduce((s, i) => s + i.score, 0);
  const max = items.reduce((s, i) => s + i.maxScore, 0);
  return max > 0 ? Math.round((total / max) * 100) : 0;
}

type ScoreLevel = "poor" | "fair" | "good";

// ✨ แปลงคะแนนเป็น label
function scoreLevel(score: number): ScoreLevel {
  if (score >= 75) return "good";
  if (score >= 45) return "fair";
  return "poor";
}

const LEVEL_CONFIG: Record<
  ScoreLevel,
  { label: string; color: string; stroke: string }
> = {
  good: { label: "Good", color: "#52c41a", stroke: "#52c41a" },
  fair: { label: "Fair", color: "#fa8c16", stroke: "#fa8c16" },
  poor: { label: "Poor", color: "#ff4d4f", stroke: "#ff4d4f" },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

// ✨ Icon แสดงสถานะ check ของแต่ละ field
function StatusIcon({ item }: { item: SeoCheckItem }) {
  if (item.length === 0) {
    return <WarningFilled style={{ color: "#8c8c8c", fontSize: 14 }} />;
  }
  if (item.length >= item.min && item.length <= item.max) {
    return <CheckCircleFilled style={{ color: "#52c41a", fontSize: 14 }} />;
  }
  if (item.length >= item.min * 0.6 && item.length <= item.max * 1.3) {
    return <WarningFilled style={{ color: "#fa8c16", fontSize: 14 }} />;
  }
  return <CloseCircleFilled style={{ color: "#ff4d4f", fontSize: 14 }} />;
}

// ✨ Bar progress ขนาดเล็กแสดง % ของ length ต่อ ideal range
function LengthBar({
  item,
  token,
}: {
  item: SeoCheckItem;
  token: ReturnType<typeof theme.useToken>["token"];
}) {
  const pct =
    item.max > 0
      ? Math.min(100, Math.round((item.length / item.max) * 100))
      : 0;
  const inRange = item.length >= item.min && item.length <= item.max;
  const stroke =
    item.length === 0
      ? token.colorFillSecondary
      : inRange
        ? "#52c41a"
        : item.length < item.min
          ? "#fa8c16"
          : "#ff4d4f";

  return (
    <Flex align="center" gap={6}>
      <Progress
        percent={pct}
        size="small"
        showInfo={false}
        strokeColor={stroke}
        style={{ flex: 1, margin: 0 }}
      />
      <Text
        style={{
          fontSize: 11,
          minWidth: 52,
          color: inRange ? "#52c41a" : token.colorTextTertiary,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {item.length} / {item.max}
      </Text>
    </Flex>
  );
}

// ✨ Google Preview จำลอง SERP snippet
function GooglePreview({
  title,
  excerpt,
  slug,
  token,
}: {
  title: string;
  excerpt: string;
  slug: string;
  token: ReturnType<typeof theme.useToken>["token"];
}) {
  // ✨ truncate ตาม Google pixel limit (approximate: 60 chars title, 160 desc)
  const displayTitle =
    title.length > 60 ? title.slice(0, 57) + "…" : title || "ชื่อบทความ";
  const displayDesc =
    excerpt.length > 160
      ? excerpt.slice(0, 157) + "…"
      : excerpt || "สรุปย่อบทความ — แสดงใน Google Search snippet ตรงนี้";
  const displaySlug =
    slug.length > 60 ? slug.slice(0, 57) + "…" : slug || "blog-slug";

  return (
    <div
      style={{
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: 12,
        padding: "12px 14px",
        background: token.colorBgContainer,
      }}
    >
      {/* favicon + breadcrumb */}
      <Flex align="center" gap={6} style={{ marginBottom: 4 }}>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0d8fd4, #5dd5fb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GlobalOutlined style={{ fontSize: 10, color: "#fff" }} />
        </div>
        <Text style={{ fontSize: 11, color: token.colorTextTertiary }}>
          schooljob.com › blog ›{" "}
          <span style={{ color: token.colorText }}>{displaySlug}</span>
        </Text>
      </Flex>

      {/* Title */}
      <Text
        style={{
          fontSize: 16,
          color: "#1a0dab",
          display: "block",
          lineHeight: 1.3,
          marginBottom: 3,
          fontFamily: "Arial, sans-serif",
          cursor: "pointer",
          wordBreak: "break-word",
        }}
      >
        {displayTitle}
      </Text>

      {/* Description */}
      <Text
        style={{
          fontSize: 12,
          color: "#545454",
          lineHeight: 1.55,
          display: "block",
          fontFamily: "Arial, sans-serif",
          wordBreak: "break-word",
        }}
      >
        {displayDesc}
      </Text>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function SeoCheckerPanel({
  title,
  excerpt,
  slug,
}: SeoCheckerPanelProps) {
  const { token } = theme.useToken();

  // ✨ สร้าง check items สำหรับ 3 fields
  const items: SeoCheckItem[] = [
    buildCheckItem("Title", title, 50, 60, "50–60 ตัวอักษร", 35),
    buildCheckItem(
      "Excerpt / Meta Description",
      excerpt,
      120,
      160,
      "120–160 ตัวอักษร",
      35,
    ),
    buildCheckItem("Slug (URL)", slug, 1, 60, "ไม่เกิน 60 ตัวอักษร", 30),
  ];

  const totalScore = calcScore(items);
  const level = scoreLevel(totalScore);
  const cfg = LEVEL_CONFIG[level];

  return (
    <Flex vertical gap={16}>
      {/* ─── Header + Score badge ─── */}
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={8}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: token.colorPrimaryBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GlobalOutlined
              style={{ color: token.colorPrimary, fontSize: 14 }}
            />
          </div>
          <Text strong style={{ fontSize: 13 }}>
            SEO Checker
          </Text>
        </Flex>

        {/* ✨ Score badge + progress ring */}
        <Flex align="center" gap={8}>
          <Tag
            color={cfg.color}
            style={{
              borderRadius: 20,
              fontWeight: 700,
              fontSize: 12,
              padding: "1px 10px",
              border: `1px solid ${cfg.color}`,
              background: `${cfg.color}18`,
              color: cfg.color,
            }}
          >
            {cfg.label}
          </Tag>
          <Tooltip title={`คะแนน SEO รวม: ${totalScore}/100`}>
            <Progress
              type="circle"
              percent={totalScore}
              size={40}
              strokeColor={cfg.stroke}
              format={(p) => (
                <Text
                  style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}
                >
                  {p}
                </Text>
              )}
            />
          </Tooltip>
        </Flex>
      </Flex>

      {/* ─── Check items ─── */}
      <Flex vertical gap={10}>
        {items.map((item) => (
          <div key={item.label}>
            <Flex align="center" gap={6} style={{ marginBottom: 4 }}>
              <StatusIcon item={item} />
              <Text style={{ fontSize: 12, flex: 1 }}>
                <strong>{item.label}</strong>
              </Text>
              <Tooltip title={`เป้าหมาย: ${item.ideal}`}>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {item.ideal}
                </Text>
              </Tooltip>
            </Flex>
            <LengthBar item={item} token={token} />
            {/* ✨ hint ถ้า too short / too long */}
            {item.length > 0 && item.length < item.min && (
              <Text type="secondary" style={{ fontSize: 11, paddingLeft: 20 }}>
                ⚠️ สั้นเกินไป — เพิ่มอีก {item.min - item.length} ตัวอักษร
              </Text>
            )}
            {item.length > item.max && (
              <Text style={{ fontSize: 11, paddingLeft: 20, color: "#ff4d4f" }}>
                ✖ ยาวเกินไป — ตัดออก {item.length - item.max} ตัวอักษร
              </Text>
            )}
          </div>
        ))}
      </Flex>

      <Divider style={{ margin: "4px 0" }} />

      {/* ─── Google Preview ─── */}
      <Flex vertical gap={8}>
        <Text
          type="secondary"
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          🔍 Google Preview
        </Text>
        <GooglePreview
          title={title ?? ""}
          excerpt={excerpt ?? ""}
          slug={slug ?? ""}
          token={token}
        />
      </Flex>
    </Flex>
  );
}
