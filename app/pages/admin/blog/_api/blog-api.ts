import axios from "axios";

const BASE = "/api/v1/admin/blogs";

// ✨ ดึงรายการบทความสำหรับ admin (รวม DRAFT)
export const requestAdminListBlogs = (params: {
  keyword?: string;
  category?: string;
  status?: "DRAFT" | "PUBLISHED" | "all";
  page?: number;
  page_size?: number;
}) => axios.get(`${BASE}/read`, { params });

// ✨ ดึงบทความ 1 ชิ้นสำหรับแก้ไข
export const requestAdminGetBlog = (id: string) =>
  axios.get(`${BASE}/read`, { params: { id } });

// ✨ สร้างบทความใหม่
export const requestAdminCreateBlog = (data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  category?: string;
  tags?: string[];
  status: "DRAFT" | "PUBLISHED";
  author_id?: string;
}) => axios.post(`${BASE}/create`, data);

// ✨ แก้ไขบทความ
export const requestAdminUpdateBlog = (data: {
  id: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  cover_image_url?: string;
  category?: string;
  tags?: string[];
  status?: "DRAFT" | "PUBLISHED";
}) => axios.put(`${BASE}/update`, data);

// ✨ ลบบทความ
export const requestAdminDeleteBlog = (id: string) =>
  axios.delete(`${BASE}/delete`, { params: { id } });
