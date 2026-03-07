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
  title: "Kam SchoolJob - ค้นหาคอร์สเรียนที่ใช่",
  description: "ศูนย์รวมคอร์สเรียนออนไลน์และติวเตอร์คุณภาพ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${kanit.variable} antialiased font-kanit`}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
