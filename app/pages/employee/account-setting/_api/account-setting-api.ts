"use client";

import axios from "axios";

// ✨ เปลี่ยนรหัสผ่านครูผ่าน Supabase Admin
export const requestChangePassword = (userId: string, newPassword: string) =>
  axios.put<{
    status_code: number;
    message_th: string;
    message_en: string;
    data: null;
  }>(`/api/v1/employee/account-setting/change-password?user_id=${userId}`, {
    new_password: newPassword,
  });
