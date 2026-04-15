"use client";

import { useTheme } from "@/app/contexts/theme-context";
import {
  ArrowRightOutlined,
  CalendarOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import {
  theme as antTheme,
  Avatar,
  Badge,
  Button,
  Card,
  ConfigProvider,
  Skeleton,
  Tag,
} from "antd";
import { motion } from "framer-motion";
import { Briefcase, ChevronRight, MapPin, Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchLatestJobs } from "../_api/landing-api";

interface LatestJob {
  id: string;
  title: string;
  school: string;
  schoolLogo: string | null;
  location: string;
  salary: string;
  postedAt: string;
  isNew: boolean;
  tags: string[];
}

// ✨ แปลง ISO → ข้อความ relative
const formatRelativeDate = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (hours < 1) return "เมื่อกี้";
  if (hours < 24) return \`\${hours} ชม. ที่แล้ว\`;
  if (days === 1) return "1 วันที่ผ่านมา";
  return \`\${days} วันที่ผ่านมา\`;
};

// ส่วนแสดงประกาศงานใหม่ล่าสุด แบบ Grid Modern พร้อม Animation
export default function LatestJobsSection() {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const [jobs, setJobs] = useState<LatestJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✨ ดึงงานล่าสุดจาก API
  useEffect(() => {
    fetchLatestJobs()
      .then((res) => {
        if (res.status_code === 200 && res.data) {
          setJobs(res.data);
        }
      })
      .catch((err) => console.error("❌ fetchLatestJobs:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section
      className={\`relative py-24 overflow-hidden transition-colors duration-500 \${
        isDark ? "bg-[#020617]" : "bg-gray-50/50"
      }\`}
    >
      {/* 🔮 Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid pattern */}
        <div
          className={\`absolute inset-0 opacity-[0.15] dark:opacity-[0.1] \${
            isDark ? "bg-[radial-gradient(#1e293b_1px,transparent_1px)]" : "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)]"
          } [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]\`}
        />

        {/* Floating Light Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* ✨ Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <ThunderboltFilled className="text-blue-500 text-sm" />
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Opportunity
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
              ประกาศงาน{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                ใหม่ล่าสุด
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl font-medium">
              เริ่มต้นเส้นทางวิชาชีพครูและบุคลากรทางการศึกษากับสถาบันชั้นนำทั่วประเทศ
              งานใหม่ทุกวันเพื่ออนาคตที่มั่นคงของคุณ
            </p>
          </div>

          <Link href="/pages/job" className="group">
            <Button
              type="primary"
              size="large"
              className="!h-12 !px-8 !rounded-xl !bg-blue-600 !border-none hover:!bg-blue-700 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all duration-300 group-hover:gap-3"
            >
              ดูงานทั้งหมด <ArrowRightOutlined className="transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {/* 📋 Jobs Grid */}
        <ConfigProvider
          theme={{
            components: {
              Card: {
                colorBgContainer: isDark ? "#0f172a" : "#ffffff",
                borderRadiusLG: 24,
              },
            },
          }}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="dark:bg-slate-900/50 border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                      <Skeleton.Avatar active shape="circle" size={56} />
                      <Skeleton.Button active shape="square" size="small" className="w-16" />
                    </div>
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {jobs.map((job) => (
                <motion.div key={job.id} variants={itemVariants} className="group">
                  <Link href={\`/pages/job/\${job.id}\`}>
                    <Card
                      hoverable
                      className={\`h-full relative overflow-hidden transition-all duration-500 border-none group-hover:shadow-[0_20px_50px_rgba(8,112,184,0.15)] \${
                        isDark ? "bg-slate-900/40 shadow-none" : "bg-white shadow-sm"
                      }\`}
                      styles={{ body: { padding: 0 } }}
                    >
                      {/* Gradient Hover Effect */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      <div className="p-6 relative z-10 flex flex-col h-full">
                        {/* 🏢 Header: Logo & Badge */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Avatar
                              src={job.schoolLogo}
                              icon={<Briefcase />}
                              size={56}
                              className="relative ring-4 ring-white dark:ring-slate-800 rounded-2xl bg-blue-50 text-blue-500 object-cover"
                            />
                          </div>
                          {job.isNew && (
                            <Badge
                              count="NEW"
                              className="latest-job-badge"
                              style={{
                                backgroundColor: "#ef4444",
                                borderRadius: "6px",
                                fontWeight: "bold",
                                padding: "0 8px",
                                height: "20px",
                                fontSize: "10px",
                                lineHeight: "20px",
                                boxShadow: "0 4px 10px rgba(239, 68, 68, 0.3)",
                              }}
                            />
                          )}
                        </div>

                        {/* 📝 Content */}
                        <div className="flex-grow space-y-3">
                          <h3 className="text-[17px] font-black leading-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[44px]">
                            {job.title}
                          </h3>
                          <p className="text-[14px] text-gray-500 dark:text-gray-400 font-medium line-clamp-1">
                            {job.school}
                          </p>

                          <div className="pt-2 flex flex-wrap gap-1.5 min-h-[28px]">
                            {job.tags?.slice(0, 2).map((tag) => (
                              <Tag
                                key={tag}
                                className="!border-none !rounded-lg !bg-gray-100 dark:!bg-slate-800 !text-gray-600 dark:!text-gray-300 font-bold px-2.5 py-0.5 text-[11px] scale-95 origin-left"
                              >
                                {tag}
                              </Tag>
                            ))}
                          </div>
                        </div>

                        {/* 📊 Meta Data */}
                        <div className="mt-6 pt-6 border-t border-gray-50 dark:border-slate-800/50 flex flex-col gap-3">
                          <div className="flex items-center justify-between text-[13px] font-medium">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <MapPin size={14} className="text-gray-400" />
                              <span className="truncate max-w-[120px]">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-500 font-bold">
                              <Wallet size={14} />
                              {job.salary}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium">
                              <CalendarOutlined />
                              {formatRelativeDate(job.postedAt)}
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                              <ChevronRight size={18} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </ConfigProvider>
      </div>
    </section>
  );
}
