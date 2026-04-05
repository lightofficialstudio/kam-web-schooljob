import { prisma } from "@/lib/prisma";
import { UpdateEmployeeProfileInput } from "../validation/employee-profile-schema";

// ✨ ดึงข้อมูล Employee Profile ครบทุก relation โดยใช้ user_id จาก Supabase Auth
// ถ้าไม่พบ profile จะ return null ให้ route handler จัดการ
export const getEmployeeProfileService = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      workExperiences: {
        where: { isDeleted: false },
        orderBy: { startDate: "desc" },
      },
      educations: {
        where: { isDeleted: false },
        orderBy: { graduationYear: "desc" },
      },
      licenses: {
        where: { isDeleted: false },
        orderBy: { issueDate: "desc" },
      },
      languages: {
        where: { isDeleted: false },
      },
      skills: {
        where: { isDeleted: false },
      },
      resumes: {
        where: { isDeleted: false },
        orderBy: { uploadedAt: "desc" },
      },
      specializations: {
        orderBy: { createdAt: "asc" },
      },
      gradeCanTeaches: {
        orderBy: { createdAt: "asc" },
      },
      preferredProvinces: {
        orderBy: { createdAt: "asc" },
      },
      activeResume: true,
    },
  });

  return profile;
};

// ✨ Auto-create profile ถ้ายังไม่มีใน DB (กรณี user สมัครก่อนระบบ sync พร้อม)
// ดึง email จาก Supabase Auth metadata ถ้าส่งมาด้วย
export const ensureEmployeeProfileService = async (
  userId: string,
  email: string
) => {
  return await prisma.profile.upsert({
    where: { userId },
    update: {}, // ไม่ update อะไร — แค่ ensure มีอยู่
    create: {
      userId,
      email,
      role: "EMPLOYEE",
    },
    include: {
      workExperiences: { where: { isDeleted: false }, orderBy: { startDate: "desc" } },
      educations: { where: { isDeleted: false }, orderBy: { graduationYear: "desc" } },
      licenses: { where: { isDeleted: false }, orderBy: { issueDate: "desc" } },
      languages: { where: { isDeleted: false } },
      skills: { where: { isDeleted: false } },
      resumes: { where: { isDeleted: false }, orderBy: { uploadedAt: "desc" } },
      specializations: { orderBy: { createdAt: "asc" } },
      gradeCanTeaches: { orderBy: { createdAt: "asc" } },
      preferredProvinces: { orderBy: { createdAt: "asc" } },
      activeResume: true,
    },
  });
};

// ✨ อัปเดต Employee Profile พร้อม upsert relations ทั้งหมดใน Transaction เดียว
export const updateEmployeeProfileService = async (
  userId: string,
  payload: UpdateEmployeeProfileInput
) => {
  const {
    specializations,
    grade_can_teaches,
    preferred_provinces,
    work_experiences,
    educations,
    licenses,
    languages,
    skills,
    ...basicFields
  } = payload;

  return await prisma.$transaction(async (tx) => {
    // 📝 ดึง profile id จาก userId ก่อน
    const profile = await tx.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new Error("PROFILE_NOT_FOUND");
    }

    const profileId = profile.id;

    // ✨ อัปเดต basic fields ของ Profile
    const updatedProfile = await tx.profile.update({
      where: { userId },
      data: {
        ...(basicFields.first_name !== undefined && { firstName: basicFields.first_name }),
        ...(basicFields.last_name !== undefined && { lastName: basicFields.last_name }),
        ...(basicFields.phone_number !== undefined && { phoneNumber: basicFields.phone_number }),
        ...(basicFields.gender !== undefined && { gender: basicFields.gender }),
        ...(basicFields.date_of_birth !== undefined && {
          dateOfBirth: basicFields.date_of_birth ? new Date(basicFields.date_of_birth) : null,
        }),
        ...(basicFields.nationality !== undefined && { nationality: basicFields.nationality }),
        ...(basicFields.profile_image_url !== undefined && { profileImageUrl: basicFields.profile_image_url }),
        ...(basicFields.profile_visibility !== undefined && {
          profileVisibility: basicFields.profile_visibility as "public" | "apply_only",
        }),
        ...(basicFields.teaching_experience !== undefined && { teachingExperience: basicFields.teaching_experience }),
        ...(basicFields.recent_school !== undefined && { recentSchool: basicFields.recent_school }),
        ...(basicFields.special_activities !== undefined && { specialActivities: basicFields.special_activities }),
        ...(basicFields.can_relocate !== undefined && { canRelocate: basicFields.can_relocate }),
        ...(basicFields.license_status !== undefined && {
          licenseStatus: basicFields.license_status as "has_license" | "pending" | "no_license" | "not_required" | null,
        }),
        ...(basicFields.active_resume_id !== undefined && { activeResumeId: basicFields.active_resume_id }),
      },
    });

    // ✨ Sync specializations — ลบของเดิมและสร้างใหม่ทั้งหมด (simple replace strategy)
    if (specializations !== undefined) {
      await tx.specialization.deleteMany({ where: { profileId } });
      if (specializations.length > 0) {
        await tx.specialization.createMany({
          data: specializations.map((subject) => ({ profileId, subject })),
        });
      }
    }

    // ✨ Sync grade_can_teaches
    if (grade_can_teaches !== undefined) {
      await tx.gradeCanTeach.deleteMany({ where: { profileId } });
      if (grade_can_teaches.length > 0) {
        await tx.gradeCanTeach.createMany({
          data: grade_can_teaches.map((grade) => ({ profileId, grade })),
        });
      }
    }

    // ✨ Sync preferred_provinces
    if (preferred_provinces !== undefined) {
      await tx.preferredProvince.deleteMany({ where: { profileId } });
      if (preferred_provinces.length > 0) {
        await tx.preferredProvince.createMany({
          data: preferred_provinces.map((province) => ({ profileId, province })),
        });
      }
    }

    // ✨ Upsert work_experiences — ใช้ id ถ้ามี, สร้างใหม่ถ้าไม่มี
    if (work_experiences !== undefined) {
      for (const exp of work_experiences) {
        if (exp.id) {
          // มี id → update หรือ soft-delete
          await tx.workExperience.update({
            where: { id: exp.id },
            data: {
              jobTitle: exp.job_title,
              companyName: exp.company_name,
              startDate: new Date(exp.start_date),
              endDate: exp.end_date ? new Date(exp.end_date) : null,
              inPresent: exp.in_present,
              description: exp.description ?? null,
              workYear: exp.work_year ?? null,
              isDeleted: exp.is_deleted,
            },
          });
        } else {
          // ไม่มี id → สร้างใหม่
          await tx.workExperience.create({
            data: {
              profileId,
              jobTitle: exp.job_title,
              companyName: exp.company_name,
              startDate: new Date(exp.start_date),
              endDate: exp.end_date ? new Date(exp.end_date) : null,
              inPresent: exp.in_present,
              description: exp.description ?? null,
              workYear: exp.work_year ?? null,
            },
          });
        }
      }
    }

    // ✨ Upsert educations
    if (educations !== undefined) {
      for (const edu of educations) {
        if (edu.id) {
          await tx.education.update({
            where: { id: edu.id },
            data: {
              level: edu.level,
              institution: edu.institution,
              major: edu.major,
              graduationYear: edu.graduation_year ?? null,
              gpa: edu.gpa ?? null,
              startDate: edu.start_date ? new Date(edu.start_date) : null,
              endDate: edu.end_date ? new Date(edu.end_date) : null,
              isDeleted: edu.is_deleted,
            },
          });
        } else {
          await tx.education.create({
            data: {
              profileId,
              level: edu.level,
              institution: edu.institution,
              major: edu.major,
              graduationYear: edu.graduation_year ?? null,
              gpa: edu.gpa ?? null,
              startDate: edu.start_date ? new Date(edu.start_date) : null,
              endDate: edu.end_date ? new Date(edu.end_date) : null,
            },
          });
        }
      }
    }

    // ✨ Upsert licenses
    if (licenses !== undefined) {
      for (const lic of licenses) {
        if (lic.id) {
          await tx.license.update({
            where: { id: lic.id },
            data: {
              licenseName: lic.license_name,
              issuer: lic.issuer ?? null,
              licenseNumber: lic.license_number ?? null,
              issueDate: lic.issue_date ? new Date(lic.issue_date) : null,
              expiryDate: lic.expiry_date ? new Date(lic.expiry_date) : null,
              fileUrl: lic.file_url ?? null,
              credentialUrl: lic.credential_url ?? null,
              isDeleted: lic.is_deleted,
            },
          });
        } else {
          await tx.license.create({
            data: {
              profileId,
              licenseName: lic.license_name,
              issuer: lic.issuer ?? null,
              licenseNumber: lic.license_number ?? null,
              issueDate: lic.issue_date ? new Date(lic.issue_date) : null,
              expiryDate: lic.expiry_date ? new Date(lic.expiry_date) : null,
              fileUrl: lic.file_url ?? null,
              credentialUrl: lic.credential_url ?? null,
            },
          });
        }
      }
    }

    // ✨ Upsert languages
    if (languages !== undefined) {
      for (const lang of languages) {
        if (lang.id) {
          await tx.language.update({
            where: { id: lang.id },
            data: {
              languageName: lang.language_name,
              proficiency: lang.proficiency ?? null,
              isDeleted: lang.is_deleted,
            },
          });
        } else {
          await tx.language.create({
            data: {
              profileId,
              languageName: lang.language_name,
              proficiency: lang.proficiency ?? null,
            },
          });
        }
      }
    }

    // ✨ Upsert skills
    if (skills !== undefined) {
      for (const skill of skills) {
        if (skill.id) {
          await tx.skill.update({
            where: { id: skill.id },
            data: {
              skillName: skill.skill_name,
              isDeleted: skill.is_deleted,
            },
          });
        } else {
          await tx.skill.create({
            data: {
              profileId,
              skillName: skill.skill_name,
            },
          });
        }
      }
    }

    return updatedProfile;
  });
};
