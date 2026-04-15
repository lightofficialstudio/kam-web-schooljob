import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ✨ GET /api/v1/admin/config — ดึง ConfigOptions ทั้งหมด (Admin)
export async function GET() {
  try {
    const options = await prisma.configOption.findMany({
      orderBy: [{ group: "asc" }, { sortOrder: "asc" }],
    });

    return Response.json({
      status_code: 200,
      message_th: "ดึงข้อมูลสำเร็จ",
      message_en: "Fetched successfully",
      data: options,
    });
  } catch (error) {
    console.error("❌ [GET /api/v1/admin/config]", error);
    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาด",
        message_en: "Internal server error",
        data: null,
      },
      { status: 500 },
    );
  }
}

const createSchema = z.object({
  group: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
  parent_value: z.string().optional().nullable(),
  sort_order: z.number().int().optional().default(0),
});

// ✨ POST /api/v1/admin/config — เพิ่ม ConfigOption ใหม่ (Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: "ข้อมูลไม่ถูกต้อง",
          message_en: "Invalid input",
          data: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { group, label, value, parent_value, sort_order } = parsed.data;

    const existing = await prisma.configOption.findFirst({
      where: { group, value },
    });
    if (existing) {
      return Response.json(
        {
          status_code: 409,
          message_th: "มีตัวเลือกนี้อยู่แล้ว",
          message_en: "Option already exists",
          data: null,
        },
        { status: 409 },
      );
    }

    const option = await prisma.configOption.create({
      data: {
        group,
        label,
        value,
        parentValue: parent_value ?? null,
        sortOrder: sort_order,
      },
    });

    return Response.json(
      {
        status_code: 201,
        message_th: "สร้างสำเร็จ",
        message_en: "Created successfully",
        data: option,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ [POST /api/v1/admin/config]", error);
    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาด",
        message_en: "Internal server error",
        data: null,
      },
      { status: 500 },
    );
  }
}

const updateSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1).optional(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

// ✨ PATCH /api/v1/admin/config — แก้ไข ConfigOption (Admin)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: "ข้อมูลไม่ถูกต้อง",
          message_en: "Invalid input",
          data: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { id, label, sort_order, is_active } = parsed.data;

    const option = await prisma.configOption.update({
      where: { id },
      data: {
        ...(label !== undefined && { label }),
        ...(sort_order !== undefined && { sortOrder: sort_order }),
        ...(is_active !== undefined && { isActive: is_active }),
      },
    });

    return Response.json({
      status_code: 200,
      message_th: "แก้ไขสำเร็จ",
      message_en: "Updated successfully",
      data: option,
    });
  } catch (error) {
    console.error("❌ [PATCH /api/v1/admin/config]", error);
    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาด",
        message_en: "Internal server error",
        data: null,
      },
      { status: 500 },
    );
  }
}

// ✨ DELETE /api/v1/admin/config?id=xxx — ลบ ConfigOption (Admin)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        {
          status_code: 400,
          message_th: "กรุณาระบุ id",
          message_en: "id is required",
          data: null,
        },
        { status: 400 },
      );
    }

    await prisma.configOption.delete({ where: { id } });

    return Response.json({
      status_code: 200,
      message_th: "ลบสำเร็จ",
      message_en: "Deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("❌ [DELETE /api/v1/admin/config]", error);
    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาด",
        message_en: "Internal server error",
        data: null,
      },
      { status: 500 },
    );
  }
}
