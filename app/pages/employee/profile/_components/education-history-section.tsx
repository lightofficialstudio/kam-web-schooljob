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
  const { token } = antTheme.useToken();
  const [form] = Form.useForm();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { profile, addEducation, removeEducation } = useProfileStore();
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
        });
      },
    });
  };

  return (
    <Space orientation="vertical" size={24} style={{ width: "100%" }}>
      {/* 1. Add/Edit Drawer (UX following job page pattern) */}
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

          {/* Content Area */}
          <Layout.Content
            style={{
              padding: "32px 40px 80px 40px",
              backgroundColor: token.colorBgContainer,
            }}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                label="ระดับการศึกษา"
                name="level"
                required
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
                required
                rules={[{ required: true, message: "กรุณากรอกสถาบัน" }]}
              >
                <Input placeholder="เช่น มหาวิทยาลัยจุฬาลงกรณ์" size="large" />
              </Form.Item>

              <Form.Item
                label="สาขาวิชา/วิทยาลัย"
                name="major"
                required
                rules={[{ required: true, message: "กรุณากรอกสาขาวิชา" }]}
              >
                <Input
                  placeholder="เช่น ครุศาสตร์ สาขาภาษาอังกฤษ"
                  size="large"
                />
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
                <InputNumber
                  placeholder="เช่น 3.5"
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

      {/* 2. List of Educations */}
      <Space orientation="vertical" size={16} style={{ width: "100%" }}>
        {educations.length > 0 ? (
          educations.map((education, index) => (
            <Card
              key={index}
              style={{
                borderRadius: token.borderRadiusLG,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
              styles={{ body: { padding: "20px" } }}
              hoverable
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
                    {education.gpa && (
                      <Text
                        style={{
                          marginTop: "8px",
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

      {/* 3. Global Add Button */}
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        block
        onClick={handleAddNew}
        size="large"
        style={{
          height: "54px",
          borderRadius: token.borderRadiusLG,
          fontSize: "16px",
          fontWeight: 600,
        }}
      >
        เพิ่มข้อมูลการศึกษา
      </Button>
    </Space>
  );
};
