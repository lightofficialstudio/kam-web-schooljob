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
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Empty,
  Flex,
  Form,
  Input,
  Layout,
  Modal,
  Row,
  Space,
  Typography,
  theme as antTheme,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { WorkExperienceEntry, useProfileStore } from "../_stores/profile-store";

const { Title, Text, Paragraph } = Typography;

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

export const WorkExperienceSection: React.FC = () => {
  const { token } = antTheme.useToken();
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
                ? "แก้ไขประสบการณ์การทำงาน"
                : "เพิ่มประสบการณ์การทำงาน"}
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
                label="ตำแหน่งงาน"
                name="jobTitle"
                required
                rules={[{ required: true, message: "กรุณากรอกตำแหน่งงาน" }]}
              >
                <Input placeholder="เช่น ครูสอนภาษาอังกฤษ" size="large" />
              </Form.Item>

              <Form.Item
                label="ชื่อบริษัท / สถาบัน"
                name="companyName"
                required
                rules={[{ required: true, message: "กรุณากรอกชื่อบริษัท" }]}
              >
                <Input placeholder="เช่น โรงเรียน ABC" size="large" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="วันที่เริ่มงาน"
                    name="startDate"
                    required
                    rules={[
                      { required: true, message: "กรุณาเลือกวันที่เริ่มงาน" },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="วันที่สิ้นสุด" name="endDate">
                    <DatePicker
                      style={{ width: "100%" }}
                      size="large"
                      disabled={form.getFieldValue("inPresent")}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="inPresent"
                valuePropName="checked"
                initialValue={false}
              >
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      form.setFieldValue("endDate", null);
                    }
                  }}
                >
                  ยังคงทำงานที่นี่
                </Checkbox>
              </Form.Item>

              <Form.Item label="คำอธิบายหน้าที่การทำงาน" name="description">
                <Input.TextArea
                  rows={6}
                  placeholder="อธิบายความรับผิดชอบและสำเร็จการงาน..."
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

      {/* 2. List of Work Experiences */}
      <Space orientation="vertical" size={16} style={{ width: "100%" }}>
        {workExperiences.length > 0 ? (
          workExperiences.map((experience, index) => (
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
                  <Flex vertical gap={12}>
                    {/* Header Row: Job Title (Left) and Date Range + Duration (Right) */}
                    <Row justify="space-between" align="middle" gutter={16}>
                      <Col flex="1">
                        <Title
                          level={5}
                          style={{
                            margin: 0,
                            fontSize: "18px",
                            fontWeight: 700,
                            color: token.colorTextHeading,
                          }}
                        >
                          {experience.jobTitle}
                        </Title>
                      </Col>
                      <Col>
                        <Flex vertical align="end">
                          <Text
                            strong
                            style={{
                              color: token.colorPrimary,
                              fontSize: "14px",
                            }}
                          >
                            {dayjs(experience.startDate).format("MMM YYYY")} -{" "}
                            {experience.inPresent
                              ? "ปัจจุบัน"
                              : experience.endDate
                                ? dayjs(experience.endDate).format("MMM YYYY")
                                : ""}
                          </Text>
                          <Text
                            type="secondary"
                            style={{ fontSize: "12px", fontWeight: 500 }}
                          >
                            (
                            {calculateDuration(
                              experience.startDate,
                              experience.endDate,
                              experience.inPresent,
                            )}
                            )
                          </Text>
                        </Flex>
                      </Col>
                    </Row>

                    {/* Company Name */}
                    <Text
                      strong
                      style={{
                        color: token.colorTextSecondary,
                        fontSize: "16px",
                        display: "block",
                      }}
                    >
                      {experience.companyName}
                    </Text>

                    {/* Description */}
                    {experience.description && (
                      <Paragraph
                        ellipsis={{
                          rows: 3,
                          expandable: true,
                          symbol: "อ่านเพิ่มเติม",
                        }}
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
                    style={{
                      color: token.colorPrimary,
                      fontWeight: 600,
                    }}
                  >
                    แก้ไขข้อมูล
                  </Button>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(index)}
                    style={{ fontWeight: 600 }}
                  >
                    ลบ
                  </Button>
                </Space>
              </Row>
            </Card>
          ))
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="ยังไม่มีข้อมูลประสบการณ์การทำงาน"
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
        เพิ่มประสบการณ์การทำงาน
      </Button>
    </Space>
  );
};
