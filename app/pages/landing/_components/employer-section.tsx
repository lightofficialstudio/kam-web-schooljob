"use client";

import { useTheme } from "@/app/contexts/theme-context";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { motion, useScroll, useTransform } from "framer-motion";
import { Rocket, ShieldCheck, Sparkles, Target, Users, Zap } from "lucide-react";
import { useRef } from "react";

const EMPLOYER_FEATURES = [
  {
    title: "ประกาศงานไม่จำกัด",
    desc: "ลงประกาศรับสมัครงานได้ทุกตำแหน่ง ไม่มีข้อจำกัดเรื่องจำนวน",
    icon: <Rocket className="w-5 h-5" />,
    color: "#11b6f5",
  },
  {
    title: "ระบบคัดกรองอัจฉริยะ",
    desc: "Dashboard ติดตามสถานะและคัดกรองผู้สมัครได้ในที่เดียว",
    icon: <Target className="w-5 h-5" />,
    color: "#0d8fd4",
  },
  {
    title: "สร้างความน่าเชื่อถือ",
    desc: "โปรไฟล์โรงเรียนแบบ Premium เพื่อดึงดูดบุคลากรคุณภาพ",
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "#5dd5fb",
  },
  {
    title: "ฐานข้อมูลครูขนาดใหญ่",
    desc: "เข้าถึงผู้สมัครที่ตรงคุณสมบัติและมีใบประกอบวิชาชีพ",
    icon: <Users className="w-5 h-5" />,
    color: "#11b6f5",
  },
];

export default function EmployerSection() {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // ✨ จัดการสีและพื้นหลังตาม Mode
  const sectionBgClass = isDark
    ? "bg-[#020617]"
    : "bg-linear-to-b from-white to-blue-50/50";

  const cardBgClass = isDark
    ? "bg-slate-900/40 border-slate-800/60"
    : "bg-white border-slate-200 shadow-xs";

  const titleColorClass = isDark ? "text-white" : "text-slate-900";
  const textColorClass = isDark ? "text-slate-400" : "text-slate-600";
  const featureTitleClass = isDark ? "text-white" : "text-slate-800";
  const featureDescClass = isDark ? "text-slate-400" : "text-slate-500";

  // ✨ องค์ประกอบแอนิเมชันสำหรับ Card (ใช้ any เพื่อเลี่ยง Variants type mismatch)
  const cardVariants: any = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    hover: {
      y: -12,
      scale: 1.02,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      ref={containerRef}
      className={`relative py-32 lg:py-48 overflow-hidden transition-colors duration-700 ${sectionBgClass}`}
    >
      {/* ✨ พื้นหลังตกแต่ง (Tailwind v4 syntax) */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute inset-0 ${isDark ? "opacity-10" : "opacity-40"} bg-[radial-gradient(#11b6f5_1px,transparent_1px)] bg-[length:40px_40px] mask-[linear-gradient(to_bottom,transparent,black,transparent)]`}
        />

        {/* Floating Background Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i,
            }}
            className="absolute rounded-full blur-2xl"
            style={{
              width: 100 + i * 50,
              height: 100 + i * 50,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
              background: `radial-gradient(circle, ${i % 2 === 0 ? "#11b6f5" : "#6366f1"} 0%, transparent 70%)`,
            }}
          />
        ))}

        {/* แสงฟุ้งแอนิเมชัน */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -right-[10%] top-[20%] w-150 h-150 bg-[#11b6f5]/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -left-[5%] bottom-[10%] w-125 h-125 bg-indigo-500/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 max-w-360 mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          {/* Content Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 space-y-10"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? "bg-[#11b6f5]/10 border-[#11b6f5]/20" : "bg-blue-50 border-blue-100"}`}
              >
                <Zap className="w-4 h-4 text-[#11b6f5]" fill="#11b6f5" />
                <span className="text-xs font-bold text-[#11b6f5] uppercase tracking-widest">
                  สำหรับโรงเรียนและสถานศึกษา
                </span>
              </motion.div>

              <h2
                className={`text-4xl md:text-6xl font-black leading-[1.1] tracking-tight ${titleColorClass}`}
              >
                พบบุคลากรที่ใช่ <br />
                <span className="bg-linear-to-r from-[#11b6f5] to-[#0d8fd4] bg-clip-text text-transparent">
                  ได้เร็วกว่าเดิม 10 เท่า
                </span>
              </h2>

              <p
                className={`text-lg md:text-xl font-medium max-w-xl leading-relaxed ${textColorClass}`}
              >
                ยกระดับการสรรหาบุคลากรครูด้วยเทคโนโลยีที่ทันสมัยที่สุด
                ช่วยลดเวลาในการคัดกรองโปรไฟล์ และเพิ่มโอกาสในการเจอ "ครูคุณภาพ"
                ที่ตรงกับวัฒนธรรมของโรงเรียนคุณ
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {EMPLOYER_FEATURES.map((feature, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  variants={cardVariants}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`group p-8 rounded-4xl border transition-all duration-300 relative overflow-hidden backdrop-blur-md ${cardBgClass} hover:border-[#11b6f5]/40 hover:shadow-2xl hover:shadow-[#11b6f5]/15 dark:hover:shadow-black/50`}
                >
                  {/* ✨ Card Background Bloom Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div
                      className="absolute -right-20 -top-20 w-48 h-48 rounded-full blur-3xl opacity-20"
                      style={{ backgroundColor: feature.color }}
                    />
                  </div>

                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10 transition-transform duration-500 group-hover:scale-110 shadow-lg"
                    style={{
                      backgroundColor: `${feature.color}15`,
                      color: feature.color,
                      boxShadow: `0 8px 16px -4px ${feature.color}30`,
                    }}
                  >
                    {feature.icon}
                  </div>

                  <h3
                    className={`font-bold text-xl mb-3 relative z-10 transition-colors group-hover:text-[#11b6f5] ${featureTitleClass}`}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className={`text-base font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity ${featureDescClass}`}
                  >
                    {feature.desc}
                  </p>

                  {/* Minimal Indicator */}
                  <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                    <ArrowRightOutlined className="text-[#11b6f5] text-lg" />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pt-4"
            >
              <Button
                type="primary"
                size="large"
                className="h-16! px-12! rounded-2xl! bg-[#11b6f5]! hover:bg-[#0d8fd4]! border-none! text-lg font-black shadow-xl shadow-[#11b6f5]/30 flex items-center gap-3"
              >
                เริ่มประกาศงานฟรีตอนนี้ <ArrowRightOutlined />
              </Button>
            </motion.div>
          </motion.div>

          {/* Illustration Right - Floating Feather คลุมทั้งเครื่อง */}
          <motion.div
            style={{ y: y1 }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 0.5, 0, -0.5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="lg:col-span-6 relative"
          >
            <div className="relative z-10 p-4 md:p-8">
              {/* Glass Card Decoration */}
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute top-0 right-0 w-64 h-64 border rounded-4xl -z-10 shadow-2xl ${isDark ? "bg-white/5 border-white/10 backdrop-blur-3xl" : "bg-blue-500/5 border-blue-500/10 backdrop-blur-xl"}`}
              />

              <div
                className={`relative rounded-5xl overflow-hidden p-12 backdrop-blur-sm border shadow-2xl ${isDark ? "bg-linear-to-tr from-[#11b6f5]/20 to-indigo-500/10 border-white/10" : "bg-linear-to-tr from-blue-100/50 to-indigo-50/50 border-blue-100"}`}
              >
                <img
                  src="/images/flat/undraw_hiring_8szx.svg"
                  alt="Hiring Innovation"
                  className="w-full h-auto drop-shadow-2xl"
                />

                {/* Floating CTA UI (แทนที่ผู้สมัครวันนี้) ✨ */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    y: {
                      delay: 0.5,
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    opacity: { delay: 0.5, duration: 0.5 },
                    x: { delay: 0.5, duration: 0.5 }
                  }}
                  className={`absolute bottom-12 left-12 right-12 p-6 backdrop-blur-md rounded-3xl shadow-xl flex items-center justify-between border ${isDark ? "bg-slate-900/90 border-white/20" : "bg-white/95 border-blue-50"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#11b6f5] to-[#0d8fd4] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <div
                        className={`text-xs font-bold uppercase tracking-tighter ${isDark ? "text-slate-400" : "text-slate-500"}`}
                      >
                        เข้าร่วมกับเราวันนี้
                      </div>
                      <div
                        className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"} tracking-tight`}
                      >
                        รับคัดเลือกครูคุณภาพทันที
                      </div>
                    </div>
                  </div>
                  <Button 
                    type="primary" 
                    shape="circle" 
                    icon={<ArrowRightOutlined />} 
                    className="bg-[#11b6f5]! border-none! shadow-md"
                  />
                </motion.div>
              </div>

              {/* Decorative blobs */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl opacity-50" />
              <div className="absolute top-20 -right-10 w-32 h-32 bg-[#11b6f5]/20 rounded-full blur-3xl opacity-50" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
