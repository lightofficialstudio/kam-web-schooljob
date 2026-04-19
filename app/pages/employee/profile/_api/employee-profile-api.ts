import axios from "axios";

const BASE_URL = "/api/v1/employee/profile";

// ✨ ดึงข้อมูล Employee Profile ทั้งหมดโดยใช้ user_id
// ส่ง email ไปด้วยเพื่อให้ API auto-create profile ถ้ายังไม่มีใน DB
export const responseEmployeeProfile = async (
  userId: string,
  email?: string,
) => {
  const { data } = await axios.get(`${BASE_URL}/read`, {
    params: { user_id: userId, ...(email ? { email } : {}) },
  });
  return data;
};

// ✨ อัปเดต Employee Profile และ relations (partial update)
export const requestUpdateEmployeeProfile = async (
  userId: string,
  payload: Record<string, unknown>,
) => {
  try {
    const { data } = await axios.patch(`${BASE_URL}/update`, payload, {
      params: { user_id: userId },
    });
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.error(
        "❌ [requestUpdateEmployeeProfile] 400 response body:",
        JSON.stringify(err.response.data, null, 2),
      );
    }
    throw err;
  }
};

// ✨ === Basic Info ===
export const patchBasicInfo = async (userId: string, payload: Record<string, unknown>) => {
  const { data } = await axios.patch("/api/v1/employee/profile/basic", payload, {
    params: { user_id: userId },
  });
  return data;
};

// ✨ === Summary ===
export const patchSummary = async (userId: string, payload: Record<string, unknown>) => {
  const { data } = await axios.patch("/api/v1/employee/profile/summary", payload, {
    params: { user_id: userId },
  });
  return data;
};

// ✨ === Work Experiences ===
export const postWorkExperience = async (userId: string, payload: Record<string, unknown>) => {
  const { data } = await axios.post("/api/v1/employee/work-experiences", payload, {
    params: { user_id: userId },
  });
  return data;
};

export const putWorkExperience = async (id: string, userId: string, payload: Record<string, unknown>) => {
  const { data } = await axios.put(`/api/v1/employee/work-experiences/${id}`, payload, {
    params: { user_id: userId },
  });
  return data;
};

export const deleteWorkExperience = async (id: string, userId: string) => {
  const { data } = await axios.delete(`/api/v1/employee/work-experiences/${id}`, {
    params: { user_id: userId },
  });
  return data;
};

// ✨ === Educations ===
export const postEducation = async (userId: string, payload: Record<string, unknown>) => {
  const { data } = await axios.post("/api/v1/employee/educations", payload, {
    params: { user_id: userId },
  });
  return data;
};

export const putEducation = async (id: string, userId: string, payload: Record<string, unknown>) => {
  const { data } = await axios.put(`/api/v1/employee/educations/${id}`, payload, {
    params: { user_id: userId },
  });
  return data;
};

export const deleteEducation = async (id: string, userId: string) => {
  const { data } = await axios.delete(`/api/v1/employee/educations/${id}`, {
    params: { user_id: userId },
  });
  return data;
};

// ✨ === Resumes ===
export const postResume = async (userId: string, payload: Record<string, unknown>) => {
  const { data } = await axios.post("/api/v1/employee/resumes", payload, {
    params: { user_id: userId },
  });
  return data;
};

export const putResume = async (id: string, userId: string, payload: Record<string, unknown>) => {
  const { data } = await axios.put(`/api/v1/employee/resumes/${id}`, payload, {
    params: { user_id: userId },
  });
  return data;
};

export const deleteResume = async (id: string, userId: string) => {
  const { data } = await axios.delete(`/api/v1/employee/resumes/${id}`, {
    params: { user_id: userId },
  });
  return data;
};

// ✨ === Licenses (ใบประกอบวิชาชีพ) ===
export const postLicense = async (userId: string, payload: Record<string, unknown>) => {
  const { data } = await axios.post("/api/v1/employee/licenses", payload, {
    params: { user_id: userId },
  });
  return data;
};

export const putLicense = async (id: string, userId: string, payload: Record<string, unknown>) => {
  const { data } = await axios.put(`/api/v1/employee/licenses/${id}`, payload, {
    params: { user_id: userId },
  });
  return data;
};

export const deleteLicense = async (id: string, userId: string) => {
  const { data } = await axios.delete(`/api/v1/employee/licenses/${id}`, {
    params: { user_id: userId },
  });
  return data;
};
