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
      fontSize: 14,
      colorPrimary: mode === "dark" ? "#1890ff" : "#1890ff",
      borderRadius: 8,
      // ✨ [Enhanced color tokens for dark mode]
      colorBgBase: mode === "dark" ? "#1A202C" : "#ffffff",
      colorTextBase: mode === "dark" ? "#E2E8F0" : "#000000",
      colorBorder: mode === "dark" ? "#404854" : "#d9d9d9",
      colorBgElevated: mode === "dark" ? "#2D3748" : "#fafafa",
      colorBgContainer: mode === "dark" ? "#2D3748" : "#f6f6f6",
      colorBgLayout: mode === "dark" ? "#0D1117" : "#f5f5f5",
    },
    algorithm:
      mode === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    components: {
      // ✨ [Layout Colors]
      Layout: {
        headerBg: mode === "dark" ? "#1A202C" : "#fafafa",
        headerColor: mode === "dark" ? "#E2E8F0" : "rgba(0, 0, 0, 0.88)",
        headerHeight: 64,
        siderBg: mode === "dark" ? "#1A202C" : "#ffffff",
        lightSiderBg: "#ffffff",
        bodyBg: mode === "dark" ? "#0D1117" : "#f5f5f5",
        triggerHeight: 64,
        triggerBg: mode === "dark" ? "#2D3748" : "#fafafa",
        triggerColor: mode === "dark" ? "#E2E8F0" : "rgba(0, 0, 0, 0.88)",
      },

      // ✨ [Menu Styling]
      Menu: {
        itemBg: mode === "dark" ? "transparent" : "transparent",
        itemSelectedBg:
          mode === "dark"
            ? "rgba(24, 144, 255, 0.2)"
            : "rgba(24, 144, 255, 0.1)",
        itemSelectedColor: mode === "dark" ? "#52B8FF" : "#1890ff",
        itemHoverBg:
          mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.04)",
        itemHoverColor: mode === "dark" ? "#E2E8F0" : "rgba(0, 0, 0, 0.88)",
      },

      // ✨ [Card Styling]
      Card: {
        colorBgContainer: mode === "dark" ? "#2D3748" : "#ffffff",
        colorBorder: mode === "dark" ? "#404854" : "#d9d9d9",
        boxShadow:
          mode === "dark"
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        borderRadiusLG: 8,
        paddingLG: 24,
      },

      // ✨ [Button Styling]
      Button: {
        colorBgContainer: mode === "dark" ? "#2D3748" : "#ffffff",
        colorBorder: mode === "dark" ? "#404854" : "#d9d9d9",
        controlHeight: 40,
        borderRadius: 8,
      },

      // ✨ [Input Styling]
      Input: {
        colorBgContainer: mode === "dark" ? "#2D3748" : "#ffffff",
        colorBorder: mode === "dark" ? "#404854" : "#d9d9d9",
        colorTextPlaceholder:
          mode === "dark" ? "#718096" : "rgba(0, 0, 0, 0.45)",
        colorBgElevated: mode === "dark" ? "#374151" : "#f5f5f5",
        borderRadius: 8,
        controlHeight: 40,
      },

      // ✨ [Form Styling]
      Form: {
        labelFontSize: 14,
        labelHeight: 32,
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
