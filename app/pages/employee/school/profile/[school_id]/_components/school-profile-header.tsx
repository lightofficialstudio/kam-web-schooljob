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
    <div className="relative">
      {/* ── Cover Image ── */}
      <div
        className="relative h-[320px] md:h-[450px] overflow-hidden transition-all duration-700"
        style={{
          background: school.coverImageUrl
            ? `url(${school.coverImageUrl}) center/cover no-repeat`
            : `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorInfoBgHover} 100%)`,
        }}
      >
        {/* ✨ Premium Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/70" />

        {/* ── Decorative Animated Elements ── */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-[5%] w-72 h-72 rounded-full bg-blue-400/20 blur-[80px]" />

        {/* ── Navigation Button ── */}
        <div className="absolute top-8 left-8 z-30">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            className="h-12 px-6 border-none! text-white! font-bold backdrop-blur-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              borderRadius: 20,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            กลับหน้าหลัก
          </Button>
        </div>

        {/* ✨ Quick Stats Badges (Mobile Hidden) */}
        <div className="absolute bottom-16 right-12 hidden lg:flex gap-8 z-30"></div>
      </div>

      {/* ── Identity Bar ── */}
      <div className="relative z-30 -mt-24 mx-auto max-w-6xl px-6 pb-16">
        <div
          className="rounded-[48px] p-8 md:p-14 shadow-[0_48px_100px_-24px_rgba(15,23,42,0.15)] border transition-all duration-500 overflow-hidden"
          style={{
            backgroundColor: token.colorBgContainer,
            borderColor: token.colorBorderSecondary,
          }}
        >
          {/* Subtle Background pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-800/20 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />

          <Row gutter={[48, 48]} align="middle" className="relative z-10">
            <Col xs={24} md={7} lg={5}>
              <div className="relative group mx-auto md:mx-0 w-fit">
                <Avatar
                  size={160}
                  shape="square"
                  src={school.logoUrl ?? fallbackLogo}
                  className="shadow-2xl border-4 border-white! dark:border-slate-800! transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                  style={{
                    borderRadius: 40,
                    backgroundColor: token.colorWhite,
                  }}
                />
                <div className="absolute -bottom-3 -right-3 bg-[#437FC7] text-white w-12 h-12 rounded-[18px] shadow-xl flex items-center justify-center border-4 border-white dark:border-slate-800">
                  <BankOutlined className="text-xl" />
                </div>
              </div>
            </Col>

            <Col xs={24} md={17} lg={19}>
              <Flex vertical gap={16} className="text-center md:text-left">
                <Flex
                  align="center"
                  gap={16}
                  wrap
                  className="justify-center md:justify-start"
                >
                  <Title
                    level={1}
                    className="m-0! text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white"
                  >
                    {school.schoolName}
                  </Title>
                  <Tag
                    className="border-none! px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-[0.1em] shadow-sm ml-0 md:mt-2"
                    style={{ backgroundColor: "#EDF6FF", color: "#437FC7" }}
                  >
                    {school.schoolType || "สถาบันการศึกษา"}
                  </Tag>
                </Flex>

                <Paragraph className="max-w-3xl text-xl text-slate-500 dark:text-slate-400 font-medium m-0! leading-relaxed">
                  <EnvironmentOutlined className="mr-2 text-[#437FC7]" />
                  {[school.district, school.province]
                    .filter(Boolean)
                    .join(", ")}{" "}
                  <Divider type="vertical" className="mx-3 opacity-50 h-5" />
                  <span className="text-[#437FC7] font-black hover:underline cursor-pointer tracking-wide text-lg">
                    ดูแผนที่เดินทาง
                  </span>
                </Paragraph>

                <Divider className="my-6! border-slate-100 dark:border-slate-800/50" />

                <Flex
                  gap={20}
                  wrap
                  className="items-center justify-center md:justify-start"
                >
                  {school.phone && (
                    <div className="bg-slate-100 dark:bg-slate-800/50 px-6 py-3 rounded-[20px] border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-3 transition-colors hover:border-[#437FC7]">
                      <PhoneOutlined className="text-[#437FC7] text-lg" />
                      <Text className="font-black text-slate-800 dark:text-slate-100 text-base">
                        {school.phone}
                      </Text>
                    </div>
                  )}
                  {school.email && (
                    <div className="bg-slate-100 dark:bg-slate-800/50 px-6 py-3 rounded-[20px] border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-3 transition-colors hover:border-[#437FC7]">
                      <MailOutlined className="text-[#437FC7] text-lg" />
                      <Text className="font-black text-slate-800 dark:text-slate-100 text-base">
                        {school.email}
                      </Text>
                    </div>
                  )}
                  {school.website && (
                    <Button
                      type="link"
                      href={school.website}
                      target="_blank"
                      icon={<GlobalOutlined className="text-xl" />}
                      className="h-auto p-0 px-4 py-2 font-black text-[#437FC7] hover:text-blue-500 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl"
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
