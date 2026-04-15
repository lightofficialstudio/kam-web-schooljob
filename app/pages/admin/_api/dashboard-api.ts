import axios from "axios";

// ✨ ประเภทข้อมูล Dashboard
export interface DashboardStats {
  users: {
    total: number;
    verified: number;
    unverified: number;
    newLast7Days: number;
    newLast30Days: number;
    byRole: { EMPLOYEE: number; EMPLOYER: number; ADMIN: number };
  };
  jobs: {
    open: number;
    closed: number;
    draft: number;
    total: number;
    deadlineSoon: number;
  };
  applications: {
    pending: number;
    interview: number;
    accepted: number;
    rejected: number;
    total: number;
    stalePending: number;
  };
  content: { draftBlogs: number };
}

export interface PendingAction {
  type: string;
  label: string;
  count: number;
  href: string;
  severity: "high" | "medium" | "low";
}

export interface RecentSignup {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  profileImageUrl: string | null;
  isEmailVerified: boolean;
  provider: string;
  schoolName: string | null;
  accountPlan: string | null;
  createdAt: string;
  hasPrismaProfile: boolean;
}

export interface GrowthPoint {
  month: string;
  year: number;
  key: string;
  teachers: number;
  schools: number;
  users: number;
  jobs: number;
}

export interface DeadlineJob {
  id: string;
  title: string;
  schoolName: string;
  deadline: string | null;
  applicationCount: number;
  daysLeft: number | null;
}

export interface DashboardData {
  stats: DashboardStats;
  pendingActions: PendingAction[];
  recentSignups: RecentSignup[];
  growthChart: GrowthPoint[];
  deadlineJobs: DeadlineJob[];
  inactiveSchools: { id: string; schoolName: string; province: string; email: string }[];
}

// ✨ ดึงข้อมูล Dashboard ทั้งหมด
export const requestDashboard = () =>
  axios.get<{ status_code: number; data: DashboardData }>("/api/v1/admin/dashboard");
