import axios from "axios";

// ✨ โครงสร้าง ConfigOption flat จาก API
export interface JobCategoryOption {
  id: string;
  label: string;
  value: string;
  parentValue: string | null;
  sortOrder: number;
}

// ✨ โครงสร้าง Cascader สำหรับ Ant Design
export interface CascaderNode {
  value: string;
  label: string;
  children?: CascaderNode[];
}

// ✨ แปลงรายการ flat → tree สำหรับ Cascader
export const buildCascaderTree = (
  options: JobCategoryOption[],
): CascaderNode[] => {
  const roots = options.filter((o) => !o.parentValue);
  return roots.map((parent) => {
    const children = options.filter((o) => o.parentValue === parent.value);
    return {
      value: parent.value,
      label: parent.label,
      ...(children.length > 0 && {
        children: children.map((c) => ({ value: c.value, label: c.label })),
      }),
    };
  });
};

// ✨ ดึงหมวดหมู่งานจาก ConfigOption group=job_category
export const fetchJobCategories = async (): Promise<CascaderNode[]> => {
  const { data } = await axios.get<{
    status_code: number;
    data: JobCategoryOption[];
  }>("/api/v1/config/options?group=job_category");
  return buildCascaderTree(data.data ?? []);
};

// ✨ ดึงประกาศงานล่าสุดสำหรับ Landing Page
export const fetchLatestJobs = async () => {
  const response = await axios.get("/api/v1/jobs/latest");
  return response.data;
};
