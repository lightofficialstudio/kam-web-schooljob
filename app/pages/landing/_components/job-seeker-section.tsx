"use client";

import { useTheme } from "@/app/contexts/theme-context";
import { useAuthStore } from "@/app/stores/auth-store";
import { ArrowRightOutlined, FileProtectOutlined, IdcardOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Briefcase, 
  Search, 
  Sparkles, 
  Zap 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function JobSeekerSection() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // ✨ Theme Classes
  const sectionBgClass = isDark 
    ? "bg-slate-950" 
    : "bg-linear-to-b from-blue-50/50 to-white";
  
  const textColorClass = isDark ? "text-slate-400" : "text-slate-600";
  const titleColorClass = isDark ? "text-white" : "text-slate-900";

  // ✨ [Handler: สมัครสมาชิกฟรี]
  const handleSignUp = () => {
    if (user) {
      if (user.role === "EMPLOYEE") {
        router.push("/pages/employee/profile");
      } else {
        router.push("/pages/employer/profile");
      }
    } else {
      router.push("/pages/signup");
    }
  };

  // ✨ [Handler: ค้นหางาน]
  const handleSearchJob = () => {
    router.push("/pages/job");
  };

  return (
    <section
      ref={containerRef}
      className={`relative py-24 lg:py-32 overflow-hidden transition-colors duration-700 ${sectionBgClass}`}
    >
      {/* ✨ Floating Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-150 h-150 bg-blue-500/5 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -right-[10%] w-180 h-180 bg-indigo-500/5 rounded-full blur-[140px]" 
        />
      </div>

      <motion.div 
        style={{ scale, opacity }}
        className="relative z-10 max-w-360 mx-auto px-6"
      >
        {/* Global CTA Illustration Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative rounded-5xl overflow-hidden border p-8 md:p-16 ${isDark ? "bg-slate-900/60 border-white/10" : "bg-white border-blue-100"} shadow-3xl`}
        >
          {/* Subtle noise pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-sm font-bold text-emerald-500 uppercase">เปิดรับใบสมัครแล้ววันนี้</span>
              </div>

              <h3 className={`text-4xl md:text-6xl font-black leading-tight tracking-tight ${titleColorClass}`}>
                โรงเรียนกำลังมองหา <br />
                <span className="bg-linear-to-r from-[#11b6f5] to-[#0d8fd4] bg-clip-text text-transparent italic">
                  "บุคลากรคุณภาพ"
                </span>
                <br />เช่นคุณ
              </h3>

              <p className={`text-lg md:text-xl font-medium opacity-80 leading-relaxed ${textColorClass}`}>
                สร้างโปรไฟล์ของคุณให้โดดเด่น และก้าวเข้าสู่รั้วโรงเรียนที่คุณปรารถนา
                ร่วมเป็นส่วนหนึ่งของสังคมครูยุคใหม่ได้ฟรี พร้อมระบบคัดกรองที่รวดเร็ว
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSignUp}
                  className="h-16! px-10! rounded-2xl! bg-[#11b6f5]! hover:bg-[#0d8fd4]! border-none! text-lg font-black shadow-[0_20px_40px_-10px_rgba(17,182,245,0.4)] flex items-center gap-3"
                >
                  สมัครสมาชิกฟรีตอนนี้ <ArrowRightOutlined />
                </Button>
                
                <Button
                  size="large"
                  onClick={handleSearchJob}
                  className={`h-16! px-10! rounded-2xl! font-bold text-lg border-2! flex items-center gap-3 transition-all ${isDark ? "border-white/10 text-white hover:bg-white/5!" : "border-slate-100 text-slate-700 hover:bg-slate-50!"}`}
                >
                  <Search className="w-5 h-5" /> ค้นหางาน
                </Button>
              </div>
            </div>

            {/* Icon-Based Creative Illustration */}
            <div className="relative flex justify-center lg:justify-end py-12 lg:py-0">
              <motion.div 
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative w-full max-w-[400px] aspect-square flex items-center justify-center"
              >
                {/* Background Rotating Circles */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-[#11b6f5]/20 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-12 border-2 border-dashed border-indigo-400/20 rounded-full"
                />

                {/* Main Icon Composition */}
                <div className="relative z-10">
                  {/* Central Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-40 h-40 rounded-[40px] flex items-center justify-center shadow-2xl relative z-20 overflow-hidden ${isDark ? "bg-slate-800 border-white/5" : "bg-white border-blue-50"}`}
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-[#11b6f5]/10 to-transparent" />
                    <IdcardOutlined className="text-8xl text-[#11b6f5] drop-shadow-lg" />
                  </motion.div>

                  {/* Satellite Icons */}
                  <motion.div
                    animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-8 -right-8 w-20 h-20 rounded-2xl bg-emerald-500 shadow-xl shadow-emerald-500/20 flex items-center justify-center text-white text-3xl z-30"
                  >
                    <SafetyCertificateOutlined />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -bottom-6 -left-10 w-24 h-24 rounded-3xl bg-indigo-600 shadow-xl shadow-indigo-600/20 flex items-center justify-center text-white text-4xl z-30"
                  >
                    <FileProtectOutlined />
                  </motion.div>

                  {/* Decorative Sparkles */}
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2"
                  >
                    <Sparkles className="w-10 h-10 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                </div>

                {/* Floating Status UI */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className={`absolute -bottom-6 right-0 p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center gap-4 z-40 ${isDark ? "bg-slate-800/90 border-white/10" : "bg-white/90 border-blue-50"}`}
                >
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white">
                    <Zap className="w-5 h-5" fill="white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase opacity-50 tracking-tighter">Profile Status</div>
                    <div className={`text-sm font-black ${titleColorClass}`}>พร้อมเริ่มงานทันที</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
