import { supabase } from "@/app/lib/supabase";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { SigninInput, SignupInput } from "../validation/authenticate-schema";

export class AuthenticateService {
  // ✨ [สมัครสมาชิกด้วย Supabase Auth SDK]
  async signup(input: SignupInput) {
    const { email, password, full_name, role } = input;

    console.log("📝 [SIGNUP] Starting signup process...");
    console.log(`   📧 Email: ${email}`);
    console.log(`   👤 Full name: ${full_name}`);
    console.log(`   🎯 Role: ${role}`);

    try {
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

      if (authError) {
        console.error(`❌ [SIGNUP] Supabase auth error:`, {
          message: authError.message,
          code: authError.code,
          status: authError.status,
        });

        // 🔍 [แปล Supabase error messages เป็นภาษาไทย]
        if (authError.message.includes("already registered")) {
          throw new Error("อีเมลนี้ถูกลงทะเบียนแล้ว");
        }
        if (authError.message.includes("Password should be at least")) {
          throw new Error("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
        }
        if (authError.message.includes("invalid email")) {
          throw new Error("อีเมลไม่ถูกต้อง");
        }

        throw new Error(
          authError.message || "ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่",
        );
      }

      console.log(`✅ [SIGNUP] User created in Supabase: ${authData.user?.id}`);

      // 2. ✨ [บันทึกข้อมูล extra ใน Prisma (optional)]
      if (authData.user) {
        try {
          await prisma.profile.upsert({
            where: { userId: authData.user.id },
            update: {
              email,
              firstName: full_name,
              role: role as UserRole,
            },
            create: {
              userId: authData.user.id,
              email,
              firstName: full_name,
              role: role as UserRole,
              password: "", // ❌ ไม่เก็บ password - Supabase จัดการแล้ว
            },
          });
          console.log(
            `✅ [SIGNUP] Profile synced to Prisma: ${authData.user.id}`,
          );
        } catch (prismaError) {
          console.warn(
            `⚠️ [SIGNUP] Prisma sync failed (non-critical):`,
            prismaError,
          );
          // ไม่ throw - ให้ signup สำเร็จแม้ Prisma fail
        }
      }

      return {
        id: authData.user?.id,
        email: authData.user?.email,
      };
    } catch (error) {
      console.error("❌ [SIGNUP] Signup failed:", error);
      throw error;
    }
  }

  // ✨ [เข้าสู่ระบบด้วย Supabase Auth SDK]
  async signin(input: SigninInput) {
    const { email, password } = input;

    console.log("🔐 [SIGNIN] Starting signin process...");
    console.log(`   📧 Email: ${email}`);

    try {
      // 1. ✨ [เข้าสู่ระบบกับ Supabase Auth]
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error(`❌ [SIGNIN] Auth failed:`, {
          message: error.message,
          code: error.code,
          status: error.status,
        });

        // 🔍 [แปล Supabase error messages เป็นภาษาไทย]
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }
        if (error.message.includes("Email not confirmed")) {
          throw new Error("โปรดยืนยันอีเมลของคุณก่อน");
        }

        throw new Error(error.message || "ไม่สามารถเข้าสู่ระบบได้");
      }

      console.log(`✅ [SIGNIN] Auth successful: ${data.user?.id}`);
      console.log(`   📧 User email: ${data.user?.email}`);
      console.log(`   💾 User metadata:`, data.user?.user_metadata);

      // 2. ✨ [ดึงข้อมูล extra จาก Prisma (optional)]
      let profile = null;
      if (data.user) {
        try {
          profile = await prisma.profile.findUnique({
            where: { userId: data.user.id },
          });
          console.log(`✅ [SIGNIN] Profile fetched from Prisma:`, profile?.id);
        } catch (prismaError) {
          console.warn(
            `⚠️ [SIGNIN] Prisma fetch failed (non-critical):`,
            prismaError,
          );
          // ไม่ throw - ให้ signin สำเร็จแม้ Prisma fail
        }
      }

      // 3. ✨ [รวมข้อมูล Supabase + Prisma]
      const fullName =
        data.user?.user_metadata?.full_name || profile?.firstName || "";
      const role =
        data.user?.user_metadata?.role || profile?.role || "EMPLOYEE";

      console.log(`✅ [SIGNIN] Ready to return user data:`, {
        user_id: data.user?.id,
        email: data.user?.email,
        full_name: fullName,
        role: role,
      });

      return {
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
        session: data.session,
        profile: {
          userId: data.user?.id || "",
          email: data.user?.email || "",
          fullName: fullName,
          role: role as UserRole,
          password: "", // ❌ ไม่คืน password
          id: profile?.id || "",
          createdAt: profile?.createdAt || new Date(),
          updatedAt: profile?.updatedAt || new Date(),
          profileImageUrl: profile?.profileImageUrl || null,
        },
      };
    } catch (error) {
      console.error("❌ [SIGNIN] Signin failed:", error);
      throw error;
    }
  }
}

export const authService = new AuthenticateService();
