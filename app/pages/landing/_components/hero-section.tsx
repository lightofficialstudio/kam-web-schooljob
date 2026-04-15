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
  Input,
  Row,
  Select,
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
  Star,
  Zap,
  BookOpen,
  GraduationCap,
  Target
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ─── ✨ ข้อมูลจังหวัด ──────────────────────────────────────────────
interface Province {
  id: number;
  name_th: string;
}
interface District {
  id: number;
  name_th: string;
  province_id: number;
}

const BASE_GEO =
  "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const POPULAR_TAGS = [
  "ครูภาษาอังกฤษ",
  "ครูคณิตศาสตร์",
  "ธุรการโรงเรียน",
  "ครูปฐมวัย",
];

// ✨ แอนิเมชันพื้นฐาน
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

// ✨ องค์ประกอบตกแต่งแบบล่องลอย (Floating Elements)
const FloatingIcon = ({ icon: Icon, delay = 0, x = "0%", y = "0%", size = 24, color = "#11b6f5" }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.2, 0.5, 0.2],
      y: ["-20px", "20px", "-20px"],
      x: ["-10px", "10px", "-10px"],
      rotate: [0, 10, -10, 0],
      scale: 1
    }}
    transition={{ 
      duration: 8 + delay, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay: delay 
    }}
    className="absolute pointer-events-none hidden lg:block"
    style={{ left: x, top: y }}
  >
    <Icon size={size} style={{ color }} opacity={0.6} />
  </motion.div>
);

export default function HeroSection() {
  const router = useRouter();
  const { mode } = useTheme();
  const { token } = antTheme.useToken();
  const isDark = mode === "dark";

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [geoOptions, setGeoOptions] = useState<any[]>([]);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);

  const {
    searchParams,
    setSearchParam,
    resetSearchParams,
    buildQueryString,
    jobCategories,
    isLoadingCategories,
    fetchJobCategories: loadCategories,
  } = useLandingStore();

  useEffect(() => {
    loadCategories();
    const fetchGeoData = async () => {
      setIsLoadingGeo(true);
      try {
        const [pRes, dRes] = await Promise.all([
          fetch(`${BASE_GEO}/province.json`).then((r) => r.json()),
          fetch(`${BASE_GEO}/district.json`).then((r) => r.json()),
        ]);
        const provinces = pRes as Province[];
        const districts = dRes as District[];
        const options = provinces.map((p) => ({
          label: p.name_th,
          value: p.name_th,
          children: districts
            .filter((d) => d.province_id === p.id)
            .map((d) => ({
              label: d.name_th,
              value: d.name_th,
            })),
        }));
        setGeoOptions(options);
      } catch (err) {
        console.error("❌ fetchGeoData:", err);
      } finally {
        setIsLoadingGeo(false);
      }
    };
    fetchGeoData();
  }, [loadCategories]);

  const handleSearch = () => {
    router.push(`/pages/job?${buildQueryString()}`);
  };

  return (
    <section
      className={cn(
        "relative min-h-screen flex flex-col justify-center items-center pt-32 pb-20 px-4 md:px-8 text-center overflow-hidden transition-all duration-700",
        isDark ? "bg-[#020617]" : "bg-[#f8fbff]",
      )}
    >
      {/* ── ✨ องค์ประกอบล่องลอยแบบ Minimal ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingIcon icon={Sparkles} x="10%" y="20%" size={32} delay={0} />
        <FloatingIcon icon={BookOpen} x="85%" y="15%" size={28} delay={2} color="#0d8fd4" />
        <FloatingIcon icon={GraduationCap} x="15%" y="70%" size={40} delay={4} color="#5dd5fb" />
        <FloatingIcon icon={Star} x="80%" y="75%" size={24} delay={1} />
        <FloatingIcon icon={Zap} x="50%" y="10%" size={20} delay={3} color="#11b6f5" />
        <FloatingIcon icon={Briefcase} x="5%" y="45%" size={26} delay={5} />
        <FloatingIcon icon={Target} x="92%" y="40%" size={30} delay={2.5} color="#0d8fd4" />
      </div>

      {/* ── พื้นหลังตกแต่ง ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(${isDark ? "rgba(255,255,255,0.1)" : "rgba(17,182,245,0.2)"} 1.5px, transparent 1.5px), linear-gradient(90deg, ${isDark ? "rgba(255,255,255,0.1)" : "rgba(17,182,245,0.2)"} 1.5px, transparent 1.5px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── แสงฟุ้งแอนิเมชัน ── */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 w-125 h-125 rounded-full blur-[120px] pointer-events-none"
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
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -bottom-48 -right-24 w-150 h-150 rounded-full blur-[150px] pointer-events-none"
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
        className="relative z-10 max-w-7xl w-full flex flex-col items-center"
      >
        {/* ✨ Badge — แพลตฟอร์มอันดับ 1 */}
        <motion.div variants={fadeInUp} className="mb-6">
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full font-medium text-[13px] tracking-wide shadow-sm backdrop-blur-sm border transition-all"
            style={{
              backgroundColor: isDark ? "rgba(17,182,245,0.1)" : "rgba(17,182,245,0.08)",
              borderColor: isDark ? "rgba(17,182,245,0.2)" : "rgba(17,182,245,0.15)",
              color: "#11b6f5",
            }}
          >
            <Sparkles size={16} className="text-[#11b6f5] animate-pulse" />
            <span>แพลตฟอร์มหางานการศึกษาอันดับ 1 ในไทย</span>
          </div>
        </motion.div>

        {/* ✨ Hero Headline */}
        <motion.div variants={fadeInUp} className="max-w-4xl px-4">
          <Title
            level={1}
            className="text-[clamp(40px,6vw,72px)] font-extrabold mb-6 leading-[1.05] tracking-tight m-0!"
            style={{ color: isDark ? "#fff" : "#0f172a" }}
          >
            ยกระดับ{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-linear-to-r from-[#0d8fd4] via-[#11b6f5] to-[#5dd5fb] bg-clip-text text-transparent italic px-2">
                วิชาชีพครู
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8, ease: "circOut" }}
                className="absolute bottom-[10%] left-0 w-full h-[30%] bg-[#11b6f5]/15 -skew-x-12 origin-left z-0"
              />
            </span>{" "}
            ให้ไกลกว่าเดิม
          </Title>
        </motion.div>

        {/* ✨ Description */}
        <motion.div variants={fadeInUp}>
          <Paragraph
            className="text-lg md:text-xl max-w-180 mx-auto mt-8 mb-12 leading-relaxed font-medium opacity-70"
            style={{ color: isDark ? "#cbd5e1" : "#475569" }}
          >
            ศูนย์รวมโอกาสทางวิชาชีพที่ใหญ่ที่สุด เชื่อมโยงบุคลากรทางการศึกษาคุณภาพ
            กับโรงเรียนและสถาบันชั้นนำทั่วประเทศ สมัครฟรี เริ่มต้นได้ทันที
          </Paragraph>
        </motion.div>

        {/* ✨ Search Card — ส่วนค้นหาหลัก */}
        <motion.div
          variants={fadeInUp}
          className={cn(
            "w-full max-w-255 mx-auto rounded-4xl p-2 md:p-3 backdrop-blur-2xl transition-all duration-500 border overflow-hidden",
            isDark
              ? "bg-[#1e293b]/60 border-white/10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.6)]"
              : "bg-white/70 border-white/80 shadow-[0_32px_128px_-16px_rgba(17,182,245,0.15)]",
          )}
        >
          <div className="p-6 md:p-8">
            <Row gutter={[20, 20]} align="bottom">
              <Col xs={24} lg={10}>
                <div className="flex flex-col gap-2.5 items-start">
                  <span className="text-[11px] font-bold uppercase tracking-widest opacity-60 px-1 dark:text-blue-300 text-blue-600">
                    ตำแหน่งงานหรือสถานศึกษา
                  </span>
                  <Input
                    prefix={<Search size={18} className="text-[#11b6f5] mr-1" />}
                    placeholder="ครูคณิตศาสตร์, โรงเรียนนานาชาติ..."
                    value={searchParams.keyword}
                    onChange={(e) => setSearchParam("keyword", e.target.value)}
                    className="h-14 rounded-2xl text-[16px] border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/20 hover:border-[#11b6f5] focus:border-[#11b6f5] transition-all w-full focus:shadow-none"
                    onPressEnter={handleSearch}
                    size="large"
                  />
                </div>
              </Col>

              <Col xs={24} sm={12} lg={7}>
                <div className="flex flex-col gap-2.5 items-start">
                  <span className="text-[11px] font-bold uppercase tracking-widest opacity-60 px-1 dark:text-blue-300 text-blue-600">
                    วิชาเอก / สายงาน
                  </span>
                  <Cascader
                    options={jobCategories}
                    loading={isLoadingCategories}
                    multiple
                    maxTagCount={1}
                    showSearch
                    value={searchParams.category}
                    onChange={(value) => setSearchParam("category", value as string[][])}
                    placeholder="เลือกสายงานที่สนใจ"
                    style={{ width: "100%" }}
                    className="h-14 custom-cascader border-gray-300! dark:border-gray-600! rounded-2xl"
                    popupClassName="min-w-[280px]"
                    size="large"
                    showCheckedStrategy={Cascader.SHOW_CHILD}
                    suffixIcon={<Briefcase size={18} className="text-[#11b6f5]" />}
                  />
                </div>
              </Col>

              <Col xs={24} sm={12} lg={7}>
                <div className="flex flex-col gap-2.5 items-start">
                  <span className="text-[11px] font-bold uppercase tracking-widest opacity-60 px-1 dark:text-blue-300 text-blue-600">
                    พื้นที่ปฏิบัติงาน
                  </span>
                  <Cascader
                    options={geoOptions}
                    loading={isLoadingGeo}
                    showSearch
                    placeholder="เลือกจังหวัด / เขต"
                    style={{ width: "100%" }}
                    className="h-14 custom-cascader border-gray-300! dark:border-gray-600! rounded-2xl"
                    popupClassName="min-w-[200px]"
                    size="large"
                    value={searchParams.location as string[] | undefined}
                    onChange={(value) => setSearchParam("location", value as string[])}
                    expandTrigger="hover"
                    suffixIcon={<MapPin size={18} className="text-[#11b6f5]" />}
                  />
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
                        className="w-full h-12 rounded-xl"
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
                        className="w-full h-12 rounded-xl"
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
                        className="w-full h-12 rounded-xl"
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
                        className="w-full h-12 rounded-xl"
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

            <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <Button
                  type="text"
                  onClick={() => setShowAdvanced((v) => !v)}
                  className={cn(
                    "h-11 rounded-xl font-bold transition-all px-5 flex items-center gap-2 border border-transparent",
                    showAdvanced ? "text-[#11b6f5] bg-[#11b6f5]/10 border-[#11b6f5]/20" : "text-gray-500 hover:text-[#11b6f5]"
                  )}
                >
                  <ChevronDown size={18} className={cn("transition-transform duration-500", showAdvanced && "rotate-180")} />
                  <span>{showAdvanced ? "ซ่อนตัวกรอง" : "การค้นหาขั้นสูง"}</span>
                </Button>
                {showAdvanced && (
                  <Button
                    type="text"
                    icon={<RefreshCcw size={16} />}
                    className="h-11 rounded-xl text-red-500 hover:bg-red-50 flex items-center gap-2"
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
                className="h-14 w-full md:w-[320px] rounded-2xl font-bold text-lg shadow-[0_20px_40px_-12px_rgba(17,182,245,0.4)] hover:shadow-[0_24px_48px_-12px_rgba(17,182,245,0.5)] active:scale-[0.98] transition-all bg-linear-to-r from-[#0d8fd4] to-[#11b6f5] border-none flex items-center justify-center gap-3"
              >
                ค้นหาตำแหน่งงาน
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ✨ Footer Tags */}
        <motion.div variants={fadeInUp} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-70">
          <span className="text-[13px] font-medium tracking-wide">ตำแหน่งงานยอดนิยม:</span>
          <div className="flex flex-wrap justify-center gap-2.5">
            {POPULAR_TAGS.map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ y: -2, opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-[13px] border transition-all",
                  isDark ? "bg-white/5 border-white/10 text-gray-400 hover:text-[#11b6f5]" : "bg-white border-gray-200 text-gray-500 hover:border-[#11b6f5] hover:text-[#11b6f5] shadow-sm"
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
