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

  if (!mounted) return <>{children}</>;

  // ✨ [Ant Design Theme Configuration]
  const themeConfig: ThemeConfig = {
    token: {
      fontFamily:
        "'Kanit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: 14,
      colorPrimary: "#1890ff",
      borderRadius: 8,
    },
    algorithm:
      mode === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    components: {
      Layout: {
        headerBg: mode === "dark" ? "#001529" : "#fafafa",
        headerColor:
          mode === "dark" ? "rgba(255, 255, 255, 0.88)" : "rgba(0, 0, 0, 0.88)",
        siderBg: mode === "dark" ? "#001529" : "#ffffff",
        lightSiderBg: "#ffffff",
        bodyBg: mode === "dark" ? "#141414" : "#f5f5f5",
      },
      Menu: {
        itemBg: mode === "dark" ? "transparent" : "transparent",
        itemSelectedBg:
          mode === "dark"
            ? "rgba(96, 165, 250, 0.15)"
            : "rgba(24, 144, 255, 0.1)",
      },
    },
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
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
