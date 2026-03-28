"use client";

import { useNotificationModalStore } from "@/app/stores/notification-modal-store";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Layout,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  theme as antTheme,
} from "antd";
import React, { useState } from "react";
import { EducationEntry, useProfileStore } from "../_stores/profile-store";

const { Title, Text } = Typography;

// [Fix #1] ปรับ Dropdown ให้ตรงตาม Requirement ครบทุก Option
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

// ปีพุทธศักราชต่ำสุดและสูงสุดที่ยอมรับ
const YEAR_MIN = 2500;
const YEAR_MAX = new Date().getFullYear() + 543; // ปัจจุบัน พ.ศ.

export const EducationHistorySection: React.FC = () => {
  const { token } = antTheme.useToken();
  const [form] = Form.useForm();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { profile, addEducation, updateEducation, removeEducation } =
    useProfileStore();
  const { openNotification } = useNotificationModalStore();

  const educations = profile.educations || [];

  // [Fix #3] ตรวจสอบจำนวนก่อนเปิด Drawer เพิ่มใหม่
  const handleAddNew = () => {
    if (educations.length >= MAX_EDUCATIONS) {
      openNotification({
        type: "error",
        mainTitle: "ไม่สามารถเพิ่มได้",
        description: `สามารถเพิ่มประวัติการศึกษาได้สูงสุด ${MAX_EDUCATIONS} รายการ`,
        icon: <CloseCircleFilled style={{ color: token.colorError }} />,
      });
      return;
    }
    form.resetFields();
    setEditingIndex(null);
    setIsAddingNew(true);
  };

  // เปิด Drawer สำหรับแก้ไข พร้อม set ค่าเดิมลงฟอร์ม
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
    setIsAddingNew(true);
  };

  // [Fix #4] handleSave เรียก updateEducation จริงๆ เมื่อเป็น Edit mode
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const entry: EducationEntry = {
        level: values.level,
        institution: values.institution,
        major: values.major,
        graduationYear: values.graduationYear,
        gpa: values.gpa,
      };

      if (editingIndex !== null) {
        updateEducation(editingIndex, entry);
        openNotification({
          type: "success",
          mainTitle: "อัปเดตข้อมูลสำเร็จ",
          description: "ข้อมูลการศึกษาของคุณถูกบันทึกเรียบร้อยแล้ว",
          icon: <CheckCircleFilled style={{ color: token.colorSuccess }} />,
        });
      } else {
        addEducation(entry);
        openNotification({
          type: "success",
          mainTitle: "เพิ่มข้อมูลสำเร็จ",
          description: "ข้อมูลการศึกษาใหม่ถูกเพิ่มเรียบร้อยแล้ว",
          icon: <CheckCircleFilled style={{ color: token.colorSuccess }} />,
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
        icon: <CloseCircleFilled style={{ color: token.colorError }} />,
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
          icon: <CheckCircleFilled style={{ color: token.colorSuccess }} />,
        });
      },
    });
  };

  return (
    <Space orientation="vertical" size={24} style={{ width: "100%" }}>
      {/* 1. Add/Edit Drawer */}
      <Drawer
        open={isAddingNew}
        onClose={handleCancel}
        size="large"
        closable={false}
        placement="right"
        styles={{ body: { padding: 0 } }}
      >
        <Layout
          style={{
            position: "relative",
            minHeight: "100%",
            backgroundColor: token.colorBgContainer,
          }}
        >
          {/* Header Sticky Action Bar */}
          <Layout.Header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 100,
              backgroundColor: token.colorBgContainer,
              padding: "16px 24px",
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              height: "auto",
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              {editingIndex !== null
                ? "แก้ไขข้อมูลการศึกษา"
                : "เพิ่มข้อมูลการศึกษา"}
            </Title>
            <Button
              type="text"
              icon={<CloseOutlined style={{ fontSize: "20px" }} />}
              onClick={handleCancel}
            />
          </Layout.Header>

          {/* Form Content */}
          <Layout.Content
            style={{
              padding: "32px 40px 80px 40px",
              backgroundColor: token.colorBgContainer,
            }}
          >
            <Form form={form} layout="vertical">
              {/* [Fix #1] Dropdown ครบตาม Requirement */}
              <Form.Item
                label="ระดับการศึกษา"
                name="level"
                rules={[{ required: true, message: "กรุณาเลือกระดับการศึกษา" }]}
              >
                <Select
                  options={EDUCATION_LEVELS}
                  placeholder="เลือกระดับการศึกษา"
                  size="large"
                />
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
                <Input
                  placeholder="เช่น ครุศาสตร์ สาขาภาษาอังกฤษ"
                  size="large"
                />
              </Form.Item>

              {/* [Fix #2] เพิ่ม field ปีที่สำเร็จการศึกษา (พ.ศ.) */}
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

              <Divider style={{ margin: "32px 0 24px 0" }} />

              <Flex justify="end" gap={12}>
                <Button
                  onClick={handleCancel}
                  size="large"
                  style={{ minWidth: 100 }}
                >
                  ยกเลิก
                </Button>
                <Button
                  type="primary"
                  onClick={handleSave}
                  size="large"
                  style={{ minWidth: 100 }}
                >
                  บันทึก
                </Button>
              </Flex>
            </Form>
          </Layout.Content>
        </Layout>
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
                      icon={
                        <EditOutlined style={{ color: token.colorPrimary }} />
                      }
                      onClick={() => handleEdit(index)}
                    />
                    <Button
                      type="text"
                      shape="circle"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(index)}
                    />
                  </Space>
                </Col>
              </Row>
            </Card>
          ))
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="ยังไม่มีข้อมูลการศึกษา"
          />
        )}
      </Space>

      {/* 3. ปุ่มเพิ่ม — แสดงจำนวน/จำกัดเพื่อให้ User รู้ */}
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        block
        onClick={handleAddNew}
        size="large"
        disabled={educations.length >= MAX_EDUCATIONS}
        style={{
          height: "54px",
          borderRadius: token.borderRadiusLG,
          fontSize: "16px",
          fontWeight: 600,
        }}
      >
        เพิ่มข้อมูลการศึกษา ({educations.length}/{MAX_EDUCATIONS})
      </Button>
    </Space>
  );
};
