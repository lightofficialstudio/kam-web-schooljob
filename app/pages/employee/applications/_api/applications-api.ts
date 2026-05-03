"use client";

import axios from "axios";

// ✨ ดึงใบสมัครทั้งหมดของ Employee
export const requestGetApplications = (userId: string) =>
  axios.get(`/api/v1/employee/applications/read?user_id=${userId}`);
