import { deleteFileService, BUCKETS, BucketName } from "../service/storage-service";

// ✨ DELETE /api/v1/storage/delete
// Body: { bucket, path }
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { bucket, path } = body as { bucket: BucketName; path: string };

    if (!bucket || !path) {
      return Response.json(
        {
          status_code: 400,
          message_th: "กรุณาระบุ bucket และ path",
          message_en: "Missing required fields: bucket, path",
          data: null,
        },
        { status: 400 }
      );
    }

    const allowedBuckets = [BUCKETS.AVATARS, BUCKETS.RESUMES, BUCKETS.LICENSES];
    if (!allowedBuckets.includes(bucket)) {
      return Response.json(
        { status_code: 400, message_th: "Bucket ไม่ถูกต้อง", message_en: "Invalid bucket", data: null },
        { status: 400 }
      );
    }

    await deleteFileService(bucket, path);

    return Response.json(
      {
        status_code: 200,
        message_th: "ลบไฟล์สำเร็จ",
        message_en: "File deleted successfully",
        data: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [storage/delete]:", error);
    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาดในการลบไฟล์",
        message_en: "File delete failed",
        data: null,
      },
      { status: 500 }
    );
  }
}
