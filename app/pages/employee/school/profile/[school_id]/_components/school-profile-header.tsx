"use client";

import {
  ArrowLeftOutlined,
  BankOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Flex,
  Row,
  Space,
  Tag,
  Typography,
  theme as antTheme,
} from "antd";
import { useRouter } from "next/navigation";
import type { SchoolProfileDetail } from "../_api/school-profile-api";

const { Title, Text, Link, Paragraph } = Typography;

interface SchoolProfileHeaderProps {
  school: SchoolProfileDetail;
}

export const SchoolProfileHeader = ({ school }: SchoolProfileHeaderProps) => {
  const { token } = antTheme.useToken();
  const router = useRouter();

  const fallbackLogo = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(school.schoolName)}`;

  return (
    <div style={{ position: "relative" }}>
      {/* ── Cover Image ── */}
      <div
        className="relative h-[320px] md:h-[400px] overflow-hidden transition-all duration-700"
        style={{
          background: school.coverImageUrl
            ? `url(${school.coverImageUrl}) center/cover no-repeat`
            : `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorInfoBgHover} 100%)`,
        }}
      >
        {/* ✨ Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />

        {/* ── decorative elements ── */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-[10%] w-60 h-60 rounded-full bg-blue-400/20 blur-2xl" />

        {/* ── ปุ่มย้อนกลับ ── */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          className="absolute top-8 left-8 h-11 border-none! text-white! font-bold backdrop-blur-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            borderRadius: 14,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          กลับหน้าหลัก
        </Button>

        {/* ✨ Quick Floating Stats in Cover (Mobile Hidden) */}
        <div className="absolute bottom-12 right-12 hidden lg:flex gap-6">
          <div className="px-6 py-4 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl flex flex-col items-center">
            <Text className="text-white text-3xl font-black leading-none">
              {school.openJobCount}
            </Text>
            <Text className="text-white/80 text-[11px] font-bold uppercase tracking-widest mt-1">
              ตำแหน่งว่าง
            </Text>
          </div>
          {school.teacherCount && (
            <div className="px-6 py-4 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl flex flex-col items-center">
              <Text className="text-white text-3xl font-black leading-none">
                {school.teacherCount.toLocaleString()}
              </Text>
              <Text className="text-white/80 text-[11px] font-bold uppercase tracking-widest mt-1">
                ทีมงานคุณภาพ
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* ── Identity Bar ── */}
      <div className="relative z-20 -mt-20 mx-auto max-w-6xl px-6 pb-12">
        <div
          className="rounded-[40px] p-8 md:p-12 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.12)] border transition-all duration-500"
          style={{
            backgroundColor: token.colorBgContainer,
            borderColor: token.colorBorderSecondary,
          }}
        >
          <Row gutter={[40, 40]} align="middle">
            <Col xs={24} md={6} lg={4}>
              <div className="relative group">
                <Avatar
                  size={140}
                  shape="square"
                  src={school.logoUrl ?? fallbackLogo}
                  className="shadow-2xl border-4 border-white! dark:border-slate-800! transition-transform duration-500 group-hover:scale-105"
                  style={{
                    borderRadius: 32,
                    backgroundColor: token.colorWhite,
                  }}
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-2xl shadow-lg">
                  <BankOutlined className="text-lg" />
                </div>
              </div>
            </Col>

            <Col xs={24} md={18} lg={20}>
              <Flex vertical gap={12}>
                <Flex align="center" gap={12} wrap>
                  <Title
                    level={1}
                    className="m-0! text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white"
                  >
                    {school.schoolName}
                  </Title>
                  <Tag
                    className="border-none! px-4 py-1 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm"
                    style={{ backgroundColor: "#EDF6FF", color: "#437FC7" }}
                  >
                    {school.schoolType || "สถาบันการศึกษา"}
                  </Tag>
                </Flex>

                <Paragraph className="max-w-3xl text-lg text-slate-500 dark:text-slate-400 font-medium m-0!">
                  {[school.district, school.province]
                    .filter(Boolean)
                    .join(", ")}{" "}
                  •
                  <span className="ml-2 text-blue-500 font-bold hover:underline cursor-pointer">
                    ดูแผนที่ <EnvironmentOutlined />
                  </span>
                </Paragraph>

                <Divider className="my-4! opacity-50" />

                <Flex gap={24} wrap className="items-center">
                  {school.phone && (
                    <Space className="bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <PhoneOutlined className="text-blue-500" />
                      <Text className="font-bold text-slate-800 dark:text-slate-200">
                        {school.phone}
                      </Text>
                    </Space>
                  )}
                  {school.email && (
                    <Space className="bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <MailOutlined className="text-blue-500" />
                      <Text className="font-bold text-slate-800 dark:text-slate-200">
                        {school.email}
                      </Text>
                    </Space>
                  )}
                  {school.website && (
                    <Button
                      type="link"
                      href={school.website}
                      target="_blank"
                      icon={<GlobalOutlined />}
                      className="h-auto p-0 font-extrabold text-[#437FC7] hover:text-blue-600 transition-colors"
                    >
                      {school.website.replace(/^https?:\/\//, "")}
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
