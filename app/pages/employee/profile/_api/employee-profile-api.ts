import axios from "axios";

const BASE_URL = "/api/v1/employee/profile";

// ✨ ดึงข้อมูล Employee Profile ทั้งหมดโดยใช้ user_id
// ส่ง email ไปด้วยเพื่อให้ API auto-create profile ถ้ายังไม่มีใน DB
export const responseEmployeeProfile = async (userId: string, email?: string) => {
  const { data } = await axios.get(`${BASE_URL}/read`, {
    params: { user_id: userId, ...(email ? { email } : {}) },
  });
  return data;
};

// ✨ อัปเดต Employee Profile และ relations (partial update)
export const requestUpdateEmployeeProfile = async (
  userId: string,
  payload: Record<string, unknown>
) => {
  try {
    const { data } = await axios.patch(`${BASE_URL}/update`, payload, {
      params: { user_id: userId },
    });
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.error("❌ [requestUpdateEmployeeProfile] 400 response body:", JSON.stringify(err.response.data, null, 2));
    }
    throw err;
  }
};
