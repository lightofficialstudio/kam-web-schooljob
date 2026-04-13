import { create } from "zustand";
import { fetchBlogs } from "../_api/blog-api";

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImageUrl?: string | null;
  publishedAt?: string | null;
  tags: string[];
  author: string;
  authorImageUrl?: string | null;
}

interface BlogListState {
  blogs: BlogItem[];
  total: number;
  isLoading: boolean;
  activeTab: string;
  searchText: string;
  setActiveTab: (tab: string) => void;
  setSearchText: (text: string) => void;
  fetchBlogList: () => Promise<void>;
}

export const useBlogStore = create<BlogListState>((set, get) => ({
  blogs: [],
  total: 0,
  isLoading: false,
  activeTab: "all",
  searchText: "",

  setActiveTab: (activeTab) => set({ activeTab }),
  setSearchText: (searchText) => set({ searchText }),

  // ✨ ดึงบทความจาก API
  fetchBlogList: async () => {
    const { activeTab, searchText } = get();
    set({ isLoading: true });
    try {
      const res = await fetchBlogs({
        ...(searchText && { keyword: searchText }),
        ...(activeTab !== "all" && { category: activeTab }),
        page_size: 50,
      });
      if (res.status_code === 200 && res.data) {
        set({ blogs: res.data.blogs, total: res.data.total, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("❌ fetchBlogList:", error);
      set({ isLoading: false });
    }
  },
}));
