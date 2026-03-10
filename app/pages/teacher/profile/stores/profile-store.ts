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

interface TeacherProfile {
  // Basic info
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
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
  profile: Partial<TeacherProfile>;
  setProfile: (profile: Partial<TeacherProfile>) => void;
  updateField: (field: keyof TeacherProfile, value: any) => void;
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
}

const initialProfile: Partial<TeacherProfile> = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  gender: "",
  dateOfBirth: "",
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
}));
