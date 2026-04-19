import { prisma } from "@/lib/prisma";
import { CreateLicenseInput, UpdateLicenseInput } from "../validation/license-schema";

// ✨ สร้างใบอนุญาต/ใบประกอบวิชาชีพใหม่ โดยดึง profileId จาก userId
export const createLicenseService = async (userId: string, payload: CreateLicenseInput) => {
  // ✨ ดึง profileId จาก userId
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) throw new Error("PROFILE_NOT_FOUND");

  return await prisma.license.create({
    data: {
      profileId: profile.id,
      licenseName: payload.license_name,
      fileUrl: payload.file_url ?? null,
      issuer: payload.issuer ?? null,
      licenseNumber: payload.license_number ?? null,
      issueDate: payload.issue_date ? new Date(payload.issue_date) : null,
      expiryDate: payload.expiry_date ? new Date(payload.expiry_date) : null,
      credentialUrl: payload.credential_url ?? null,
      isDeleted: false,
    },
    select: {
      id: true,
      licenseName: true,
      fileUrl: true,
      issuer: true,
      licenseNumber: true,
      issueDate: true,
      expiryDate: true,
      credentialUrl: true,
      createdAt: true,
    },
  });
};

// ✨ อัปเดตใบอนุญาต — เฉพาะ field ที่ส่งมา
export const updateLicenseService = async (id: string, payload: UpdateLicenseInput) => {
  return await prisma.license.update({
    where: { id },
    data: {
      ...(payload.license_name !== undefined && { licenseName: payload.license_name }),
      ...(payload.file_url !== undefined && { fileUrl: payload.file_url }),
      ...(payload.issuer !== undefined && { issuer: payload.issuer }),
      ...(payload.license_number !== undefined && { licenseNumber: payload.license_number }),
      ...(payload.issue_date !== undefined && { issueDate: payload.issue_date ? new Date(payload.issue_date) : null }),
      ...(payload.expiry_date !== undefined && { expiryDate: payload.expiry_date ? new Date(payload.expiry_date) : null }),
      ...(payload.credential_url !== undefined && { credentialUrl: payload.credential_url }),
    },
    select: {
      id: true,
      licenseName: true,
      fileUrl: true,
      issuer: true,
      licenseNumber: true,
      issueDate: true,
      expiryDate: true,
      credentialUrl: true,
      createdAt: true,
    },
  });
};

// ✨ Soft-delete ใบอนุญาต — set isDeleted: true
export const deleteLicenseService = async (id: string) => {
  return await prisma.license.update({
    where: { id },
    data: { isDeleted: true },
    select: { id: true },
  });
};
