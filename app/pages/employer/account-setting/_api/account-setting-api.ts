"use client";

import axios from "axios";

// ✨ ดึงข้อมูลส่วนตัวผู้ดูแลจาก Profile
export const requestGetPersonalInfo = (userId: string) =>
  axios.get(`/api/v1/employer/profile/read?user_id=${userId}`);

// ✨ อัปเดตข้อมูลส่วนตัวผู้ดูแล (firstName, lastName, phoneNumber)
export const requestUpdatePersonalInfo = (
  userId: string,
  data: { first_name?: string; last_name?: string; phone_number?: string },
) =>
  axios.put(`/api/v1/employer/account-setting/update-personal?user_id=${userId}`, data);

// ✨ เปลี่ยนรหัสผ่านผ่าน Supabase Admin
export const requestChangePassword = (userId: string, newPassword: string) =>
  axios.put(`/api/v1/employer/account-setting/change-password?user_id=${userId}`, {
    new_password: newPassword,
  });

// ✨ ดึงข้อมูล Package ปัจจุบันของ Employer (quota, features, plan)
export const requestGetEmployerPackage = (userId: string) =>
  axios.get(`/api/v1/employer/package/read?user_id=${userId}`);

// ✨ ดึงรายการ Package Plan ทั้งหมดที่ Admin กำหนด (สำหรับตารางเปรียบเทียบ)
export const requestGetAllPlans = () =>
  axios.get(`/api/v1/admin/packages/plans?include_inactive=false`);
