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
  Typography,
} from "antd";
import React from "react";
import {
  SchoolProfile,
  useSchoolProfileStore,
} from "../stores/school-profile-store";

const { Title } = Typography;

interface ProfileEditDrawerProps {
  onSave: (values: SchoolProfile) => void;
}

export const ProfileEditDrawer: React.FC<ProfileEditDrawerProps> = ({
  onSave,
}) => {
  const { isDrawerOpen, setIsDrawerOpen, profile } = useSchoolProfileStore();
  const [form] = Form.useForm();

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
              <Select placeholder="เลือกประเภท">
                <Select.Option value="โรงเรียนเอกชน (นานาชาติ)">
                  โรงเรียนเอกชน (นานาชาติ)
                </Select.Option>
                <Select.Option value="โรงเรียนเอกชน (สามัญ)">
                  โรงเรียนเอกชน (สามัญ)
                </Select.Option>
                <Select.Option value="โรงเรียนรัฐบาล">
                  โรงเรียนรัฐบาล
                </Select.Option>
                <Select.Option value="ศูนย์รวมการเรียนรู้">
                  ศูนย์รวมการเรียนรู้
                </Select.Option>
              </Select>
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
          <Select
            mode="tags"
            placeholder="เลือกหรือพิมพ์ระดับชั้น เช่น ประถม, มัธยม"
          >
            <Select.Option value="อนุบาล">อนุบาล</Select.Option>
            <Select.Option value="ประถมศึกษา">ประถมศึกษา</Select.Option>
            <Select.Option value="มัธยมศึกษา">มัธยมศึกษา</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="benefits" label="สวัสดิการ (เพิ่มได้หลายรายการ)">
          <Select mode="tags" placeholder="เช่น ประกันสุขภาพ, อาหารกลางวัน" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};
