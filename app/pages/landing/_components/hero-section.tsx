"use client";

import { useTheme } from "@/app/contexts/theme-context";
import { useLandingStore } from "@/app/pages/landing/_state/landing-store";
import { cn } from "@/lib/utils";
import {
  theme as antTheme,
  Button,
  Cascader,
  Col,
  Divider,
  Flex,
  Input,
  Row,
  Select,
  Tag,
  Typography,
} from "antd";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  ChevronDown,
  MapPin,
  RefreshCcw,
  Search,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const POPULAR_TAGS = [
  "ครูภาษาอังกฤษ",
  "ครูคณิตศาสตร์",
  "ธุรการโรงเรียน",
  "ครูปฐมวัย",
];

// ✨ Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Hero Section พร้อม Search Bar สำหรับ Landing Page
export default function HeroSection() {
  const router = useRouter();
  const { mode } = useTheme();
  const { token } = antTheme.useToken();
  const isDark = mode === "dark";

  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    searchParams,
    setSearchParam,
    resetSearchParams,
    buildQueryString,
    jobCategories,
    isLoadingCategories,
    fetchJobCategories: loadCategories,
  } = useLandingStore();

  // ✨ โหลดหมวดหมู่งานจาก Admin Config เมื่อ Component mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // นำทางไปยังหน้า Job พร้อม Query String
  const handleSearch = () => {
    router.push(`/pages/job?${buildQueryString()}`);
  };

  return (
    <section
      className={cn(
        "relative min-h-screen flex flex-col justify-center items-center pt-32 pb-20 px-4 md:px-8 text-center overflow-hidden transition-all duration-700",
        isDark ? "bg-[#0a0f1e]" : "bg-[#f8fbff]"
      )}
    >
      {/* ── Background Patterns — Enhanced ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(${isDark ? "rgba(255,255,255,0.1)" : "rgba(17,182,245,0.2)"} 1.5px, transparent 1.5px), linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.1)" : "rgba(17,182,245,0.2)"} 1.5px, transparent 1.5px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle at center, transparent 0%, #0a0f1e 90%)"
            : "radial-gradient(circle at center, transparent 0%, #f8fbff 90%)",
        }}
      />

      {/* ── Ambient Glows — Refined Sizes ── */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #11b6f5 0%, transparent 70%)",
        }}
      />

      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-48 -right-24 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle, #6366f1 0%, transparent 70%)"
            : "radial-gradient(circle, #11b6f5 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="relative z-10 max-w-[1280px] w-full flex flex-col items-center"
      >
        {/* ✨ Badge — Modern Compact Style */}
        <motion.div variants={fadeInUp} className="mb-6">
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full font-medium text-[13px] tracking-wide shadow-sm backdrop-blur-sm border transition-all"
            style={{
              backgroundColor: isDark ? "rgba(17,182,245,0.1)" : "rgba(17,182,245,0.08)",
              borderColor: isDark ? "rgba(17,182,245,0.2)" : "rgba(17,182,245,0.15)",
              color: token.colorPrimary,
            }}
          >
            <Sparkles size={16} className="text-[#11b6f5] animate-pulse" />
            <span>แพลตฟอร์มหางานการศึกษาอันดับ 1 ในไทย</span>
          </div>
        </motion.div>

        {/* ✨ Hero Headline — Dynamic Typography */}
        <motion.div variants={fadeInUp} className="max-w-4xl px-4">
          <Title
            level={1}
            className="text-[clamp(40px,6vw,72px)] font-extrabold mb-6 leading-[1.05] tracking-tight !m-0"
            style={{ color: isDark ? "#fff" : "#0f172a" }}
          >
            ยกระดับ{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-[#0d8fd4] via-[#11b6f5] to-[#5dd5fb] bg-clip-text text-transparent italic px-2">
                วิชาชีพครู
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8, ease: "circOut" }}
                className="absolute bottom-[10%] left-0 w-full h-[30%] bg-[#11b6f5]/15 -skew-x-12 origin-left -z-0"
              />
            </span>
            {" "}ให้ไกลกว่าเดิม
          </Title>
        </motion.div>

        {/* ✨ Description — Better Readability */}
        <motion.div variants={fadeInUp}>
          <Paragraph
            className="text-lg md:text-xl max-w-[720px] mx-auto mt-8 mb-12 leading-relaxed font-normal opacity-70"
            style={{ color: isDark ? "#cbd5e1" : "#475569" }}
          >
            ศูนย์รวมโอกาสทางวิชาชีพที่ใหญ่ที่สุด เชื่อมโยงบุคลากรทางการศึกษาคุณภาพ
            กับโรงเรียนและสถาบันชั้นนำทั่วประเทศ สมัครฟรี เริ่มต้นได้ทันที
          </Paragraph>
        </motion.div>

        {/* ✨ Search Card — Master Layout */}
        <motion.div
          variants={fadeInUp}
          className={cn(
            "w-full max-w-[1000px] mx-auto rounded-[32px] p-2 md:p-3 backdrop-blur-2xl transition-all duration-500 border overflow-hidden",
            isDark
              ? "bg-[#1e293b]/60 border-white/10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.6)]"
              : "bg-white/70 border-white/80 shadow-[0_32px_128px_-16px_rgba(17,182,245,0.15)]"
          )}
        >
          {/* Inner Content Area */}
          <div className="p-6 md:p-8">
            <Row gutter={[24, 24]} align="bottom">
              {/* 🔍 Keyword Search */}
              <Col xs={24} lg={10}>
                <div className="flex flex-col gap-2.5 items-start">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] opacity-50 px-1">
                    ตำแหน่งงานหรือสถาบัน
                  </span>
                  <Input
                    prefix={<Search size={18} className="text-[#11b6f5] mr-1" />}
                    placeholder="ครูคณิตศาสตร์, โรงเรียนนานาชาติ..."
                    value={searchParams.keyword}
                    onChange={(e) => setSearchParam("keyword", e.target.value)}
                    className="h-14 rounded-2xl text-[16px] border-none bg-gray-100/50 dark:bg-black/20 hover:bg-gray-200/50 dark:hover:bg-black/30 transition-all w-full focus:shadow-none"
                    onPressEnter={handleSearch}
                  />
                </div>
              </Col>

              {/* 🏫 Categories */}
              <Col xs={24} sm={12} lg={7}>
                <div className="flex flex-col gap-2.5 items-start">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] opacity-50 px-1">
                    วิชาเอก / สายงาน
                  </span>
                  <Cascader
                    options={jobCategories}
                    loading={isLoadingCategories}
                    multiple
                    maxTagCount={1}
                    value={searchParams.category}
                    onChange={(value) => setSearchParam("category", value as string[][])}
                    placeholder="เลือกสายงานที่สนใจ"
                    className="w-full h-14 custom-cascader"
                    size="large"
                    showCheckedStrategy={Cascader.SHOW_CHILD}
                    suffixIcon={<Briefcase size={18} className="text-[#11b6f5]" />}
                  />
                </div>
              </Col>

              {/* 📍 Location */}
              <Col xs={24} sm={12} lg={7}>
                <div className="flex flex-col gap-2.5 items-start">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] opacity-50 px-1">
                    พื้นที่ปฏิบัติงาน
                  </span>
                  <Select
                    placeholder="เลือกจังหวัด"
                    className="w-full h-14"
                    variant="borderless"
                    style={{ background: isDark ? "rgba(0,0,0,0.2)" : "rgba(243,244,246,0.5)", borderRadius: "1rem" }}
                    size="large"
                    allowClear
                    value={searchParams.location}
                    onChange={(value) => setSearchParam("location", value)}
                    suffixIcon={<MapPin size={18} className="text-[#11b6f5]" />}
                  >
                    <Option value="bkk">กรุงเทพมหานคร</Option>
                    <Option value="center">ภาคกลาง</Option>
                    <Option value="north">ภาคเหนือ</Option>
                    <Option value="east">ภาคตะวันออก</Option>
                  </Select>
                </div>
              </Col>
            </Row>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <Divider className="my-8 border-gray-200/50 dark:border-gray-800/50" />
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                      <Select
                        placeholder="รูปแบบการจ้างงาน"
                        className="w-full h-12 rounded-xl bg-gray-50/50 dark:bg-black/10"
                        variant="borderless"
                        allowClear
                        value={searchParams.employmentType}
                        onChange={(value) => setSearchParam("employmentType", value)}
                      >
                        <Option value="fulltime">Full-time</Option>
                        <Option value="parttime">Part-time</Option>
                        <Option value="contract">สัญญาจ้าง</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Select
                        placeholder="ใบประกอบวิชาชีพ"
                        className="w-full h-12 rounded-xl bg-gray-50/50 dark:bg-black/10"
                        variant="borderless"
                        allowClear
                        value={searchParams.license}
                        onChange={(value) => setSearchParam("license", value)}
                      >
                        <Option value="required">ต้องมีใบประกอบฯ</Option>
                        <Option value="not-required">ไม่ต้องมี</Option>
                        <Option value="pending">อยู่ระหว่างขอ</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Select
                        placeholder="ช่วงเงินเดือน"
                        className="w-full h-12 rounded-xl bg-gray-50/50 dark:bg-black/10"
                        variant="borderless"
                        allowClear
                        value={searchParams.salaryRange}
                        onChange={(value) => setSearchParam("salaryRange", value)}
                      >
                        <Option value="0-15000">ต่ำกว่า 15,000</Option>
                        <Option value="15000-25000">15,000 – 25,000</Option>
                        <Option value="25000-40000">25,000 – 40,000</Option>
                        <Option value="40000+">40,000 ขึ้นไป</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Select
                        placeholder="ประกาศเมื่อ"
                        className="w-full h-12 rounded-xl bg-gray-50/50 dark:bg-black/10"
                        variant="borderless"
                        allowClear
                        value={searchParams.postedAt}
                        onChange={(value) => setSearchParam("postedAt", value)}
                      >
                        <Option value="today">วันนี้</Option>
                        <Option value="3days">3 วันที่ผ่านมา</Option>
                        <Option value="7days">7 วันที่ผ่านมา</Option>
                        <Option value="30days">30 วันที่ผ่านมา</Option>
                      </Select>
                    </Col>
                  </Row>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Bar — Centered & Balanced */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <Button
                  type="text"
                  onClick={() => setShowAdvanced((v) => !v)}
                  className={cn(
                    "h-11 rounded-xl font-semibold transition-all px-4 flex items-center gap-2",
                    showAdvanced ? "text-[#11b6f5] bg-[#11b6f5]/10" : "text-gray-500 hover:text-[#11b6f5]"
                  )}
                >
                  <ChevronDown
                    size={18}
                    className={cn("transition-transform duration-500", showAdvanced && "rotate-180")}
                  />
                  <span>{showAdvanced ? "ซ่อนตัวกรอง" : "การค้นหาขั้นสูง"}</span>
                </Button>

                {showAdvanced && (
                  <Button
                    type="text"
                    icon={<RefreshCcw size={16} />}
                    className="h-11 rounded-xl text-red-500/80 hover:text-red-500 hover:bg-red-50 flex items-center gap-2"
                    onClick={resetSearchParams}
                  >
                    <span>รีเซ็ต</span>
                  </Button>
                )}
              </div>

              <Button
                type="primary"
                size="large"
                icon={<Search size={22} />}
                onClick={handleSearch}
                className="h-14 w-full md:w-[280px] rounded-2xl font-bold text-lg shadow-[0_12px_24px_-8px_rgba(17,182,245,0.4)] hover:shadow-[0_16px_32px_-8px_rgba(17,182,245,0.5)] active:scale-[0.98] transition-all bg-gradient-to-r from-[#0d8fd4] to-[#11b6f5] border-none flex items-center justify-center gap-3"
              >
                ค้นหาตำแหน่งงาน
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ✨ Footer Tags — Minimalist Style */}
        <motion.div
          variants={fadeInUp}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-70"
        >
          <span className="text-[13px] font-medium tracking-wide">ตำแหน่งงานยอดนิยม:</span>
          <div className="flex flex-wrap justify-center gap-2.5">
            {POPULAR_TAGS.map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ y: -2, opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-[13px] border transition-all",
                  isDark
                    ? "bg-white/5 border-white/10 text-gray-400 hover:border-[#11b6f5]/50 hover:text-[#11b6f5]"
                    : "bg-white border-gray-200 text-gray-500 hover:border-[#11b6f5] hover:text-[#11b6f5] shadow-sm"
                )}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
