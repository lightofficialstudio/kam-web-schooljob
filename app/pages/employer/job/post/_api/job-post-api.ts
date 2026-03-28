import axios from "axios";

// สร้างประกาศงานใหม่
export const requestCreateJob = async (payload: Record<string, unknown>) => {
  const response = await axios.post("/api/v1/employer/jobs", payload);
  return response.data;
};

// แก้ไขประกาศงานที่มีอยู่
export const requestUpdateJob = async (
  jobId: string,
  payload: Record<string, unknown>,
) => {
  const response = await axios.patch(`/api/v1/employer/jobs/${jobId}`, payload);
  return response.data;
};

// ดึงข้อมูลประกาศงานตาม ID
export const fetchJobById = async (jobId: string) => {
  const response = await axios.get(`/api/v1/employer/jobs/${jobId}`);
  return response.data;
};
