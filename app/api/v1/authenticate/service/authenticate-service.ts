import { supabase } from "@/app/lib/supabase";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { SigninInput, SignupInput } from "../validation/authenticate-schema";

export class AuthenticateService {
  // ✨ [ฟังก์ชันสำหรับการสมัครสมาชิกและสร้างโปรไฟล์ในฐานข้อมูล]
  async signup(input: SignupInput) {
    const { email, password, full_name, role } = input;

    // 1. ✨ [สมัครสมาชิกผ่าน Supabase Auth]
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role,
        },
      },
    });

    if (authError) throw authError;

    // 2. ✨ [สร้างหรืออัปเดตโปรไฟล์ใน Prisma ด้วย snake_case mapping]
    if (authData.user) {
      await prisma.profile.upsert({
        where: { userId: authData.user.id },
        update: {
          email: email,
          fullName: full_name,
          role: role as UserRole,
        },
        create: {
          userId: authData.user.id,
          email: email,
          fullName: full_name,
          role: role as UserRole,
        },
      });
    }

    return authData.user;
  }

  // ✨ [ฟังก์ชันสำหรับการเข้าสู่ระบบผ่าน Supabase]
  async signin(input: SigninInput) {
    const { email, password } = input;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data;
  }
}

export const authService = new AuthenticateService();
