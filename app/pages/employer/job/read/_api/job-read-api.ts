import axios from "axios";

// API response shape
interface ApiResponse<T> {
  status_code: number;
  message_th: string;
  message_en: string;
  data: T;
}

// ดึงรายการประกาศงานทั้งหมดของ Employer (รวม application count)
export const fetchJobList = async (userId: string) => {
  const { data } = await axios.get<ApiResponse<unknown[]>>(
    `/api/v1/employer/jobs/read?user_id=${userId}`,
  );
  return data.data ?? [];
};

// ดึงสรุป Pipeline การรับสมัครทั้งหมด
export const fetchPipeline = async (userId: string) => {
  const { data } = await axios.get<ApiResponse<unknown>>(
    `/api/v1/employer/jobs/pipeline?user_id=${userId}`,
  );
  return data.data;
};

// ปิดรับสมัครประกาศงาน
export const requestCloseJob = async (userId: string, jobId: string) => {
  const { data } = await axios.patch<ApiResponse<unknown>>(
    `/api/v1/employer/jobs/close?user_id=${userId}&job_id=${jobId}`,
  );
  return data;
};
