import { LayoutSelector } from "@/app/components/layouts/layout-selector";
import { NotificationModalProvider } from "@/app/components/layouts/modal/notification-modal-provider";
import { ThemeProvider } from "@/app/contexts/theme-context";
import "@/app/styles/globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Kanit } from "next/font/google";

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "School Board - แพลตฟอร์มหางานสายการศึกษา",
  description: "ศูนย์รวมงานครูและบุคลากรทางการศึกษาอันดับ 1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${kanit.variable} antialiased font-kanit`}>
        <AntdRegistry>
          <ThemeProvider>
            {/* ✨ [Notification Modal Provider] */}
            <NotificationModalProvider />

            {/* ✨ [LayoutSelector - เลือก Layout ตามสถานะ User] */}
            <LayoutSelector>{children}</LayoutSelector>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
