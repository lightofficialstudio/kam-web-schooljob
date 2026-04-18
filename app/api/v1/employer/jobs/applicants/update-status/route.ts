import { createNotification } from "@/lib/notification";
import { updateApplicantStatusService } from "../../service/job-service";

const VALID_STATUSES = ["PENDING", "INTERVIEW", "ACCEPTED", "REJECTED"] as const;
type ApplicationStatus = (typeof VALID_STATUSES)[number];

// ✨ PATCH /api/v1/employer/jobs/applicants/update-status — อัปเดตสถานะผู้สมัคร
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { user_id, application_id, status } = body as {
      user_id?: string;
      application_id?: string;
      status?: string;
    };

    if (!user_id || !application_id || !status) {
      return Response.json(
        {
          status_code: 400,
          message_th: "กรุณาระบุ user_id, application_id และ status",
          message_en: "user_id, application_id and status are required",
          data: null,
        },
        { status: 400 },
      );
    }

    if (!VALID_STATUSES.includes(status as ApplicationStatus)) {
      return Response.json(
        {
          status_code: 400,
          message_th: "สถานะไม่ถูกต้อง ต้องเป็น PENDING, INTERVIEW, ACCEPTED หรือ REJECTED",
          message_en: "Invalid status value",
          data: null,
        },
        { status: 400 },
      );
    }

    const result = await updateApplicantStatusService(
      user_id,
      application_id,
      status as ApplicationStatus,
    );

    // ✨ แจ้ง EMPLOYEE ว่าสถานะใบสมัครเปลี่ยนแล้ว
    const statusLabelMap: Record<ApplicationStatus, string> = {
      PENDING:   "รอการพิจารณา",
      INTERVIEW: "ได้รับเลือกให้สัมภาษณ์",
      ACCEPTED:  "ผ่านการคัดเลือก 🎉",
      REJECTED:  "ไม่ผ่านการคัดเลือก",
    };
    if (status !== "PENDING") {
      createNotification({
        profileId:     result.applicantId,
        type:          "application_status",
        title:         `${result.job.schoolProfile.schoolName}: ${statusLabelMap[status as ApplicationStatus]}`,
        message:       `ใบสมัครตำแหน่ง "${result.job.title}" ได้รับการอัปเดตสถานะ`,
        referenceId:   result.id,
        referenceType: "application",
      }).catch((e) => console.error("❌ [notification] application_status:", e));
    }

    return Response.json({
      status_code: 200,
      message_th: "อัปเดตสถานะผู้สมัครสำเร็จ",
      message_en: "Applicant status updated successfully",
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message === "APPLICATION_NOT_FOUND") {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบใบสมัครนี้",
          message_en: "Application not found",
          data: null,
        },
        { status: 404 },
      );
    }

    if (message === "SCHOOL_PROFILE_NOT_FOUND") {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบโปรไฟล์โรงเรียน",
          message_en: "School profile not found",
          data: null,
        },
        { status: 404 },
      );
    }

    console.error("❌ [applicants/update-status]", error);
    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาดภายในระบบ",
        message_en: "Internal server error",
        data: null,
      },
      { status: 500 },
    );
  }
}
