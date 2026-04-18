import { z } from "zod";

// ✨ Schema สำหรับ path param ของ school profile
export const schoolProfileParamSchema = z.object({
  school_id: z.string().uuid("school_id ต้องเป็น UUID"),
});

export type SchoolProfileParam = z.infer<typeof schoolProfileParamSchema>;
