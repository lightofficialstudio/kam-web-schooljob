import axios from "axios";
import type { JobFilters } from "../_state/job-search-store";

// ดึงรายการงานทั้งหมดพร้อม filter params
export const fetchJobList = async (filters?: Partial<JobFilters>) => {
  const response = await axios.get("/api/v1/jobs", { params: filters });
  return response.data;
};

// ดึงรายละเอียดงานตาม ID
export const fetchJobById = async (jobId: string) => {
  const response = await axios.get(`/api/v1/jobs/${jobId}`);
  return response.data;
};
