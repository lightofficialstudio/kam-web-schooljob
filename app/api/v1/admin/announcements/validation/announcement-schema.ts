import { z } from "zod";

// ✨ Schema สำหรับ Broadcast Announcement
export const broadcastSchema = z.object({
  admin_user_id: z.string().min(1),
  title: z.string().min(1, "กรุณากรอก title").max(120),
  message: z.string().min(1, "กรุณากรอก message").max(1000),
  target_role: z.enum(["ALL", "EMPLOYEE", "EMPLOYER"]),
  type: z.string().default("system"),
  reference_id: z.string().optional(),
  reference_type: z.string().optional(),
});

export type BroadcastInput = z.infer<typeof broadcastSchema>;
