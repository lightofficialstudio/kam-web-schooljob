import { create } from "zustand";

export interface PipelineStep {
  label: string;
  count: number;
  color: string;
}

export interface DailyTrend {
  date: string;
  views: number;
  applicants: number;
}

export interface BreakdownItem {
  label: string;
  count: number;
  percent: number;
}

export interface JobStatsData {
  jobId: string;
  jobTitle: string;
  publishedAt: string;
  expiresAt: string;
  totalViews: number;
  totalApplicants: number;
  newApplicants: number;
  conversionRate: string;
  avgTimeToApply: string;   // เวลาเฉลี่ยที่ผู้สมัครใช้ก่อนกด "สมัคร"
  pipeline: PipelineStep[];
  dailyTrend: DailyTrend[]; // 7 วันล่าสุด
  sources: BreakdownItem[];            // แหล่งที่มาของผู้สมัคร
  experienceLevels: BreakdownItem[];   // ระดับประสบการณ์ผู้สมัคร
}

// ข้อมูล Mock สถิติจำแนกตาม jobId
const MOCK_STATS: Record<string, JobStatsData> = {
  "1": {
    jobId: "1",
    jobTitle: "ครูสอนภาษาอังกฤษ (Full-time)",
    publishedAt: "2026-03-01",
    expiresAt: "2026-03-31",
    totalViews: 1240,
    totalApplicants: 45,
    newApplicants: 12,
    conversionRate: "3.6%",
    avgTimeToApply: "4 นาที",
    pipeline: [
      { label: "สมัครแล้ว",       count: 45, color: "#11b6f5" },
      { label: "ตรวจสอบแล้ว",     count: 32, color: "#6366F1" },
      { label: "นัดสัมภาษณ์",     count: 12, color: "#F59E0B" },
      { label: "รับเข้าทำงาน",    count: 4,  color: "#10B981" },
    ],
    dailyTrend: [
      { date: "22 มี.ค.", views: 120, applicants: 5 },
      { date: "23 มี.ค.", views: 145, applicants: 8 },
      { date: "24 มี.ค.", views: 210, applicants: 12 },
      { date: "25 มี.ค.", views: 180, applicants: 7 },
      { date: "26 มี.ค.", views: 230, applicants: 15 },
      { date: "27 มี.ค.", views: 195, applicants: 9 },
      { date: "28 มี.ค.", views: 160, applicants: 11 },
    ],
    sources: [
      { label: "ค้นหาโดยตรง",   count: 18, percent: 40 },
      { label: "แนะนำโดยระบบ",  count: 15, percent: 33 },
      { label: "อีเมลแจ้งเตือน", count: 8,  percent: 18 },
      { label: "อื่นๆ",         count: 4,  percent: 9  },
    ],
    experienceLevels: [
      { label: "0–2 ปี",    count: 12, percent: 27 },
      { label: "3–5 ปี",    count: 18, percent: 40 },
      { label: "6–10 ปี",   count: 10, percent: 22 },
      { label: "10 ปีขึ้นไป", count: 5, percent: 11 },
    ],
  },
  "2": {
    jobId: "2",
    jobTitle: "ครูสอนคณิตศาสตร์ (Part-time)",
    publishedAt: "2026-02-15",
    expiresAt: "2026-03-15",
    totalViews: 850,
    totalApplicants: 18,
    newApplicants: 3,
    conversionRate: "2.1%",
    avgTimeToApply: "6 นาที",
    pipeline: [
      { label: "สมัครแล้ว",    count: 18, color: "#11b6f5" },
      { label: "ตรวจสอบแล้ว", count: 10, color: "#6366F1" },
      { label: "นัดสัมภาษณ์",  count: 5,  color: "#F59E0B" },
      { label: "รับเข้าทำงาน", count: 2,  color: "#10B981" },
    ],
    dailyTrend: [
      { date: "22 มี.ค.", views: 80,  applicants: 2 },
      { date: "23 มี.ค.", views: 95,  applicants: 3 },
      { date: "24 มี.ค.", views: 110, applicants: 4 },
      { date: "25 มี.ค.", views: 130, applicants: 2 },
      { date: "26 มี.ค.", views: 140, applicants: 5 },
      { date: "27 มี.ค.", views: 100, applicants: 1 },
      { date: "28 มี.ค.", views: 195, applicants: 1 },
    ],
    sources: [
      { label: "ค้นหาโดยตรง",   count: 8,  percent: 44 },
      { label: "แนะนำโดยระบบ",  count: 5,  percent: 28 },
      { label: "อีเมลแจ้งเตือน", count: 3,  percent: 17 },
      { label: "อื่นๆ",         count: 2,  percent: 11 },
    ],
    experienceLevels: [
      { label: "0–2 ปี",    count: 3,  percent: 17 },
      { label: "3–5 ปี",    count: 7,  percent: 39 },
      { label: "6–10 ปี",   count: 6,  percent: 33 },
      { label: "10 ปีขึ้นไป", count: 2, percent: 11 },
    ],
  },
  "3": {
    jobId: "3",
    jobTitle: "ครูประจำชั้นอนุบาล 3",
    publishedAt: "2025-12-01",
    expiresAt: "2026-01-01",
    totalViews: 2100,
    totalApplicants: 89,
    newApplicants: 0,
    conversionRate: "4.2%",
    avgTimeToApply: "3 นาที",
    pipeline: [
      { label: "สมัครแล้ว",    count: 89, color: "#11b6f5" },
      { label: "ตรวจสอบแล้ว", count: 60, color: "#6366F1" },
      { label: "นัดสัมภาษณ์",  count: 20, color: "#F59E0B" },
      { label: "รับเข้าทำงาน", count: 7,  color: "#10B981" },
    ],
    dailyTrend: [
      { date: "22 พ.ย.", views: 320, applicants: 14 },
      { date: "23 พ.ย.", views: 280, applicants: 11 },
      { date: "24 พ.ย.", views: 350, applicants: 18 },
      { date: "25 พ.ย.", views: 290, applicants: 9  },
      { date: "26 พ.ย.", views: 410, applicants: 22 },
      { date: "27 พ.ย.", views: 240, applicants: 8  },
      { date: "28 พ.ย.", views: 210, applicants: 7  },
    ],
    sources: [
      { label: "ค้นหาโดยตรง",   count: 40, percent: 45 },
      { label: "แนะนำโดยระบบ",  count: 28, percent: 31 },
      { label: "อีเมลแจ้งเตือน", count: 14, percent: 16 },
      { label: "อื่นๆ",         count: 7,  percent: 8  },
    ],
    experienceLevels: [
      { label: "0–2 ปี",    count: 20, percent: 22 },
      { label: "3–5 ปี",    count: 35, percent: 39 },
      { label: "6–10 ปี",   count: 24, percent: 27 },
      { label: "10 ปีขึ้นไป", count: 10, percent: 12 },
    ],
  },
};

// State สำหรับ Modal สถิติของแต่ละตำแหน่งงาน
interface JobStatsModalState {
  isOpen: boolean;
  stats: JobStatsData | null;
  openModal: (jobId: string) => void;
  closeModal: () => void;
}

export const useJobStatsModalStore = create<JobStatsModalState>((set) => ({
  isOpen: false,
  stats: null,

  // เปิด Modal พร้อมโหลดข้อมูลสถิติตาม jobId
  openModal: (jobId) =>
    set({ isOpen: true, stats: MOCK_STATS[jobId] ?? null }),

  // ปิด Modal และ clear ข้อมูล
  closeModal: () =>
    set({ isOpen: false, stats: null }),
}));
