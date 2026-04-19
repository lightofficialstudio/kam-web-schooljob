"use client";

import { ModalComponent } from "@/app/components/modal/modal.component";
import { useAuthStore } from "@/app/stores/auth-store";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Drawer,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
  theme as antTheme,
} from "antd";
import React, { useState } from "react";
import { EducationEntry, useProfileStore } from "../_stores/profile-store";

const { Title, Text } = Typography;

// ✨ ตัวเลือกระดับการศึกษา
const EDUCATION_LEVELS = [
  { value: "ต่ำกว่ามัธยมศึกษา", label: "ต่ำกว่ามัธยมศึกษา" },
  { value: "มัธยมศึกษาตอนต้น", label: "มัธยมศึกษาตอนต้น" },
  { value: "มัธยมศึกษาตอนปลาย", label: "มัธยมศึกษาตอนปลาย" },
  { value: "ปวช.", label: "ปวช." },
  { value: "ปวท.", label: "ปวท." },
  { value: "ปวส.", label: "ปวส." },
  { value: "อนุปริญญา", label: "อนุปริญญา" },
  { value: "ปริญญาตรี", label: "ปริญญาตรี" },
  { value: "ปริญญาโท", label: "ปริญญาโท" },
  { value: "ปริญญาเอก", label: "ปริญญาเอก" },
];

const MAX_EDUCATIONS = 3;
const YEAR_MIN = 2500;
const YEAR_MAX = new Date().getFullYear() + 543;

// ✨ โครงสร้าง local modal state
interface ModalState {
  open: boolean;
  type: "success" | "error" | "confirm" | "delete";
  title: string;
  description: string;
  errorDetails?: unknown;
  loading?: boolean;
}

const MODAL_CLOSED: ModalState = { open: false, type: "success", title: "", description: "" };

export const EducationHistorySection: React.FC = () => {
  const { token } = antTheme.useToken();
  const [form] = Form.useForm();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>(MODAL_CLOSED);
  // ✨ เก็บ index ที่รอการยืนยันลบ
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);

  const { profile, addEducation, updateEducation, removeEducation, saveProfile, isSaving } = useProfileStore();
  const { user } = useAuthStore();

  const educations = profile.educations || [];
  const closeModal = () => setModal(MODAL_CLOSED);

  // ✨ ตรวจสอบจำนวนก่อนเปิด Drawer
  const handleAddNew = () => {
    if (educations.length >= MAX_EDUCATIONS) {
      setModal({
        open: true,
        type: "error",
        title: "ไม่สามารถเพิ่มได้",
        description: `สามารถเพิ่มประวัติการศึกษาได้สูงสุด ${MAX_EDUCATIONS} รายการเท่านั้น กรุณาลบรายการเก่าออกก่อนเพิ่มใหม่`,
      });
      return;
    }
    form.resetFields();
    setEditingIndex(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (index: number) => {
    const education = educations[index];
    form.setFieldsValue({
      level: education.level,
      institution: education.institution,
      major: education.major,
      graduationYear: education.graduationYear,
      gpa: education.gpa,
    });
    setEditingIndex(index);
    setIsDrawerOpen(true);
  };

  // ✨ บันทึก — ครอบ try/catch ทุกกรณี
  const handleSave = async () => {
    // ✨ validate form fields ก่อน — ถ้า fail AntD จะแสดง inline error เองอยู่แล้ว
    let values: ReturnType<typeof form.getFieldsValue>;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }

    const entry: EducationEntry = {
      level: values.level,
      institution: values.institution,
      major: values.major,
      graduationYear: values.graduationYear,
      gpa: values.gpa,
    };

    try {
      if (editingIndex !== null) {
        const existingId = profile.educations?.[editingIndex]?.id;
        updateEducation(editingIndex, { ...entry, id: existingId });
      } else {
        addEducation(entry);
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
        description: "ข้อมูลการศึกษาถูกบันทึกลงฐานข้อมูลเรียบร้อยแล้ว",
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
    const edu = educations[index];
    setPendingDeleteIndex(index);
    setModal({
      open: true,
      type: "confirm",
      title: "ยืนยันการลบ",
      description: `ต้องการลบข้อมูลการศึกษาระดับ "${edu.level}" จาก ${edu.institution} ออกจากโปรไฟล์? การกระทำนี้ไม่สามารถย้อนกลับได้`,
    });
  };

  // ✨ callback เมื่อกด "ยืนยัน" บน confirm modal
  const handleDeleteConfirm = async () => {
    if (pendingDeleteIndex === null) return;
    setModal((prev) => ({ ...prev, loading: true }));
    try {
      removeEducation(pendingDeleteIndex);
      if (!user?.user_id) throw new Error("ไม่พบข้อมูลผู้ใช้");
      await saveProfile(user.user_id);
      setModal({
        open: true,
        type: "success",
        title: "ลบข้อมูลสำเร็จ",
        description: "ข้อมูลการศึกษาถูกลบออกจากฐานข้อมูลเรียบร้อยแล้ว",
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
              {editingIndex !== null ? "แก้ไขข้อมูลการศึกษา" : "เพิ่มข้อมูลการศึกษา"}
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
              label="ระดับการศึกษา"
              name="level"
              rules={[{ required: true, message: "กรุณาเลือกระดับการศึกษา" }]}
            >
              <Select options={EDUCATION_LEVELS} placeholder="เลือกระดับการศึกษา" size="large" />
            </Form.Item>

            <Form.Item
              label="สถาบัน / โรงเรียน / มหาวิทยาลัย"
              name="institution"
              rules={[{ required: true, message: "กรุณากรอกสถาบัน" }]}
            >
              <Input placeholder="เช่น มหาวิทยาลัยจุฬาลงกรณ์" size="large" />
            </Form.Item>

            <Form.Item
              label="สาขาวิชา"
              name="major"
              rules={[{ required: true, message: "กรุณากรอกสาขาวิชา" }]}
            >
              <Input placeholder="เช่น ครุศาสตร์ สาขาภาษาอังกฤษ" size="large" />
            </Form.Item>

            <Form.Item
              label="ปีที่สำเร็จการศึกษา (พ.ศ.)"
              name="graduationYear"
              rules={[
                { required: true, message: "กรุณากรอกปีที่สำเร็จการศึกษา" },
                {
                  type: "number",
                  min: YEAR_MIN,
                  max: YEAR_MAX,
                  message: `กรุณากรอกปี พ.ศ. ระหว่าง ${YEAR_MIN} - ${YEAR_MAX}`,
                },
              ]}
            >
              <InputNumber
                placeholder={`เช่น ${YEAR_MAX}`}
                min={YEAR_MIN}
                max={YEAR_MAX}
                size="large"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="เกรดเฉลี่ย (GPA)"
              name="gpa"
              rules={[
                {
                  type: "number",
                  min: 0,
                  max: 4,
                  message: "GPA ต้องเป็นตัวเลขระหว่าง 0.00 - 4.00",
                },
              ]}
            >
              <InputNumber
                placeholder="เช่น 3.50"
                step={0.01}
                min={0}
                max={4}
                size="large"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Form>
        </Drawer>

        {/* 2. รายการประวัติการศึกษา */}
        <Space orientation="vertical" size={16} style={{ width: "100%" }}>
          {educations.length > 0 ? (
            educations.map((education, index) => (
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
                    <Space orientation="vertical" size={2}>
                      <Title level={5} style={{ margin: 0, fontSize: "17px" }}>
                        {education.level}
                      </Title>
                      <Text strong style={{ color: token.colorTextSecondary }}>
                        {education.institution}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "14px" }}>
                        {education.major}
                      </Text>
                      <Flex gap={8} style={{ marginTop: "8px" }} wrap="wrap">
                        {education.graduationYear && (
                          <Text
                            style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              backgroundColor: token.colorFillAlter,
                              borderRadius: token.borderRadiusSM,
                              fontSize: "13px",
                            }}
                          >
                            สำเร็จการศึกษา พ.ศ. {education.graduationYear}
                          </Text>
                        )}
                        {education.gpa && (
                          <Text
                            style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              backgroundColor: token.colorFillAlter,
                              borderRadius: token.borderRadiusSM,
                              fontSize: "13px",
                            }}
                          >
                            GPA: {education.gpa}
                          </Text>
                        )}
                      </Flex>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <Button
                        type="text"
                        shape="circle"
                        icon={<EditOutlined style={{ color: token.colorPrimary }} />}
                        onClick={() => handleEdit(index)}
                      />
                      <Button
                        type="text"
                        shape="circle"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteRequest(index)}
                      />
                    </Space>
                  </Col>
                </Row>
              </Card>
            ))
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="ยังไม่มีข้อมูลการศึกษา" />
          )}
        </Space>

        {/* 3. ปุ่มเพิ่ม */}
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          block
          onClick={handleAddNew}
          size="large"
          disabled={educations.length >= MAX_EDUCATIONS}
          style={{ height: "54px", borderRadius: token.borderRadiusLG, fontSize: "16px", fontWeight: 600 }}
        >
          เพิ่มข้อมูลการศึกษา ({educations.length}/{MAX_EDUCATIONS})
        </Button>
      </Space>
    </>
  );
};
