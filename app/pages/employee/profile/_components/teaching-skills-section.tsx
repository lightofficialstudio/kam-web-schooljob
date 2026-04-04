import { Form, Select, Typography } from "antd";
import React from "react";

const { Text } = Typography;

interface TeachingSkillsSectionProps {
  form: unknown;
}

// ✨ [Teaching Skills Section — free-text tags สำหรับวิชาที่เชี่ยวชาญ + ทักษะภาษา/IT]
export const TeachingSkillsSection: React.FC<
  TeachingSkillsSectionProps
> = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* วิชาที่เชี่ยวชาญ */}
      <Form.Item
        label="วิชาที่เชี่ยวชาญ"
        name="specialization"
        extra={
          <Text type="secondary" style={{ fontSize: 12 }}>
            พิมพ์แล้วกด Enter เพื่อเพิ่ม เช่น ภาษาอังกฤษ, คณิตศาสตร์,
            วิทยาศาสตร์
          </Text>
        }
      >
        <Select
          mode="tags"
          placeholder="เช่น ภาษาอังกฤษ, คณิตศาสตร์, วิทยาศาสตร์..."
          tokenSeparators={[","]}
          style={{ width: "100%" }}
          options={[
            { label: "ภาษาไทย", value: "ภาษาไทย" },
            { label: "ภาษาอังกฤษ", value: "ภาษาอังกฤษ" },
            { label: "คณิตศาสตร์", value: "คณิตศาสตร์" },
            { label: "วิทยาศาสตร์", value: "วิทยาศาสตร์" },
            { label: "สังคมศึกษา", value: "สังคมศึกษา" },
            { label: "ประวัติศาสตร์", value: "ประวัติศาสตร์" },
            { label: "ศิลปะ", value: "ศิลปะ" },
            { label: "พลศึกษา", value: "พลศึกษา" },
            { label: "ดนตรี", value: "ดนตรี" },
            { label: "คอมพิวเตอร์", value: "คอมพิวเตอร์" },
            { label: "ภาษาจีน", value: "ภาษาจีน" },
            { label: "ภาษาญี่ปุ่น", value: "ภาษาญี่ปุ่น" },
            { label: "ปฐมวัย", value: "ปฐมวัย" },
            { label: "การงานอาชีพ", value: "การงานอาชีพ" },
            { label: "EdTech", value: "EdTech" },
          ]}
        />
      </Form.Item>

      {/* ทักษะด้านภาษาและไอที */}
      <Form.Item
        label="ทักษะด้านภาษาและไอที"
        name="languageAndItSkills"
        extra={
          <Text type="secondary" style={{ fontSize: 12 }}>
            พิมพ์แล้วกด Enter เพื่อเพิ่ม เช่น ไทย (Native), อังกฤษ (Fluent),
            Microsoft Office
          </Text>
        }
      >
        <Select
          mode="tags"
          placeholder="เช่น ไทย (Native), อังกฤษ (Fluent), Microsoft Office..."
          tokenSeparators={[","]}
          style={{ width: "100%" }}
          options={[
            { label: "ไทย (Native)", value: "ไทย (Native)" },
            { label: "อังกฤษ (Fluent)", value: "อังกฤษ (Fluent)" },
            { label: "อังกฤษ (Basic)", value: "อังกฤษ (Basic)" },
            { label: "จีน (Fluent)", value: "จีน (Fluent)" },
            { label: "เยอรมัน (Basic)", value: "เยอรมัน (Basic)" },
            { label: "ญี่ปุ่น (Basic)", value: "ญี่ปุ่น (Basic)" },
            { label: "Microsoft Office", value: "Microsoft Office" },
            { label: "Google Classroom", value: "Google Classroom" },
            { label: "Canva for Education", value: "Canva for Education" },
            { label: "Zoom / MS Teams", value: "Zoom / MS Teams" },
            { label: "Google Workspace", value: "Google Workspace" },
            { label: "Coding / Programming", value: "Coding / Programming" },
          ]}
        />
      </Form.Item>
    </div>
  );
};
