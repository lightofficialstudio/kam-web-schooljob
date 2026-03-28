import type { ThemeConfig } from "antd";
import { theme } from "antd";

// ─── Brand ────────────────────────────────────────────────────────────────────
export const BRAND_COLORS = {
  primary: "#11b6f5",
  success: "#10B981",
  warning: "#F59E0B",
  error:   "#EF4444",
  info:    "#11b6f5",
} as const;

export const FONTS = {
  kanit: 'var(--font-kanit), "Kanit", system-ui, sans-serif',
} as const;

// ─── Palette ──────────────────────────────────────────────────────────────────
export const PALETTE = {
  light: {
    bgLayout:        "#F1F5F9",
    bgContainer:     "#FFFFFF",
    bgElevated:      "#FFFFFF",
    textMain:        "#0F172A",
    textSub:         "#475569",
    border:          "#E2E8F0",
    borderSecondary: "#F1F5F9",
    glassBg:         "rgba(255, 255, 255, 0.7)",
    cardBg:          "rgba(255, 255, 255, 0.8)",
  },
  dark: {
    bgLayout:        "#020617",
    bgContainer:     "#0F172A",
    bgElevated:      "#1E293B",
    textMain:        "#F8FAFC",
    textSub:         "#94A3B8",
    border:          "#1E293B",
    borderSecondary: "#0F172A",
    glassBg:         "rgba(15, 23, 42, 0.75)",
    cardBg:          "rgba(30, 41, 59, 0.5)",
  },
} as const;

export type Palette = typeof PALETTE.light;

// ─── Theme Builder ────────────────────────────────────────────────────────────
export const buildLandingTheme = (isDark: boolean): ThemeConfig => {
  const p: Palette = isDark ? PALETTE.dark : PALETTE.light;

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary:         BRAND_COLORS.primary,
      colorSuccess:         BRAND_COLORS.success,
      colorWarning:         BRAND_COLORS.warning,
      colorError:           BRAND_COLORS.error,
      colorInfo:            BRAND_COLORS.info,
      colorBgLayout:        p.bgLayout,
      colorBgContainer:     p.bgContainer,
      colorBgElevated:      p.bgElevated,
      colorTextBase:        p.textMain,
      colorTextSecondary:   p.textSub,
      colorBorder:          p.border,
      colorBorderSecondary: p.borderSecondary,
      fontFamily:           FONTS.kanit,
      fontSize:             14,
      borderRadius:         14,
      borderRadiusLG:       20,
      borderRadiusSM:       8,
      controlHeight:        44,
      fontWeightStrong:     700,
      wireframe:            false,
      motionUnit:           0.1,
    },
    components: {
      Button: {
        controlOutline: "none",
        fontWeight:     600,
        paddingInlineLG: 32,
        borderRadius:   12,
        defaultShadow:  "none",
        primaryShadow:  isDark
          ? "0 4px 12px rgba(17, 182, 245, 0.4)"
          : "0 4px 12px rgba(17, 182, 245, 0.25)",
      },
      Card: {
        paddingLG:          24,
        colorBgContainer:   isDark ? "#0F172A" : "#FFFFFF",
        boxShadowTertiary:  isDark
          ? "0 4px 24px -2px rgba(0, 0, 0, 0.6)"
          : "0 4px 24px -2px rgba(15, 23, 42, 0.06)",
        borderRadiusLG:     24,
      },
      Layout: {
        bodyBg:   p.bgLayout,
        headerBg: p.bgContainer,
      },
      Input: {
        borderRadius:         12,
        colorTextPlaceholder: isDark
          ? "rgba(255, 255, 255, 0.25)"
          : "rgba(0, 0, 0, 0.25)",
      },
      Select: {
        borderRadius:     12,
        colorBgContainer: p.bgContainer,
      },
    },
  };
};

// ─── CSS Custom Properties ────────────────────────────────────────────────────
// ใช้ใน LandingLayoutClient เพื่อ inject CSS vars ทั้งหมดในที่เดียว
export const buildCssVars = (isDark: boolean): React.CSSProperties => {
  const p: Palette = isDark ? PALETTE.dark : PALETTE.light;
  return {
    "--primary":        BRAND_COLORS.primary,
    "--bg-layout":      p.bgLayout,
    "--bg-container":   p.bgContainer,
    "--border":         p.border,
    "--text-main":      p.textMain,
    "--text-sub":       p.textSub,
    "--glass-bg":       p.glassBg,
    "--card-bg":        p.cardBg,
    "--modal-mask-bg":  isDark ? "rgba(0,0,0,0.7)"  : "rgba(0,0,0,0.45)",
    "--modal-bg":       p.bgElevated,
    "--scroll-thumb":   isDark ? "#1E293B" : "#CBD5E1",
    "--scroll-thumb-hover": isDark ? "#334155" : "#94A3B8",
  } as React.CSSProperties;
};
