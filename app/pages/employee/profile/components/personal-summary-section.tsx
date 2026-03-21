import { Form, Input } from "antd";
import React from "react";

interface PersonalSummarySectionProps {
  form: any;
}

export const PersonalSummarySection: React.FC<PersonalSummarySectionProps> = ({
  form,
}) => {
  return (
    <div className="py-2">
      <Form.Item
        label="รายละเอียดสรุปข้อมูลส่วนตัว"
        name="specialActivities"
        rules={[
          {
            required: true,
            message: "กรุณาระบุข้อมูลสรุปเบื้องต้นของคุณ",
          },
        ]}
        extra="แนะนำตัวตน ประสบการณ์การสอนที่โดดเด่น หรือแพสชันในการสอนของคุณเพื่อให้โรงเรียนรู้จักคุณมากขึ้น"
      >
        <Input.TextArea
          placeholder="แนะนำตัวเองสั้นๆ เกี่ยวกับเป้าหมายการทำงานและทักษะที่เกี่ยวข้อง..."
          rows={10}
          style={{ borderRadius: "8px" }}
        />
      </Form.Item>
    </div>
  );
};
