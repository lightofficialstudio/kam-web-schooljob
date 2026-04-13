import { z } from "zod";

// ✨ Schema สำหรับ query params ดึงใบสมัครของ Employee
export const getApplicationsQuerySchema = z.object({
  user_id: z.string().min(1, "กรุณาระบุ user_id"),
});

export type GetApplicationsQuery = z.infer<typeof getApplicationsQuerySchema>;
