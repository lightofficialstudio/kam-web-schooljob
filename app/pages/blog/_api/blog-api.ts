import axios from "axios";

export interface BlogListParams {
  keyword?: string;
  category?: string;
  page?: number;
  page_size?: number;
}

// ✨ ดึงรายการบทความ
export const fetchBlogs = async (params?: BlogListParams) => {
  const response = await axios.get("/api/v1/blogs/read", { params });
  return response.data;
};

// ✨ ดึงบทความตาม ID หรือ slug
export const fetchBlogById = async (blogId: string) => {
  const response = await axios.get(`/api/v1/blogs/${blogId}`);
  return response.data;
};

// ✨ ดึงหมวดหมู่ที่มีบทความเผยแพร่แล้วจาก DB
export const fetchBlogCategories = async (): Promise<string[]> => {
  const response = await axios.get<{ status_code: number; data: string[] }>(
    "/api/v1/blogs/categories",
  );
  return response.data.status_code === 200 ? response.data.data : [];
};
