import { create } from "zustand";

// Work Experience Type
export interface WorkExperienceEntry {
  id?: string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  inPresent: boolean;
  description: string;
  workYear?: number;
  isDeleted?: boolean;
}

// Education Type
export interface EducationEntry {
  id?: string;
  level: string;
  institution: string;
  major: string;
  graduationYear?: number; // ปีที่สำเร็จการศึกษา (พ.ศ.)
  gpa?: number;
  startDate?: string;
  endDate?: string;
  isDeleted?: boolean;
}

// License/Certification Type
export interface LicenseEntry {
  id?: string;
  licenseName: string;
  issuer?: string;
  licenseNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
  isDeleted?: boolean;
}

// Language Type
export interface LanguageEntry {
  id?: string;
  languageName: string;
  proficiency?: string;
  isDeleted?: boolean;
}

// Skill Type
export interface SkillEntry {
  id?: string;
  skillName: string;
  endorsements?: number;
  isDeleted?: boolean;
}

interface EmployeeProfile {
  // Basic info
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  profileImageFile?: File;
  profileImageUrl?: string;

  // Education (main, for compatibility)
  educationLevel: string;
  institution: string;
  major: string;
  gpa: number | string;
  teachingLicense: string;
  licenseFile?: File;
  licenseFileUrl?: string;

  // Teaching info
  specialization: string[];
  gradeCanTeach: string[];
  teachingExperience: string;
  recentSchool: string;

  // Skills (tags)
  languagesSpoken: string[];
  itSkills: string[];
  specialActivities: string;

  // Work location
  preferredProvinces: string[];
  canRelocate: boolean;

  // การมองเห็นโปรไฟล์
  profileVisibility: "public" | "apply_only";

  // Other
  resumeFile?: File;
  resumeUrl?: string;

  // Relations (arrays of entries)
  workExperiences: WorkExperienceEntry[];
  educations: EducationEntry[];
  licenses: LicenseEntry[];
  languages: LanguageEntry[];
  skills: SkillEntry[];
}

interface ProfileStore {
  profile: Partial<EmployeeProfile>;
  setProfile: (profile: Partial<EmployeeProfile>) => void;
  updateField: (field: keyof EmployeeProfile, value: any) => void;
  resetProfile: () => void;

  // Work Experience helpers
  addWorkExperience: (experience: WorkExperienceEntry) => void;
  updateWorkExperience: (
    index: number,
    experience: WorkExperienceEntry,
  ) => void;
  removeWorkExperience: (index: number) => void;

  // Education helpers
  addEducation: (education: EducationEntry) => void;
  updateEducation: (index: number, education: EducationEntry) => void;
  removeEducation: (index: number) => void;

  // License helpers
  addLicense: (license: LicenseEntry) => void;
  updateLicense: (index: number, license: LicenseEntry) => void;
  removeLicense: (index: number) => void;

  // Language helpers
  addLanguage: (language: LanguageEntry) => void;
  updateLanguage: (index: number, language: LanguageEntry) => void;
  removeLanguage: (index: number) => void;

  // Skill helpers
  addSkill: (skill: SkillEntry) => void;
  updateSkill: (index: number, skill: SkillEntry) => void;
  removeSkill: (index: number) => void;

  // Mockup Data Helper
  setMockupData: () => void;
}

const initialProfile: Partial<EmployeeProfile> = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  gender: "",
  dateOfBirth: "",
  nationality: "",
  profileImageUrl: "",
  educationLevel: "",
  institution: "",
  major: "",
  gpa: "",
  teachingLicense: "",
  licenseFileUrl: "",
  specialization: [],
  gradeCanTeach: [],
  teachingExperience: "",
  recentSchool: "",
  languagesSpoken: [],
  itSkills: [],
  specialActivities: "",
  preferredProvinces: [],
  canRelocate: false,
  profileVisibility: "public",
  resumeUrl: "",
  workExperiences: [],
  educations: [],
  licenses: [],
  languages: [],
  skills: [],
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: initialProfile,

  setProfile: (profile) =>
    set((state) => ({
      profile: { ...state.profile, ...profile },
    })),

  updateField: (field, value) =>
    set((state) => ({
      profile: { ...state.profile, [field]: value },
    })),

  resetProfile: () => set({ profile: initialProfile }),

  // Work Experience methods
  addWorkExperience: (experience) =>
    set((state) => ({
      profile: {
        ...state.profile,
        workExperiences: [...(state.profile.workExperiences || []), experience],
      },
    })),

  updateWorkExperience: (index, experience) =>
    set((state) => ({
      profile: {
        ...state.profile,
        workExperiences: state.profile.workExperiences?.map((exp, i) =>
          i === index ? experience : exp,
        ),
      },
    })),

  removeWorkExperience: (index) =>
    set((state) => ({
      profile: {
        ...state.profile,
        workExperiences: state.profile.workExperiences?.filter(
          (_, i) => i !== index,
        ),
      },
    })),

  // Education methods
  addEducation: (education) =>
    set((state) => ({
      profile: {
        ...state.profile,
        educations: [...(state.profile.educations || []), education],
      },
    })),

  updateEducation: (index, education) =>
    set((state) => ({
      profile: {
        ...state.profile,
        educations: state.profile.educations?.map((edu, i) =>
          i === index ? education : edu,
        ),
      },
    })),

  removeEducation: (index) =>
    set((state) => ({
      profile: {
        ...state.profile,
        educations: state.profile.educations?.filter((_, i) => i !== index),
      },
    })),

  // License methods
  addLicense: (license) =>
    set((state) => ({
      profile: {
        ...state.profile,
        licenses: [...(state.profile.licenses || []), license],
      },
    })),

  updateLicense: (index, license) =>
    set((state) => ({
      profile: {
        ...state.profile,
        licenses: state.profile.licenses?.map((lic, i) =>
          i === index ? license : lic,
        ),
      },
    })),

  removeLicense: (index) =>
    set((state) => ({
      profile: {
        ...state.profile,
        licenses: state.profile.licenses?.filter((_, i) => i !== index),
      },
    })),

  // Language methods
  addLanguage: (language) =>
    set((state) => ({
      profile: {
        ...state.profile,
        languages: [...(state.profile.languages || []), language],
      },
    })),

  updateLanguage: (index, language) =>
    set((state) => ({
      profile: {
        ...state.profile,
        languages: state.profile.languages?.map((lang, i) =>
          i === index ? language : lang,
        ),
      },
    })),

  removeLanguage: (index) =>
    set((state) => ({
      profile: {
        ...state.profile,
        languages: state.profile.languages?.filter((_, i) => i !== index),
      },
    })),

  // Skill methods
  addSkill: (skill) =>
    set((state) => ({
      profile: {
        ...state.profile,
        skills: [...(state.profile.skills || []), skill],
      },
    })),

  updateSkill: (index, skill) =>
    set((state) => ({
      profile: {
        ...state.profile,
        skills: state.profile.skills?.map((s, i) => (i === index ? skill : s)),
      },
    })),

  removeSkill: (index) =>
    set((state) => ({
      profile: {
        ...state.profile,
        skills: state.profile.skills?.filter((_, i) => i !== index),
      },
    })),

  // Mockup Data Implementation
  setMockupData: () =>
    set(() => ({
      profile: {
        firstName: "ธนวัฒน์",
        lastName: "เรียนรู้ดี",
        phoneNumber: "081-234-5678",
        gender: "ชาย",
        dateOfBirth: "1995-05-15",
        profileImageUrl:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=ธนวัฒน์",
        email: "thanawat.learn@example.com",
        specialActivities:
          "ครูผู้เชี่ยวชาญด้านการสอนภาษาอังกฤษและเทคโนโลยีการศึกษา มีความมุ่งมั่นในการพัฒนาทักษะการเรียนรู้ของผู้เรียนผ่านนวัตกรรมการสอนสมัยใหม่ (Active Learning) ชอบการทำกิจกรรมจิตอาสาและแนะแนวการศึกษา",
        workExperiences: [
          {
            jobTitle: "ครูสอนภาษาอังกฤษ (English Teacher)",
            companyName: "โรงเรียนนานาชาติเซนต์แมรี่",
            startDate: "2022-05-01",
            endDate: "",
            inPresent: true,
            description:
              "รับผิดชอบการสอนวิชาภาษาอังกฤษระดับมัธยมศึกษาตอนปลาย (G10-12) ออกแบบหลักสูตรเน้นการสื่อสารและการใช้ภาษาในชีวิตจริง จัดกิจกรรมค่ายภาษาอังกฤษประจำปี และเป็นที่ปรึกษาชมรมโต้วาทีภาษาอังกฤษ",
          },
          {
            jobTitle: "วิทยากรพิเศษ (Educational Content Creator)",
            companyName: "สถาบันกวดวิชาเอกวิทย์",
            startDate: "2020-06-01",
            endDate: "2022-04-30",
            inPresent: false,
            description:
              "ออกแบบเนื้อหาการสอนและผลิตสื่อวิดีโอเพื่อการเรียนรู้ออนไลน์สำหรับ เตรียมสอบเข้ามหาวิทยาลัย (TCAS) มีนักเรียนติดตามและเข้าร่วมคอร์สมากกว่า 500 คนต่อเทอม",
          },
          {
            jobTitle: "ครูอัตราจ้าง วิชาภาษาอังกฤษ",
            companyName: "โรงเรียนสาธิตพุทธมณฑล",
            startDate: "2018-05-15",
            endDate: "2020-04-30",
            inPresent: false,
            description:
              "สอนวิชาภาษาอังกฤษพื้นฐานและภาษาอังกฤษเพิ่มเติมสำหรับนักเรียนมัธยมต้น ดูแลโครงการนักเรียนแลกเปลี่ยนต่างชาติ และร่วมพัฒนาหลักสูตรท้องถิ่น",
          },
          {
            jobTitle: "ผู้ช่วยวิจัยด้านการศึกษา (Research Assistant)",
            companyName: "คณะครุศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย",
            startDate: "2017-06-01",
            endDate: "2018-04-30",
            inPresent: false,
            description:
              "ช่วยเก็บรวบรวมข้อมูลงานวิจัยเกี่ยวกับการพัฒนาทักษะการอ่านของเด็กไทย จัดทำรายงานสรุปผลการวิจัย และช่วยงานฝ่ายวิชาการของคณะ",
          },
          {
            jobTitle: "ติวเตอร์อาสา (Volunteer Tutor)",
            companyName: "มูลนิธิเด็กไทยเติบโต",
            startDate: "2016-01-01",
            endDate: "2017-05-01",
            inPresent: false,
            description:
              "สอนเสริมวิชาภาษาอังกฤษและทักษะชีวิตให้กับเด็กในชุมชนขาดแคลนช่วงวันหยุดสุดสัปดาห์ จัดกิจกรรมส่งเสริมการอ่านและศิลปะเพื่อการเรียนรู้",
          },
        ],
        educations: [
          {
            level: "ปริญญาโท",
            institution: "มหาวิทยาลัยธรรมศาสตร์",
            major: "ศิลปศาสตร์มหาบัณฑิต (การสอนภาษาอังกฤษ)",
            graduationYear: 2565,
            gpa: 3.85,
          },
          {
            level: "ปริญญาตรี",
            institution: "จุฬาลงกรณ์มหาวิทยาลัย",
            major: "ครุศาสตร์บัณฑิต (สาขาวิชาภาษาอังกฤษ-ภาษาไทย)",
            graduationYear: 2562,
            gpa: 3.75,
          },
          {
            level: "มัธยมศึกษาตอนปลาย",
            institution: "โรงเรียนเตรียมอุดมศึกษา",
            major: "ศิลป์-ภาษา (อังกฤษ-เยอรมัน)",
            graduationYear: 2558,
            gpa: 3.9,
          },
        ],
        specialization: [
          "การสอนภาษาอังกฤษ (ESL/EFL)",
          "การออกแบบบทเรียนออนไลน์",
          "เทคโนโลยีเพื่อการศึกษา (EdTech)",
          "แนะแนวการศึกษาต่อ",
        ],
        gradeCanTeach: ["ประถมศึกษา", "มัธยมศึกษาตอนต้น", "มัธยมศึกษาตอนปลาย"],
        teachingExperience: "5-10 ปี",
        languagesSpoken: ["ไทย (Native)", "อังกฤษ (Fluent)", "เยอรมัน (Basic)"],
        itSkills: [
          "Microsoft Office Specialist",
          "Google Classroom / Canvas",
          "Canva for Education",
          "Zoom / MS Teams Expert",
        ],
        preferredProvinces: [
          "กรุงเทพมหานคร",
          "เชียงใหม่",
          "นนทบุรี",
          "ปทุมธานี",
        ],
        canRelocate: true,
      },
    })),
}));
