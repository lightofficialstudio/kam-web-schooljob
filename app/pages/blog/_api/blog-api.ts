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
