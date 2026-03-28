import axios from "axios";

import type { SchoolProfile } from "../_state/school-profile.state";

// Axios instance สำหรับ Employer Profile API
const employerApi = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

// ดึงข้อมูลโปรไฟล์โรงเรียน ตาม schoolId
export const requestSchoolProfile = async (
  schoolId: string,
): Promise<SchoolProfile> => {
  const response = await employerApi.get<SchoolProfile>(
    `/employer/profile/${schoolId}`,
  );
  return response.data;
};

// อัปเดตข้อมูลโปรไฟล์โรงเรียน
export const requestUpdateSchoolProfile = async (
  schoolId: string,
  data: Partial<SchoolProfile>,
): Promise<SchoolProfile> => {
  const response = await employerApi.put<SchoolProfile>(
    `/employer/profile/${schoolId}`,
    data,
  );
  return response.data;
};

// อัปโหลดรูปปก/โลโก้โรงเรียน
export const requestUploadSchoolLogo = async (
  schoolId: string,
  file: FormData,
): Promise<{ url: string }> => {
  const response = await employerApi.post<{ url: string }>(
    `/employer/profile/${schoolId}/logo`,
    file,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};
