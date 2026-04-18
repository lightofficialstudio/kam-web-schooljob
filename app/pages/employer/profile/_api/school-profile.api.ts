import axios from "axios";

import type { SchoolProfile } from "../_state/school-profile.state";

// ✨ Axios instance สำหรับ Employer Profile API
const employerApi = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

// ✨ API response shape จาก backend
interface ApiResponse<T> {
  status_code: number;
  message_th: string;
  message_en: string;
  data: T;
}

// ✨ ดึงข้อมูลโปรไฟล์โรงเรียนโดยใช้ userId (+ email สำหรับ auto-create)
export const requestFetchSchoolProfile = async (
  userId: string,
  email?: string,
): Promise<SchoolProfile | null> => {
  const params = new URLSearchParams({ user_id: userId });
  if (email) params.set("email", email);
  const response = await employerApi.get<
    ApiResponse<{
      email: string;
      schoolProfile: {
        id: string;
        schoolName: string;
        schoolType?: string | null;
        province: string;
        district?: string | null;
        address?: string | null;
        website?: string | null;
        phone?: string | null;
        description?: string | null;
        vision?: string | null;
        foundedYear?: number | null;
        teacherCount?: number | null;
        studentCount?: number | null;
        affiliation?: string | null;
        curriculum?: string | null;
        levels?: string | null; // JSON string ใน DB
        logoUrl?: string | null;
        coverImageUrl?: string | null;
        accountPlan: string;
        jobQuotaMax: number;
        schoolBenefits: { benefit: string }[];
      } | null;
    }>
  >(`/employer/profile/read?${params.toString()}`);

  const raw = response.data.data;
  if (!raw?.schoolProfile) return null;

  const sp = raw.schoolProfile;

  // ✨ แปลง levels JSON string → string[]
  let levels: string[] = [];
  if (sp.levels) {
    try {
      levels = JSON.parse(sp.levels);
    } catch {
      levels = [];
    }
  }

  return {
    id: sp.id,
    name: sp.schoolName,
    type: sp.schoolType ?? "",
    location: sp.province,
    district: sp.district ?? "",
    address: sp.address ?? "",
    website: sp.website ?? "",
    email: raw.email,
    phone: sp.phone ?? "",
    established: sp.foundedYear ? String(sp.foundedYear) : "",
    teacherCount: sp.teacherCount ?? undefined,
    studentCount: sp.studentCount ?? undefined,
    affiliation: sp.affiliation ?? "",
    description: sp.description ?? "",
    vision: sp.vision ?? "",
    curriculum: sp.curriculum ?? "",
    levels,
    benefits: sp.schoolBenefits.map((b) => b.benefit),
    gallery: [],
    logoUrl: sp.logoUrl ?? undefined,
    coverImageUrl: sp.coverImageUrl ?? undefined,
    accountPlan: sp.accountPlan,
    jobQuotaMax: sp.jobQuotaMax,
  };
};

// ✨ อัปเดตข้อมูลโปรไฟล์โรงเรียน
export const requestUpdateSchoolProfile = async (
  userId: string,
  data: SchoolProfile,
): Promise<void> => {
  await employerApi.patch(`/employer/profile/update?user_id=${userId}`, {
    school_name: data.name,
    school_type: data.type || null,
    province: data.location,
    district: data.district ?? null,
    address: data.address ?? null,
    website: data.website ?? null,
    phone: data.phone ?? null,
    description: data.description ?? null,
    vision: data.vision ?? null,
    founded_year: data.established
      ? parseInt(data.established, 10) || null
      : null,
    teacher_count: data.teacherCount ?? null,
    student_count: data.studentCount ?? null,
    affiliation: data.affiliation ?? null,
    curriculum: data.curriculum ?? null,
    levels: data.levels ?? [],
    benefits: data.benefits ?? [],
    logo_url: data.logoUrl ?? null,
    cover_image_url: data.coverImageUrl ?? null,
    gallery: data.gallery ?? [],
  });
};
