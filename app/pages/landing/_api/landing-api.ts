import axios from "axios";

// ✨ ดึงประกาศงานล่าสุดสำหรับ Landing Page
export const fetchLatestJobs = async () => {
  const response = await axios.get("/api/v1/jobs/latest");
  return response.data;
};
