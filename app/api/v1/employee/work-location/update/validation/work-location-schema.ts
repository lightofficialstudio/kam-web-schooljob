import { z } from "zod";

// 📝 Schema สำหรับอัปเดต Work Location (จังหวัดที่ต้องการทำงาน + ย้ายที่อยู่ได้)
export const updateWorkLocationSchema = z.object({
  preferred_provinces: z
    .array(z.string())
    .min(1, "กรุณาเลือกจังหวัดที่ต้องการทำงานอย่างน้อย 1 จังหวัด"),
  can_relocate: z.boolean(),
});

export type UpdateWorkLocationInput = z.infer<typeof updateWorkLocationSchema>;
