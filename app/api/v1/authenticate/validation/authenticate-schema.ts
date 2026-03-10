import { z } from "zod";

// ✨ [Schema สำหรับการตรวจสอบข้อมูลการสมัครสมาชิก]
export const signupSchema = z.preprocess(
  (data: any) => {
    if (data && typeof data.role === "string") {
      const roleUpper = data.role.toUpperCase();
      const roleMap: Record<string, string> = {
        TEACHER: "EMPLOYEE",
        SCHOOL: "EMPLOYER",
      };
      if (roleMap[roleUpper]) {
        return { ...data, role: roleMap[roleUpper] };
      }
    }
    return data;
  },
  z.object({
    email: z.string().email("อีเมลไม่ถูกต้อง"),
    password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    full_name: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล"),
    role: z.enum(["EMPLOYEE", "EMPLOYER", "ADMIN"], {
      message: "บทบาทไม่ถูกต้อง",
    }),
  }),
);

// ✨ [Schema สำหรับการตรวจสอบข้อมูลการเข้าสู่ระบบ]
export const signinSchema = z.object({
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
