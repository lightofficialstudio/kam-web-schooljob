"use client";

import { ThemeProvider, useTheme } from "@/app/contexts/theme-context";
import type { ThemeConfig } from "antd";
import { App, ConfigProvider, Layout, theme } from "antd";
import thTH from "antd/locale/th_TH";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import React, { useMemo } from "react";
import Footer from "./footer";
import Navbar from "./navbar";

// Initialize configuration
dayjs.extend(buddhistEra);
dayjs.locale("th");

/**
 * Design Constants for 2026 Aesthetics
 */
const BRAND_COLORS = {
  primary: "#0066FF", // Blue Primary as previously defined
  success: "#10B981", // Emerald
  warning: "#F59E0B", // Amber
  error: "#EF4444", // Rose
  info: "#3B82F6", // Blue
};

const FONTS = {
  kanit: 'var(--font-kanit), "Kanit", system-ui, sans-serif',
};

const SYSTEM_PALETTE = {
  light: {
    bgLayout: "#F8FAFC",
    bgContainer: "#FFFFFF",
    bgElevated: "#FFFFFF",
    textMain: "#0F172A",
    textSub: "#64748B",
    border: "#F1F5F9",
    borderSecondary: "#F8FAFC",
  },
  dark: {
    bgLayout: "#020617",
    bgContainer: "#0F172A",
    bgElevated: "#1E293B",
    textMain: "#F8FAFC",
    textSub: "#94A3B8",
    border: "#1E293B",
    borderSecondary: "#1E293B",
  },
};

const getModernTheme = (isDark: boolean): ThemeConfig => {
  const palette = isDark ? SYSTEM_PALETTE.dark : SYSTEM_PALETTE.light;

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: BRAND_COLORS.primary,
      colorSuccess: BRAND_COLORS.success,
      colorWarning: BRAND_COLORS.warning,
      colorError: BRAND_COLORS.error,
      colorInfo: BRAND_COLORS.info,

      colorBgLayout: palette.bgLayout,
      colorBgContainer: palette.bgContainer,
      colorBgElevated: palette.bgElevated,

      colorTextBase: palette.textMain,
      colorTextSecondary: palette.textSub,

      colorBorder: palette.border,
      colorBorderSecondary: palette.borderSecondary,

      fontFamily: FONTS.kanit,
      fontSize: 14,
      borderRadius: 14,
      borderRadiusLG: 20,
      borderRadiusSM: 8,

      controlHeight: 44,
      fontWeightStrong: 700,

      wireframe: false,
      motionUnit: 0.1,
    },
    components: {
      Button: {
        controlOutline: "none",
        fontWeight: 600,
        paddingInlineLG: 32,
        borderRadius: 12,
        defaultShadow: "none",
        primaryShadow: "0 4px 12px rgba(0, 102, 255, 0.25)",
      },
      Card: {
        paddingLG: 24,
        colorBgContainer: isDark
          ? "rgba(15, 23, 42, 0.65)"
          : "rgba(255, 255, 255, 0.75)",
        boxShadowTertiary: isDark
          ? "0 4px 24px -2px rgba(0, 0, 0, 0.4)"
          : "0 4px 24px -2px rgba(0, 0, 0, 0.04)",
      },
      Layout: {
        bodyBg: palette.bgLayout,
        headerBg: palette.bgContainer,
      },
    },
  };
};

/**
 * Inner component that uses theme context
 * Must be wrapped within ThemeProvider
 */
function LandingLayoutInner({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const themeConfig = useMemo(() => getModernTheme(isDark), [isDark]);
  const palette = isDark ? SYSTEM_PALETTE.dark : SYSTEM_PALETTE.light;

  return (
    <ConfigProvider
      locale={thTH}
      theme={themeConfig}
      componentSize="middle"
      input={{ autoComplete: "off" }}
    >
      <App>
        <div
          className="ant-theme-root"
          style={
            {
              "--primary": BRAND_COLORS.primary,
              "--bg-layout": palette.bgLayout,
              "--border": palette.border,
              "--text-main": palette.textMain,
              "--glass-bg": isDark
                ? "rgba(15, 23, 42, 0.7)"
                : "rgba(255, 255, 255, 0.7)",
              "--card-glass-bg": isDark
                ? "rgba(15, 23, 42, 0.65)"
                : "rgba(255, 255, 255, 0.65)",
              "--modal-mask-bg": isDark
                ? "rgba(0, 0, 0, 0.6)"
                : "rgba(0, 0, 0, 0.45)",
              "--scroll-thumb": isDark ? "#1E293B" : "#CBD5E1",
              "--scroll-thumb-hover": isDark ? "#334155" : "#94A3B8",
              "--modal-bg": isDark ? "#1E293B" : "#FFFFFF",
            } as React.CSSProperties
          }
        >
          <style jsx global>{`
            :root {
              --font-family: ${FONTS.kanit};
            }
            body {
              background-color: var(--bg-layout);
              color: var(--text-main);
              font-family: var(--font-family);
              -webkit-font-smoothing: antialiased;
              margin: 0;
            }

            .glass-card {
              background: var(--card-glass-bg) !important;
              backdrop-filter: blur(1rem) saturate(180%) !important;
              -webkit-backdrop-filter: blur(1rem) saturate(180%) !important;
              border: 1px solid var(--border);
            }

            .ant-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.1) !important;
            }

            ::-webkit-scrollbar {
              width: 8px;
            }
            ::-webkit-scrollbar-thumb {
              background: var(--scroll-thumb);
              border-radius: 10px;
            }
          `}</style>
          <Layout
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Navbar isDark={isDark} />
            <Layout.Content
              style={{
                flex: "1 0 auto",
                width: "100%",
                maxWidth: "100vw",
                overflowX: "hidden",
              }}
            >
              <div style={{ width: "100%", height: "100%" }}>{children}</div>
            </Layout.Content>
            <Footer />
          </Layout>
        </div>
      </App>
    </ConfigProvider>
  );
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <LandingLayoutInner>{children}</LandingLayoutInner>
    </ThemeProvider>
  );
}
