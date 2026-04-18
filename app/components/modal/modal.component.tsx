"use client";

/**
 * ModalComponent — Shared Status/Confirm Modal สำหรับ KAM-WEB-SCHOOLJOB
 *
 * Modal กลางที่รองรับ 4 ประเภท พร้อม framer-motion animation, Dark Mode (Ant Design token),
 * portal rendering, ESC close, scroll lock และ debug panel สำหรับ error
 *
 * ─── ประเภท (type) ────────────────────────────────────────────────────────────
 * @type "success"  — สีเขียว ✅ ปุ่มเดียว (ตกลง) ไม่มีปุ่มยกเลิก
 * @type "error"    — สีแดง ❌ มีปุ่มยกเลิก + debug panel ถ้าส่ง errorDetails
 * @type "confirm"  — สีเหลือง ⚠️ มีปุ่มยืนยัน + ยกเลิก
 * @type "delete"   — สีแดง 🗑️ ต้องพิมพ์ "Delete" เพื่อยืนยัน
 *
 * ─── Props ────────────────────────────────────────────────────────────────────
 * @prop open          — แสดง/ซ่อน modal
 * @prop type          — ประเภท: "success" | "error" | "confirm" | "delete"
 * @prop title         — หัวเรื่อง (ถ้าไม่ส่ง จะใช้ default ตาม type)
 * @prop description   — ข้อความอธิบาย (optional)
 * @prop onClose       — callback เมื่อปิด modal (กด X, backdrop, ESC)
 * @prop onConfirm     — callback เมื่อกดยืนยัน (ถ้าไม่ส่ง จะ onClose แทน)
 * @prop loading       — แสดง spinner บนปุ่มยืนยัน
 * @prop errorDetails  — object/string สำหรับ debug panel (เฉพาะ type="error")
 * @prop confirmLabel  — ข้อความปุ่มยืนยัน (override default)
 * @prop cancelLabel   — ข้อความปุ่มยกเลิก (override default)
 *
 * ─── Example ──────────────────────────────────────────────────────────────────
 * // Success
 * <ModalComponent open={open} type="success" title="บันทึกสำเร็จ" description="ข้อมูลถูกบันทึกแล้ว" onClose={handleClose} />
 *
 * // Error พร้อม debug
 * <ModalComponent open={open} type="error" title="เกิดข้อผิดพลาด" description={errMsg} errorDetails={err} onClose={handleClose} />
 *
 * // Confirm
 * <ModalComponent open={open} type="confirm" title="ยืนยันการส่ง?" onClose={handleClose} onConfirm={handleSubmit} loading={isLoading} />
 *
 * // Delete (ต้องพิมพ์ "Delete")
 * <ModalComponent open={open} type="delete" title="ลบรายการนี้?" description="การกระทำนี้ไม่สามารถย้อนกลับได้" onClose={handleClose} onConfirm={handleDelete} />
 */

import { useTheme } from "@/app/contexts/theme-context";
import { theme as antTheme } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ModalType = "success" | "error" | "confirm" | "delete";

export interface ModalComponentProps {
  open: boolean;
  type: ModalType;
  title?: string;
  /** ข้อความอธิบาย รองรับ string หรือ ReactNode (optional) */
  description?: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  loading?: boolean;
  errorDetails?: unknown;
  confirmLabel?: string;
  cancelLabel?: string;
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const IconSuccess = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconError = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const IconWarning = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconDelete = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const IconClose = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconChevron = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Type Config ──────────────────────────────────────────────────────────────

interface TypeConfig {
  icon: React.JSX.Element;
  iconBg: string;
  iconColor: string;
  defaultTitle: string;
  accentColor: string;
  confirmBg: string;
}

function getTypeConfig(type: ModalType, isDark: boolean): TypeConfig {
  switch (type) {
    case "success":
      return {
        icon: <IconSuccess />,
        iconBg: isDark ? "#052e16" : "#f0fdf4",
        iconColor: "#22c55e",
        defaultTitle: "ดำเนินการสำเร็จ",
        accentColor: "#22c55e",
        confirmBg: "#11b6f5", // ✨ primary ของ project
      };
    case "error":
      return {
        icon: <IconError />,
        iconBg: isDark ? "#450a0a" : "#fef2f2",
        iconColor: "#ef4444",
        defaultTitle: "เกิดข้อผิดพลาด",
        accentColor: "#ef4444",
        confirmBg: "#11b6f5",
      };
    case "delete":
      return {
        icon: <IconDelete />,
        iconBg: isDark ? "#450a0a" : "#fef2f2",
        iconColor: "#ef4444",
        defaultTitle: "ยืนยันการลบ",
        accentColor: "#ef4444",
        confirmBg: "#ef4444",
      };
    default: // confirm
      return {
        icon: <IconWarning />,
        iconBg: isDark ? "#422006" : "#fffbeb",
        iconColor: "#f59e0b",
        defaultTitle: "ยืนยันรายการ",
        accentColor: "#f59e0b",
        confirmBg: "#11b6f5",
      };
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const ModalComponent: React.FC<ModalComponentProps> = ({
  open,
  type,
  title,
  description,
  onClose,
  onConfirm,
  loading = false,
  errorDetails,
  confirmLabel,
  cancelLabel,
}) => {
  const { token } = antTheme.useToken();
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const [confirmInput, setConfirmInput] = useState("");
  const [debugExpanded, setDebugExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isSuccess = type === "success";
  const isError = type === "error";
  const isDelete = type === "delete";
  const cfg = getTypeConfig(type, isDark);

  const handleClose = () => {
    setConfirmInput("");
    setDebugExpanded(false);
    onClose();
  };

  const handleConfirm = () => {
    if (isDelete && confirmInput !== "Delete") return;
    if (onConfirm) onConfirm();
    else handleClose();
    setConfirmInput("");
  };

  const canConfirmDelete = !isDelete || confirmInput === "Delete";

  // ✨ mount guard สำหรับ portal
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // ✨ ล็อก scroll เมื่อ modal เปิด
  useEffect(() => {
    if (!isMounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMounted, open]);

  // ✨ ESC ปิด modal
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!isMounted) return null;

  const bgCard = isDark ? token.colorBgElevated : "#ffffff";
  const textPrimary = token.colorText;
  const textSecondary = token.colorTextSecondary;
  const borderColor = token.colorBorderSecondary;
  const bgHover = isDark ? token.colorFillSecondary : "#f8fafc";

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* ✨ Backdrop */}
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9998,
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={handleClose}
          />

          {/* ✨ Modal Container */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              padding: 16,
            }}
          >
            <motion.div
              style={{
                background: bgCard,
                borderRadius: 20,
                width: "100%",
                maxWidth: isError ? 540 : 400,
                position: "relative",
                overflow: "hidden",
                pointerEvents: "auto",
                boxShadow: isDark
                  ? "0 32px 80px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)"
                  : "0 32px 80px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
              }}
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ✨ Accent bar */}
              <motion.div
                style={{
                  height: 3,
                  width: "100%",
                  background: cfg.accentColor,
                }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              />

              <div style={{ padding: "28px 28px 24px" }}>
                {/* ✨ Close button */}
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: token.colorTextQuaternary,
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      bgHover;
                    (e.currentTarget as HTMLButtonElement).style.color =
                      textSecondary;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      token.colorTextQuaternary;
                  }}
                >
                  <IconClose />
                </button>

                {/* ✨ Icon + Title + Description */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 14,
                    marginBottom: 22,
                  }}
                >
                  {/* Icon badge พร้อม glow animation */}
                  <motion.div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: cfg.iconBg,
                      color: cfg.iconColor,
                      flexShrink: 0,
                    }}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.08,
                    }}
                  >
                    {cfg.icon}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.14 }}
                  >
                    <h2
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: textPrimary,
                        margin: "0 0 6px",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {title ?? cfg.defaultTitle}
                    </h2>
                    {description && (
                      <p
                        style={{
                          fontSize: 14,
                          color: textSecondary,
                          margin: 0,
                          lineHeight: 1.6,
                          maxWidth: 320,
                        }}
                      >
                        {description}
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* ✨ Delete confirmation input */}
                {isDelete && (
                  <motion.div
                    style={{ marginBottom: 20 }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.18 }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        color: textSecondary,
                        marginBottom: 8,
                      }}
                    >
                      โปรดพิมพ์{" "}
                      <code
                        style={{
                          color: "#ef4444",
                          background: isDark ? "#450a0a" : "#fef2f2",
                          padding: "2px 6px",
                          borderRadius: 4,
                          fontFamily: "monospace",
                          fontSize: 11,
                        }}
                      >
                        Delete
                      </code>{" "}
                      เพื่อยืนยัน
                    </p>
                    <input
                      type="text"
                      placeholder="Delete"
                      value={confirmInput}
                      onChange={(e) => setConfirmInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleConfirm();
                      }}
                      autoFocus
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        fontSize: 14,
                        borderRadius: 10,
                        outline: "none",
                        fontFamily: "inherit",
                        background: isDark
                          ? token.colorFillSecondary
                          : "#f8fafc",
                        border: `1.5px solid ${confirmInput === "Delete" ? "#ef4444" : borderColor}`,
                        color: textPrimary,
                        transition: "border-color 0.2s",
                        boxSizing: "border-box",
                      }}
                    />
                  </motion.div>
                )}

                {/* ✨ Debug panel (เฉพาะ error + errorDetails) */}
                {isError && errorDetails && (
                  <motion.div
                    style={{
                      marginBottom: 20,
                      borderRadius: 12,
                      overflow: "hidden",
                      border: `1px solid ${borderColor}`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <button
                      type="button"
                      onClick={() => setDebugExpanded((p) => !p)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        background: bgHover,
                        border: "none",
                        cursor: "pointer",
                        color: textSecondary,
                        transition: "background 0.15s",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Debug Information
                      </span>
                      <motion.span
                        animate={{ rotate: debugExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: textSecondary }}
                      >
                        <IconChevron />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {debugExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          <pre
                            style={{
                              fontSize: 11,
                              color: textSecondary,
                              background: bgHover,
                              padding: "12px 14px",
                              margin: 0,
                              overflow: "auto",
                              maxHeight: 160,
                              fontFamily: "monospace",
                              lineHeight: 1.6,
                              borderTop: `1px solid ${borderColor}`,
                            }}
                          >
                            {typeof errorDetails === "string"
                              ? errorDetails
                              : JSON.stringify(errorDetails, null, 2)}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* ✨ Buttons */}
                <motion.div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {/* Primary button */}
                  <motion.button
                    type="button"
                    onClick={isSuccess ? handleClose : handleConfirm}
                    disabled={loading || !canConfirmDelete}
                    whileHover={{
                      opacity: loading || !canConfirmDelete ? 0.4 : 0.9,
                      scale: 1.005,
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    style={{
                      width: "100%",
                      height: 48,
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#ffffff",
                      background: cfg.confirmBg,
                      border: "none",
                      cursor:
                        loading || !canConfirmDelete
                          ? "not-allowed"
                          : "pointer",
                      opacity: loading || !canConfirmDelete ? 0.5 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      transition: "opacity 0.15s",
                    }}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          style={{
                            width: 16,
                            height: 16,
                            border: "2px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#fff",
                            borderRadius: "50%",
                          }}
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.7,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <span>กำลังดำเนินการ...</span>
                      </>
                    ) : (
                      <span>
                        {confirmLabel ??
                          (isDelete
                            ? "ลบรายการ"
                            : isSuccess
                              ? "ตกลง"
                              : "ยืนยัน")}
                      </span>
                    )}
                  </motion.button>

                  {/* Cancel button (ไม่แสดงเมื่อ success) */}
                  {!isSuccess && (
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      style={{
                        width: "100%",
                        height: 42,
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        color: textSecondary,
                        background: "transparent",
                        border: `1px solid ${borderColor}`,
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.4 : 1,
                        transition: "background 0.15s, color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = bgHover;
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "transparent";
                      }}
                    >
                      {cancelLabel ?? "ยกเลิก"}
                    </button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ModalComponent;
