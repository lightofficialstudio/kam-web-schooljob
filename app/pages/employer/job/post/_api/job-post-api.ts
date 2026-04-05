import axios from "axios";

// API response shape จาก backend
interface ApiResponse<T> {
  status_code: number;
  message_th: string;
  message_en: string;
  data: T;
}

// ✨ สร้างประกาศงานใหม่
export const requestCreateJob = async (
  userId: string,
  payload: Record<string, unknown>,
) => {
  const { data } = await axios.post<ApiResponse<{ id: string }>>(
    `/api/v1/employer/jobs/create?user_id=${userId}`,
    payload,
  );
  return data;
};

// ✨ แก้ไขประกาศงานที่มีอยู่
export const requestUpdateJob = async (
  userId: string,
  jobId: string,
  payload: Record<string, unknown>,
) => {
  const { data } = await axios.patch<ApiResponse<{ id: string }>>(
    `/api/v1/employer/jobs/update?user_id=${userId}&job_id=${jobId}`,
    payload,
  );
  return data;
};

// ✨ ดึงข้อมูลประกาศงานตาม ID
export const requestFetchJobById = async (userId: string, jobId: string) => {
  const { data } = await axios.get<ApiResponse<Record<string, unknown>>>(
    `/api/v1/employer/jobs/read?user_id=${userId}&job_id=${jobId}`,
  );
  return data.data;
};
