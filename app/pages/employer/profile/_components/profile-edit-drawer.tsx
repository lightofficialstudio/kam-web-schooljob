"use client";

import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  SchoolProfile,
  useSchoolProfileState as useSchoolProfileStore,
} from "../_state/school-profile.state";

const { Title } = Typography;

// ✨ รูปแบบตัวเลือกจาก API
interface ConfigOption {
  id: string;
  label: string;
  value: string;
}

interface ProfileEditDrawerProps {
  onSave: (values: SchoolProfile) => void;
}

export const ProfileEditDrawer: React.FC<ProfileEditDrawerProps> = ({
  onSave,
}) => {
  const { isDrawerOpen, setIsDrawerOpen, profile } = useSchoolProfileStore();
  const [form] = Form.useForm();

  const [schoolTypes, setSchoolTypes] = useState<ConfigOption[]>([]);
  const [schoolLevels, setSchoolLevels] = useState<ConfigOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // ✨ โหลดตัวเลือกจาก API ครั้งแรก
  useEffect(() => {
    setIsLoadingOptions(true);
    Promise.all([
      axios.get<{ status_code: number; data: ConfigOption[] }>("/api/v1/config/options?group=school_type"),
      axios.get<{ status_code: number; data: ConfigOption[] }>("/api/v1/config/options?group=school_level"),
    ])
      .then(([typeRes, levelRes]) => {
        if (typeRes.data.status_code === 200) setSchoolTypes(typeRes.data.data);
        if (levelRes.data.status_code === 200) setSchoolLevels(levelRes.data.data);
      })
      .catch((err) => console.error("❌ โหลด config options ไม่สำเร็จ:", err))
      .finally(() => setIsLoadingOptions(false));
  }, []);

  React.useEffect(() => {
    if (isDrawerOpen) {
      form.setFieldsValue(profile);
    }
  }, [isDrawerOpen, profile, form]);

  const handleFinish = (values: SchoolProfile) => {
    onSave(values);
  };

  return (
    <Drawer
      title="แก้ไขข้อมูลโรงเรียน"
      placement="right"
      onClose={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
      size="large"
      extra={
        <Space>
          <Button onClick={() => setIsDrawerOpen(false)}>ยกเลิก</Button>
          <Button type="primary" onClick={() => form.submit()}>
            บันทึกข้อมูล
          </Button>
        </Space>
      }
    >
      {isLoadingOptions ? (
        <Spin style={{ display: "block", margin: "40px auto" }} />
      ) : (
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Title level={5}>ข้อมูลพื้นฐาน</Title>
          <Form.Item
            name="name"
            label="ชื่อโรงเรียน"
            rules={[{ required: true, message: "กรุณาระบุชื่อโรงเรียน" }]}
          >
            <Input placeholder="ระบุชื่อโรงเรียน" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="ประเภทโรงเรียน"
                rules={[{ required: true }]}
              >
                {/* ✨ ดึงตัวเลือกจาก DB ผ่าน API แทน hardcode */}
                <Select placeholder="เลือกประเภท" options={schoolTypes.map((t) => ({ value: t.value, label: t.label }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="จังหวัด"
                rules={[{ required: true }]}
              >
                <Input placeholder="เช่น กรุงเทพมหานคร" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="ที่อยู่เต็ม">
            <Input.TextArea
              rows={3}
              placeholder="ระบุที่อยู่สำหรับการติดต่อและแสดงแผนที่"
            />
          </Form.Item>

          <Divider />
          <Title level={5}>ข้อมูลติดต่อ</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="อีเมลติดต่อสมัครงาน"
                rules={[{ required: true, type: "email" }]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="เบอร์โทรศัพท์"
                rules={[{ required: true }]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="website" label="เว็บไซต์ (ไม่ต้องใส่ https://)">
            <Input prefix="https://" />
          </Form.Item>

          <Divider />
          <Title level={5}>รายละเอียดเชิงลึก (SEO & Employer Branding)</Title>
          <Form.Item name="description" label="เกี่ยวกับโรงเรียน">
            <Input.TextArea
              rows={6}
              placeholder="เล่าประวัติความเป็นมา วัฒนธรรมองค์กร"
            />
          </Form.Item>
          <Form.Item name="vision" label="วิสัยทัศน์">
            <Input.TextArea
              rows={3}
              placeholder="เช่น สร้างผู้นำแห่งอนาคต ด้วยคุณธรรม..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="curriculum" label="หลักสูตร">
                <Input placeholder="เช่น British, IB, Thai" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="size" label="จำนวนบุคลากร">
                <Input placeholder="เช่น 20-50 คน" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="levels" label="ระดับชั้นที่เปิดสอน">
            {/* ✨ ดึงตัวเลือกจาก DB ผ่าน API แทน hardcode */}
            <Select
              mode="tags"
              placeholder="เลือกหรือพิมพ์ระดับชั้น"
              options={schoolLevels.map((l) => ({ value: l.value, label: l.label }))}
            />
          </Form.Item>

          <Form.Item name="benefits" label="สวัสดิการ (เพิ่มได้หลายรายการ)">
            <Select mode="tags" placeholder="เช่น ประกันสุขภาพ, อาหารกลางวัน" />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};
