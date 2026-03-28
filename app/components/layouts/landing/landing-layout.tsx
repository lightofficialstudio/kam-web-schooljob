// Server Component — ไม่มี "use client"
// Next.js 16: ดัน client boundary ลึกที่สุดเท่าที่จะทำได้
import { ThemeProvider } from "@/app/contexts/theme-context";
import type { ReactNode } from "react";
import { LandingLayoutClient } from "./landing-layout-client";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LandingLayoutClient>{children}</LandingLayoutClient>
    </ThemeProvider>
  );
}
