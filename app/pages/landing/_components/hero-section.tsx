"use client";

import { useTheme } from "@/app/contexts/theme-context";
import { useLandingStore } from "@/app/pages/landing/_state/landing-store";
import { cn } from "@/lib/utils";
import {
  theme as antTheme,
  Button,
  Cascader,
  Col,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  ChevronDown,
  GraduationCap,
  MapPin,
  RefreshCcw,
  Search,
  Sparkles,
  Star,
  Target,
  Zap,
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
const FloatingIcon = ({
  icon: Icon,
  delay = 0,
  x = "0%",
  y = "0%",
  size = 24,
  color = "#437FC7",
}: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.3, 0.6, 0.3],
      y: ["-30px", "30px", "-30px"],
      x: ["-15px", "15px", "-15px"],
      rotate: [0, 15, -15, 0],
      scale: 1,
    }}
    transition={{
      duration: 10 + delay,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay,
    }}
    className="absolute pointer-events-none hidden lg:block"
    style={{ left: x, top: y }}
  >
    <Icon size={size} style={{ color }} opacity={0.5} />
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
        "relative min-h-[90vh] flex flex-col justify-center items-center pt-40 pb-24 px-4 md:px-8 text-center overflow-hidden transition-all duration-700",
        isDark ? "bg-[#0F172A]" : "bg-[#FFFFFF]",
      )}
    >
      {/* ── ✨ องค์ประกอบล่องลอยแบบ Minimal ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingIcon
          icon={Sparkles}
          x="8%"
          y="15%"
          size={36}
          delay={0}
          color="#437FC7"
        />
        <FloatingIcon
          icon={BookOpen}
          x="88%"
          y="12%"
          size={32}
          delay={2}
          color="#6DAFFE"
        />
        <FloatingIcon
          icon={GraduationCap}
          x="12%"
          y="75%"
          size={44}
          delay={4}
          color="#437FC7"
        />
        <FloatingIcon
          icon={Star}
          x="82%"
          y="80%"
          size={28}
          delay={1}
          color="#6DAFFE"
        />
        <FloatingIcon
          icon={Zap}
          x="50%"
          y="8%"
          size={24}
          delay={3}
          color="#437FC7"
        />
        <FloatingIcon
          icon={Briefcase}
          x="4%"
          y="42%"
          size={28}
          delay={5}
          color="#6DAFFE"
        />
        <FloatingIcon
          icon={Target}
          x="94%"
          y="38%"
          size={34}
          delay={2.5}
          color="#437FC7"
        />
      </div>

      {/* ── พื้นหลังตกแต่ง Gradient Mesh ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={cn(
            "absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20",
            isDark ? "bg-blue-900" : "bg-blue-100",
          )}
        />
        <div
          className={cn(
            "absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20",
            isDark ? "bg-indigo-900" : "bg-indigo-50",
          )}
        />
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="relative z-10 max-w-7xl w-full flex flex-col items-center"
      >
        {/* ✨ Badge — แพลตฟอร์มอันดับ 1 */}
        <motion.div variants={fadeInUp} className="mb-8">
          <div
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full font-semibold text-[14px] tracking-wide shadow-xs backdrop-blur-md border transition-all"
            style={{
              backgroundColor: isDark ? "rgba(67, 127, 199, 0.1)" : "#EDF6FF",
              borderColor: isDark
                ? "rgba(67, 127, 199, 0.2)"
                : "rgba(67, 127, 199, 0.1)",
              color: "#437FC7",
            }}
          >
            <Sparkles size={18} className="text-[#437FC7] animate-pulse" />
            <span>แพลตฟอร์มหางานการศึกษาอันดับ 1 ในไทย</span>
          </div>
        </motion.div>

        {/* ✨ Hero Headline */}
        <motion.div variants={fadeInUp} className="max-w-5xl px-4">
          <Title
            level={1}
            className="text-[clamp(44px,7vw,84px)] font-extrabold mb-8 leading-[1.02] tracking-tight m-0!"
            style={{ color: isDark ? "#fff" : "#0F172A" }}
          >
            สร้างเส้นทางใหม่ให้{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-linear-to-r from-[#437FC7] via-[#6DAFFE] to-[#437FC7] bg-clip-text text-transparent italic px-2">
                วิชาชีพครู
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.8, ease: "circOut" }}
                className="absolute bottom-[8%] left-0 w-full h-[25%] bg-[#437FC7]/10 -skew-x-12 origin-left z-0"
              />
            </span>
          </Title>
        </motion.div>

        {/* ✨ Description */}
        <motion.div variants={fadeInUp}>
          <Paragraph
            className="text-lg md:text-2xl max-w-220 mx-auto mt-4 mb-16 leading-relaxed font-semibold"
            style={{ color: isDark ? "#E2E8F0" : "#1E293B" }}
          >
            เชื่อมต่อโรงเรียนคุณภาพกับบุคลากรทางการศึกษาที่ยอดเยี่ยมที่สุดในประเทศ
            ร่วมกันสร้างอนาคตของการศึกษาไทยให้ก้าวหน้าไปพร้อมกัน
          </Paragraph>
        </motion.div>

        {/* ✨ Search Card — ส่วนค้นหาที่กว้างขึ้นและโดดเด่น */}
        <motion.div
          variants={fadeInUp}
          className={cn(
            "w-full max-w-320 mx-auto rounded-[32px] p-2 md:p-4 backdrop-blur-3xl transition-all duration-500 border overflow-hidden",
            isDark
              ? "bg-[#1E293B]/80 border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]"
              : "bg-white/80 border-[#EDF6FF] shadow-[0_40px_100px_-20px_rgba(67,127,199,0.12)]",
          )}
        >
          <div className="p-6 md:p-10">
            <Row gutter={[24, 24]} align="bottom">
              <Col xs={24} lg={10}>
                <div className="flex flex-col gap-3 items-start">
                  <span
                    className="text-[13px] font-extrabold uppercase  px-1"
                    style={{ color: isDark ? "#bedbff" : "#0F172A" }}
                  >
                    หางานจากตำแหน่งหรือโรงเรียน
                  </span>
                  <Input
                    prefix={
                      <Search size={22} className="text-[#437FC7] mr-2" />
                    }
                    placeholder="ครูภาษาอังกฤษ, โรงเรียนนานาชาติ..."
                    value={searchParams.keyword}
                    onChange={(e) => setSearchParam("keyword", e.target.value)}
                    className="h-16 rounded-2xl text-[17px] font-semibold border-2! border-[#EDF6FF]! dark:border-none! bg-gray-50/80 dark:bg-black/30 hover:bg-white dark:hover:bg-black/40 focus:bg-white dark:focus:bg-black/50 transition-all w-full shadow-sm text-[#1E293B] dark:text-white placeholder:text-gray-400"
                    onPressEnter={handleSearch}
                    size="large"
                  />
                </div>
              </Col>

              <Col xs={24} sm={12} lg={7}>
                <div className="flex flex-col gap-3 items-start">
                  <span
                    className="text-[13px] font-extrabold uppercase  px-1"
                    style={{ color: isDark ? "#bedbff" : "#0F172A" }}
                  >
                    หมวดหมู่สายงาน
                  </span>
                  <Cascader
                    options={jobCategories}
                    loading={isLoadingCategories}
                    multiple
                    maxTagCount="responsive"
                    showSearch
                    value={searchParams.category}
                    onChange={(value) =>
                      setSearchParam("category", value as string[][])
                    }
                    placeholder="เลือกสายงานที่สนใจ"
                    style={{ width: "100%" }}
                    className="h-16 custom-cascader-v2 rounded-2xl bg-gray-50/80 dark:bg-black/30 shadow-sm border-2! border-[#EDF6FF]! dark:border-none! font-semibold"
                    popupClassName="min-w-[300px]"
                    size="large"
                    showCheckedStrategy={Cascader.SHOW_CHILD}
                    suffixIcon={
                      <Briefcase size={20} className="text-[#437FC7]" />
                    }
                  />
                </div>
              </Col>

              <Col xs={24} sm={12} lg={7}>
                <div className="flex flex-col gap-3 items-start">
                  <span
                    className="text-[13px] font-extrabold uppercase  px-1"
                    style={{ color: isDark ? "#bedbff" : "#0F172A" }}
                  >
                    ทำเลที่ต้องการ
                  </span>
                  <Cascader
                    options={geoOptions}
                    loading={isLoadingGeo}
                    showSearch
                    placeholder="เลือกจังหวัด / เขต"
                    style={{ width: "100%" }}
                    className="h-16 custom-cascader-v2 rounded-2xl bg-gray-50/80 dark:bg-black/30 shadow-sm border-2! border-[#EDF6FF]! dark:border-none! font-semibold"
                    popupClassName="min-w-[220px]"
                    size="large"
                    value={searchParams.location as string[] | undefined}
                    onChange={(value) =>
                      setSearchParam("location", value as string[])
                    }
                    expandTrigger="hover"
                    suffixIcon={<MapPin size={20} className="text-[#437FC7]" />}
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
                  <div className="h-px bg-gray-200/50 dark:bg-gray-800/50 my-10" />
                  <Row gutter={[20, 20]}>
                    <Col xs={24} sm={12} md={6}>
                      <Select
                        placeholder="รูปแบบการจ้าง"
                        className="w-full h-14 rounded-2xl bg-gray-100/50 dark:bg-black/20"
                        allowClear
                        value={searchParams.employmentType}
                        onChange={(value) =>
                          setSearchParam("employmentType", value)
                        }
                      >
                        <Option value="fulltime">งานประจำ (Full-time)</Option>
                        <Option value="parttime">พาร์ทไทม์ (Part-time)</Option>
                        <Option value="contract">สัญญาจ้าง (Contract)</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Select
                        placeholder="ใบประกอบวิชาชีพ"
                        className="w-full h-14 rounded-2xl bg-gray-100/50 dark:bg-black/20"
                        allowClear
                        value={searchParams.license}
                        onChange={(value) => setSearchParam("license", value)}
                      >
                        <Option value="required">ต้องมีใบประกอบฯ</Option>
                        <Option value="not-required">ไม่ต้องมีใบประกอบฯ</Option>
                        <Option value="pending">อยู่ระหว่างดำเนินการขอ</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Select
                        placeholder="ฐานเงินเดือน"
                        className="w-full h-14 rounded-2xl bg-gray-100/50 dark:bg-black/20"
                        allowClear
                        value={searchParams.salaryRange}
                        onChange={(value) =>
                          setSearchParam("salaryRange", value)
                        }
                      >
                        <Option value="0-15000">เริ่มต้น - 15,000</Option>
                        <Option value="15000-25000">15,000 – 25,000</Option>
                        <Option value="25000-40000">25,000 – 40,000</Option>
                        <Option value="40000+">40,000 ขึ้นไป</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Select
                        placeholder="ระยะเวลาประกาศ"
                        className="w-full h-14 rounded-2xl bg-gray-100/50 dark:bg-black/20"
                        allowClear
                        value={searchParams.postedAt}
                        onChange={(value) => setSearchParam("postedAt", value)}
                      >
                        <Option value="today">ภายในวันนี้</Option>
                        <Option value="3days">3 วันล่าสุด</Option>
                        <Option value="7days">1 สัปดาห์ล่าสุด</Option>
                        <Option value="30days">1 เดือนล่าสุด</Option>
                      </Select>
                    </Col>
                  </Row>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <Button
                  type="text"
                  onClick={() => setShowAdvanced((v) => !v)}
                  className={cn(
                    "h-12 rounded-2xl font-bold transition-all px-6 flex items-center gap-3",
                    showAdvanced
                      ? "text-[#437FC7] bg-[#EDF6FF] dark:bg-blue-900/40"
                      : "text-gray-500 hover:text-[#437FC7] hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                >
                  <ChevronDown
                    size={20}
                    className={cn(
                      "transition-transform duration-500",
                      showAdvanced && "rotate-180",
                    )}
                  />
                  <span>
                    {showAdvanced ? "ลดตัวกรอง" : "ตัวเลือกการค้นหาเพิ่มเติม"}
                  </span>
                </Button>
                {showAdvanced && (
                  <Button
                    type="text"
                    icon={<RefreshCcw size={18} />}
                    className="h-12 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-6 font-semibold"
                    onClick={resetSearchParams}
                  >
                    <span>รีเซ็ต</span>
                  </Button>
                )}
              </div>
              <Button
                type="primary"
                size="large"
                icon={<Search size={24} />}
                onClick={handleSearch}
                className="h-16 w-full md:w-[380px] rounded-2xl font-bold text-xl shadow-[0_20px_40px_-12px_rgba(67,127,199,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(67,127,199,0.4)] active:scale-[0.97] transition-all bg-linear-to-r from-[#437FC7] to-[#6DAFFE] border-none flex items-center justify-center gap-4"
              >
                ค้นหาตำแหน่งงานตอนนี้
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ✨ Footer Tags */}
        <motion.div
          variants={fadeInUp}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 opacity-70"
        >
          <span className="text-[14px] font-bold tracking-wider text-[#437FC7] dark:text-blue-300">
            ตำแหน่งงานยอดนิยม:
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {POPULAR_TAGS.map((tag) => (
              <motion.button
                key={tag}
                whileHover={{
                  y: -3,
                  backgroundColor: "#EDF6FF",
                  color: "#437FC7",
                  borderColor: "#437FC7",
                }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-5 py-2 rounded-xl text-[13px] font-semibold border transition-all",
                  isDark
                    ? "bg-white/5 border-white/10 text-gray-400"
                    : "bg-white border-[#EDF6FF] text-gray-500 shadow-xs",
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
