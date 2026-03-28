import { create } from "zustand";

export type ApplicantStatus = "PENDING" | "INTERVIEW" | "ACCEPTED" | "REJECTED";

export interface ApplicantRecord {
  key: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  experience: string;
  education: string;
  appliedAt: string;
  status: ApplicantStatus;
  jobTitle?: string; // แสดงเฉพาะใน mode ผู้สมัครใหม่ทั้งหมด
  jobId?: string;
}

// Map ชื่อตำแหน่งตาม jobId — ใช้ในการ aggregate "ผู้สมัครใหม่ทั้งหมด"
export const JOB_TITLE_MAP: Record<string, string> = {
  "1": "ครูสอนภาษาอังกฤษ (Full-time)",
  "2": "ครูสอนคณิตศาสตร์ (Part-time)",
  "3": "ครูประจำชั้นอนุบาล 3",
};

// ข้อมูล Mock ผู้สมัครจำแนกตาม jobId
const MOCK_APPLICANTS: Record<string, ApplicantRecord[]> = {
  "1": [
    {
      key: "a1-1",
      name: "นางสาวสมหญิง ใจดี",
      email: "somying@email.com",
      phone: "081-234-5678",
      subjects: ["ภาษาอังกฤษ", "Conversation"],
      experience: "5 ปี",
      education: "ครุศาสตรบัณฑิต ม.ราชภัฏ",
      appliedAt: "2026-03-20",
      status: "INTERVIEW",
    },
    {
      key: "a1-2",
      name: "นายสมชาย เก่งมาก",
      email: "somchai@email.com",
      phone: "089-876-5432",
      subjects: ["ภาษาอังกฤษ"],
      experience: "2 ปี",
      education: "ศิลปศาสตรบัณฑิต ม.ธรรมศาสตร์",
      appliedAt: "2026-03-22",
      status: "PENDING",
    },
    {
      key: "a1-3",
      name: "นางมณี รักเรียน",
      email: "manee@email.com",
      phone: "062-111-2222",
      subjects: ["ภาษาอังกฤษ", "IELTS"],
      experience: "8 ปี",
      education: "Master of Education, มหาวิทยาลัยมหิดล",
      appliedAt: "2026-03-18",
      status: "ACCEPTED",
    },
    {
      key: "a1-4",
      name: "นายกิตติ ภาษาดี",
      email: "kitti@email.com",
      phone: "095-333-4444",
      subjects: ["Conversation"],
      experience: "1 ปี",
      education: "ครุศาสตรบัณฑิต จุฬาลงกรณ์มหาวิทยาลัย",
      appliedAt: "2026-03-25",
      status: "PENDING",
    },
    {
      key: "a1-5",
      name: "นางสาวพิมพ์ชนก วาทะดี",
      email: "pimchanok@email.com",
      phone: "086-555-6666",
      subjects: ["ภาษาอังกฤษ"],
      experience: "3 ปี",
      education: "ครุศาสตรบัณฑิต ม.เชียงใหม่",
      appliedAt: "2026-03-24",
      status: "PENDING",
    },
    {
      key: "a1-6",
      name: "นายธนพล อังกฤษเยี่ยม",
      email: "thanapol@email.com",
      phone: "064-222-3333",
      subjects: ["ภาษาอังกฤษ", "Conversation"],
      experience: "4 ปี",
      education: "ครุศาสตรบัณฑิต ม.ศิลปากร",
      appliedAt: "2026-03-26",
      status: "PENDING",
    },
    {
      key: "a1-7",
      name: "นางสาวชลิดา นิ่มนวล",
      email: "chalida@email.com",
      phone: "085-444-5555",
      subjects: ["ภาษาอังกฤษ"],
      experience: "6 ปี",
      education: "ศิลปศาสตรบัณฑิต ม.เกษตรศาสตร์",
      appliedAt: "2026-03-27",
      status: "PENDING",
    },
  ],
  "2": [
    {
      key: "a2-1",
      name: "นายคณิต เลขเก่ง",
      email: "kanit@email.com",
      phone: "082-777-8888",
      subjects: ["คณิตศาสตร์", "Calculus"],
      experience: "6 ปี",
      education: "วิทยาศาสตรบัณฑิต ม.เกษตรศาสตร์",
      appliedAt: "2026-03-15",
      status: "INTERVIEW",
    },
    {
      key: "a2-2",
      name: "นางสาวรัชดา ตัวเลข",
      email: "rachada@email.com",
      phone: "091-999-0000",
      subjects: ["คณิตศาสตร์"],
      experience: "4 ปี",
      education: "ครุศาสตรบัณฑิต ม.ราชภัฏ",
      appliedAt: "2026-03-17",
      status: "PENDING",
    },
    {
      key: "a2-3",
      name: "นายวิทยา สูตรไว",
      email: "wittaya@email.com",
      phone: "083-111-2233",
      subjects: ["คณิตศาสตร์", "ฟิสิกส์"],
      experience: "10 ปี",
      education: "ครุศาสตรมหาบัณฑิต จุฬาลงกรณ์มหาวิทยาลัย",
      appliedAt: "2026-03-10",
      status: "ACCEPTED",
    },
    {
      key: "a2-4",
      name: "นางสาวสุภาพร เลขดี",
      email: "supaporn@email.com",
      phone: "096-888-7777",
      subjects: ["คณิตศาสตร์"],
      experience: "2 ปี",
      education: "วิทยาศาสตรบัณฑิต ม.มหิดล",
      appliedAt: "2026-03-26",
      status: "PENDING",
    },
  ],
  "3": [
    {
      key: "a3-1",
      name: "นางสาวอรุณ รักเด็ก",
      email: "arun@email.com",
      phone: "087-444-5566",
      subjects: ["ปฐมวัย"],
      experience: "7 ปี",
      education: "ครุศาสตรบัณฑิต ม.ราชภัฏ",
      appliedAt: "2025-12-05",
      status: "ACCEPTED",
    },
    {
      key: "a3-2",
      name: "นางเพ็ญแข ใจอ่อน",
      email: "penkhae@email.com",
      phone: "090-222-3344",
      subjects: ["ปฐมวัย"],
      experience: "3 ปี",
      education: "ครุศาสตรบัณฑิต ม.บูรพา",
      appliedAt: "2025-12-08",
      status: "REJECTED",
    },
  ],
};

// "__NEW__" คือ mode พิเศษ — แสดงผู้สมัครใหม่ (PENDING) จากทุกตำแหน่ง
export const NEW_APPLICANTS_MODE = "__NEW__";

// State สำหรับ Drawer แสดงรายชื่อผู้สมัครของแต่ละตำแหน่ง
interface ApplicantDrawerState {
  isOpen: boolean;
  selectedJobId: string | null;
  selectedJobTitle: string;
  filterStatus: ApplicantStatus | "ALL";
  openDrawer: (jobId: string, jobTitle: string) => void;
  openNewApplicantsDrawer: () => void; // เปิดในโหมดผู้สมัครใหม่ทั้งหมด
  closeDrawer: () => void;
  setFilterStatus: (status: ApplicantStatus | "ALL") => void;
  getAllApplicants: () => ApplicantRecord[]; // ดึงทั้งหมดโดยไม่ filter status
  getApplicants: () => ApplicantRecord[];   // ดึงตาม filterStatus ปัจจุบัน
  updateApplicantStatus: (applicantKey: string, status: ApplicantStatus) => void;
}

export const useApplicantDrawerStore = create<ApplicantDrawerState>((set, get) => ({
  isOpen: false,
  selectedJobId: null,
  selectedJobTitle: "",
  filterStatus: "ALL",

  // เปิด Drawer พร้อมระบุ jobId และชื่อตำแหน่ง
  openDrawer: (jobId, jobTitle) =>
    set({ isOpen: true, selectedJobId: jobId, selectedJobTitle: jobTitle, filterStatus: "ALL" }),

  // เปิด Drawer ในโหมดรวมผู้สมัครใหม่ทุกตำแหน่ง
  openNewApplicantsDrawer: () =>
    set({
      isOpen: true,
      selectedJobId: NEW_APPLICANTS_MODE,
      selectedJobTitle: "ผู้สมัครใหม่ทั้งหมด",
      filterStatus: "ALL",
    }),

  // ปิด Drawer และ reset state
  closeDrawer: () =>
    set({ isOpen: false, selectedJobId: null, selectedJobTitle: "", filterStatus: "ALL" }),

  // กรองสถานะผู้สมัครใน Drawer
  setFilterStatus: (filterStatus) => set({ filterStatus }),

  // ดึงรายชื่อผู้สมัครทั้งหมดตาม mode โดยไม่ filter status — ใช้คำนวณ count
  getAllApplicants: () => {
    const { selectedJobId } = get();
    if (!selectedJobId) return [];
    if (selectedJobId === NEW_APPLICANTS_MODE) {
      return Object.entries(MOCK_APPLICANTS).flatMap(([jobId, applicants]) =>
        applicants
          .filter((a) => a.status === "PENDING")
          .map((a) => ({ ...a, jobTitle: JOB_TITLE_MAP[jobId] ?? jobId, jobId })),
      );
    }
    return MOCK_APPLICANTS[selectedJobId] ?? [];
  },

  // ดึงรายชื่อผู้สมัครตาม mode ปัจจุบัน
  getApplicants: () => {
    const { selectedJobId, filterStatus } = get();
    if (!selectedJobId) return [];

    let allRecords: ApplicantRecord[] = [];

    if (selectedJobId === NEW_APPLICANTS_MODE) {
      // รวมผู้สมัครใหม่ (PENDING) จากทุกตำแหน่ง พร้อม inject jobTitle + jobId
      allRecords = Object.entries(MOCK_APPLICANTS).flatMap(([jobId, applicants]) =>
        applicants
          .filter((a) => a.status === "PENDING")
          .map((a) => ({ ...a, jobTitle: JOB_TITLE_MAP[jobId] ?? jobId, jobId })),
      );
    } else {
      allRecords = MOCK_APPLICANTS[selectedJobId] ?? [];
    }

    return filterStatus === "ALL" ? allRecords : allRecords.filter((a) => a.status === filterStatus);
  },

  // อัปเดตสถานะผู้สมัคร — รองรับทั้ง mode ปกติและ NEW mode
  updateApplicantStatus: (applicantKey, status) => {
    const { selectedJobId } = get();

    if (selectedJobId === NEW_APPLICANTS_MODE) {
      // ค้นหาใน jobId ทั้งหมดแล้ว update
      for (const jobId of Object.keys(MOCK_APPLICANTS)) {
        const idx = MOCK_APPLICANTS[jobId].findIndex((a) => a.key === applicantKey);
        if (idx !== -1) {
          MOCK_APPLICANTS[jobId][idx] = { ...MOCK_APPLICANTS[jobId][idx], status };
          break;
        }
      }
    } else if (selectedJobId && MOCK_APPLICANTS[selectedJobId]) {
      MOCK_APPLICANTS[selectedJobId] = MOCK_APPLICANTS[selectedJobId].map((a) =>
        a.key === applicantKey ? { ...a, status } : a,
      );
    }

    set({}); // trigger re-render
  },
}));
