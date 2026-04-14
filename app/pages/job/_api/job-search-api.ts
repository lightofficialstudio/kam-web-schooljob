import axios from "axios";

// ✨ Params สำหรับค้นหางาน (Cursor-based)
export interface JobSearchParams {
  keyword?: string;
  province?: string;
  school_type?: string;
  license?: string;
  salary_min?: number;
  salary_max?: number;
  grade_level?: string;
  cursor?: string;
  page_size?: number;
}

// ✨ ดึงรายการงานสำหรับหน้าค้นหา (Public)
export const fetchJobList = async (params?: JobSearchParams) => {
  const response = await axios.get("/api/v1/jobs", { params });
  return response.data;
};

// ✨ ดึงรายละเอียดงานตาม job_id (สำหรับเปิด Drawer จาก URL param)
export const fetchJobById = async (jobId: string) => {
  const response = await axios.get(`/api/v1/jobs/${jobId}`);
  return response.data;
};

// ✨ ดึงใบสมัครของ Employee ตาม user_id
export const fetchMyApplications = async (userId: string) => {
  const response = await axios.get("/api/v1/employee/applications/read", {
    params: { user_id: userId },
  });
  return response.data;
};
