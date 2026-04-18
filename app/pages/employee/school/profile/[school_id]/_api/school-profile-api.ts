import axios from "axios";

// ✨ โครงสร้างตำแหน่งงานที่โรงเรียนเปิดรับ
export interface SchoolOpenJob {
  id: string;
  title: string;
  jobType: string | null;
  positionsAvailable: number;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryNegotiable: boolean;
  licenseRequired: string;
  deadline: string | null;
  postedAt: string;
  isNew: boolean;
  applicantCount: number;
  subjects: string[];
  grades: string[];
  benefits: string[];
}

// ✨ โครงสร้าง School Profile ครบถ้วน
export interface SchoolProfileDetail {
  id: string;
  schoolName: string;
  schoolType: string | null;
  affiliation: string | null;
  province: string;
  district: string | null;
  address: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  description: string | null;
  studentCount: number | null;
  teacherCount: number | null;
  foundedYear: number | null;
  totalJobsPosted: number;
  benefits: string[];
  openJobCount: number;
  jobs: SchoolOpenJob[];
}

// ✨ ดึงข้อมูลโรงเรียนครบถ้วนตาม school_id
export const fetchSchoolProfile = async (schoolId: string) => {
  const response = await axios.get<{
    status_code: number;
    data: SchoolProfileDetail;
  }>(`/api/v1/employee/schools/${schoolId}/read`);
  return response.data;
};
