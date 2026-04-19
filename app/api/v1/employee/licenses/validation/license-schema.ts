import { z } from "zod";

// ✨ Schema สำหรับสร้างใบอนุญาต/ใบประกอบวิชาชีพใหม่
export const createLicenseSchema = z.object({
  license_name: z.string().min(1),
  file_url: z.string().url().optional(),
  issuer: z.string().optional(),
  license_number: z.string().optional(),
  issue_date: z.string().datetime({ offset: true }).nullable().optional(),
  expiry_date: z.string().datetime({ offset: true }).nullable().optional(),
  credential_url: z.string().url().optional(),
});

// ✨ Schema สำหรับอัปเดตใบอนุญาต (ทุก field optional)
export const updateLicenseSchema = z.object({
  license_name: z.string().min(1).optional(),
  file_url: z.string().url().optional(),
  issuer: z.string().optional(),
  license_number: z.string().optional(),
  issue_date: z.string().datetime({ offset: true }).nullable().optional(),
  expiry_date: z.string().datetime({ offset: true }).nullable().optional(),
  credential_url: z.string().url().optional(),
});

export type CreateLicenseInput = z.infer<typeof createLicenseSchema>;
export type UpdateLicenseInput = z.infer<typeof updateLicenseSchema>;
