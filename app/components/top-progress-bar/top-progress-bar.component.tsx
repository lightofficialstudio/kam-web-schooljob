"use client";

import { theme } from "antd";
import { useEffect, useRef, useState } from "react";

// ✨ YouTube-style slim top progress bar สำหรับ async operations
// - active=true  → ปรากฏที่ 0% แล้ว creep ช้าๆ ไปถึง ~80% (จำลองว่างานกำลังทำ)
// - active=false → วิ่งเร็วไป 100% แล้ว fade out

interface TopProgressBarProps {
  active: boolean;
}

export function TopProgressBar({ active }: TopProgressBarProps) {
  const { token } = theme.useToken();

  const [width, setWidth] = useState("0%");
  const [opacity, setOpacity] = useState(1);
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    clearTimer();

    if (active) {
      // ✨ ปรากฏทันที แล้ว creep ถึง 80% ช้าๆ
      setShow(true);
      setOpacity(1);
      setWidth("0%");
      timerRef.current = setTimeout(() => setWidth("80%"), 16);
    } else if (show) {
      // ✨ งานเสร็จ: วิ่งไป 100% แล้ว fade out
      setWidth("100%");
      timerRef.current = setTimeout(() => {
        setOpacity(0);
        timerRef.current = setTimeout(() => {
          setShow(false);
          setWidth("0%");
          setOpacity(1);
        }, 380);
      }, 220);
    }

    return clearTimer;
  }, [active]);

  if (!show) return null;

  // ✨ transition ขึ้นอยู่กับ phase — slow creep / fast complete / fade
  const transition =
    width === "0%"
      ? "none"
      : width === "80%"
        ? `width 2.6s cubic-bezier(0.05, 0.1, 0.3, 1.0), opacity 0.3s`
        : `width 0.22s ease-out, opacity 0.38s ease-out`;

  return (
    <div
      className="fixed top-0 left-0 right-0 pointer-events-none"
      style={{ zIndex: 9999, height: 3 }}
    >
      {/* ✨ Glow backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: `${token.colorPrimary}18`,
        }}
      />

      {/* ✨ Main bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width,
          opacity,
          transition,
          background: `linear-gradient(90deg, ${token.colorPrimary} 0%, #5dd5fb 100%)`,
          boxShadow: `0 0 8px 1px ${token.colorPrimary}90`,
        }}
      />
    </div>
  );
}
