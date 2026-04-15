import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// ✨ Schema สำหรับ AI Blog Assistant request
const aiRequestSchema = z.object({
  action: z.enum(["generate_title", "generate_excerpt", "generate_content", "suggest_tags", "seo_score"]),
  topic: z.string().optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  outline: z.string().optional(),
  category: z.string().optional(),
  target_audience: z.string().optional().default("ครูและสถานศึกษา"),
});

// ✨ POST /api/v1/admin/blogs/ai — AI Blog Assistant ช่วยเขียนบทความ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = aiRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid input", data: null },
        { status: 400 },
      );
    }

    const { action, topic, title, content, outline, category, target_audience } = parsed.data;

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { status_code: 503, message_th: "ยังไม่ได้ตั้งค่า AI API Key", message_en: "AI not configured", data: null },
        { status: 503 },
      );
    }

    // ✨ สร้าง prompt ตาม action
    let prompt = "";
    let systemPrompt = "คุณเป็น AI Assistant ผู้เชี่ยวชาญด้านการเขียนบทความการศึกษาภาษาไทย สำหรับเว็บไซต์ตลาดงานครูและสถานศึกษา ตอบเฉพาะผลลัพธ์ที่ขอ ไม่ต้องอธิบาย";

    if (action === "generate_title") {
      prompt = `สร้างชื่อบทความ 5 แบบ สำหรับหัวข้อ: "${topic}"
หมวดหมู่: ${category ?? "ทั่วไป"}
กลุ่มเป้าหมาย: ${target_audience}

ตอบเป็น JSON array ของ string เท่านั้น เช่น ["ชื่อ1", "ชื่อ2", ...]
ชื่อต้องน่าสนใจ กระชับ ไม่เกิน 80 ตัวอักษร`;
    } else if (action === "generate_excerpt") {
      prompt = `เขียนสรุปย่อ (excerpt) สำหรับบทความ:
ชื่อ: "${title}"
${content ? `เนื้อหาย่อ: ${content.slice(0, 500)}` : ""}

ตอบเป็น JSON object: {"excerpt": "..."}
ความยาว 2-3 ประโยค ไม่เกิน 200 ตัวอักษร น่าสนใจ กระตุ้นการคลิก`;
    } else if (action === "generate_content") {
      prompt = `เขียนเนื้อหาบทความฉบับเต็มในรูปแบบ Markdown:
ชื่อบทความ: "${title}"
${outline ? `โครงร่าง:\n${outline}` : ""}
${topic ? `หัวข้อ: ${topic}` : ""}
หมวดหมู่: ${category ?? "ทั่วไป"}
กลุ่มเป้าหมาย: ${target_audience}

ตอบเป็น JSON object: {"content": "...markdown content..."}
ความยาวประมาณ 600-1000 คำ มีหัวข้อ (## ###) รายการ bullet และตัวอย่างที่ชัดเจน`;
    } else if (action === "suggest_tags") {
      prompt = `แนะนำ tags สำหรับบทความ:
ชื่อ: "${title}"
${content ? `เนื้อหา: ${content.slice(0, 800)}` : ""}
หมวดหมู่: ${category ?? "ทั่วไป"}

ตอบเป็น JSON object: {"tags": ["tag1", "tag2", ...]}
แนะนำ 5-8 tags ที่เกี่ยวข้อง กระชับ ภาษาไทย`;
    } else if (action === "seo_score") {
      prompt = `วิเคราะห์ SEO ของบทความ:
ชื่อ: "${title}"
Excerpt: "${content?.slice(0, 200) ?? ""}"
เนื้อหา (ย่อ): "${content?.slice(0, 1000) ?? ""}"

ตอบเป็น JSON object: {
  "score": <0-100>,
  "grade": <"A"|"B"|"C"|"D">,
  "issues": ["ปัญหา1", "ปัญหา2"],
  "suggestions": ["คำแนะนำ1", "คำแนะนำ2"],
  "keyword_density": <number>,
  "readability": <"ง่าย"|"ปานกลาง"|"ยาก">
}`;
    }

    // ✨ เรียก Claude API (Anthropic)
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const rawText = aiResponse.content?.[0]?.text ?? "";

    // ✨ parse JSON จาก response
    const jsonMatch = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    let result: unknown = null;
    if (jsonMatch) {
      try {
        result = JSON.parse(jsonMatch[0]);
      } catch {
        result = { raw: rawText };
      }
    } else {
      result = { raw: rawText };
    }

    return NextResponse.json({
      status_code: 200,
      message_th: "AI ประมวลผลสำเร็จ",
      message_en: "AI processed successfully",
      data: result,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [POST /api/v1/admin/blogs/ai]", msg);
    return NextResponse.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดจาก AI", message_en: msg, data: null },
      { status: 500 },
    );
  }
}
