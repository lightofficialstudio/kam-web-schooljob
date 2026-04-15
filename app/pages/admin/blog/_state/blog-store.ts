"use client";

import { create } from "zustand";
import {
  AiAction,
  BlogStatsOverview,
  requestAdminCreateBlog,
  requestAdminDeleteBlog,
  requestAdminListBlogs,
  requestAdminUpdateBlog,
  requestAiBlogAssist,
  requestBlogStatsOverview,
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

// ✨ ผลลัพธ์จาก AI
export interface SeoScore {
  score: number;
  grade: "A" | "B" | "C" | "D";
  issues: string[];
  suggestions: string[];
  keyword_density: number;
  readability: "ง่าย" | "ปานกลาง" | "ยาก";
}

interface BlogStore {
  blogs: AdminBlogItem[];
  total: number;
  isLoading: boolean;
  isSubmitting: boolean;
  // ✨ filter state
  filterStatus: "DRAFT" | "PUBLISHED" | "all";
  filterKeyword: string;
  filterCategory: string;
  page: number;
  viewMode: "grid" | "table" | "kanban";
  // ✨ editor state
  editingBlog: AdminBlogItem | null;
  isDrawerOpen: boolean;
  // ✨ AI state
  isAiLoading: boolean;
  aiSeoScore: SeoScore | null;
  // ✨ analytics state
  statsOverview: BlogStatsOverview | null;
  isStatsLoading: boolean;
  // ✨ actions
  setFilterStatus: (s: "DRAFT" | "PUBLISHED" | "all") => void;
  setFilterKeyword: (k: string) => void;
  setFilterCategory: (c: string) => void;
  setPage: (p: number) => void;
  setViewMode: (m: "grid" | "table" | "kanban") => void;
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
  quickPublish: (id: string, currentStatus: "DRAFT" | "PUBLISHED") => Promise<void>;
  // ✨ analytics actions
  fetchStatsOverview: () => Promise<void>;
  // ✨ AI actions
  aiAssist: (payload: {
    action: AiAction;
    topic?: string;
    title?: string;
    content?: string;
    outline?: string;
    category?: string;
  }) => Promise<unknown>;
}

export const useAdminBlogStore = create<BlogStore>((set, get) => ({
  blogs: [],
  total: 0,
  isLoading: false,
  isSubmitting: false,
  filterStatus: "all",
  filterKeyword: "",
  filterCategory: "",
  page: 1,
  viewMode: "grid",
  editingBlog: null,
  isDrawerOpen: false,
  isAiLoading: false,
  aiSeoScore: null,
  statsOverview: null,
  isStatsLoading: false,

  setFilterStatus: (s) => set({ filterStatus: s, page: 1 }),
  setFilterKeyword: (k) => set({ filterKeyword: k, page: 1 }),
  setFilterCategory: (c) => set({ filterCategory: c, page: 1 }),
  setPage: (p) => set({ page: p }),
  setViewMode: (m) => set({ viewMode: m }),
  openCreate: () => set({ editingBlog: null, isDrawerOpen: true }),
  openEdit: (blog) => set({ editingBlog: blog, isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false, editingBlog: null }),

  // ✨ ดึงรายการบทความตาม filter ปัจจุบัน
  fetchBlogs: async () => {
    const { filterStatus, filterKeyword, filterCategory, page } = get();
    set({ isLoading: true });
    try {
      const res = await requestAdminListBlogs({
        status: filterStatus,
        keyword: filterKeyword || undefined,
        category: filterCategory || undefined,
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

  // ✨ สลับ DRAFT ↔ PUBLISHED ทันที (quick publish)
  quickPublish: async (id, currentStatus) => {
    const newStatus = currentStatus === "DRAFT" ? "PUBLISHED" : "DRAFT";
    await requestAdminUpdateBlog({ id, status: newStatus });
    // ✨ update local state ทันที ไม่รอ refetch
    set((s) => ({
      blogs: s.blogs.map((b) =>
        b.id === id
          ? { ...b, status: newStatus, publishedAt: newStatus === "PUBLISHED" ? new Date().toISOString() : b.publishedAt }
          : b,
      ),
    }));
  },

  // ✨ ดึง analytics overview
  fetchStatsOverview: async () => {
    set({ isStatsLoading: true });
    try {
      const res = await requestBlogStatsOverview();
      if (res.data.status_code === 200) {
        set({ statsOverview: res.data.data });
      }
    } finally {
      set({ isStatsLoading: false });
    }
  },

  // ✨ เรียก AI Blog Assistant
  aiAssist: async (payload) => {
    set({ isAiLoading: true });
    try {
      const res = await requestAiBlogAssist(payload);
      if (payload.action === "seo_score" && res.data.status_code === 200) {
        set({ aiSeoScore: res.data.data as SeoScore });
      }
      return res.data.data;
    } finally {
      set({ isAiLoading: false });
    }
  },
}));
