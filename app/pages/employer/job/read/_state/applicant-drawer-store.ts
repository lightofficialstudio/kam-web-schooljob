import { create } from "zustand";
import {
  fetchApplicantsByJob,
  fetchNewApplicants,
  requestUpdateApplicantStatus,
} from "../_api/job-read-api";

export type ApplicantStatus = "PENDING" | "INTERVIEW" | "ACCEPTED" | "REJECTED";

export interface ApplicantRecord {
  key: string;           // application.id
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  experience: string;
  education: string;
  appliedAt: string;
  status: ApplicantStatus;
  jobTitle?: string;     // แสดงเฉพาะใน mode ผู้สมัครใหม่ทั้งหมด
  jobId?: string;
  // ข้อมูลโปรไฟล์เพิ่มเติม
  summary?: string;
  gradeCanTeach?: string[];
  languagesSpoken?: string[];
  itSkills?: string[];
  preferredProvinces?: string[];
  workExperiences?: { jobTitle: string; companyName: string; period: string; description: string }[];
  educations?: { level: string; institution: string; major: string; graduationYear?: number; gpa?: number }[];
}

// "__NEW__" คือ mode พิเศษ — แสดงผู้สมัครใหม่ (PENDING) จากทุกตำแหน่ง
export const NEW_APPLICANTS_MODE = "__NEW__";

// ✨ แปลงข้อมูล Application จาก API → ApplicantRecord สำหรับ UI
const mapApiToApplicantRecord = (
  app: Record<string, unknown>,
  jobTitle?: string,
  jobId?: string,
): ApplicantRecord => {
  const applicant = app.applicant as Record<string, unknown>;
  const firstName = (applicant.firstName as string | null) ?? "";
  const lastName = (applicant.lastName as string | null) ?? "";

  const specializations = ((applicant.specializations as { subject: string }[]) ?? []).map(
    (s) => s.subject,
  );
  const gradeCanTeach = ((applicant.gradeCanTeaches as { grade: string }[]) ?? []).map(
    (g) => g.grade,
  );
  const languages = ((applicant.languages as { languageName: string; proficiency: string | null }[]) ?? []).map(
    (l) => `${l.languageName}${l.proficiency ? ` (${l.proficiency})` : ""}`,
  );
  const skills = ((applicant.skills as { skillName: string }[]) ?? []).map(
    (s) => s.skillName,
  );
  const preferredProvinces = ((applicant.preferredProvinces as { province: string }[]) ?? []).map(
    (p) => p.province,
  );

  const rawEducations = (applicant.educations as {
    level: string;
    institution: string;
    major: string;
    graduationYear?: number | null;
    gpa?: number | null;
  }[]) ?? [];
  const educationSummary = rawEducations.length > 0
    ? `${rawEducations[0].level} ${rawEducations[0].institution}`
    : "-";

  const rawWorkExps = (applicant.workExperiences as {
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate: string | null;
    inPresent: boolean;
    description: string | null;
  }[]) ?? [];
  const workExperiences = rawWorkExps.map((w) => ({
    jobTitle: w.jobTitle,
    companyName: w.companyName,
    period: `${new Date(w.startDate).getFullYear() + 543} – ${w.inPresent ? "ปัจจุบัน" : w.endDate ? new Date(w.endDate).getFullYear() + 543 : ""}`,
    description: w.description ?? "",
  }));

  return {
    key: app.id as string,
    name: `${firstName} ${lastName}`.trim() || "-",
    email: (applicant.email as string) ?? "-",
    phone: (applicant.phoneNumber as string | null) ?? "-",
    subjects: specializations,
    experience: (applicant.teachingExperience as string | null) ?? "-",
    education: educationSummary,
    appliedAt: new Date(app.appliedAt as string).toISOString().split("T")[0],
    status: app.status as ApplicantStatus,
    jobTitle,
    jobId,
    summary: (applicant.specialActivities as string | null) ?? undefined,
    gradeCanTeach,
    languagesSpoken: languages,
    itSkills: skills,
    preferredProvinces,
    workExperiences,
    educations: rawEducations.map((e) => ({
      level: e.level,
      institution: e.institution,
      major: e.major,
      graduationYear: e.graduationYear ?? undefined,
      gpa: e.gpa ?? undefined,
    })),
  };
};

// State สำหรับ Drawer แสดงรายชื่อผู้สมัครของแต่ละตำแหน่ง
interface ApplicantDrawerState {
  isOpen: boolean;
  selectedJobId: string | null;
  selectedJobTitle: string;
  filterStatus: ApplicantStatus | "ALL";
  applicants: ApplicantRecord[];
  isLoading: boolean;
  // Profile Modal
  profileModalOpen: boolean;
  selectedApplicant: ApplicantRecord | null;
  // Actions
  openProfileModal: (applicant: ApplicantRecord) => void;
  closeProfileModal: () => void;
  openDrawer: (jobId: string, jobTitle: string, userId: string) => void;
  openNewApplicantsDrawer: (userId: string) => void;
  closeDrawer: () => void;
  setFilterStatus: (status: ApplicantStatus | "ALL") => void;
  getAllApplicants: () => ApplicantRecord[];
  getApplicants: () => ApplicantRecord[];
  updateApplicantStatus: (applicationId: string, status: ApplicantStatus, userId: string) => Promise<void>;
}

export const useApplicantDrawerStore = create<ApplicantDrawerState>((set, get) => ({
  isOpen: false,
  selectedJobId: null,
  selectedJobTitle: "",
  filterStatus: "ALL",
  applicants: [],
  isLoading: false,
  profileModalOpen: false,
  selectedApplicant: null,

  openProfileModal: (applicant) =>
    set({ profileModalOpen: true, selectedApplicant: applicant }),

  closeProfileModal: () =>
    set({ profileModalOpen: false, selectedApplicant: null }),

  // ✨ เปิด Drawer พร้อมโหลดผู้สมัครของตำแหน่งที่เลือก
  openDrawer: async (jobId, jobTitle, userId) => {
    set({ isOpen: true, selectedJobId: jobId, selectedJobTitle: jobTitle, filterStatus: "ALL", isLoading: true });
    try {
      const rawList = await fetchApplicantsByJob(userId, jobId);
      const applicants = (rawList as Record<string, unknown>[]).map((a) =>
        mapApiToApplicantRecord(a),
      );
      set({ applicants });
    } catch (err) {
      console.error("❌ [applicant-drawer-store] openDrawer error:", err);
      set({ applicants: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  // ✨ เปิด Drawer ในโหมดผู้สมัครใหม่ทุกตำแหน่ง
  openNewApplicantsDrawer: async (userId) => {
    set({
      isOpen: true,
      selectedJobId: NEW_APPLICANTS_MODE,
      selectedJobTitle: "ผู้สมัครใหม่ทั้งหมด",
      filterStatus: "ALL",
      isLoading: true,
    });
    try {
      const rawList = await fetchNewApplicants(userId);
      const applicants = (rawList as Record<string, unknown>[]).map((a) => {
        const job = a.job as { id: string; title: string } | undefined;
        return mapApiToApplicantRecord(a, job?.title, job?.id);
      });
      set({ applicants });
    } catch (err) {
      console.error("❌ [applicant-drawer-store] openNewApplicantsDrawer error:", err);
      set({ applicants: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  closeDrawer: () =>
    set({ isOpen: false, selectedJobId: null, selectedJobTitle: "", filterStatus: "ALL", applicants: [] }),

  setFilterStatus: (filterStatus) => set({ filterStatus }),

  // ดึงรายชื่อผู้สมัครทั้งหมดโดยไม่ filter status — ใช้คำนวณ count
  getAllApplicants: () => get().applicants,

  // ดึงรายชื่อผู้สมัครตาม filterStatus ปัจจุบัน
  getApplicants: () => {
    const { applicants, filterStatus } = get();
    return filterStatus === "ALL"
      ? applicants
      : applicants.filter((a) => a.status === filterStatus);
  },

  // ✨ อัปเดตสถานะผู้สมัครผ่าน API จริง แล้ว update local state ทันที (optimistic-like)
  updateApplicantStatus: async (applicationId, status, userId) => {
    // อัปเดต local state ก่อนเพื่อ UX ที่รวดเร็ว
    set((state) => ({
      applicants: state.applicants.map((a) =>
        a.key === applicationId ? { ...a, status } : a,
      ),
    }));
    try {
      await requestUpdateApplicantStatus(userId, applicationId, status);
    } catch (err) {
      console.error("❌ [applicant-drawer-store] updateApplicantStatus error:", err);
      // TODO: revert optimistic update ถ้าต้องการ
    }
  },
}));
