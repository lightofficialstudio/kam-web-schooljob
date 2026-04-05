import { createClient } from "@supabase/supabase-js";

// ✨ ใช้ Service Role Key เพื่อ bypass RLS ในฝั่ง Server (API route เท่านั้น)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Bucket names
export const BUCKETS = {
  AVATARS: "avatars",   // public — รูปโปรไฟล์
  RESUMES: "resumes",   // private — เรซูเม่ PDF
  LICENSES: "licenses", // private — ใบประกอบวิชาชีพ
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

// ✨ Upload ไฟล์ไปยัง Supabase Storage
// path รูปแบบ: {userId}/{filename} เพื่อแยก folder ตาม user
export const uploadFileService = async (
  bucket: BucketName,
  userId: string,
  fileName: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<{ url: string; path: string }> => {
  const filePath = `${userId}/${Date.now()}_${fileName}`;

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // ✨ Public bucket → getPublicUrl, Private bucket → createSignedUrl (1 ชั่วโมง)
  if (bucket === BUCKETS.AVATARS) {
    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
    return { url: data.publicUrl, path: filePath };
  }

  // Private buckets — คืน path กลับไป ให้ frontend ขอ signed URL ตอนแสดงผล
  const publicBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`;
  return { url: publicBase, path: filePath };
};

// ✨ สร้าง Signed URL สำหรับ private file (อายุ 1 ชั่วโมง)
export const getSignedUrlService = async (
  bucket: BucketName,
  filePath: string,
  expiresInSeconds = 3600
): Promise<string> => {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to create signed URL: ${error?.message}`);
  }

  return data.signedUrl;
};

// ✨ ลบไฟล์ออกจาก Supabase Storage
export const deleteFileService = async (
  bucket: BucketName,
  filePath: string
): Promise<void> => {
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};
