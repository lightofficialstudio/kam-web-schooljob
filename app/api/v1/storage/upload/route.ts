import { uploadFileService, BUCKETS, BucketName } from "../service/storage-service";

const ALLOWED_BUCKETS: BucketName[] = [
  BUCKETS.AVATARS,
  BUCKETS.RESUMES,
  BUCKETS.LICENSES,
];

// ✨ POST /api/v1/storage/upload
// Body: FormData — fields: file (File), bucket (string), user_id (string)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const bucket = formData.get("bucket") as BucketName | null;
    const userId = formData.get("user_id") as string | null;

    // 📝 Validate required fields
    if (!file || !bucket || !userId) {
      return Response.json(
        {
          status_code: 400,
          message_th: "กรุณาส่ง file, bucket และ user_id",
          message_en: "Missing required fields: file, bucket, user_id",
          data: null,
        },
        { status: 400 }
      );
    }

    // 📝 Validate bucket name
    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return Response.json(
        {
          status_code: 400,
          message_th: `Bucket ไม่ถูกต้อง — ใช้ได้: ${ALLOWED_BUCKETS.join(", ")}`,
          message_en: `Invalid bucket. Allowed: ${ALLOWED_BUCKETS.join(", ")}`,
          data: null,
        },
        { status: 400 }
      );
    }

    // 📝 Validate file size ตาม bucket
    const maxSizes: Record<BucketName, number> = {
      avatars: 5 * 1024 * 1024,   // 5 MB
      resumes: 10 * 1024 * 1024,  // 10 MB
      licenses: 10 * 1024 * 1024, // 10 MB
    };

    if (file.size > maxSizes[bucket]) {
      const mb = maxSizes[bucket] / 1024 / 1024;
      return Response.json(
        {
          status_code: 400,
          message_th: `ไฟล์ใหญ่เกินไป — ขนาดสูงสุด ${mb} MB`,
          message_en: `File too large. Max size: ${mb} MB`,
          data: null,
        },
        { status: 400 }
      );
    }

    // ✨ แปลง File → Buffer แล้วส่ง upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadFileService(
      bucket,
      userId,
      file.name,
      buffer,
      file.type
    );

    return Response.json(
      {
        status_code: 200,
        message_th: "อัปโหลดไฟล์สำเร็จ",
        message_en: "File uploaded successfully",
        data: {
          url: result.url,
          path: result.path,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [storage/upload]:", error);
    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์",
        message_en: "File upload failed",
        data: null,
      },
      { status: 500 }
    );
  }
}
