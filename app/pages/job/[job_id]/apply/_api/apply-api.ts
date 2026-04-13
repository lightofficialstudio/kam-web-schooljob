import axios from "axios";

// ✨ ดึงข้อมูลงานตาม ID
export const fetchJobForApply = async (jobId: string) => {
  const response = await axios.get(`/api/v1/jobs/${jobId}`);
  return response.data;
};

// ✨ ดึง Employee Profile พร้อม resumes
export const fetchEmployeeProfile = async (userId: string) => {
  const response = await axios.get("/api/v1/employee/profile/read", {
    params: { user_id: userId },
  });
  return response.data;
};

// ✨ ส่งใบสมัครงาน
export const submitApplication = async (payload: {
  user_id: string;
  job_id: string;
  cover_letter?: string;
  resume_id?: string;
}) => {
  const response = await axios.post("/api/v1/employee/applications/create", payload);
  return response.data;
};
