import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ✨ Utility function สำหรับการรวม Tailwind classes และจัดการข้อขัดแย้ง
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
