"use client";

import { useNotificationModalStore } from "@/app/stores/notification-modal-store";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Space,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { WorkExperienceEntry, useProfileStore } from "../stores/profile-store";

export const WorkExperienceSection: React.FC = () => {
  const [form] = Form.useForm();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const {
    profile,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
  } = useProfileStore();
  const { openNotification } = useNotificationModalStore();

  const workExperiences = profile.workExperiences || [];

  const handleAddNew = () => {
    form.resetFields();
    form.setFieldsValue({ inPresent: false });
    setEditingIndex(null);
    setIsAddingNew(true);
  };

  const handleEdit = (index: number) => {
    const experience = workExperiences[index];
    form.setFieldsValue({
      jobTitle: experience.jobTitle,
      companyName: experience.companyName,
      startDate: dayjs(experience.startDate),
      endDate: experience.endDate ? dayjs(experience.endDate) : null,
      inPresent: experience.inPresent || false,
      description: experience.description,
    });
    setEditingIndex(index);
    setIsAddingNew(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const entry: WorkExperienceEntry = {
        jobTitle: values.jobTitle,
        companyName: values.companyName,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.inPresent
          ? ""
          : values.endDate?.format("YYYY-MM-DD") || "",
        inPresent: values.inPresent || false,
        description: values.description,
      };

      if (editingIndex !== null) {
        openNotification({
          type: "success",
          mainTitle: "อัปเดตข้อมูลสำเร็จ",
          description: "ข้อมูลประสบการณ์ทำงานถูกบันทึกเรียบร้อยแล้ว",
          icon: <CheckCircleFilled style={{ color: "#52c41a" }} />,
        });
      } else {
        addWorkExperience(entry);
        openNotification({
          type: "success",
          mainTitle: "เพิ่มข้อมูลสำเร็จ",
          description: "ข้อมูลประสบการณ์ทำงานใหม่ถูกเพิ่มเรียบร้อยแล้ว",
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
        removeWorkExperience(index);
        openNotification({
          type: "success",
          mainTitle: "ลบข้อมูลสำเร็จ",
          description: "ข้อมูลประสบการณ์ทำงานถูกลบเรียบร้อยแล้ว",
          icon: <CheckCircleFilled style={{ color: "#52c41a" }} />,
        });
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
              ? "แก้ไขประสบการณ์การทำงาน"
              : "เพิ่มประสบการณ์การทำงาน"}
          </h3>
          <Form form={form} layout="vertical" requiredMark="optional">
            <Form.Item
              label="ตำแหน่งงาน"
              name="jobTitle"
              rules={[{ required: true, message: "กรุณากรอกตำแหน่งงาน" }]}
            >
              <Input placeholder="เช่น ครูสอนภาษาอังกฤษ" />
            </Form.Item>

            <Form.Item
              label="ชื่อบริษัท / สถาบัน"
              name="companyName"
              rules={[{ required: true, message: "กรุณากรอกชื่อบริษัท" }]}
            >
              <Input placeholder="เช่น โรงเรียน ABC" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="วันเดือนปีที่เริ่มงาน"
                name="startDate"
                rules={[
                  { required: true, message: "กรุณาเลือกวันที่เริ่มงาน" },
                ]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                label="วันเดือนปีที่สิ้นสุด"
                name="endDate"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <DatePicker
                  className="w-full"
                  disabled={form.getFieldValue("inPresent")}
                />
              </Form.Item>
            </div>

            <Form.Item
              name="inPresent"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>ยังคงทำงานที่นี่</Checkbox>
            </Form.Item>

            <Form.Item label="คำอธิบายหน้าที่การทำงาน" name="description">
              <Input.TextArea
                rows={4}
                placeholder="อธิบายความรับผิดชอบและสำเร็จการงาน..."
              />
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

      {/* List of Work Experiences */}
      <div className="space-y-4">
        {workExperiences.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold">
              ประสบการณ์การทำงาน ({workExperiences.length})
            </h3>
            {workExperiences.map((experience, index) => (
              <Card
                key={index}
                className="border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {experience.jobTitle}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {experience.companyName}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      {experience.startDate} ถึง{" "}
                      {experience.inPresent ? "ปัจจุบัน" : experience.endDate}
                    </p>
                    {experience.description && (
                      <>
                        <Divider className="my-2" />
                        <p className="text-sm text-gray-700">
                          {experience.description}
                        </p>
                      </>
                    )}
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
          !isAddingNew && <Empty description="ยังไม่มีประสบการณ์การทำงาน" />
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
          เพิ่มประสบการณ์การทำงาน
        </Button>
      )}
    </div>
  );
};
