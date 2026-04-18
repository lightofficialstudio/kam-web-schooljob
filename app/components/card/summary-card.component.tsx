"use client";

/**
 * SummaryCard — Shared Stats Card Component
 *
 * ใช้แสดงตัวเลขสรุป (KPI/Metric) ได้ทุกหน้า รองรับ Light/Dark mode ผ่าน Ant Design token
 *
 * ─── Props ────────────────────────────────────────────────────────────────────
 * @prop title       — ชื่อ metric (เช่น "สมาชิกทั้งหมด") แสดงเป็น uppercase
 * @prop value       — ตัวเลขหรือข้อความหลัก (เช่น 42, "98%")
 * @prop unit        — หน่วยต่อท้าย value (เช่น "คน", "งาน") แสดงขนาดเล็ก
 * @prop subtitle    — ข้อความหรือ ReactNode ใต้ value (เช่น trend, คำอธิบาย)
 * @prop icon        — ReactNode ไอคอน Ant Design หรือ SVG ด้านขวาของ card
 * @prop color       — hex สีหลักของ card: accent bar, icon bg, glow (default: token.colorPrimary)
 * @prop tooltip     — คำอธิบาย hover tooltip บน title
 * @prop isLoading   — แสดง Skeleton แทน content เมื่อ true
 * @prop suffix      — alias ของ unit (ใช้ได้แทนกัน)
 * @prop trend       — แสดง trend badge: { value: "+12%", direction: "up" | "down" | "neutral" }
 * @prop onClick     — callback เมื่อ click card (เพิ่ม cursor-pointer และ hover effect)
 * @prop size        — ขนาด card: "sm" | "md" (default) | "lg"
 *
 * ─── Example ──────────────────────────────────────────────────────────────────
 * <SummaryCard
 *   title="สมาชิกทั้งหมด"
 *   value={42}
 *   unit="คน"
 *   icon={<TeamOutlined />}
 *   color="#11b6f5"
 *   trend={{ value: "+3", direction: "up" }}
 *   isLoading={isLoading}
 * />
 */

import { InfoCircleOutlined } from "@ant-design/icons";
import { Skeleton, Tooltip, theme } from "antd";
import React from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SummaryCardTrend {
  value: string;
  direction: "up" | "down" | "neutral";
}

export interface SummaryCardProps {
  /** ชื่อ metric แสดงเป็น uppercase */
  title: string;
  /** ตัวเลขหรือข้อความหลัก */
  value: string | number;
  /** หน่วยต่อท้าย value */
  unit?: string;
  /** alias ของ unit */
  suffix?: string;
  /** ข้อความหรือ ReactNode ใต้ value */
  subtitle?: React.ReactNode;
  /** ReactNode ไอคอน */
  icon?: React.ReactNode;
  /** hex สีหลักของ card */
  color?: string;
  /** คำอธิบาย hover tooltip บน title */
  tooltip?: string;
  /** แสดง Skeleton เมื่อ true */
  isLoading?: boolean;
  /** trend badge */
  trend?: SummaryCardTrend;
  /** callback เมื่อ click */
  onClick?: () => void;
  /** ขนาด card */
  size?: "sm" | "md" | "lg";
}

// ─── Trend Badge ──────────────────────────────────────────────────────────────

const TREND_COLOR: Record<SummaryCardTrend["direction"], string> = {
  up: "#22c55e",
  down: "#ef4444",
  neutral: "#94A3B8",
};

const TREND_ARROW: Record<SummaryCardTrend["direction"], string> = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

// ─── Size config ──────────────────────────────────────────────────────────────

const SIZE_CONFIG = {
  sm: {
    minHeight: 80,
    padding: "12px 16px",
    valueFontSize: 22,
    iconSize: 36,
    titleFontSize: 11,
  },
  md: {
    minHeight: 100,
    padding: "16px 20px",
    valueFontSize: 28,
    iconSize: 44,
    titleFontSize: 12,
  },
  lg: {
    minHeight: 120,
    padding: "20px 24px",
    valueFontSize: 34,
    iconSize: 52,
    titleFontSize: 13,
  },
};

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SummaryCardSkeleton({
  size = "md",
}: {
  size?: SummaryCardProps["size"];
}) {
  const cfg = SIZE_CONFIG[size ?? "md"];
  return (
    <div
      style={{
        minHeight: cfg.minHeight,
        padding: cfg.padding,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        gap: 12,
        overflow: "hidden",
      }}
    >
      <Skeleton.Avatar
        active
        size={cfg.iconSize}
        shape="square"
        style={{ borderRadius: 10, flexShrink: 0 }}
      />
      <div style={{ flex: 1 }}>
        <Skeleton active paragraph={{ rows: 2 }} title={false} />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  unit,
  suffix,
  subtitle,
  icon,
  color,
  tooltip,
  isLoading = false,
  trend,
  onClick,
  size = "md",
}) => {
  const { token } = theme.useToken();

  // ✨ ใช้ token.colorPrimary เป็น fallback ป้องกัน hardcode สีผิด
  const accentColor = color ?? token.colorPrimary;
  const cfg = SIZE_CONFIG[size];
  const unitLabel = unit ?? suffix;

  if (isLoading) return <SummaryCardSkeleton size={size} />;

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        minHeight: cfg.minHeight,
        padding: cfg.padding,
        borderRadius: 14,
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 4px 20px rgba(0,0,0,0.08)`;
        if (onClick)
          (e.currentTarget as HTMLDivElement).style.transform =
            "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.transform = "none";
      }}
    >
      {/* ✨ Accent bar ด้านบน */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: accentColor,
          borderRadius: "14px 14px 0 0",
        }}
      />

      {/* ✨ Glow background */}
      <div
        style={{
          position: "absolute",
          bottom: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: accentColor,
          opacity: 0.06,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ✨ Left: texts */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontSize: cfg.titleFontSize,
                fontWeight: 700,
                color: token.colorTextSecondary,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </span>
            {tooltip && (
              <Tooltip title={tooltip}>
                <InfoCircleOutlined
                  style={{
                    fontSize: 12,
                    color: token.colorTextQuaternary,
                    cursor: "help",
                    flexShrink: 0,
                  }}
                />
              </Tooltip>
            )}
          </div>

          {/* Value row */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: cfg.valueFontSize,
                fontWeight: 800,
                lineHeight: 1,
                color: token.colorText,
                letterSpacing: "-0.5px",
              }}
            >
              {value}
            </span>
            {unitLabel && (
              <span
                style={{
                  fontSize: cfg.titleFontSize + 1,
                  fontWeight: 600,
                  color: token.colorTextQuaternary,
                  lineHeight: 1,
                }}
              >
                {unitLabel}
              </span>
            )}
            {/* ✨ Trend badge */}
            {trend && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: TREND_COLOR[trend.direction],
                  background: `${TREND_COLOR[trend.direction]}18`,
                  borderRadius: 6,
                  padding: "2px 7px",
                  lineHeight: 1.4,
                  flexShrink: 0,
                }}
              >
                {TREND_ARROW[trend.direction]} {trend.value}
              </span>
            )}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                fontSize: 12,
                color: token.colorTextTertiary,
                marginTop: 5,
                lineHeight: 1.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* ✨ Right: icon box */}
        {icon && (
          <div
            style={{
              width: cfg.iconSize,
              height: cfg.iconSize,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${accentColor}14`,
              color: accentColor,
              fontSize: cfg.iconSize * 0.45,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
