"use client";

import { useTheme } from "@/app/contexts/theme-context";
import { ArrowRightOutlined, CheckCircleFilled } from "@ant-design/icons";
import { Button, ConfigProvider, theme as antTheme } from "antd";
import { motion, useScroll, useTransform } from "framer-motion";
import { Rocket, ShieldCheck, Target, Users, Zap } from "lucide-react";
import { useRef } from "react";

const EMPLOYER_FEATURES = [
  {
    title: "ประกาศงานไม่จำกัด",
    desc: "ลงประกาศรับสมัครงานได้ทุกตำแหน่ง ไม่มีข้อจำกัดเรื่องจำนวน",
    icon: <Rocket className="w-5 h-5" />,
    color: "#11b6f5"
  },
  {
    title: "ระบบคัดกรองอัจฉริยะ",
    desc: "Dashboard ติดตามสถานะและคัดกรองผู้สมัครได้ในที่เดียว",
    icon: <Target className="w-5 h-5" />,
    color: "#0d8fd4"
  },
  {
    title: "สร้างความน่าเชื่อถือ",
    desc: "โปรไฟล์โรงเรียนแบบ Premium เพื่อดึงดูดบุคลากรคุณภาพ",
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "#5dd5fb"
  },
  {
    title: "ฐานข้อมูลครูขนาดใหญ่",
    desc: "เข้าถึงผู้สมัครที่ตรงคุณสมบัติและมีใบประกอบวิชาชีพ",
    icon: <Users className="w-5 h-5" />,
    color: "#11b6f5"
  },
];

export default function EmployerSection() {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // ✨ จัดการสีและพื้นหลังตาม Mode (รองรับ Light/Dark Mode 100%)
  const sectionBgClass = isDark 
    ? "bg-[#020617]" 
    : "bg-gradient-to-b from-white to-blue-50/50";
  
  const cardBgClass = isDark
    ? "bg-slate-900/40 border-slate-800/60 shadow-none"
    : "bg-white border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]";

  const titleColorClass = isDark ? "text-white" : "text-slate-900";
  const textColorClass = isDark ? "text-slate-400" : "text-slate-600";
  const featureTitleClass = isDark ? "text-white" : "text-slate-800";
  const featureDescClass = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <section 
      ref={containerRef}
      className={"relative py-32 lg:py-48 overflow-hidden transition-colors duration-700 " + sectionBgClass}
    >
      {/* ✨ พื้นหลังตกแต่ง (Dynamic Opacity) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-0 ${isDark ? "opacity-[0.1]" : "opacity-[0.4]"} [background-image:radial-gradient(#11b6f5_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]`} />
        
        {/* แสงฟุ้งแอนิเมชัน */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -right-[10%] top-[20%] w-[600px] h-[600px] bg-[#11b6f5]/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -left-[5%] bottom-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" 
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
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

              <h2 className={`text-4xl md:text-6xl font-black leading-[1.1] tracking-tight ${titleColorClass}`}>
                พบบุคลากรที่ใช่ <br />
                <span className="bg-gradient-to-r from-[#11b6f5] to-[#0d8fd4] bg-clip-text text-transparent">
                  ได้เร็วกว่าเดิม 10 เท่า
                </span>
              </h2>

              <p className={`text-lg md:text-xl font-medium max-w-xl leading-relaxed ${textColorClass}`}>
                ยกระดับการสรรหาบุคลากรครูด้วยเทคโนโลยีที่ทันสมัยที่สุด 
                ช่วยลดเวลาในการคัดกรองโปรไฟล์ และเพิ่มโอกาสในการเจอ "ครูคุณภาพ" ที่ตรงกับวัฒนธรรมของโรงเรียนคุณ
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {EMPLOYER_FEATURES.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.02] ${cardBgClass}`}
                >
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className={`font-bold text-lg mb-2 ${featureTitleClass}`}>{feature.title}</h3>
                  <p className={`text-sm font-medium leading-relaxed ${featureDescClass}`}>
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="primary"
                size="large"
                className="!h-16 !px-12 !rounded-2xl !bg-[#11b6f5] hover:!bg-[#0d8fd4] !border-none text-lg font-black shadow-[0_20px_40px_-10px_rgba(17,182,245,0.3)] flex items-center gap-3"
              >
                เริ่มประกาศงานฟรีตอนนี้ <ArrowRightOutlined />
              </Button>
            </motion.div>
          </motion.div>

          {/* Illustration Right */}
          <motion.div style={{ y: y1 }} className="lg:col-span-6 relative">
            <div className="relative z-10 p-4 md:p-8">
              {/* Glass Card Decoration */}
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute top-0 right-0 w-64 h-64 border rounded-[40px] -z-10 shadow-2xl ${isDark ? "bg-white/5 border-white/10 backdrop-blur-3xl" : "bg-blue-500/5 border-blue-500/10 backdrop-blur-xl"}`} 
              />
              
              <div className={`relative rounded-[48px] overflow-hidden p-12 backdrop-blur-sm border shadow-2xl ${isDark ? "bg-gradient-to-tr from-[#11b6f5]/20 to-indigo-500/10 border-white/10" : "bg-gradient-to-tr from-blue-100/50 to-indigo-50/50 border-blue-100"}`}>
                <img
                  src="/images/flat/undraw_hiring_8szx.svg"
                  alt="Hiring Innovation"
                  className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                />
                
                {/* Floating Status UI */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`absolute bottom-12 left-12 right-12 p-6 backdrop-blur-md rounded-3xl shadow-xl flex items-center justify-between border ${isDark ? "bg-slate-900/90 border-white/20" : "bg-white/95 border-blue-50"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#11b6f5] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold uppercase tracking-tighter ${isDark ? "text-slate-400" : "text-slate-500"}`}>ผู้สมัครวันนี้</div>
                      <div className={`text-2xl font-black underline decoration-[#11b6f5] decoration-4 ${isDark ? "text-white" : "text-slate-900"}`}>+128 คน</div>
                    </div>
                  </div>
                  <CheckCircleFilled className="text-emerald-500 text-3xl" />
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
