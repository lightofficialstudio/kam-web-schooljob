"use client";

import { ModalComponent } from "@/app/components/modal/modal.component";
import { useAuthStore } from "@/app/stores/auth-store";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Empty,
  Flex,
  Form,
  Input,
  Row,
  Space,
  Typography,
  theme as antTheme,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { WorkExperienceEntry, useProfileStore } from "../_stores/profile-store";

const { Title, Text, Paragraph } = Typography;

const MAX_WORK_EXPERIENCES = 5;

// ✨ ชื่อเดือนภาษาไทยแบบย่อ
const THAI_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

// ✨ แปลงวันที่ string เป็น "เดือน พ.ศ." สำหรับแสดงผล
const formatMonthYearThai = (dateStr: string): string => {
  if (!dateStr) return "";
  const d = dayjs(dateStr);
  return `${THAI_MONTHS[d.month()]} ${d.year() + 543}`;
};

// ✨ คำนวณระยะเวลาการทำงาน
const calculateDuration = (
  startDate: string,
  endDate: string | null,
  inPresent: boolean,
) => {
  const start = dayjs(startDate);
  const end = inPresent ? dayjs() : dayjs(endDate);
  const years = end.diff(start, "year");
  const months = end.diff(start.add(years, "year"), "month");
  const days = end.diff(start.add(years, "year").add(months, "month"), "day");
  const parts = [];
  if (years > 0) parts.push(`${years} ปี`);
  if (months > 0) parts.push(`${months} เดือน`);
  if (days > 0) parts.push(`${days} วัน`);
  return parts.length > 0 ? parts.join(" ") : "0 วัน";
};

// ✨ โครงสร้าง local modal state
interface ModalState {
  open: boolean;
  type: "success" | "error" | "confirm" | "delete";
  title: string;
  description: string;
  errorDetails?: unknown;
  loading?: boolean;
}

const MODAL_CLOSED: ModalState = {
  open: false,
  type: "success",
  title: "",
  description: "",
};

export const WorkExperienceSection: React.FC = () => {
  const { token } = antTheme.useToken();
  const [form] = Form.useForm();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>(MODAL_CLOSED);
  // ✨ เก็บ index ที่รอการยืนยันลบ
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);

  const {
    profile,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    saveProfile,
    isSaving,
  } = useProfileStore();
  const { user } = useAuthStore();

  const workExperiences = profile.workExperiences || [];

  const closeModal = () => setModal(MODAL_CLOSED);

  // ✨ ตรวจสอบจำนวนก่อนเปิด Drawer
  const handleAddNew = () => {
    if (workExperiences.length >= MAX_WORK_EXPERIENCES) {
      setModal({
        open: true,
        type: "error",
        title: "ไม่สามารถเพิ่มได้",
        description: `สามารถเพิ่มประวัติการทำงานได้สูงสุด ${MAX_WORK_EXPERIENCES} รายการเท่านั้น กรุณาลบรายการเก่าออกก่อนเพิ่มใหม่`,
      });
      return;
    }
    form.resetFields();
    form.setFieldsValue({ inPresent: false });
    setEditingIndex(null);
    setIsDrawerOpen(true);
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
    setIsDrawerOpen(true);
  };

  // ✨ บันทึก — ครอบ try/catch ทุกกรณี
  const handleSave = async () => {
    // ✨ validate form fields ก่อน — ถ้า fail จะ throw และไม่ต้องแสดง modal
    let values: ReturnType<typeof form.getFieldsValue>;
    try {
      values = await form.validateFields();
    } catch {
      // ✨ Form validation error — AntD จะแสดง inline error เองอยู่แล้ว
      return;
    }

    const entry: WorkExperienceEntry = {
      jobTitle: values.jobTitle,
      companyName: values.companyName,
      startDate: values.startDate.format("YYYY-MM-DD"),
      endDate: values.inPresent ? "" : values.endDate?.format("YYYY-MM-DD") || "",
      inPresent: values.inPresent || false,
      description: values.description,
    };

    try {
      if (editingIndex !== null) {
        const existingId = profile.workExperiences?.[editingIndex]?.id;
        updateWorkExperience(editingIndex, { ...entry, id: existingId });
      } else {
        addWorkExperience(entry);
      }

      if (!user?.user_id) {
        setModal({
          open: true,
          type: "error",
          title: "ไม่พบข้อมูลผู้ใช้",
          description: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
        });
        return;
      }

      await saveProfile(user.user_id);

      setModal({
        open: true,
        type: "success",
        title: editingIndex !== null ? "อัปเดตข้อมูลสำเร็จ" : "เพิ่มข้อมูลสำเร็จ",
        description: "ข้อมูลประสบการณ์ทำงานถูกบันทึกลงฐานข้อมูลเรียบร้อยแล้ว",
      });

      form.resetFields();
      setIsDrawerOpen(false);
      setEditingIndex(null);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message_th?: string } }; message?: string };
      const description =
        axiosErr?.response?.data?.message_th ||
        axiosErr?.message ||
        "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง";

      setModal({
        open: true,
        type: "error",
        title: "บันทึกข้อมูลไม่สำเร็จ",
        description,
        // ✨ ส่ง errorDetails ให้ Modal แสดง debug panel — ผู้ใช้ capture ได้
        errorDetails: err,
      });
    }
  };

  const handleDrawerClose = () => {
    form.resetFields();
    setIsDrawerOpen(false);
    setEditingIndex(null);
  };

  // ✨ เปิด confirm modal แทน Modal.confirm เดิม
  const handleDeleteRequest = (index: number) => {
    const exp = workExperiences[index];
    setPendingDeleteIndex(index);
    setModal({
      open: true,
      type: "confirm",
      title: "ยืนยันการลบ",
      description: `ต้องการลบประสบการณ์ "${exp.jobTitle}" ที่ ${exp.companyName} ออกจากโปรไฟล์? การกระทำนี้ไม่สามารถย้อนกลับได้`,
    });
  };

  // ✨ callback เมื่อกด "ยืนยัน" บน confirm modal
  const handleDeleteConfirm = async () => {
    if (pendingDeleteIndex === null) return;

    setModal((prev) => ({ ...prev, loading: true }));
    try {
      removeWorkExperience(pendingDeleteIndex);

      if (!user?.user_id) throw new Error("ไม่พบข้อมูลผู้ใช้");
      await saveProfile(user.user_id);

      setModal({
        open: true,
        type: "success",
        title: "ลบข้อมูลสำเร็จ",
        description: "ข้อมูลประสบการณ์ทำงานถูกลบออกจากฐานข้อมูลเรียบร้อยแล้ว",
      });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message_th?: string } }; message?: string };
      const description =
        axiosErr?.response?.data?.message_th ||
        axiosErr?.message ||
        "เกิดข้อผิดพลาดขณะลบข้อมูล กรุณาลองใหม่อีกครั้ง";

      setModal({
        open: true,
        type: "error",
        title: "ลบข้อมูลไม่สำเร็จ",
        description,
        errorDetails: err,
      });
    } finally {
      setPendingDeleteIndex(null);
    }
  };

  return (
    <>
      {/* ✨ Modal กลาง — ทุก state รายงานผ่านนี้ */}
      <ModalComponent
        open={modal.open}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        errorDetails={modal.errorDetails}
        loading={modal.loading}
        onClose={closeModal}
        onConfirm={modal.type === "confirm" ? handleDeleteConfirm : undefined}
        confirmLabel={modal.type === "confirm" ? "ยืนยันลบ" : "ตกลง"}
        cancelLabel="ยกเลิก"
      />

      <Space orientation="vertical" size={24} style={{ width: "100%" }}>
        {/* 1. Add/Edit Drawer */}
        <Drawer
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          size="large"
          title={
            <Title level={4} style={{ margin: 0 }}>
              {editingIndex !== null
                ? "แก้ไขประสบการณ์การทำงาน"
                : "เพิ่มประสบการณ์การทำงาน"}
            </Title>
          }
          placement="right"
          footer={
            <Flex justify="end" gap={12} style={{ padding: "8px 0" }}>
              <Button onClick={handleDrawerClose} size="large" style={{ minWidth: 100 }}>
                ยกเลิก
              </Button>
              <Button
                type="primary"
                onClick={handleSave}
                size="large"
                loading={isSaving}
                style={{ minWidth: 100 }}
              >
                บันทึก
              </Button>
            </Flex>
          }
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="ตำแหน่งงาน"
              name="jobTitle"
              rules={[{ required: true, message: "กรุณากรอกตำแหน่งงาน" }]}
            >
              <Input placeholder="เช่น ครูสอนภาษาอังกฤษ" size="large" />
            </Form.Item>

            <Form.Item
              label="ชื่อโรงเรียน / บริษัท"
              name="companyName"
              rules={[{ required: true, message: "กรุณากรอกชื่อโรงเรียน/บริษัท" }]}
            >
              <Input placeholder="เช่น โรงเรียนสาธิตจุฬาฯ" size="large" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="เริ่มงาน (เดือน/ปี พ.ศ.)"
                  name="startDate"
                  rules={[{ required: true, message: "กรุณาเลือกเดือนและปีที่เริ่มงาน" }]}
                >
                  <DatePicker
                    picker="month"
                    style={{ width: "100%" }}
                    size="large"
                    format={(value) => `${THAI_MONTHS[value.month()]} ${value.year() + 543}`}
                    placeholder="เลือกเดือน/ปี"
                    onChange={() => form.validateFields(["endDate"])}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="จนถึง (เดือน/ปี พ.ศ.)"
                  name="endDate"
                  dependencies={["inPresent", "startDate"]}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (getFieldValue("inPresent")) return Promise.resolve();
                        if (!value) return Promise.reject(new Error("กรุณาเลือกเดือนและปีที่สิ้นสุด"));
                        const start = getFieldValue("startDate");
                        if (start && value.isBefore(start, "month")) {
                          return Promise.reject(new Error("วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มงาน"));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    picker="month"
                    style={{ width: "100%" }}
                    size="large"
                    format={(value) => `${THAI_MONTHS[value.month()]} ${value.year() + 543}`}
                    placeholder="เลือกเดือน/ปี"
                    disabled={Form.useWatch("inPresent", form)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="inPresent" valuePropName="checked" initialValue={false}>
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) form.setFieldValue("endDate", null);
                  form.validateFields(["endDate"]);
                }}
              >
                ยังคงทำงานที่นี่อยู่
              </Checkbox>
            </Form.Item>

            <Form.Item label="รายละเอียดงาน" name="description">
              <Input.TextArea rows={6} placeholder="อธิบายความรับผิดชอบและผลงานที่ผ่านมา..." />
            </Form.Item>
          </Form>
        </Drawer>

        {/* 2. รายการประวัติการทำงาน */}
        <Space orientation="vertical" size={16} style={{ width: "100%" }}>
          {workExperiences.length > 0 ? (
            workExperiences.map((experience, index) => (
              <Card
                key={index}
                hoverable
                style={{
                  borderRadius: token.borderRadiusLG,
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
                styles={{ body: { padding: "20px" } }}
              >
                <Row justify="space-between" align="top">
                  <Col flex="auto">
                    <Flex vertical gap={12}>
                      <Row justify="space-between" align="middle" gutter={16}>
                        <Col flex="1">
                          <Title
                            level={5}
                            style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: token.colorTextHeading }}
                          >
                            {experience.jobTitle}
                          </Title>
                        </Col>
                        <Col>
                          <Flex vertical align="end">
                            <Text strong style={{ color: token.colorPrimary, fontSize: "14px" }}>
                              {formatMonthYearThai(experience.startDate)} —{" "}
                              {experience.inPresent ? "ปัจจุบัน" : formatMonthYearThai(experience.endDate)}
                            </Text>
                            <Text type="secondary" style={{ fontSize: "12px", fontWeight: 500 }}>
                              ({calculateDuration(experience.startDate, experience.endDate, experience.inPresent)})
                            </Text>
                          </Flex>
                        </Col>
                      </Row>

                      <Text strong style={{ color: token.colorTextSecondary, fontSize: "16px", display: "block" }}>
                        {experience.companyName}
                      </Text>

                      {experience.description && (
                        <Paragraph
                          ellipsis={{ rows: 3, expandable: true, symbol: "อ่านเพิ่มเติม" }}
                          style={{
                            margin: 0,
                            color: token.colorText,
                            fontSize: "15px",
                            lineHeight: 1.6,
                            backgroundColor: token.colorFillAlter,
                            padding: "12px 16px",
                            borderRadius: token.borderRadius,
                            borderLeft: `3px solid ${token.colorBorder}`,
                          }}
                        >
                          {experience.description}
                        </Paragraph>
                      )}
                    </Flex>
                  </Col>
                </Row>

                <Divider style={{ margin: "16px 0" }} />

                <Row justify="end">
                  <Space size={12}>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(index)}
                      style={{ color: token.colorPrimary, fontWeight: 600 }}
                    >
                      แก้ไขข้อมูล
                    </Button>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteRequest(index)}
                      style={{ fontWeight: 600 }}
                    >
                      ลบ
                    </Button>
                  </Space>
                </Row>
              </Card>
            ))
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="ยังไม่มีข้อมูลประสบการณ์การทำงาน" />
          )}
        </Space>

        {/* 3. ปุ่มเพิ่ม — แสดงจำนวน/จำกัด */}
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          block
          onClick={handleAddNew}
          size="large"
          disabled={workExperiences.length >= MAX_WORK_EXPERIENCES}
          style={{ height: "54px", borderRadius: token.borderRadiusLG, fontSize: "16px", fontWeight: 600 }}
        >
          เพิ่มประสบการณ์การทำงาน ({workExperiences.length}/{MAX_WORK_EXPERIENCES})
        </Button>
      </Space>
    </>
  );
};
