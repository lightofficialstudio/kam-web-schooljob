import axios from "axios";

// ดึงรายการประกาศงานทั้งหมดของ Employer
export const fetchJobList = async () => {
  const response = await axios.get("/api/v1/employer/jobs");
  return response.data;
};

// ปิดรับสมัครประกาศงาน
export const requestCloseJob = async (jobId: string) => {
  const response = await axios.patch(`/api/v1/employer/jobs/${jobId}/close`);
  return response.data;
};
