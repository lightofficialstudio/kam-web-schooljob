import axios from "axios";

export interface ConfigOption {
  id: string;
  group: string;
  label: string;
  value: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  status_code: number;
  data: T;
}

// ✨ ดึง ConfigOptions ทั้งหมด (Admin)
export const fetchAllConfigOptions = async (): Promise<ConfigOption[]> => {
  const { data } = await axios.get<ApiResponse<ConfigOption[]>>("/api/v1/admin/config");
  return data.data ?? [];
};

// ✨ สร้าง ConfigOption ใหม่
export const createConfigOption = async (payload: {
  group: string;
  label: string;
  value: string;
  sort_order?: number;
}) => {
  const { data } = await axios.post<ApiResponse<ConfigOption>>("/api/v1/admin/config", payload);
  return data.data;
};

// ✨ แก้ไข ConfigOption
export const updateConfigOption = async (payload: {
  id: string;
  label?: string;
  sort_order?: number;
  is_active?: boolean;
}) => {
  const { data } = await axios.patch<ApiResponse<ConfigOption>>("/api/v1/admin/config", payload);
  return data.data;
};

// ✨ ลบ ConfigOption
export const deleteConfigOption = async (id: string) => {
  await axios.delete(`/api/v1/admin/config?id=${id}`);
};
