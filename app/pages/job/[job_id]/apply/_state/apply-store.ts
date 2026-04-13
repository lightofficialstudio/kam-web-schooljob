import { create } from "zustand";
import { fetchJobForApply, fetchEmployeeProfile, submitApplication } from "../_api/apply-api";

export interface JobInfo {
  id: string;
  title: string;
  schoolName: string;
  logoUrl?: string;
  province?: string;
  subjects?: string[];
  grades?: string[];
}

export interface ResumeOption {
  id: string;
  fileName: string;
  fileUrl: string;
}

export interface ProfileInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  resumes: ResumeOption[];
}

interface ApplyState {
  job: JobInfo | null;
  profile: ProfileInfo | null;
  isLoadingJob: boolean;
  isLoadingProfile: boolean;
  isSubmitting: boolean;
  isConfirmModalOpen: boolean;
  resumeOption: string;
  coverLetterOption: string;
  coverLetter: string;
  selectedResumeId: string | undefined;
  fetchJob: (jobId: string) => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  submitApply: (userId: string, jobId: string) => Promise<{ success: boolean; message: string }>;
  setIsConfirmModalOpen: (open: boolean) => void;
  setResumeOption: (option: string) => void;
  setCoverLetterOption: (option: string) => void;
  setCoverLetter: (text: string) => void;
  setSelectedResumeId: (id: string | undefined) => void;
  reset: () => void;
}

export const useApplyStore = create<ApplyState>((set, get) => ({
  job: null,
  profile: null,
  isLoadingJob: false,
  isLoadingProfile: false,
  isSubmitting: false,
  isConfirmModalOpen: false,
  resumeOption: "select",
  coverLetterOption: "none",
  coverLetter: "",
  selectedResumeId: undefined,

  // ✨ ดึงข้อมูลงานตาม jobId
  fetchJob: async (jobId) => {
    set({ isLoadingJob: true });
    try {
      const res = await fetchJobForApply(jobId);
      if (res.status_code === 200 && res.data) {
        set({
          job: {
            id: res.data.id,
            title: res.data.title,
            schoolName: res.data.schoolName,
            logoUrl: res.data.logoUrl,
            province: res.data.province,
            subjects: res.data.subjects,
            grades: res.data.grades,
          },
        });
      }
    } catch (error) {
      console.error("❌ fetchJob:", error);
    } finally {
      set({ isLoadingJob: false });
    }
  },

  // ✨ ดึง Employee Profile พร้อม resumes
  fetchProfile: async (userId) => {
    set({ isLoadingProfile: true });
    try {
      const res = await fetchEmployeeProfile(userId);
      if (res.status_code === 200 && res.data) {
        const data = res.data;
        const resumes: ResumeOption[] = (data.resumes ?? []).map((r: { id: string; fileName: string; fileUrl: string }) => ({
          id: r.id,
          fileName: r.fileName,
          fileUrl: r.fileUrl,
        }));

        set({
          profile: {
            firstName: data.firstName ?? undefined,
            lastName: data.lastName ?? undefined,
            email: data.email ?? undefined,
            phoneNumber: data.phoneNumber ?? undefined,
            profileImageUrl: data.profileImageUrl ?? undefined,
            resumes,
          },
          // ✨ ตั้ง selectedResumeId เป็น active resume ถ้ามี
          selectedResumeId: data.activeResumeId ?? (resumes[0]?.id ?? undefined),
        });
      }
    } catch (error) {
      console.error("❌ fetchProfile:", error);
    } finally {
      set({ isLoadingProfile: false });
    }
  },

  // ✨ ส่งใบสมัครงาน
  submitApply: async (userId, jobId) => {
    const { coverLetter, selectedResumeId, resumeOption } = get();
    set({ isSubmitting: true });
    try {
      const res = await submitApplication({
        user_id: userId,
        job_id: jobId,
        cover_letter: coverLetter || undefined,
        resume_id: resumeOption === "select" ? selectedResumeId : undefined,
      });

      if (res.status_code === 201) {
        set({ isConfirmModalOpen: false });
        return { success: true, message: "ส่งใบสมัครสำเร็จ" };
      }

      return { success: false, message: res.message_th ?? "เกิดข้อผิดพลาด" };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message_th?: string } } };
      const msg = axiosError?.response?.data?.message_th ?? "เกิดข้อผิดพลาด กรุณาลองใหม่";
      return { success: false, message: msg };
    } finally {
      set({ isSubmitting: false });
    }
  },

  setIsConfirmModalOpen: (isConfirmModalOpen) => set({ isConfirmModalOpen }),
  setResumeOption: (resumeOption) => set({ resumeOption }),
  setCoverLetterOption: (coverLetterOption) => set({ coverLetterOption }),
  setCoverLetter: (coverLetter) => set({ coverLetter }),
  setSelectedResumeId: (selectedResumeId) => set({ selectedResumeId }),

  reset: () => set({
    job: null,
    profile: null,
    isConfirmModalOpen: false,
    resumeOption: "select",
    coverLetterOption: "none",
    coverLetter: "",
    selectedResumeId: undefined,
  }),
}));
