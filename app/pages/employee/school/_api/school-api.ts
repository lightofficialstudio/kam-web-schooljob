import axios from "axios";

// ✨ Params สำหรับค้นหาโรงเรียน
export interface SchoolSearchParams {
  keyword?: string;
  province?: string;
  school_type?: string;
}

// ✨ ดึงรายชื่อโรงเรียนที่มีงานเปิดรับสมัคร
export const fetchSchools = async (params?: SchoolSearchParams) => {
  const response = await axios.get("/api/v1/employee/schools/read", { params });
  return response.data;
};
