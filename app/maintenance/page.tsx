"use client";

import { theme } from "antd";
import { motion } from "framer-motion";
import { Home, WrenchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ✨ หน้าปิดปรับปรุงระบบ — แสดงเมื่อ maintenance mode เปิด
export default function MaintenancePage() {
  const { token } = theme.useToken();
  const [title, setTitle] = useState("ระบบกำลังปรับปรุง");
  const [message, setMessage] = useState("กรุณากลับมาใหม่ในภายหลัง เราจะกลับมาเร็ว ๆ นี้");

  useEffect(() => {
    // ✨ ดึงข้อความจาก API (ไม่ block render ถ้า fetch fail)
    fetch("/api/v1/system/maintenance")
      .then((r) => r.json())
      .then((json) => {
        if (json?.data?.title) setTitle(json.data.title);
        if (json?.data?.message) setMessage(json.data.message);
      })
      .catch(() => {});
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: token.colorBgLayout, fontFamily: token.fontFamily }}
    >
      {/* 🟦 Background Decorators */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(${token.colorPrimary} 1px, transparent 1px), linear-gradient(90deg, ${token.colorPrimary} 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(circle, black, transparent 80%)",
            WebkitMaskImage: "radial-gradient(circle, black, transparent 80%)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[80px]"
          style={{ backgroundColor: token.colorPrimary }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ backgroundColor: token.colorPrimary }}
        />
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* 🎨 Illustration Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center md:order-1"
        >
          <div className="relative w-full max-w-[320px] aspect-square">
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-20 scale-75"
              style={{ backgroundColor: token.colorPrimary }}
            />
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <img
                src="https://illustrations.popsy.co/amber/work-from-home.svg"
                alt="Under Maintenance"
                className="w-full h-auto drop-shadow-2xl brightness-100 dark:brightness-90 transition-all"
              />
            </motion.div>

            {/* ✨ Icon หมุนรอบ */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4 p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700"
            >
              <WrenchIcon size={32} color={token.colorPrimary} />
            </motion.div>

            {/* ✨ Dots ลอย */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
                className="absolute rounded-full"
                style={{
                  backgroundColor: token.colorPrimary,
                  width: 10 - i * 2,
                  height: 10 - i * 2,
                  bottom: 20 + i * 20,
                  left: 10 + i * 25,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* 📝 Content Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center md:text-left flex flex-col items-center md:items-start space-y-6"
        >
          <div className="space-y-2">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.4 }}
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border"
              style={{
                color: token.colorPrimary,
                borderColor: `${token.colorPrimary}40`,
                backgroundColor: `${token.colorPrimary}10`,
              }}
            >
              System Maintenance
            </motion.span>

            <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight" style={{ color: token.colorText }}>
              {title.split(" ").length > 2 ? (
                <>
                  {title.split(" ").slice(0, 2).join(" ")}
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(135deg, ${token.colorPrimary} 0%, #0d8fd4 50%, #5dd5fb 100%)` }}
                  >
                    {title.split(" ").slice(2).join(" ")}
                  </span>
                </>
              ) : (
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(135deg, ${token.colorPrimary} 0%, #0d8fd4 50%, #5dd5fb 100%)` }}
                >
                  {title}
                </span>
              )}
            </h1>
          </div>

          <p
            className="text-lg md:text-xl font-medium leading-relaxed max-w-md opacity-70"
            style={{ color: token.colorText }}
          >
            {message}
          </p>

          {/* ✨ Progress dots animation */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: token.colorPrimary }}
              />
            ))}
            <span className="ml-2 text-sm opacity-50" style={{ color: token.colorText }}>
              กำลังดำเนินการ...
            </span>
          </div>

          <div className="pt-2">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${token.colorPrimary} 0%, #0d8fd4 100%)` }}
              >
                <Home size={20} strokeWidth={2.5} />
                ลองใหม่อีกครั้ง
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
