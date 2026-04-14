"use client";

import {
  theme as antTheme,
  App,
  ConfigProvider,
  type ThemeConfig,
} from "antd";
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
  const [mode, setMode] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  // ✨ [Initialize theme from localStorage]
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as ThemeMode | null;
    if (savedTheme) {
      setMode(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
    setMounted(true);
  }, []);

  // ✨ [Save theme to localStorage when changed]
  const toggleTheme = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("app-theme", newMode);
    document.documentElement.setAttribute("data-theme", newMode);
  };

  // ✨ [Provide context value - always available even during SSR]
  const value: ThemeContextType = { mode, toggleTheme };

  // ✨ [Ant Design Theme Configuration - Beautiful Dark Mode Support]
  const themeConfig: ThemeConfig = {
    token: {
      fontFamily:
        "'Kanit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: 14,
      colorPrimary: "#11b6f5",
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
            ? "rgba(17, 182, 245, 0.2)"
            : "rgba(17, 182, 245, 0.1)",
        itemSelectedColor: mode === "dark" ? "#52B8FF" : "#11b6f5",
        itemHoverBg:
          mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
        itemHoverColor: mode === "dark" ? "#F8FAFC" : "#1E293B",
      },

      // ✨ [Card Styling - Clean & No Shadow Hover]
      Card: {
        colorBgContainer: mode === "dark" ? "#1E293B" : "#ffffff",
        colorBorderSecondary: mode === "dark" ? "#334155" : "#E2E8F0",
        boxShadow: "none",
        boxShadowTertiary: "none",
        borderRadiusLG: 16,
        paddingLG: 24,
      },

      // ✨ [Button Styling - Capsule Style]
      Button: {
        controlHeight: 36,
        borderRadius: 100,
        fontWeight: 500,
      },

      // ✨ [Input Styling - รองรับ Dark Mode ทุก variant: Text, Password, TextArea, Search]
      Input: {
        controlHeight: 36,
        borderRadius: 8,
        colorBgContainer: mode === "dark" ? "#1E293B" : "#ffffff",
        colorBorder: mode === "dark" ? "#334155" : "#E2E8F0",
        colorText: mode === "dark" ? "#F8FAFC" : "#1E293B",
        colorTextPlaceholder: mode === "dark" ? "#64748B" : "#9CA3AF",
        hoverBorderColor: "#11b6f5",
        activeBorderColor: "#11b6f5",
        activeShadow:
          mode === "dark"
            ? "0 0 0 2px rgba(17,182,245,0.2)"
            : "0 0 0 2px rgba(17,182,245,0.1)",
        addonBg: mode === "dark" ? "#0F172A" : "#fafafa",
        colorBgContainerDisabled: mode === "dark" ? "#0F172A" : "#f5f5f5",
        colorTextDisabled: mode === "dark" ? "#475569" : "#00000040",
      },

      // ✨ [InputNumber Styling - รองรับ Dark Mode]
      InputNumber: {
        controlHeight: 36,
        borderRadius: 8,
        colorBgContainer: mode === "dark" ? "#1E293B" : "#ffffff",
        colorBorder: mode === "dark" ? "#334155" : "#E2E8F0",
        colorText: mode === "dark" ? "#F8FAFC" : "#1E293B",
        colorTextPlaceholder: mode === "dark" ? "#64748B" : "#9CA3AF",
        hoverBorderColor: "#11b6f5",
        activeBorderColor: "#11b6f5",
        activeShadow:
          mode === "dark"
            ? "0 0 0 2px rgba(17,182,245,0.2)"
            : "0 0 0 2px rgba(17,182,245,0.1)",
        colorBgContainerDisabled: mode === "dark" ? "#0F172A" : "#f5f5f5",
      },

      // ✨ [Form Styling]
      Form: {
        labelFontSize: 14,
        labelHeight: 28,
        itemMarginBottom: 20,
      },

      // ✨ [Select Styling]
      Select: {
        colorBgContainer: mode === "dark" ? "#1E293B" : "#ffffff",
        colorBorder: mode === "dark" ? "#334155" : "#E2E8F0",
        colorText: mode === "dark" ? "#F8FAFC" : "#1E293B",
        colorTextPlaceholder: mode === "dark" ? "#64748B" : "#9CA3AF",
        controlHeight: 40,
        borderRadius: 8,
        optionSelectedBg:
          mode === "dark" ? "rgba(17,182,245,0.15)" : "rgba(17,182,245,0.08)",
        optionActiveBg:
          mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
      },

      // ✨ [DatePicker / TimePicker Styling - รองรับ Dark Mode]
      DatePicker: {
        controlHeight: 36,
        borderRadius: 8,
        colorBgContainer: mode === "dark" ? "#1E293B" : "#ffffff",
        colorBgElevated: mode === "dark" ? "#1E293B" : "#ffffff",
        colorBorder: mode === "dark" ? "#334155" : "#E2E8F0",
        colorText: mode === "dark" ? "#F8FAFC" : "#1E293B",
        colorTextPlaceholder: mode === "dark" ? "#64748B" : "#9CA3AF",
        colorIcon: mode === "dark" ? "#94A3B8" : "#9CA3AF",
        colorIconHover: "#11b6f5",
        hoverBorderColor: "#11b6f5",
        activeBorderColor: "#11b6f5",
        activeShadow:
          mode === "dark"
            ? "0 0 0 2px rgba(17,182,245,0.2)"
            : "0 0 0 2px rgba(17,182,245,0.1)",
        colorTextDisabled: mode === "dark" ? "#475569" : "#00000040",
        cellHoverBg:
          mode === "dark" ? "rgba(17,182,245,0.1)" : "rgba(17,182,245,0.06)",
        cellActiveWithRangeBg:
          mode === "dark" ? "rgba(17,182,245,0.08)" : "rgba(17,182,245,0.04)",
      },

      // ✨ [Table Styling - Striped Rows]
      Table: {
        colorBgContainer: mode === "dark" ? "#1E293B" : "#ffffff",
        colorBgElevated: mode === "dark" ? "#0F172A" : "#fafafa",
        colorBorder: mode === "dark" ? "#334155" : "#f0f0f0",
        rowHoverBg:
          mode === "dark"
            ? "rgba(17, 182, 245, 0.08)"
            : "rgba(17, 182, 245, 0.05)",
        headerBg: mode === "dark" ? "#0F172A" : "#f0f7ff",
        headerColor: mode === "dark" ? "#94A3B8" : "#64748B",
        headerSplitColor: mode === "dark" ? "#334155" : "#E2E8F0",
        rowExpandedBg: mode === "dark" ? "#162032" : "#f8fbff",
        bodySortBg: mode === "dark" ? "#1a2744" : "#f0f7ff",
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
      <ConfigProvider theme={themeConfig}>
        <App>{children}</App>
      </ConfigProvider>
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
