import axios from "axios";

// ✨ [Type Definition สำหรับ User]
export interface UserRecord {
  id: string;
  userId: string;
  email: string;
  fullName: string | null;
  role: "EMPLOYEE" | "EMPLOYER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

// ✨ [Axios Instance สำหรับ Admin API]
const apiClient = axios.create({
  baseURL: "/api/v1/admin",
  headers: { "Content-Type": "application/json" },
});

// ดึงรายชื่อผู้ใช้ทั้งหมดในระบบ
export const responseUserList = async (): Promise<{
  users: UserRecord[];
  total: number;
}> => {
  const { data } = await apiClient.get<{
    data: { users: UserRecord[]; total: number };
  }>("/users");
  return data.data;
};

// ลบผู้ใช้ตาม ID (ยังไม่ได้ implement ฝั่ง server)
export const requestDeleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}`);
};
