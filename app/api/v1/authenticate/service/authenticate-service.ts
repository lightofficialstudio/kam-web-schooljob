import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { randomUUID } from "crypto";
import { SigninInput, SignupInput } from "../validation/authenticate-schema";

export class AuthenticateService {
  // ✨ [ฟังก์ชันสำหรับการสมัครสมาชิกและสร้างโปรไฟล์ในฐานข้อมูล]
  async signup(input: SignupInput) {
    const { email, password, full_name, role } = input;

    // 0. ✨ [ตรวจสอบว่าอีเมลถูกใช้งานแล้วหรือไม่]
    const existingProfile = await prisma.profile.findUnique({
      where: { email },
    });

    if (existingProfile) {
      throw new Error("อีเมลนี้ถูกใช้งานแล้ว");
    }

    // 1. ✨ [Hash password ด้วย bcryptjs]
    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log("🔐 Password hashed successfully");

    // 2. ✨ [สร้างโปรไฟล์ในฐานข้อมูลท้องถิ่น (ไม่ใช้ Supabase)]
    const userId = randomUUID();
    try {
      const createdProfile = await prisma.profile.create({
        data: {
          userId: userId,
          email: email,
          password: hashedPassword,
          fullName: full_name,
          role: role as UserRole,
        },
      });
      console.log("✅ Profile created successfully:", createdProfile.id);

      return {
        id: createdProfile.userId,
        email: createdProfile.email,
      };
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("อีเมลนี้ถูกใช้งานแล้ว");
      }
      throw error;
    }
  }

  // ✨ [ฟังก์ชันสำหรับการเข้าสู่ระบบจากฐานข้อมูลท้องถิ่น]
  async signin(input: SigninInput) {
    const { email, password } = input;

    console.log("🔐 Attempting signin with email:", email);

    // 1. ✨ [ค้นหา profile จากฐานข้อมูล]
    const profile = await prisma.profile.findUnique({
      where: { email },
    });

    if (!profile) {
      console.error("❌ Profile not found for email:", email);
      throw new Error("Invalid login credentials");
    }

    if (!profile.password) {
      console.error("❌ No password set for profile:", email);
      throw new Error("Invalid login credentials");
    }

    console.log("✅ Profile found for email:", email);

    // 2. ✨ [เปรียบเทียบ password ที่ส่งมากับ password hash ที่เก็บ]
    const isPasswordValid = await bcryptjs.compare(password, profile.password);

    if (!isPasswordValid) {
      console.error("❌ Password mismatch for email:", email);
      throw new Error("Invalid login credentials");
    }

    console.log("✅ Password verified successfully");

    return {
      user: {
        id: profile.userId,
        email: profile.email,
      },
      session: null,
      profile: profile,
    };
  }
}

export const authService = new AuthenticateService();
