"use client";

import { Checkbox, Col, Form, Row, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";

// ✨ URL ข้อมูลภูมิศาสตร์ไทยจาก GitHub — ตรงกับ job-search-store
const PROVINCE_API =
  "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province.json";

interface Province {
  id: number;
  name_th: string;
}

interface WorkLocationSectionProps {
  form: ReturnType<typeof Form.useForm>[0];
}

// ✨ แสดงฟอร์ม Work Location แยกจาก SkillsLocationSection อย่างชัดเจน (1:1 concept)
export const WorkLocationSection: React.FC<WorkLocationSectionProps> = ({ form }) => {
  const [provinceOptions, setProvinceOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✨ โหลดรายชื่อจังหวัดทั้ง 77 จังหวัดจาก GitHub (ไม่ hardcode)
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(PROVINCE_API);
        const data: Province[] = await res.json();
        setProvinceOptions(
          data.map((p) => ({ label: p.name_th, value: p.name_th })),
        );
      } catch (err) {
        console.error("❌ [WorkLocationSection] โหลดจังหวัดไม่สำเร็จ:", err);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchProvinces();
  }, []);

  return (
    <div className="py-2">
      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            label="จังหวัดที่ต้องการทำงาน"
            name="preferredProvinces"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกจังหวัดที่ต้องการทำงานอย่างน้อย 1 จังหวัด",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder={isLoading ? "กำลังโหลดรายชื่อจังหวัด..." : "เลือกจังหวัด"}
              options={provinceOptions}
              loading={isLoading}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              notFoundContent={isLoading ? <Spin size="small" /> : "ไม่พบจังหวัดที่ค้นหา"}
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            label="การย้ายที่อยู่"
            name="canRelocate"
            valuePropName="checked"
          >
            <Checkbox>ฉันสามารถย้ายที่อยู่ได้</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
