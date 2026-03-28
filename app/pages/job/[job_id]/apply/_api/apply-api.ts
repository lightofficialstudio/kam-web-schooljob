import axios from "axios";

interface ApplyPayload {
  jobId: string;
  resumeOption: string;
  selectedResume?: string;
  coverLetterOption: string;
}

// ส่งใบสมัครงาน
export const requestSubmitApplication = async (payload: ApplyPayload) =>
  axios.post("/api/v1/applications", payload);

// ดึงข้อมูลงานตาม ID (สำหรับหน้า apply)
export const fetchJobForApply = async (jobId: string) =>
  axios.get(`/api/v1/jobs/${jobId}`);
