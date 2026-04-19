import { z } from "zod";

// ✨ [Schema สำหรับการตรวจสอบข้อมูลการสมัครสมาชิก]
// รับ first_name + last_name แยก และ role เป็น "teacher" | "school" — backend แปลงเอง
export const signupSchema = z.preprocess(
  (data: any) => {
    if (!data || typeof data !== "object") return data;
    const result = { ...data };

    // ✨ แปลง role: teacher → EMPLOYEE, school → EMPLOYER
    if (typeof result.role === "string") {
      const roleMap: Record<string, string> = {
        teacher: "EMPLOYEE",
        school: "EMPLOYER",
        TEACHER: "EMPLOYEE",
        SCHOOL: "EMPLOYER",
      };
      result.role = roleMap[result.role] ?? result.role.toUpperCase();
    }

    // ✨ concat full_name จาก first_name + last_name
    if (result.first_name || result.last_name) {
      result.full_name = `${result.first_name ?? ""} ${result.last_name ?? ""}`.trim();
    }

    return result;
  },
  z.object({
    email: z.string().email("อีเมลไม่ถูกต้อง"),
    password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    first_name: z.string().min(1, "กรุณากรอกชื่อ"),
    last_name: z.string().min(1, "กรุณากรอกนามสกุล"),
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
