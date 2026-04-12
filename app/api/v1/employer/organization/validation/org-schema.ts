import { z } from "zod";

// ✨ เชิญสมาชิกใหม่
export const inviteMemberSchema = z.object({
  email:   z.string().email("อีเมลไม่ถูกต้อง"),
  role_id: z.string().min(1, "กรุณาระบุ role_id"),
});
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

// ✨ อัปเดต Role ของสมาชิก
export const updateMemberRoleSchema = z.object({
  member_id: z.string().min(1),
  role_id:   z.string().min(1),
});
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;

// ✨ สร้าง Custom Role
export const createRoleSchema = z.object({
  name:        z.string().min(1, "กรุณากรอกชื่อ Role").max(50),
  description: z.string().max(200).optional(),
  color:       z.string().regex(/^#[0-9A-Fa-f]{6}$/, "รูปแบบสีไม่ถูกต้อง").optional(),
  icon_key:    z.string().max(30).optional(),
});
export type CreateRoleInput = z.infer<typeof createRoleSchema>;

// ✨ แก้ไข Role
export const updateRoleSchema = z.object({
  name:        z.string().min(1).max(50).optional(),
  description: z.string().max(200).nullable().optional(),
  color:       z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon_key:    z.string().max(30).optional(),
});
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

// ✨ อัปเดต Permissions ของ Role
export const updatePermissionsSchema = z.object({
  permissions: z.array(z.string()).max(100),
});
export type UpdatePermissionsInput = z.infer<typeof updatePermissionsSchema>;

// ✨ ยอมรับคำเชิญ
export const acceptInviteSchema = z.object({
  token: z.string().min(1),
});
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
