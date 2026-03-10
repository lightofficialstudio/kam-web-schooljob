"use client";

import { DeleteOutlined, EditOutlined, PlusOutlined, CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
} from "antd";
import React, { useState } from "react";
import { EducationEntry, useProfileStore } from "../stores/profile-store";
import { useNotificationModalStore } from "@/app/stores/notification-modal-store";

const EDUCATION_LEVELS = [
  { value: "ประถมศึกษา", label: "ประถมศึกษา" },
  { value: "มัธยมศึกษา", label: "มัธยมศึกษา" },
  { value: "ปวช/ปวส", label: "ปวช/ปวส" },
  { value: "ปริญญาตรี", label: "ปริญญาตรี" },
  { value: "ปริญญาโท", label: "ปริญญาโท" },
  { value: "ปริญญาเอก", label: "ปริญญาเอก" },
  { value: "อื่นๆ", label: "อื่นๆ" },
];

export const EducationHistorySection: React.FC = () => {
  const [form] = Form.useForm();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { profile, addEducation, updateEducation, removeEducation } =
    useProfileStore();
  const { openNotification } = useNotificationModalStore();

  const educations = profile.educations || [];

  const handleAddNew = () => {
    form.resetFields();
    setEditingIndex(null);
    setIsAddingNew(true);
  };

  const handleEdit = (index: number) => {
    const education = educations[index];
    form.setFieldsValue({
      level: education.level,
      institution: education.institution,
      major: education.major,
      gpa: education.gpa,
    });
    setEditingIndex(index);
    setIsAddingNew(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const entry: EducationEntry = {
        level: values.level,
        institution: values.institution,
        major: values.major,
        gpa: values.gpa,
      };

      if (editingIndex !== null) {
        openNotification({
          type: "success",
          mainTitle: "อัปเดตข้อมูลสำเร็จ",
          description: "ข้อมูลการศึกษาของคุณถูกบันทึกเรียบร้อยแล้ว",
          icon: <CheckCircleFilled style={{ color: "#52c41a" }} />,
        });
      } else {
        addEducation(entry);
        openNotification({
          type: "success",
          mainTitle: "เพิ่มข้อมูลสำเร็จ",
          description: "ข้อมูลการศึกษาใหม่ถูกเพิ่มเรียบร้อยแล้ว",
          icon: <CheckCircleFilled style={{ color: "#52c41a" }} />,
        });
      }

      form.resetFields();
      setIsAddingNew(false);
      setEditingIndex(null);
    } catch (error) {
      openNotification({
        type: "error",
        mainTitle: "เกิดข้อผิดพลาด",
        description: "กรุณาตรวจสอบข้อมูลให้ถูกต้อง",
        icon: <CloseCircleFilled style={{ color: "#ff4d4f" }} />,
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsAddingNew(false);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    Modal.confirm({
      title: "ลบข้อมูล",
      content: "คุณแน่ใจว่าต้องการลบข้อมูลนี้?",
      okText: "ลบ",
      cancelText: "ยกเลิก",
      okButtonProps: { danger: true },
      onOk() {
        removeEducation(index);
        openNotification({
          type: "success",
          mainTitle: "ลบข้อมูลสำเร็จ",
          description: "ข้อมูลการศึกษาถูกลบเรียบร้อยแล้ว",
          icon: <CheckCircleFilled style={{ color: "#52c41a" }} />,
        }
        message.success("ลบข้อมูลสำเร็จ");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Form for Adding/Editing */}
      {isAddingNew && (
        <Card className="border-2 border-blue-300 bg-blue-50">
          <h3 className="text-lg font-semibold mb-4">
            {editingIndex !== null
              ? "แก้ไขข้อมูลการศึกษา"
              : "เพิ่มข้อมูลการศึกษา"}
          </h3>
          <Form form={form} layout="vertical" requiredMark="optional">
            <Form.Item
              label="ระดับการศึกษา"
              name="level"
              rules={[{ required: true, message: "กรุณาเลือกระดับการศึกษา" }]}
            >
              <Select
                options={EDUCATION_LEVELS}
                placeholder="เลือกระดับการศึกษา"
              />
            </Form.Item>

            <Form.Item
              label="สถาบัน / โรงเรียน / มหาวิทยาลัย"
              name="institution"
              rules={[{ required: true, message: "กรุณากรอกสถาบัน" }]}
            >
              <Input placeholder="เช่น มหาวิทยาลัยจุฬาลงกรณ์" />
            </Form.Item>

            <Form.Item
              label="สาขาวิชา/วิทยาลัย"
              name="major"
              rules={[{ required: true, message: "กรุณากรอกสาขาวิชา" }]}
            >
              <Input placeholder="เช่น ครุศาสตร์ สาขาภาษาอังกฤษ" />
            </Form.Item>

            <Form.Item
              label="GPA"
              name="gpa"
              rules={[
                {
                  type: "number",
                  min: 0,
                  max: 4,
                  message: "GPA ต้องเป็นตัวเลขระหว่าง 0-4",
                },
              ]}
            >
              <InputNumber placeholder="เช่น 3.5" step={0.01} min={0} max={4} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" onClick={handleSave}>
                  {editingIndex !== null ? "บันทึกการแก้ไข" : "เพิ่มรายการ"}
                </Button>
                <Button onClick={handleCancel}>ยกเลิก</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {/* List of Educations */}
      <div className="space-y-4">
        {educations.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold">
              ประวัติการศึกษา ({educations.length})
            </h3>
            {educations.map((education, index) => (
              <Card
                key={index}
                className="border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {education.level}
                      </h4>
                      {education.gpa && (
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          GPA {education.gpa}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {education.institution}
                    </p>
                    <p className="text-sm text-gray-600">{education.major}</p>
                  </div>
                  <Space className="ml-4">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800"
                    />
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800"
                    />
                  </Space>
                </div>
              </Card>
            ))}
          </>
        ) : (
          !isAddingNew && <Empty description="ยังไม่มีข้อมูลการศึกษา" />
        )}
      </div>

      {/* Add Button */}
      {!isAddingNew && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          block
          onClick={handleAddNew}
          size="large"
        >
          เพิ่มข้อมูลการศึกษา
        </Button>
      )}
    </div>
  );
};
