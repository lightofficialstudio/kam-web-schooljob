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
}

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
      status: "REJECTED",
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

// State สำหรับ Drawer แสดงรายชื่อผู้สมัครของแต่ละตำแหน่ง
interface ApplicantDrawerState {
  isOpen: boolean;
  selectedJobId: string | null;
  selectedJobTitle: string;
  filterStatus: ApplicantStatus | "ALL";
  openDrawer: (jobId: string, jobTitle: string) => void;
  closeDrawer: () => void;
  setFilterStatus: (status: ApplicantStatus | "ALL") => void;
  getApplicants: () => ApplicantRecord[];
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

  // ปิด Drawer และ reset state
  closeDrawer: () =>
    set({ isOpen: false, selectedJobId: null, selectedJobTitle: "", filterStatus: "ALL" }),

  // กรองสถานะผู้สมัครใน Drawer
  setFilterStatus: (filterStatus) => set({ filterStatus }),

  // ดึงรายชื่อผู้สมัครตาม jobId และ filterStatus ปัจจุบัน
  getApplicants: () => {
    const { selectedJobId, filterStatus } = get();
    if (!selectedJobId) return [];
    const all = MOCK_APPLICANTS[selectedJobId] ?? [];
    return filterStatus === "ALL" ? all : all.filter((a) => a.status === filterStatus);
  },

  // อัปเดตสถานะผู้สมัคร (จำลองการเปลี่ยนสถานะ)
  updateApplicantStatus: (applicantKey, status) => {
    const { selectedJobId } = get();
    if (!selectedJobId || !MOCK_APPLICANTS[selectedJobId]) return;
    MOCK_APPLICANTS[selectedJobId] = MOCK_APPLICANTS[selectedJobId].map((a) =>
      a.key === applicantKey ? { ...a, status } : a,
    );
    set({}); // trigger re-render
  },
}));
