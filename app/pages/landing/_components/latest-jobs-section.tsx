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
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ChevronRight, MapPin, Wallet, Sparkles } from "lucide-react";
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

const formatRelativeDate = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (hours < 1) return "เมื่อกี้";
  if (hours < 24) return String(hours) + " ชม. ที่แล้ว";
  if (days === 1) return "1 วันที่ผ่านมา";
  return String(days) + " วันที่ผ่านมา";
};

export default function LatestJobsSection() {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const [jobs, setJobs] = useState<LatestJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLatestJobs()
      .then((res) => {
        if (res.status_code === 200 && res.data) {
          setJobs(res.data);
        }
      })
      .catch((err) => console.error("fetchLatestJobs error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  // ✨ Dynamic Colors based on Theme
  const sectionBgClass = isDark 
    ? "bg-[#020617]" 
    : "bg-gradient-to-b from-slate-50 to-white";
  
  const gridPatternClass = isDark 
    ? "bg-[radial-gradient(#1e293b_1px,transparent_1px)]" 
    : "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)]";

  const titleColorClass = isDark ? "text-white" : "text-slate-900";
  const descColorClass = isDark ? "text-slate-400" : "text-slate-600";
  const cardBorderClass = isDark ? "border-slate-800/60" : "border-slate-200";

  return (
    <section className={"relative py-32 overflow-hidden transition-colors duration-700 " + sectionBgClass}>
      {/* ✨ Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={"absolute inset-0 opacity-[0.2] dark:opacity-[0.15] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] " + gridPatternClass} />
        
        {/* Animated Glows */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[32rem] h-[32rem] bg-blue-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -right-24 w-[28rem] h-[28rem] bg-indigo-600/15 rounded-full blur-[100px]" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Sparkles className="text-blue-500 dark:text-blue-400 w-4 h-4" />
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.15em]">
                Latest Opportunities
              </span>
            </div>
            
            <div className="space-y-2">
              <h2 className={"text-4xl md:text-6xl font-black tracking-tight leading-[1.1] transition-colors " + titleColorClass}>
                ค้นหางาน <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">ที่ใช่</span>
                  <motion.span 
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute bottom-2 left-0 h-3 bg-blue-500/10 -z-0 rounded-full"
                  />
                </span> สำหรับคุณ
              </h2>
              <p className={"text-lg md:text-xl max-w-2xl font-medium leading-relaxed transition-colors " + descColorClass}>
                เชื่อมต่อโรงเรียนชั้นนำกับบุคลากรคุณภาพ พร้อมสวัสดิการและสภาพแวดล้อมที่ส่งเสริมการเติบโต
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/pages/job">
              <Button
                type="primary"
                size="large"
                className="group !h-14 !px-10 !rounded-2xl !bg-slate-900 dark:!bg-white !text-white dark:!text-slate-900 !border-none hover:!scale-105 active:!scale-95 shadow-xl transition-all duration-300 flex items-center gap-3 font-bold"
              >
                ดูประกาศงานทั้งหมด 
                <ArrowRightOutlined className="transition-transform group-hover:translate-x-1.5" />
              </Button>
            </Link>
          </motion.div>
        </header>

        <ConfigProvider
          theme={{
            token: {
              colorBgContainer: isDark ? "rgba(15, 23, 42, 0.6)" : "#ffffff",
              borderRadiusLG: 28,
              colorText: isDark ? "#ffffff" : "#0f172a",
              colorTextDescription: isDark ? "#94a3b8" : "#475569",
            },
          }}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className={"backdrop-blur-sm " + cardBorderClass}>
                    <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-center">
                        <Skeleton.Avatar active shape="square" size={64} className="!rounded-2xl" />
                        <Skeleton.Button active shape="round" size="small" className="w-16" />
                      </div>
                      <Skeleton active paragraph={{ rows: 3 }} />
                    </div>
                  </Card>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {jobs.map((job) => (
                  <motion.div 
                    key={job.id} 
                    variants={itemVariants} 
                    whileHover={{ y: -12 }}
                    className="group"
                  >
                    <Link href={"/pages/job?job_id=" + job.id}>
                      <Card
                        hoverable
                        className={"h-full relative overflow-hidden transition-all duration-500 border backdrop-blur-md " + cardBorderClass + " group-hover:border-blue-500/30 group-hover:shadow-[0_32px_64px_-16px_rgba(30,58,138,0.12)] " + (isDark ? "dark:group-hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)]" : "")}
                        styles={{ body: { padding: 0 } }}
                      >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-20 -mt-20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="p-8 relative z-10 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-8">
                            <div className="relative">
                              <div className="absolute inset-0 bg-blue-500/25 rounded-[22px] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-110" />
                              <Avatar
                                src={job.schoolLogo}
                                icon={<Briefcase />}
                                size={64}
                                className="relative ring-1 ring-slate-200 dark:ring-slate-700 rounded-[20px] bg-slate-50 dark:bg-slate-800 text-blue-500 transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            
                            {job.isNew && (
                              <Badge
                                count="NEW"
                                style={{
                                  backgroundColor: isDark ? "#3b82f6" : "#2563eb",
                                  borderRadius: "10px",
                                  fontWeight: "800",
                                  padding: "0 10px",
                                  height: "22px",
                                  fontSize: "10px",
                                  letterSpacing: "0.05em",
                                  lineHeight: "22px",
                                  border: "none",
                                  boxShadow: "0 8px 16px -4px rgba(37, 99, 235, 0.4)",
                                }}
                              />
                            )}
                          </div>

                          <div className="flex-grow space-y-4">
                            <div className="space-y-2">
                              <h3 className={"text-xl font-bold leading-tight transition-colors line-clamp-2 min-h-[56px] tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 " + titleColorClass}>
                                {job.title}
                              </h3>
                              <p className={"text-sm font-semibold line-clamp-1 flex items-center gap-2 transition-colors " + descColorClass}>
                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                {job.school}
                              </p>
                            </div>

                            <div className="pt-2 flex flex-wrap gap-2 min-h-[32px]">
                              {(job.tags || []).slice(0, 2).map((tag) => (
                                <Tag
                                  key={tag}
                                  className="!border-none !rounded-xl !bg-slate-100 dark:!bg-slate-800/80 !text-slate-600 dark:!text-slate-300 font-bold px-3 py-1 text-[11px] transition-colors group-hover:!bg-blue-500/10 group-hover:!text-blue-600"
                                >
                                  {tag}
                                </Tag>
                              ))}
                            </div>
                          </div>

                          <div className={"mt-8 pt-8 border-t flex flex-col gap-5 " + (isDark ? "border-slate-800/60" : "border-slate-100")}>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Location</span>
                                <div className={"flex items-center gap-1.5 font-bold text-xs transition-colors " + (isDark ? "text-slate-300" : "text-slate-700")}>
                                  <MapPin size={14} className="text-blue-500" />
                                  <span className="truncate">{job.location}</span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Salary</span>
                                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                                  <Wallet size={14} />
                                  {job.salary}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold group-hover:text-slate-500 transition-colors">
                                <CalendarOutlined className="text-blue-500/70" />
                                {formatRelativeDate(job.postedAt)}
                              </div>
                              <motion.div whileHover={{ x: 4 }} className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold text-xs">
                                รายละเอียด <ChevronRight size={16} />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </ConfigProvider>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className={"text-sm font-medium transition-colors " + descColorClass}>
            มีงานใหม่เพิ่มเข้ามาทุกวัน — <Link href="/pages/signup" className="text-blue-500 hover:underline font-bold">สมัครสมาชิก</Link> เพื่อรับการแจ้งเตือนงานที่ตรงใจคุณ
          </p>
        </motion.div>
      </div>
    </section>
  );
}
