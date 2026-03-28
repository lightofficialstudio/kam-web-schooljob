import { create } from "zustand";

export interface Job {
  id: string;
  title: string;
  subjects: string[];
  grades: string[];
  vacancyCount: number;
  salaryType: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  educationLevel: string;
  teachingExperience: string;
  licenseRequired: string;
  gender: string;
  schoolName: string;
  province: string;
  address: string;
  postedAt: string;
  isNew: boolean;
}

export interface JobFilters {
  keyword: string;
  category: string[][];
  location: string | null;
  employmentType: string | null;
  license: string | null;
  salaryRange: string | null;
  postedAt: string | null;
}

// Mock Data 10 รายการ — จะแทนที่ด้วย API จริง
const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "ครูสอนภาษาอังกฤษ (English Teacher)",
    subjects: ["ภาษาอังกฤษ"],
    grades: ["มัธยมต้น", "มัธยมปลาย"],
    vacancyCount: 2,
    salaryType: "ระบุเงินเดือน",
    salaryMin: 25000,
    salaryMax: 35000,
    description: "รับสมัครครูสอนภาษาอังกฤษ มีประสบการณ์การสอนในระดับมัธยม เน้นทักษะการสื่อสารและกิจกรรมในห้องเรียน",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "1 - 3 ปี",
    licenseRequired: "มีรับผู้ที่กำลังดำเนินการ",
    gender: "ไม่จำกัด",
    schoolName: "โรงเรียนนานาชาติแสงทอง",
    province: "กรุงเทพมหานคร",
    address: "เขตบางนา กรุงเทพฯ",
    postedAt: "2026-03-09T10:00:00Z",
    isNew: true,
  },
  {
    id: "2",
    title: "ครูสอนคณิตศาสตร์",
    subjects: ["คณิตศาสตร์"],
    grades: ["ประถมศึกษา"],
    vacancyCount: 1,
    salaryType: "ตามประสบการณ์",
    description: "ต้องการครูคณิตศาสตร์ที่รักเด็ก มีเทคนิคการสอนที่สนุกสนาน เข้าใจง่าย",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "น้อยกว่า 1 ปี",
    licenseRequired: "จำเป็นต้องมี",
    gender: "หญิง",
    schoolName: "โรงเรียนประถมวิทยา",
    province: "นนทบุรี",
    address: "อ.เมือง นนทบุรี",
    postedAt: "2026-03-08T15:30:00Z",
    isNew: true,
  },
  {
    id: "3",
    title: "ครูสอนวิทยาศาสตร์ (ฟิสิกส์)",
    subjects: ["วิทยาศาสตร์", "ฟิสิกส์"],
    grades: ["มัธยมปลาย"],
    vacancyCount: 1,
    salaryType: "ระบุเงินเดือน",
    salaryMin: 30000,
    salaryMax: 45000,
    description: "เน้นการสอนปฏิบัติการและการเตรียมตัวสอบเข้ามหาวิทยาลัย",
    educationLevel: "ปริญญาโทขึ้นไป",
    teachingExperience: "3 - 5 ปี",
    licenseRequired: "จำเป็นต้องมี",
    gender: "ไม่จำกัด",
    schoolName: "โรงเรียนสาธิตเกษตร",
    province: "กรุงเทพมหานคร",
    address: "เขตจตุจักร กรุงเทพฯ",
    postedAt: "2026-03-07T09:00:00Z",
    isNew: false,
  },
  {
    id: "4",
    title: "ครูพี่เลี้ยงเด็กอนุบาล",
    subjects: ["กิจกรรมปฐมวัย"],
    grades: ["อนุบาล"],
    vacancyCount: 3,
    salaryType: "ระบุเงินเดือน",
    salaryMin: 18000,
    salaryMax: 22000,
    description: "ดูแลเด็กเล็ก ช่วยเหลือครูประจำชั้นในกิจกรรมต่างๆ รักความสะอาดและใจเย็น",
    educationLevel: "มัธยมศึกษา/ปวช",
    teachingExperience: "ไม่กำหนด",
    licenseRequired: "ไม่จำเป็นต้องมี",
    gender: "หญิง",
    schoolName: "โรงเรียนอนุบาลรักลูก",
    province: "ปทุมธานี",
    address: "คลองหลวง ปทุมธานี",
    postedAt: "2026-03-09T08:00:00Z",
    isNew: true,
  },
  {
    id: "5",
    title: "ครูสอนคอมพิวเตอร์และ Coding",
    subjects: ["คอมพิวเตอร์", "วิทยาการคำนวณ"],
    grades: ["ประถมศึกษา", "มัธยมต้น"],
    vacancyCount: 1,
    salaryType: "ระบุเงินเดือน",
    salaryMin: 28000,
    salaryMax: 40000,
    description: "สอนพื้นฐานการเขียนโปรแกรม Scratch, Python และการใช้เทคโนโลยีสารสนเทศ",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "1 - 3 ปี",
    licenseRequired: "ยินดีรับผู้ที่กำลังดำเนินการ",
    gender: "ไม่จำกัด",
    schoolName: "โรงเรียนเทคโนวิทยา",
    province: "สมุทรปราการ",
    address: "อ.เมือง สมุทรปราการ",
    postedAt: "2026-03-05T11:00:00Z",
    isNew: false,
  },
  {
    id: "6",
    title: "ครูสอนภาษาจีน",
    subjects: ["ภาษาจีน"],
    grades: ["ประถมศึกษา", "มัธยมต้น", "มัธยมปลาย"],
    vacancyCount: 2,
    salaryType: "ตามประสบการณ์",
    description: "สอนภาษาจีนพื้นฐานจนถึงระดับ HSK 4 มีสื่อการสอนที่ทันสมัย",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "1 - 3 ปี",
    licenseRequired: "ยินดีรับผู้ที่กำลังดำเนินการ",
    gender: "ไม่จำกัด",
    schoolName: "โรงเรียนภาษาโลก",
    province: "กรุงเทพมหานคร",
    address: "เขตสัมพันธวงศ์ กรุงเทพฯ",
    postedAt: "2026-03-09T14:00:00Z",
    isNew: true,
  },
  {
    id: "7",
    title: "ครูสอนศิลปะ (Art Teacher)",
    subjects: ["ศิลปะ"],
    grades: ["ประถมศึกษา"],
    vacancyCount: 1,
    salaryType: "ระบุเงินเดือน",
    salaryMin: 22000,
    salaryMax: 28000,
    description: "ส่งเสริมจินตนาการเด็กผ่านงานศิลปะหลากหลายรูปแบบ",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "น้อยกว่า 1 ปี",
    licenseRequired: "ไม่จำเป็นต้องมี",
    gender: "ไม่จำกัด",
    schoolName: "โรงเรียนสร้างสรรค์วิทย์",
    province: "เชียงใหม่",
    address: "อ.เมือง เชียงใหม่",
    postedAt: "2026-03-08T10:00:00Z",
    isNew: false,
  },
  {
    id: "8",
    title: "ครูสอนวิชาสังคมศึกษา",
    subjects: ["สังคมศึกษา", "ประวัติศาสตร์"],
    grades: ["มัธยมต้น"],
    vacancyCount: 1,
    salaryType: "ระบุเงินเดือน",
    salaryMin: 24000,
    salaryMax: 30000,
    description: "รับสมัครครูที่มีความรู้ในวิชาสังคมศึกษาและประวัติศาสตร์ไทย-สากล",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "3 - 5 ปี",
    licenseRequired: "จำเป็นต้องมี",
    gender: "ไม่จำกัด",
    schoolName: "โรงเรียนเก่งวิทยา",
    province: "นครปฐม",
    address: "อ.พุทธมณฑล นครปฐม",
    postedAt: "2026-03-04T12:00:00Z",
    isNew: false,
  },
  {
    id: "9",
    title: "ครูสอนพลศึกษา",
    subjects: ["พลศึกษา", "สุขศึกษา"],
    grades: ["มัธยมต้น", "มัธยมปลาย"],
    vacancyCount: 2,
    salaryType: "ระบุเงินเดือน",
    salaryMin: 20000,
    salaryMax: 26000,
    description: "ดูแลกิจกรรมกีฬาและสุขภาพของนักเรียน มีทักษะกีฬาที่หลากหลาย",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "1 - 3 ปี",
    licenseRequired: "ยินดีรับผู้ที่กำลังดำเนินการ",
    gender: "ชาย",
    schoolName: "โรงเรียนกีฬาแห่งชาติ",
    province: "ชลบุรี",
    address: "อ.เมือง ชลบุรี",
    postedAt: "2026-03-09T16:00:00Z",
    isNew: true,
  },
  {
    id: "10",
    title: "ครูสอนดนตรีไทย-สากล",
    subjects: ["ดนตรีไทย", "ดนตรีสากล"],
    grades: ["ประถมศึกษา", "มัธยมต้น"],
    vacancyCount: 1,
    salaryType: "ไม่ระบุ",
    description: "สอนเครื่องดนตรีเบื้องต้นและทฤษฎีดนตรี จัดตั้งวงดนตรีโรงเรียน",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "ไม่กำหนด",
    licenseRequired: "ยินดีรับผู้ที่กำลังดำเนินการ",
    gender: "ไม่จำกัด",
    schoolName: "โรงเรียนศิลป์ดนตรี",
    province: "กรุงเทพมหานคร",
    address: "เขตดุสิต กรุงเทพฯ",
    postedAt: "2026-03-06T13:00:00Z",
    isNew: false,
  },
];

// แผนที่จังหวัดตาม Location Filter
const LOCATION_MAP: Record<string, string[]> = {
  bkk: ["กรุงเทพมหานคร"],
  center: ["นนทบุรี", "ปทุมธานี", "สมุทรปราการ", "นครปฐม"],
  north: ["เชียงใหม่"],
  east: ["ชลบุรี", "ระยอง"],
};

interface JobSearchState {
  jobs: Job[];
  filters: JobFilters;
  selectedJob: Job | null;
  isDrawerOpen: boolean;
  currentPage: number;
  pageSize: number;
  setFilters: (filters: Partial<JobFilters>) => void;
  resetFilters: () => void;
  setSelectedJob: (job: Job | null) => void;
  setIsDrawerOpen: (open: boolean) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  openJobDrawer: (job: Job) => void;
  getFilteredJobs: () => Job[];
}

const DEFAULT_FILTERS: JobFilters = {
  keyword: "",
  category: [],
  location: null,
  employmentType: null,
  license: null,
  salaryRange: null,
  postedAt: null,
};

export const useJobSearchStore = create<JobSearchState>((set, get) => ({
  jobs: MOCK_JOBS,
  filters: DEFAULT_FILTERS,
  selectedJob: null,
  isDrawerOpen: false,
  currentPage: 1,
  pageSize: 5,

  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial }, currentPage: 1 })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS, currentPage: 1 }),

  setSelectedJob: (selectedJob) => set({ selectedJob }),

  setIsDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),

  setCurrentPage: (currentPage) => set({ currentPage }),

  setPageSize: (pageSize) => set({ pageSize, currentPage: 1 }),

  // เปิด Drawer พร้อมเซ็ต Job ที่เลือก
  openJobDrawer: (job) => set({ selectedJob: job, isDrawerOpen: true }),

  // คำนวณรายการงานที่กรองแล้วจาก Raw Data ใน Store โดยตรง
  getFilteredJobs: () => {
    const { jobs, filters } = get();
    return jobs.filter((job) => {
      if (
        filters.keyword &&
        !job.title.toLowerCase().includes(filters.keyword.toLowerCase()) &&
        !job.schoolName.toLowerCase().includes(filters.keyword.toLowerCase())
      ) {
        return false;
      }
      if (filters.location) {
        const provinces = LOCATION_MAP[filters.location] || [filters.location];
        if (!provinces.includes(job.province)) return false;
      }
      if (filters.license) {
        if (filters.license === "required" && job.licenseRequired !== "จำเป็นต้องมี") return false;
        if (filters.license === "not-required" && job.licenseRequired !== "ไม่จำเป็นต้องมี") return false;
      }
      if (filters.salaryRange && job.salaryType === "ระบุเงินเดือน") {
        const [min, max] = filters.salaryRange.split("-").map(Number);
        const sMin = job.salaryMin ?? 0;
        const sMax = job.salaryMax ?? 0;
        if (filters.salaryRange === "40000+") {
          if (sMax < 40000) return false;
        } else if (max && (sMin > max || sMax < min)) {
          return false;
        }
      }
      return true;
    });
  },
}));
