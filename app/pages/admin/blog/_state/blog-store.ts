"use client";

import { create } from "zustand";
import {
  requestAdminCreateBlog,
  requestAdminDeleteBlog,
  requestAdminListBlogs,
  requestAdminUpdateBlog,
} from "../_api/blog-api";

export interface AdminBlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImageUrl: string | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  author: { id: string | null; name: string; imageUrl: string | null };
}

interface BlogStore {
  blogs: AdminBlogItem[];
  total: number;
  isLoading: boolean;
  isSubmitting: boolean;
  // ✨ filter state
  filterStatus: "DRAFT" | "PUBLISHED" | "all";
  filterKeyword: string;
  page: number;
  // ✨ editor state
  editingBlog: AdminBlogItem | null;
  isDrawerOpen: boolean;
  // ✨ actions
  setFilterStatus: (s: "DRAFT" | "PUBLISHED" | "all") => void;
  setFilterKeyword: (k: string) => void;
  setPage: (p: number) => void;
  openCreate: () => void;
  openEdit: (blog: AdminBlogItem) => void;
  closeDrawer: () => void;
  fetchBlogs: () => Promise<void>;
  submitBlog: (values: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    cover_image_url?: string;
    category?: string;
    tags?: string[];
    status: "DRAFT" | "PUBLISHED";
    author_id?: string;
  }) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
}

export const useAdminBlogStore = create<BlogStore>((set, get) => ({
  blogs: [],
  total: 0,
  isLoading: false,
  isSubmitting: false,
  filterStatus: "all",
  filterKeyword: "",
  page: 1,
  editingBlog: null,
  isDrawerOpen: false,

  setFilterStatus: (s) => set({ filterStatus: s, page: 1 }),
  setFilterKeyword: (k) => set({ filterKeyword: k, page: 1 }),
  setPage: (p) => set({ page: p }),
  openCreate: () => set({ editingBlog: null, isDrawerOpen: true }),
  openEdit: (blog) => set({ editingBlog: blog, isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false, editingBlog: null }),

  // ✨ ดึงรายการบทความตาม filter ปัจจุบัน
  fetchBlogs: async () => {
    const { filterStatus, filterKeyword, page } = get();
    set({ isLoading: true });
    try {
      const res = await requestAdminListBlogs({
        status: filterStatus,
        keyword: filterKeyword || undefined,
        page,
        page_size: 20,
      });
      const d = res.data.data;
      set({ blogs: d.blogs, total: d.total });
    } finally {
      set({ isLoading: false });
    }
  },

  // ✨ สร้าง หรือ แก้ไขบทความ
  submitBlog: async (values) => {
    const { editingBlog, fetchBlogs, closeDrawer } = get();
    set({ isSubmitting: true });
    try {
      if (editingBlog) {
        await requestAdminUpdateBlog({ id: editingBlog.id, ...values });
      } else {
        await requestAdminCreateBlog(values);
      }
      closeDrawer();
      await fetchBlogs();
    } finally {
      set({ isSubmitting: false });
    }
  },

  // ✨ ลบบทความแล้ว refresh
  deleteBlog: async (id: string) => {
    await requestAdminDeleteBlog(id);
    await get().fetchBlogs();
  },
}));
