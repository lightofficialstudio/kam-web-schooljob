"use client";

import { theme as antTheme, ConfigProvider, type ThemeConfig } from "antd";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  // ✨ [Initialize theme from localStorage]
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as ThemeMode | null;
    if (savedTheme) {
      setMode(savedTheme);
    }
    setMounted(true);
  }, []);

  // ✨ [Save theme to localStorage when changed]
  const toggleTheme = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("app-theme", newMode);
  };

  // ✨ [Provide context value - always available even during SSR]
  const value: ThemeContextType = { mode, toggleTheme };

  // ✨ [Ant Design Theme Configuration - Beautiful Dark Mode Support]
  const themeConfig: ThemeConfig = {
    token: {
      fontFamily:
        "'Kanit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: 16,
      colorPrimary: "#1890ff",
      borderRadius: 12,
      // ✨ [Enhanced color tokens for high visibility & Modern look]
      colorBgBase: mode === "dark" ? "#0F172A" : "#ffffff",
      colorTextBase: mode === "dark" ? "#F8FAFC" : "#1E293B",
      colorBorder: mode === "dark" ? "#334155" : "#E2E8F0",
      colorBgElevated: mode === "dark" ? "#1E293B" : "#ffffff",
      colorBgContainer: mode === "dark" ? "#1E293B" : "#ffffff",
      colorBgLayout: mode === "dark" ? "#0F172A" : "#F8FAFC",
    },
    algorithm:
      mode === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    components: {
      // ✨ [Layout Colors]
      Layout: {
        headerBg: mode === "dark" ? "#0F172A" : "#ffffff",
        headerColor: mode === "dark" ? "#F8FAFC" : "#1E293B",
        headerHeight: 72,
        siderBg: mode === "dark" ? "#0F172A" : "#ffffff",
        lightSiderBg: "#ffffff",
        bodyBg: mode === "dark" ? "#0F172A" : "#F8FAFC",
        triggerHeight: 64,
        triggerBg: mode === "dark" ? "#1E293B" : "#fafafa",
        triggerColor: mode === "dark" ? "#F8FAFC" : "#1E293B",
      },

      // ✨ [Menu Styling]
      Menu: {
        itemBg: "transparent",
        itemSelectedBg:
          mode === "dark"
            ? "rgba(24, 144, 255, 0.2)"
            : "rgba(24, 144, 255, 0.1)",
        itemSelectedColor: mode === "dark" ? "#52B8FF" : "#1890ff",
        itemHoverBg:
          mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
        itemHoverColor: mode === "dark" ? "#F8FAFC" : "#1E293B",
      },

      // ✨ [Card Styling - Clean & No Shadow Hover]
      Card: {
        colorBgContainer: mode === "dark" ? "#1E293B" : "#ffffff",
        colorBorderSecondary: mode === "dark" ? "#334155" : "#E2E8F0",
        boxShadow: "none",
        boxShadowCard: "none",
        boxShadowTertiary: "none",
        borderRadiusLG: 16,
        paddingLG: 24,
      },

      // ✨ [Button Styling]
      Button: {
        controlHeight: 44,
        borderRadius: 10,
        fontWeight: 600,
      },

      // ✨ [Input Styling]
      Input: {
        controlHeight: 48,
        borderRadius: 10,
        colorBgContainer: mode === "dark" ? "#0F172A" : "#ffffff",
        colorBorder: mode === "dark" ? "#334155" : "#E2E8F0",
      },

      // ✨ [Form Styling]
      Form: {
        labelFontSize: 15,
        labelHeight: 32,
        itemMarginBottom: 24,
      },

      // ✨ [Select Styling]
      Select: {
        colorBgContainer: mode === "dark" ? "#2D3748" : "#ffffff",
        colorBorder: mode === "dark" ? "#404854" : "#d9d9d9",
        controlHeight: 40,
        borderRadius: 8,
      },

      // ✨ [Table Styling]
      Table: {
        colorBgContainer: mode === "dark" ? "#2D3748" : "#ffffff",
        colorBgElevated: mode === "dark" ? "#1A202C" : "#fafafa",
        colorBorder: mode === "dark" ? "#404854" : "#f0f0f0",
        rowHoverBg:
          mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.02)",
        headerBg: mode === "dark" ? "#1A202C" : "#fafafa",
      },

      // ✨ [Statistic Styling]
      Statistic: {
        titleFontSize: 14,
      },

      // ✨ [Tag Styling]
      Tag: {
        colorBgContainer: mode === "dark" ? "#374151" : "#fafafa",
        colorBorder: mode === "dark" ? "#404854" : "#d9d9d9",
      },

      // ✨ [Modal Styling]
      Modal: {
        colorBgElevated: mode === "dark" ? "#2D3748" : "#ffffff",
      },

      // ✨ [Dropdown Styling]
      Dropdown: {
        colorBgElevated: mode === "dark" ? "#2D3748" : "#ffffff",
        colorBorder: mode === "dark" ? "#404854" : "#d9d9d9",
      },

      // ✨ [Tooltip Styling]
      Tooltip: {
        colorBgBase: mode === "dark" ? "#4A5568" : "#000000",
      },

      // ✨ [Divider Styling]
      Divider: {
        colorBorder: mode === "dark" ? "#404854" : "#d9d9d9",
      },

      // ✨ [Breadcrumb Styling]
      Breadcrumb: {
        colorText: mode === "dark" ? "#A0AEC0" : "rgba(0, 0, 0, 0.45)",
      },
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
